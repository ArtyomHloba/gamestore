import { useEffect, useState } from "react";
import { fetchWishlist, fetchCurrentUser } from "../../api";
import PaymentForm from "../PaymentForm";
import ClipLoader from "react-spinners/ClipLoader";
import styles from "./Wishlist.module.css";

function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const [selectedGame, setSelectedGame] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadWishlist = async () => {
      setLoading(true);

      try {
        const user = await fetchCurrentUser();
        if (!user) {
          console.error("User is not authenticated");
          setLoading(false);
          return;
        }

        const wishlistData = await fetchWishlist(user.id);
        setWishlist(wishlistData);
      } catch (error) {
        console.error("Error loading wishlist:", error);
      } finally {
        setLoading(false);
      }
    };

    loadWishlist();
  }, []);

  const handlePaymentSuccess = () => {
    setSelectedGame(null);
  };

  return (
    <div className={styles.wishlistContainer}>
      <h2 className={styles.title}>Your Wishlist</h2>
      {loading ? (
        <div className={styles.loaderContainer}>
          <ClipLoader color="#179CFF" size={50} />
        </div>
      ) : selectedGame ? (
        <PaymentForm
          game={selectedGame}
          onPaymentSuccess={handlePaymentSuccess}
        />
      ) : wishlist.length === 0 ? (
        <p className={styles.noWishListGames}>
          Your wishlist is empty, please log in
        </p>
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
