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

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: title,
            },
            unit_amount: price * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: "http://localhost:3000/my-games?success=true",
      cancel_url: "http://localhost:3000?canceled=true",
      metadata: {
        game_id,
        user_id,
      },
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error("Error creating session:", error.message);
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
      console.error("Webhook Error:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const gameId = session.metadata.game_id;
      const userId = session.metadata.user_id;

      console.log(`Purchase completed. Game: ${gameId}, User: ${userId}`);

      const { data, error } = await supabase
        .from("copies")
        .update({ user_id: userId })
        .eq("game_id", gameId)
        .is("user_id", null)
        .limit(1)
        .select();

      if (error) {
        console.error("Error issuing key:", error);
      } else if (data.length === 0) {
        console.warn("No available keys for this game.");
      } else {
        console.log("Key issued to user:", data[0].game_key);
      }
    }

    res.json({ received: true });
  }
);

app.listen(4242, () => console.log("Server running on http://localhost:4242"));
