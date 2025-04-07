const express = require("express");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const app = express();
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

app.use(cors());
app.use(express.json());

app.post("/simulate-payment", async (req, res) => {
  const { game_id, user_id } = req.body;

  console.log("Simulating payment for:", { game_id, user_id });

  if (!game_id || !user_id) {
    return res.status(400).json({ error: "Missing game_id or user_id" });
  }

  try {
    const { error: purchaseError } = await supabase
      .from("purchases")
      .insert([{ user_id, game_id }]);

    if (purchaseError) {
      console.error("Error inserting purchase:", purchaseError);
      return res.status(500).json({ error: "Failed to record purchase" });
    }

    const { data: availableCopy, error: copyError } = await supabase
      .from("copies")
      .select("*")
      .eq("game_id", game_id)
      .is("user_id", null)
      .limit(1)
      .single();

    if (copyError || !availableCopy) {
      console.error("Error finding available copy:", copyError);
      return res.status(500).json({ error: "No available copies found" });
    }

    const { error: updateCopyError } = await supabase
      .from("copies")
      .update({ user_id })
      .eq("copy_id", availableCopy.copy_id);

    if (updateCopyError) {
      console.error("Error updating copy:", updateCopyError);
      return res.status(500).json({ error: "Failed to update game copy" });
    }

    console.log(`Purchase and copy update successful for user ${user_id}`);
    res.json({ success: true, message: "Purchase and copy update successful" });
  } catch (e) {
    console.error("Unexpected server error:", e);
    res.status(500).json({ error: "Unexpected server error" });
  }
});

module.exports = app;
