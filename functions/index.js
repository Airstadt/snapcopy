const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

const Stripe = require("stripe");


// ------------------------------
// 1. CREATE CHECKOUT SESSION
// ------------------------------
exports.createCheckoutSession = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "Must be logged in");
  }

  const uid = context.auth.uid;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      customer_email: data.email,
      line_items: [
        {
          price: process.env.MONTHLY_PRICE_ID,
          quantity: 1,
        },
      ],
      success_url: process.env.SUCCESS_URL,
      cancel_url: process.env.CANCEL_URL,
      metadata: { uid },
      subscription_data: {
        metadata: { uid },
      },
    });

    return { id: session.id };
  } catch (err) {
    console.error("Checkout error:", err);
    throw new functions.https.HttpsError("internal", err.message);
  }
});

// ------------------------------
// 2. BILLING PORTAL SESSION
// ------------------------------
exports.createPortalSession = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "Must be logged in");
  }

  const uid = context.auth.uid;

  try {
    const userDoc = await admin.firestore().collection("users").doc(uid).get();
    const stripeCustomerId = userDoc.data()?.stripeCustomerId;

    if (!stripeCustomerId) {
      throw new functions.https.HttpsError("failed-precondition", "No Stripe customer found");
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: stripeCustomerId,
      return_url: process.env.PORTAL_RETURN_URL,
    });

    return { url: session.url };
  } catch (err) {
    console.error("Portal error:", err);
    throw new functions.https.HttpsError("internal", err.message);
  }
});

// ------------------------------
// 3. STRIPE WEBHOOK
// ------------------------------
exports.stripeWebhook = functions.https.onRequest(async (req, res) => {
  let event;

  try {
    const signature = req.headers["stripe-signature"];
    event = stripe.webhooks.constructEvent(
      req.rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature error:", err);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  const data = event.data.object;

  // Handle subscription events
  if (
    event.type === "customer.subscription.created" ||
    event.type === "customer.subscription.updated"
  ) {
    const uid = data.metadata?.uid;
    if (!uid) return res.status(200).send("No UID in metadata");

    await admin.firestore().collection("users").doc(uid).set(
      {
        plan: data.status === "active" ? "pro" : "free",
        stripeCustomerId: data.customer,
        subscriptionStatus: data.status,
        currentPeriodEnd: data.current_period_end,
      },
      { merge: true }
    );
  }

  if (event.type === "customer.subscription.deleted") {
    const uid = data.metadata?.uid;
    if (uid) {
      await admin.firestore().collection("users").doc(uid).set(
        {
          plan: "free",
          subscriptionStatus: "canceled",
          currentPeriodEnd: null,
        },
        { merge: true }
      );
    }
  }

  res.status(200).send("Webhook received");
});
