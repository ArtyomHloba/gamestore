import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import ClipLoader from "react-spinners/ClipLoader";
import MyGameCard from "../MyGameCard";
import styles from "./MyGames.module.css";

function MyGames() {
  const [gamesWithKeys, setGamesWithKeys] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleKeys, setVisibleKeys] = useState({});

  useEffect(() => {
    const fetchMyGamesAndPurchases = async () => {
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

      try {
        const { data: copiesData, error: copiesError } = await supabase
          .from("copies")
          .select(
            `
            game_key,
            user_id,
            game:game_id (
              title,
              image
            )
          `
          )
          .eq("user_id", user.id);

        if (copiesError) {
          console.error("Error fetching copies:", copiesError);
        } else {
          setGamesWithKeys(copiesData);
        }

        const { data: purchasesData, error: purchasesError } = await supabase
          .from("purchases")
          .select(
            `
            purchase_id,
            purchase_date,
            game:game_id (
              title,
              genre,
              price
            ),
            user:user_id (
              user_name,
              email
            )
          `
          )
          .eq("user_id", user.id);

        if (purchasesError) {
          console.error("Error fetching purchases:", purchasesError);
        } else {
          setPurchases(purchasesData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyGamesAndPurchases();
  }, []);

  const toggleKeyVisibility = index => {
    setVisibleKeys(prevState => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>My Games</h2>

      {loading ? (
        <div className={styles.loaderContainer}>
          <ClipLoader color="#f39c12" size={50} className={styles.loader} />
        </div>
      ) : gamesWithKeys.length === 0 ? (
        <p className={styles.noGames}>
          You don't have any purchased games yet.
        </p>
      ) : (
        <div className={styles.grid}>
          {gamesWithKeys.map((item, index) => {
            const purchase = purchases.find(
              purchase => purchase.game.title === item.game.title
            );

            return (
              <MyGameCard
                key={index}
                game={item.game}
                gameKey={item.game_key}
                purchase={purchase}
                visible={visibleKeys[index]}
                onToggleVisibility={() => toggleKeyVisibility(index)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

export default MyGames;
