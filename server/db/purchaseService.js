const supabase = require("./supabaseClient");

async function recordPurchase(user_id, game_id) {
  const { error } = await supabase
    .from("purchases")
    .insert([{ user_id, game_id }]);

  if (error) {
    throw new Error("Failed to record purchase");
  }
}

module.exports = { recordPurchase };
