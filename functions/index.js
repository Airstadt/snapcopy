const { onCall, onRequest, HttpsError } = require("firebase-functions/v2/https"); // Added HttpsError
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

// ------------------------------
// 1. CREATE CHECKOUT SESSION
// ------------------------------
exports.createCheckoutSession = onCall(
  { secrets: [STRIPE_SECRET_KEY, MONTHLY_PRICE_ID, SUCCESS_URL, CANCEL_URL] },
  async (request) => { // Changed (data, context) to (request) for v2 syntax
    if (!request.auth) {
      throw new HttpsError("unauthenticated", "Must be logged in");
    }

    const stripe = new Stripe(STRIPE_SECRET_KEY.value());
    const uid = request.auth.uid;
    const email = request.data.email;

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      customer_email: email,
      line_items: [
        {
          price: MONTHLY_PRICE_ID.value(),
          quantity: 1,
        },
      ],
      success_url: SUCCESS_URL.value(),
      cancel_url: CANCEL_URL.value(),
      metadata: { uid },
      subscription_data: {
        metadata: { uid }, // This ensures the UID is attached to the subscription object
      },
    });

    return { id: session.id };
  }
);

// ------------------------------
// 2. BILLING PORTAL SESSION
// ------------------------------
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

// ------------------------------
// 3. STRIPE WEBHOOK
// ------------------------------
exports.stripeWebhook = onRequest(
  { secrets: [STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET] },
  async (req, res) => {
    const stripe = new Stripe(STRIPE_SECRET_KEY.value());
    const sig = req.headers["stripe-signature"];

    let event;

    try {
      // Use req.rawBody for signature verification in Firebase Functions
      event = stripe.webhooks.constructEvent(
        req.rawBody,
        sig,
        STRIPE_WEBHOOK_SECRET.value()
      );
    } catch (err) {
      console.error(`Webhook Error: ${err.message}`);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    console.log("stripewebhook: Received event", event.type, event.id);

    const subscription = event.data.object;

    // Handle the event
    switch (event.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated":
        const uid = subscription.metadata?.uid;
        
        // IMPORTANT: stripe trigger doesn't include UID, so we log it here
        if (!uid) {
          console.log("No UID found in metadata. If this was 'stripe trigger', this is normal.");
          return res.status(200).send("Webhook received, but no UID to update.");
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
        break;

      case "customer.subscription.deleted":
        const deletedUid = subscription.metadata?.uid;
        if (deletedUid) {
          await admin.firestore().collection("users").doc(deletedUid).set(
            {
              plan: "free",
              subscriptionStatus: "canceled",
            },
            { merge: true }
          );
        }
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.status(200).send({ received: true });
  }
);
