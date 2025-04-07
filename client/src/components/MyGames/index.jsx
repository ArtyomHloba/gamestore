import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import styles from "./MyGames.module.css";

function MyGames() {
  const [purchasedGames, setPurchasedGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPurchasedGames = async () => {
      setLoading(true);

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("purchases")
        .select(
          `
          purchase_date,
          game:game_id (
            title,
            image,
            genre,
            description
          )
        `
        )
        .eq("user_id", user.id);

      if (!error) {
        setPurchasedGames(data);
      }

      setLoading(false);
    };

    fetchPurchasedGames();
  }, []);

  return (
    <div className={styles.container}>
      <h2>My Games</h2>

      {loading ? (
        <p>Loading...</p>
      ) : purchasedGames.length === 0 ? (
        <p>You don't have any purchased games yet.</p>
      ) : (
        <div className={styles.grid}>
          {purchasedGames.map((item, index) => (
            <div key={index} className={styles.card}>
              {item.game ? (
                <>
                  <img
                    src={item.game.image}
                    alt={item.game.title}
                    className={styles.image}
                  />
                  <h3>{item.game.title}</h3>
                  <p>{item.game.description}</p>
                  <p>
                    <strong>Genre:</strong> {item.game.genre}
                  </p>
                  <p>
                    <strong>Purchase Date:</strong>{" "}
                    {new Date(item.purchase_date).toLocaleDateString()}
                  </p>
                </>
              ) : (
                <p>Game not found or has been removed</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyGames;
