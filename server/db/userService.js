const supabase = require("./supabaseClient");

async function getUserById(user_id) {
  const { data: user, error } = await supabase
    .from("user")
    .select("*")
    .eq("user_id", user_id)
    .single();

  if (error) {
    throw new Error("User not found");
  }

  return user;
}

module.exports = { getUserById };
