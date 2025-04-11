import { IoGameControllerOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import { FaHeart } from "react-icons/fa";
import styles from "./Header.module.css";

function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setIsLoggedIn(!!user);
    };

    checkUser();
  }, []);

  return (
    <header className={styles.headerPage}>
      <div className={styles.logoContainer}>
        <Link to="/" className={styles.logo}>
          <IoGameControllerOutline />
        </Link>
        <p className={styles.gameStore}>Game Store</p>
      </div>

      <div className={styles.signUpContainer}>
        <Link to="/wishlist">
          <button className={styles.wishlistButton}>
            <FaHeart color="red" /> Wishlist
          </button>
        </Link>
        <Link to="/my-games">
          <button className={styles.loginBtn}>Profile</button>
        </Link>
        <Link to="/login">
          <button className={styles.loginBtn}>Login</button>
        </Link>
        {!isLoggedIn && (
          <Link to="/signup">
            <button className={styles.signUpBtn}>Sign up</button>
          </Link>
        )}
      </div>
    </header>
  );
}

export default Header;
