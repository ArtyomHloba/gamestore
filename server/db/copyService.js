const supabase = require("./supabaseClient");

async function getAvailableCopy(game_id) {
  const { data: availableCopy, error } = await supabase
    .from("copies")
    .select("*")
    .eq("game_id", game_id)
    .is("user_id", null)
    .limit(1)
    .single();

  if (error || !availableCopy) {
    throw new Error("No available copies found");
  }

  return availableCopy;
}

async function updateCopyUser(copy_id, user_id) {
  const { error } = await supabase
    .from("copies")
    .update({ user_id })
    .eq("copy_id", copy_id);

  if (error) {
    throw new Error("Failed to update game copy");
  }
}

module.exports = { getAvailableCopy, updateCopyUser };
