import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import styles from "./MyGames.module.css";

function MyGames() {
  const [gamesWithKeys, setGamesWithKeys] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyGames = async () => {
      setLoading(true);

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error("User is not authenticated:", userError);
        setLoading(false);
        return;
      }

      console.log("User ID:", user.id);

      const { data, error } = await supabase
        .from("copies")
        .select(
          `
          game_key,
          user_id,
          game:game_id (
            title,
            image,
            genre,
            description
          )
        `
        )
        .eq("user_id", user.id);

      if (error) {
        console.error("Error fetching games:", error);
      } else {
        console.log("Fetched games:", data);
        setGamesWithKeys(data);
      }

      setLoading(false);
    };

    fetchMyGames();
  }, []);

  return (
    <div className={styles.container}>
      <h2>My Games</h2>

      {loading ? (
        <p>Loading...</p>
      ) : gamesWithKeys.length === 0 ? (
        <p>You don't have any purchased games yet.</p>
      ) : (
        <div className={styles.grid}>
          {gamesWithKeys.map((item, index) => (
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
                    <strong>Game Key:</strong> <code>{item.game_key}</code>
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
