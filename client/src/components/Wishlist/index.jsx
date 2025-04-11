import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import { fetchWishlist } from "../../api";
import PaymentForm from "../PaymentForm";
import styles from "./Wishlist.module.css";

function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const [selectedGame, setSelectedGame] = useState(null);

  useEffect(() => {
    const loadWishlist = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error("User is not authenticated:", userError);
        return;
      }

      const wishlistData = await fetchWishlist(user.id);
      setWishlist(wishlistData);
    };

    loadWishlist();
  }, []);

  const handlePaymentSuccess = () => {
    setSelectedGame(null);
  };

  return (
    <div className={styles.wishlistContainer}>
      <h2>Your Wishlist</h2>
      {selectedGame ? (
        <PaymentForm
          game={selectedGame}
          onPaymentSuccess={handlePaymentSuccess}
        />
      ) : wishlist.length === 0 ? (
        <p>Your wishlist is empty.</p>
      ) : (
        <div className={styles.wishlistGrid}>
          {wishlist.map(game => (
            <div key={game.game_id} className={styles.wishlistItem}>
              <img src={game.image} alt={game.title} />
              <h3>{game.title}</h3>
              <p>{game.genre}</p>
              <p>${game.price}</p>
              <button
                className={styles.buyButton}
                onClick={() => setSelectedGame(game)}
              >
                Buy
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Wishlist;
