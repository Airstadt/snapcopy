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
      const uid = request.auth.uid;

      const session = await stripe.checkout.sessions.create({
        mode: "subscription",
        payment_method_types: ["card"],
        customer_email: email,
        line_items: [{ price: MONTHLY_PRICE_ID.value(), quantity: 1 }],
        success_url: SUCCESS_URL.value(),
        cancel_url: CANCEL_URL.value(),
        // Metadata for the Checkout Session
        metadata: { uid }, 
        // Metadata for the Subscription (Ensures UID persists for the webhook)
        subscription_data: {
          metadata: { uid },
        },
      });

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

    return { url: session.url };
  }
);

/* -------------------------------------------------------
   3. STRIPE WEBHOOK (FIXED)
-------------------------------------------------------- */
/* -------------------------------------------------------
   3. STRIPE WEBHOOK (FINAL CLEAN VERSION)
-------------------------------------------------------- */
exports.stripeWebhook = onRequest(
  { secrets: [STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET] },
  async (req, res) => {
    // We initialize stripe here to ensure it uses the secret correctly
    const stripeInstance = require("stripe")(STRIPE_SECRET_KEY.value());
    const sig = req.headers["stripe-signature"];

    let event;

    try {
      // Use the instance we just created
      event = stripeInstance.webhooks.constructEvent(
        req.rawBody,
        sig,
        STRIPE_WEBHOOK_SECRET.value()
      );
    } catch (err) {
      console.error("❌ Webhook signature error:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    const dataObject = event.data.object;
    const uid = dataObject.metadata?.uid;

    console.log(`⚡ Event: ${event.type} | UID: ${uid}`);

    // Update Firestore
    if (event.type === "checkout.session.completed") {
      if (uid) {
        await admin.firestore().collection("users").doc(uid).set(
          { stripeCustomerId: dataObject.customer },
          { merge: true }
        );
      }
    }

    if (event.type === "customer.subscription.created" || event.type === "customer.subscription.updated") {
      if (uid) {
        await admin.firestore().collection("users").doc(uid).set(
          {
            plan: dataObject.status === "active" ? "pro" : "free",
            subscriptionStatus: dataObject.status,
            currentPeriodEnd: dataObject.current_period_end,
          },
          { merge: true }
        );
        console.log("✅ SUCCESS: User upgraded to PRO in Firestore");
      }
    }

    res.status(200).send("OK");
  }
);