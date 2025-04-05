import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import styles from "./MyGames.module.css";

function MyGames() {
  const [gamesWithKeys, setGamesWithKeys] = useState([]);

  useEffect(() => {
    const fetchMyGames = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error("Пользователь не авторизован");
        return;
      }

      const { data, error } = await supabase
        .from("copies")
        .select(
          `
          game_key,
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
        console.error("Ошибка при получении игр:", error);
      } else {
        setGamesWithKeys(data);
      }
    };

    fetchMyGames();
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h2>🎮 Мои игры</h2>
      {gamesWithKeys.length === 0 ? (
        <p>У вас пока нет купленных игр.</p>
      ) : (
        <div style={{ display: "grid", gap: "1rem" }}>
          {gamesWithKeys.map((item, index) => (
            <div
              key={index}
              style={{
                border: "1px solid #ddd",
                padding: "1rem",
                borderRadius: "10px",
              }}
            >
              <img
                src={item.game.image}
                alt={item.game.title}
                style={{ width: "150px" }}
              />
              <h3>{item.game.title}</h3>
              <p>{item.game.description}</p>
              <p>
                <strong>Жанр:</strong> {item.game.genre}
              </p>
              <p>
                <strong>Ключ игры:</strong> <code>{item.game_key}</code>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyGames;
