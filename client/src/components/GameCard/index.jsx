import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import GameFilter from "../GameFilter/index";
import styles from "./GameCard.module.css";

function GameCard() {
  const [games, setGames] = useState([]);
  const [filteredGames, setFilteredGames] = useState([]);
  const [filters, setFilters] = useState({
    search: "",
    genre: "",
    maxPrice: 100,
  });

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

  const handleBuy = async game => {
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        alert("You need to be logged in to make a purchase.");
        return;
      }

      const response = await fetch("http://localhost:5000/simulate-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          game_id: game.game_id,
          user_id: user.id,
        }),
      });

      const result = await response.json();

      if (result.success) {
        alert("Purchase successful!");
      } else {
        alert("Failed to record purchase: " + result.error);
      }
    } catch (error) {
      alert(
        "An error occurred during the simulated payment. Please try again."
      );
    }
  };

  return (
    <div>
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
              onClick={() => handleBuy(game)}
            >
              Buy
            </button>
          </div>
        ))}
      </section>
    </div>
  );
}

export default GameCard;
