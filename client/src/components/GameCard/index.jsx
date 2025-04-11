import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import { addToWishlist, removeFromWishlist } from "../../api";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import GameFilter from "../GameFilter/index";
import PaymentForm from "../PaymentForm";
import ClipLoader from "react-spinners/ClipLoader";
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
    const fetchGames = async () => {
      setLoading(true);

      let { data, error } = await supabase.from("game").select("*");
      if (!error) {
        setGames(data);
        setFilteredGames(data);
      }

      setLoading(false);
    };

    fetchGames();
  }, []);

  useEffect(() => {
    const applyFilters = () => {
      let filtered = games.filter(
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
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (!userError && user) {
      const { data: wishlistData, error: wishlistError } = await supabase
        .from("wishlist")
        .select("*")
        .eq("user_id", user.id);

      if (!wishlistError) {
        setWishlist(wishlistData.map(item => item.game_id));
      }
    }
  };

  useEffect(() => {
    handleWishlistUpdate();
  }, []);

  const toggleWishlist = async game => {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      alert("You need to be logged in to add to wishlist.");
      return;
    }

    if (wishlist.includes(game.game_id)) {
      await removeFromWishlist(user.id, game.game_id);
      setWishlist(wishlist.filter(id => id !== game.game_id));
    } else {
      await addToWishlist(user.id, game.game_id);
      setWishlist([...wishlist, game.game_id]);
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
              <ClipLoader color="#f39c12" size={50} />
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
