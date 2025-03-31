import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import styles from "./GameCard.module.css";

function GameCard() {
  const [games, setGames] = useState([]);

  useEffect(() => {
    const fetchGames = async () => {
      let { data, error } = await supabase.from("game").select("*");
      if (error) {
        console.error("Error for loading...", error);
      } else {
        setGames(data);
      }
    };

    fetchGames();
  }, []);

  return (
    <section className={styles.gameList}>
      {games.map(game => (
        <div key={game.id} className={styles.gameCard}>
          <img src={game.image} alt={game.title} className={styles.gameImage} />
          <h3>{game.title}</h3>
          <p className={styles.genre}>{game.genre}</p>
          <p>{game.description}</p>
          <p className={styles.price}>${game.price}</p>
          <button className={styles.buyButton}>Buy</button>
        </div>
      ))}
    </section>
  );
}

export default GameCard;
