const express = require("express");
const Stripe = require("stripe");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const app = express();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

app.use(cors());
app.use(express.json());

app.post("/create-checkout-session", async (req, res) => {
  const { title, price, game_id, user_id } = req.body;

  console.log("Received data from client:", { title, price, game_id, user_id });

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: title },
            unit_amount: Math.round(price * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: "http://localhost:5173/my-games?success=true",
      cancel_url: "http://localhost:5173?canceled=true",
      metadata: {
        game_id,
        user_id,
      },
    });

    console.log("Stripe session created:", session);
    res.json({ url: session.url });
  } catch (error) {
    console.error("Error creating Stripe session:", error.message);
    res.status(500).json({ error: error.message });
  }
});

app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];

    let event;
    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error(`Webhook Error: ${err.message}`);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    console.log("Webhook event received:", event.type);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      const gameId = session.metadata?.game_id;
      const userId = session.metadata?.user_id;

      if (!gameId || !userId) {
        console.error("Missing metadata in session:", session.metadata);
        return res.status(400).send("Missing metadata in session");
      }

      console.log(
        `Processing purchase for game_id: ${gameId}, user_id: ${userId}`
      );

      try {
        const { error } = await supabase
          .from("purchases")
          .insert([{ user_id: userId, game_id: gameId }]);

        if (error) {
          console.error("Error inserting purchase:", error);
          return res.status(500).send("Error inserting purchase");
        }

        console.log(`Purchase successfully recorded for user ${userId}`);
      } catch (e) {
        console.error("Unexpected server error:", e);
        return res.status(500).send("Unexpected server error");
      }
    }

    res.json({ received: true });
  }
);

// Симуляция оплаты
app.post("/simulate-payment", async (req, res) => {
  const { game_id, user_id } = req.body;

  console.log("Simulating payment for:", { game_id, user_id });

  if (!game_id || !user_id) {
    return res.status(400).json({ error: "Missing game_id or user_id" });
  }

  try {
    const { error } = await supabase
      .from("purchases")
      .insert([{ user_id, game_id }]);

    if (error) {
      console.error("Error inserting purchase:", error);
      return res.status(500).json({ error: "Failed to record purchase" });
    }

    console.log(`Purchase successfully recorded for user ${user_id}`);
    res.json({ success: true, message: "Purchase recorded successfully" });
  } catch (e) {
    console.error("Unexpected server error:", e);
    res.status(500).json({ error: "Unexpected server error" });
  }
});

module.exports = app;
