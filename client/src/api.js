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
