import { FaEye, FaEyeSlash } from "react-icons/fa";
import ReceiptPDF from "../ReceiptPDF";
import styles from "../MyGames/MyGames.module.css";

function MyGameCard({ game, gameKey, purchase, visible, onToggleVisibility }) {
  return (
    <div className={styles.card}>
      {game ? (
        <>
          <img src={game.image} alt={game.title} className={styles.image} />
          <h3 className={styles.gameTitle}>{game.title}</h3>
          <p className={styles.gameKey}>
            Game Key:{" "}
            {visible ? (
              <>
                <code>{gameKey}</code>
                <FaEyeSlash
                  className={styles.eyeIcon}
                  onClick={onToggleVisibility}
                />
              </>
            ) : (
              <>
                <span>••••••••••••••••</span>
                <FaEye
                  className={styles.eyeIcon}
                  onClick={onToggleVisibility}
                />
              </>
            )}
          </p>
          {purchase && <ReceiptPDF purchaseId={purchase.purchase_id} />}
        </>
      ) : (
        <p className={styles.error}>Game not found or has been removed</p>
      )}
    </div>
  );
}

export default MyGameCard;
