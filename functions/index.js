const { onCall, onRequest, HttpsError } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");
const admin = require("firebase-admin");
admin.initializeApp();

const STRIPE_SECRET_KEY = defineSecret("STRIPE_SECRET_KEY");
const STRIPE_WEBHOOK_SECRET = defineSecret("STRIPE_WEBHOOK_SECRET");
const MONTHLY_PRICE_ID = defineSecret("MONTHLY_PRICE_ID");
const SUCCESS_URL = defineSecret("SUCCESS_URL");
const CANCEL_URL = defineSecret("CANCEL_URL");
const PORTAL_RETURN_URL = defineSecret("PORTAL_RETURN_URL");

const Stripe = require("stripe");

/* -------------------------------------------------------
   1. CREATE CHECKOUT SESSION
-------------------------------------------------------- */
exports.createCheckoutSession = onCall(
  { secrets: [STRIPE_SECRET_KEY, MONTHLY_PRICE_ID, SUCCESS_URL, CANCEL_URL] },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError("unauthenticated", "Must be logged in");
    }

    try {
      const stripe = new Stripe(STRIPE_SECRET_KEY.value());
      const email = request.data.email;

      const session = await stripe.checkout.sessions.create({
        mode: "subscription",
        payment_method_types: ["card"],
        customer_email: email,
        line_items: [{ price: MONTHLY_PRICE_ID.value(), quantity: 1 }],
        success_url: SUCCESS_URL.value(),
        cancel_url: CANCEL_URL.value(),
        metadata: { uid: request.auth.uid },
      });

      // IMPORTANT: You must return the URL for the redirect to happen
      return { id: session.id, url: session.url }; 
    } catch (error) {
      console.error("Stripe Error:", error);
      throw new HttpsError("internal", error.message);
    }
  }
);

/* -------------------------------------------------------
   2. BILLING PORTAL SESSION
-------------------------------------------------------- */
exports.createPortalSession = onCall(
  { secrets: [STRIPE_SECRET_KEY, PORTAL_RETURN_URL] },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError("unauthenticated", "Must be logged in");
    }

    const stripe = new Stripe(STRIPE_SECRET_KEY.value());
    const uid = request.auth.uid;

    const userDoc = await admin.firestore().collection("users").doc(uid).get();
    const stripeCustomerId = userDoc.data()?.stripeCustomerId;

    if (!stripeCustomerId) {
      throw new HttpsError("failed-precondition", "No Stripe customer found");
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: stripeCustomerId,
      return_url: PORTAL_RETURN_URL.value(),
    });

    return { id: session.id};
  }
);

/* -------------------------------------------------------
   3. STRIPE WEBHOOK (rawBody enabled in firebase.json)
-------------------------------------------------------- */
exports.stripeWebhook = onRequest(
  { secrets: [STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET] },
  async (req, res) => {
    const stripe = new Stripe(STRIPE_SECRET_KEY.value());
    const sig = req.headers["stripe-signature"];

    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.rawBody,
        sig,
        STRIPE_WEBHOOK_SECRET.value()
      );
    } catch (err) {
      console.error("❌ Webhook signature error:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    console.log("⚡ Stripe Webhook Event:", event.type, event.id);

    /* ------------------------------
       Handle checkout.session.completed
       (earliest reliable event)
    ------------------------------ */
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const uid = session.metadata?.uid;

      if (uid) {
        await admin.firestore().collection("users").doc(uid).set(
          {
            stripeCustomerId: session.customer,
          },
          { merge: true }
        );
        console.log("✅ Stored Stripe customer ID for UID:", uid);
      }

      return res.status(200).send("OK");
    }

    /* ------------------------------
       Handle subscription events
    ------------------------------ */
    if (
      event.type === "customer.subscription.created" ||
      event.type === "customer.subscription.updated"
    ) {
      const subscription = event.data.object;
      const uid = subscription.metadata?.uid;

      if (!uid) {
        console.log("⚠ No UID in metadata (likely stripe trigger)");
        return res.status(200).send("OK");
      }

      await admin.firestore().collection("users").doc(uid).set(
        {
          plan: subscription.status === "active" ? "pro" : "free",
          stripeCustomerId: subscription.customer,
          subscriptionStatus: subscription.status,
          currentPeriodEnd: subscription.current_period_end,
        },
        { merge: true }
      );

      console.log("✅ Updated subscription for UID:", uid);
      return res.status(200).send("OK");
    }

    /* ------------------------------
       Handle subscription cancellation
    ------------------------------ */
    if (event.type === "customer.subscription.deleted") {
      const subscription = event.data.object;
      const uid = subscription.metadata?.uid;

      if (uid) {
        await admin.firestore().collection("users").doc(uid).set(
          {
            plan: "free",
            subscriptionStatus: "canceled",
          },
          { merge: true }
        );
        console.log("⚠ Subscription canceled for UID:", uid);
      }

      return res.status(200).send("OK");
    }

    console.log("ℹ Unhandled event type:", event.type);
    res.status(200).send("OK");
  }
);