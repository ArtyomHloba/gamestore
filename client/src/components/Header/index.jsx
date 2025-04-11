import { IoGameControllerOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import { FaHeart } from "react-icons/fa";
import { motion } from "framer-motion";
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
          <motion.div
            initial={{ rotate: 0, opacity: 0 }}
            animate={{ rotate: 360, opacity: 1 }}
            transition={{
              duration: 1.5,
              ease: "easeInOut",
            }}
          >
            <IoGameControllerOutline size={40} />
          </motion.div>
        </Link>
        <p className={styles.gameStore}>Game Store</p>
      </div>

      <div className={styles.signUpContainer}>
        <Link to="/wishlist">
          <motion.div
            whileHover={{ scale: 1.2, rotate: 10 }}
            whileTap={{ scale: 0.9, rotate: -10 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <FaHeart color="red" className={styles.wishlistButton} />
          </motion.div>
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
