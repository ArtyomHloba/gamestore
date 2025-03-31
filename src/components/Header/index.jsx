import { IoGameControllerOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import styles from "./Header.module.css";

function Header() {
  return (
    <header className={styles.headerPage}>
      <div className={styles.logoContainer}>
        <Link to="/" className={styles.logo}>
          <IoGameControllerOutline />
        </Link>
        <p>Game Store</p>
      </div>

      <div className={styles.signUpContainer}>
        <Link to="/login">
          <button className={styles.loginBtn}>Login</button>
        </Link>
        <Link to="/signup">
          <button className={styles.signUpBtn}>Sign up</button>
        </Link>
      </div>
    </header>
  );
}

export default Header;
