import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import GameFilter from "../GameFilter/index";
import PaymentForm from "../PaymentForm";
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

  useEffect(() => {
    const fetchGames = async () => {
      let { data, error } = await supabase.from("game").select("*");
      if (!error) {
        setGames(data);
        setFilteredGames(data);
      }
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
    alert("Game purchased successfully!");
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
                <button
                  className={styles.buyButton}
                  onClick={() => setSelectedGame(game)}
                >
                  Buy
                </button>
              </div>
            ))}
          </section>
        </>
      )}
    </div>
  );
}

export default GameCard;
