import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import GameFilter from "../GameFilter/index";
import styles from "./GameCard.module.css";

import { loadStripe } from "@stripe/stripe-js";
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

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
      if (error) {
        console.error("Error loading games...", error);
      } else {
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
    const stripe = await stripePromise;

    const response = await fetch(
      "http://localhost:4242/create-checkout-session",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: game.title,
          price: game.price,
        }),
      }
    );

    const session = await response.json();

    if (session.url) {
      window.location.href = session.url;
    } else {
      alert("Something went wrong while creating checkout session");
    }
  };

  return (
    <div>
      <GameFilter onFilterChange={setFilters} />
      <section className={styles.gameList}>
        {filteredGames.map(game => (
          <div key={game.id} className={styles.gameCard}>
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
