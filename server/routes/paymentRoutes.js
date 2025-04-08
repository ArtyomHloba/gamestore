const express = require("express");
const { getUserById } = require("../db/userService");
const { recordPurchase } = require("../db/purchaseService");
const { getAvailableCopy, updateCopyUser } = require("../db/copyService");

const router = express.Router();

router.post("/simulate-payment", async (req, res) => {
  const { game_id, user_id } = req.body;

  if (!game_id || !user_id) {
    return res.status(400).json({ error: "Missing game_id or user_id" });
  }

  try {
    const user = await getUserById(user_id);
    await recordPurchase(user_id, game_id);

    const availableCopy = await getAvailableCopy(game_id);
    await updateCopyUser(availableCopy.copy_id, user_id);

    res.json({ success: true, message: "Purchase and copy update successful" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
