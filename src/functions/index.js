const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// 1. CREATE CHECKOUT SESSION
exports.createCheckoutSession = functions.https.onCall(async (data, context) => {
  const uid = context.auth.uid;
  const priceId = data.priceId;

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    customer_email: context.auth.token.email,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.SUCCESS_URL}?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: process.env.CANCEL_URL,
    metadata: { uid }
  });

  return { url: session.url };
});

// 2. BILLING PORTAL
exports.createPortalSession = functions.https.onCall(async (data, context) => {
  const uid = context.auth.uid;

  const customers = await stripe.customers.list({
    email: context.auth.token.email,
    limit: 1
  });

  const customer = customers.data[0];

  const session = await stripe.billingPortal.sessions.create({
    customer: customer.id,
    return_url: process.env.PORTAL_RETURN_URL
  });

  return { url: session.url };
});

// 3. STRIPE WEBHOOK
exports.stripeWebhook = functions.https.onRequest(async (req, res) => {
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.rawBody,
      req.headers["stripe-signature"],
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature verification failed.", err);
    return res.sendStatus(400);
  }

  const data = event.data.object;

  switch (event.type) {
    case "customer.subscription.created":
    case "customer.subscription.updated":
      await admin.firestore().collection("users").doc(data.metadata.uid).update({
        plan: data.status === "active" ? "pro" : "free",
        subscriptionStatus: data.status,
        currentPeriodEnd: data.current_period_end
      });
      break;

    case "customer.subscription.deleted":
      await admin.firestore().collection("users").doc(data.metadata.uid).update({
        plan: "free",
        subscriptionStatus: "canceled"
      });
      break;
  }

  res.sendStatus(200);
});
