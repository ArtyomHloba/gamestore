import { useEffect, useState } from "react";
import {
  fetchGames,
  fetchWishlist,
  addToWishlist,
  removeFromWishlist,
  fetchCurrentUser,
} from "../../api";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import GameFilter from "../GameFilter/index";
import PaymentForm from "../PaymentForm";
import ClipLoader from "react-spinners/ClipLoader";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./GameCard.module.css";

function GameCard() {
  const [games, setGames] = useState([]);
  const [filteredGames, setFilteredGames] = useState([]);
  const [filters, setFilters] = useState({
    search: "",
    genre: "",
    maxPrice: 100,
  });
  const [selectedGame, setSelectedGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const loadGames = async () => {
      setLoading(true);
      try {
        const data = await fetchGames();
        setGames(data);
        setFilteredGames(data);
      } catch (error) {
        console.error("Error loading games:", error);
      } finally {
        setLoading(false);
      }
    };

    loadGames();
  }, []);

  useEffect(() => {
    const applyFilters = () => {
      const filtered = games.filter(
        game =>
          game.title.toLowerCase().includes(filters.search.toLowerCase()) &&
          (filters.genre === "" || game.genre === filters.genre) &&
          game.price <= filters.maxPrice
      );
      setFilteredGames(filtered);
    };

    applyFilters();
  }, [filters, games]);

  const handlePaymentSuccess = () => {
    setSelectedGame(null);
  };

  const handleWishlistUpdate = async () => {
    try {
      const user = await fetchCurrentUser();
      if (user) {
        const wishlistData = await fetchWishlist(user.id);
        setWishlist(wishlistData);
      }
    } catch (error) {
      console.error("Error updating wishlist:", error);
    }
  };

  useEffect(() => {
    handleWishlistUpdate();
  }, []);

  const toggleWishlist = async game => {
    try {
      const user = await fetchCurrentUser();
      if (!user) {
        toast.error("You need to be logged in to add to wishlist.", {
          position: "top-center",
          autoClose: 3000,
        });
        return;
      }

      if (wishlist.includes(game.game_id)) {
        await removeFromWishlist(user.id, game.game_id);
        setWishlist(wishlist.filter(id => id !== game.game_id));
        toast.info(`${game.title} removed from wishlist.`, {
          position: "top-center",
          autoClose: 3000,
        });
      } else {
        await addToWishlist(user.id, game.game_id);
        setWishlist([...wishlist, game.game_id]);
        toast.success(`${game.title} added to wishlist!`, {
          position: "top-center",
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error("Error toggling wishlist:", error);
    }
  };

  return (
    <div>
      {selectedGame ? (
        <PaymentForm
          game={selectedGame}
          onPaymentSuccess={handlePaymentSuccess}
        />
      ) : (
        <>
          <GameFilter onFilterChange={setFilters} />
          {loading ? (
            <div className={styles.loaderContainer}>
              <ClipLoader color="#179CFF" size={50} />
            </div>
          ) : (
            <section className={styles.gameList}>
              {filteredGames.map(game => (
                <div key={game.game_id} className={styles.gameCard}>
                  <img
                    src={game.image}
                    alt={game.title}
                    className={styles.gameImage}
                  />
                  <h3>{game.title}</h3>
                  <p className={styles.genre}>{game.genre}</p>
                  <p>{game.description}</p>
                  <p className={styles.price}>${game.price}</p>
                  <div
                    className={styles.wishlistIcon}
                    onClick={() => toggleWishlist(game)}
                  >
                    {wishlist.includes(game.game_id) ? (
                      <FaHeart color="red" />
                    ) : (
                      <FaRegHeart />
                    )}
                  </div>
                  <button
                    className={styles.buyButton}
                    onClick={() => setSelectedGame(game)}
                  >
                    Buy
                  </button>
                </div>
              ))}
            </section>
          )}
        </>
      )}
    </div>
  );
}

export default GameCard;
