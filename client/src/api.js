import { supabase } from "./supabaseClient";

export const fetchCopies = async userId => {
  const { data, error } = await supabase
    .from("copies")
    .select(
      `
      game_key,
      user_id,
      game:game_id (
        title,
        image
      )
    `
    )
    .eq("user_id", userId);

  if (error) {
    console.error("Error fetching copies:", error);
    throw error;
  }

  return data;
};

export const fetchPurchases = async userId => {
  const { data, error } = await supabase
    .from("purchases")
    .select(
      `
      purchase_id,
      purchase_date,
      game:game_id (
        title,
        genre,
        price
      ),
      user:user_id (
        user_name,
        email
      )
    `
    )
    .eq("user_id", userId);

  if (error) {
    console.error("Error fetching purchases:", error);
    throw error;
  }

  return data;
};

export const fetchPurchaseById = async purchaseId => {
  const { data, error } = await supabase
    .from("purchases")
    .select(
      `
      purchase_id,
      purchase_date,
      game:game_id (
        title,
        image,
        genre,
        price
      ),
      user:user_id (
        user_name,
        email
      )
    `
    )
    .eq("purchase_id", purchaseId)
    .single();

  if (error) {
    console.error("Error fetching purchase data:", error);
    throw error;
  }

  return data;
};

export const fetchGames = async () => {
  const { data, error } = await supabase.from("game").select("*");
  if (error) {
    console.error("Error fetching games:", error);
    throw error;
  }
  return data;
};

export const fetchWishlist = async userId => {
  const { data, error } = await supabase
    .from("wishlist")
    .select(
      `
      game:game_id (
        game_id,
        title,
        image,
        genre,
        price
      )
    `
    )
    .eq("user_id", userId);

  if (error) {
    console.error("Error fetching wishlist:", error);
    throw error;
  }

  return data.map(item => item.game);
};

export const addToWishlist = async (userId, gameId) => {
  const { error } = await supabase.from("wishlist").insert([
    {
      user_id: userId,
      game_id: gameId,
    },
  ]);

  if (error) {
    console.error("Error adding to wishlist:", error);
    throw error;
  }
};

export const removeFromWishlist = async (userId, gameId) => {
  const { error } = await supabase
    .from("wishlist")
    .delete()
    .eq("user_id", userId)
    .eq("game_id", gameId);

  if (error) {
    console.error("Error removing from wishlist:", error);
    throw error;
  }
};

export const fetchCurrentUser = async () => {
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    console.error("Error fetching current user:", error);
    throw error;
  }
  return data.user;
};
