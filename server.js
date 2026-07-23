require("dotenv").config();
const express = require("express");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const products = require("./products");

const app = express();
const DOMAIN = process.env.DOMAIN || "http://localhost:4242";

app.use(express.static("public"));

// IMPORTANT: the webhook route must come BEFORE express.json(), and must use
// express.raw() instead — Stripe's signature check needs the exact raw request
// body, not a parsed/re-serialized version of it.
app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error("Webhook signature verification failed:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      console.log("✅ Payment succeeded for session:", session.id);
      // TODO: fulfill the order here — e.g. mark it paid in your database,
      // send a confirmation email, etc.
    }

    res.json({ received: true });
  }
);

app.use(express.json());

// Let the frontend fetch the product catalog + publishable key without
// hardcoding secrets client-side.
app.get("/api/products", (req, res) => {
  res.json({
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    products,
  });
});

// Create a Checkout Session for a single product and redirect the customer
// to Stripe's hosted payment page.
app.post("/create-checkout-session", async (req, res) => {
  try {
    const { productId } = req.body;
    const product = products.find((p) => p.id === productId);

    if (!product) {
      return res.status(400).json({ error: "Unknown product" });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: product.currency,
            product_data: {
              name: product.name,
              description: product.description,
              images: [product.image],
            },
            unit_amount: product.amount,
          },
          quantity: 1,
        },
      ],
      success_url: `${DOMAIN}/success.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${DOMAIN}/cancel.html`,
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error("Error creating checkout session:", err.message);
    res.status(500).json({ error: "Something went wrong creating checkout." });
  }
});

const PORT = process.env.PORT || 4242;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
