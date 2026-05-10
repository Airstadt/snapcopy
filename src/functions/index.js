const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// 1. CREATE CHECKOUT SESSION (MONTHLY ONLY)
exports.createCheckoutSession = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "You must be logged in to create a checkout session."
    );
  }

  const uid = context.auth.uid;
  const priceId = process.env.MONTHLY_PRICE_ID; // fixed monthly price

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      customer_email: context.auth.token.email,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.SUCCESS_URL}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: process.env.CANCEL_URL,
      // attach UID to the SUBSCRIPTION via subscription_data.metadata
      subscription_data: {
        metadata: { uid },
      },
      metadata: { uid }, // also on the session for debugging
    });

    return { url: session.url };
  } catch (error) {
    console.error("Error creating checkout session:", error);
    throw new functions.https.HttpsError(
      "internal",
      "Unable to create checkout session."
    );
  }
});

// 2. BILLING PORTAL
exports.createPortalSession = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "You must be logged in to access the billing portal."
    );
  }

  const email = context.auth.token.email;

  try {
    const customers = await stripe.customers.list({
      email,
      limit: 1,
    });

    if (!customers.data.length) {
      throw new Error("No Stripe customer found for this user.");
    }

    const customer = customers.data[0];

    const session = await stripe.billingPortal.sessions.create({
      customer: customer.id,
      return_url: process.env.PORTAL_RETURN_URL,
    });

    return { url: session.url };
  } catch (error) {
    console.error("Error creating billing portal session:", error);
    throw new functions.https.HttpsError(
      "internal",
      "Unable to create billing portal session."
    );
  }
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
    console.error("Webhook signature verification failed.", err.message);
    return res.sendStatus(400);
  }

  const data = event.data.object;

  try {
    switch (event.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const uid = data.metadata?.uid;

        if (!uid) {
          console.error("No UID on subscription metadata.");
          break;
        }

        await admin.firestore().collection("users").doc(uid).set(
          {
            plan: data.status === "active" ? "pro" : "free",
            subscriptionStatus: data.status,
            currentPeriodEnd: data.current_period_end,
          },
          { merge: true }
        );
        break;
      }

      case "customer.subscription.deleted": {
        const uid = data.metadata?.uid;

        if (!uid) {
          console.error("No UID on subscription metadata for deletion.");
          break;
        }

        await admin.firestore().collection("users").doc(uid).set(
          {
            plan: "free",
            subscriptionStatus: "canceled",
            currentPeriodEnd: null,
          },
          { merge: true }
        );
        break;
      }

      default:
        // ignore other events for now
        break;
    }

    res.sendStatus(200);
  } catch (err) {
    console.error("Error handling webhook:", err);
    res.sendStatus(500);
  }
});
