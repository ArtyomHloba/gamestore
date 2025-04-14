import { IoGameControllerOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import { FaHeart, FaUser, FaSignInAlt, FaUserPlus } from "react-icons/fa";
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
        {/* Wishlist */}
        <Link to="/wishlist" className={styles.navItem}>
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300 }}
            className={styles.navLink}
          >
            <FaHeart className={styles.icon} />
            <span>Wishlist</span>
          </motion.div>
        </Link>

        {/* Profile */}
        <Link to="/my-games" className={styles.navItem}>
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300 }}
            className={styles.navLink}
          >
            <FaUser className={styles.icon} />
            <span>Profile</span>
          </motion.div>
        </Link>

        {/* Login */}
        <Link to="/login" className={styles.navItem}>
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300 }}
            className={styles.navLink}
          >
            <FaSignInAlt className={styles.icon} />
            <span>Login</span>
          </motion.div>
        </Link>

        {/* Sign up */}
        {!isLoggedIn && (
          <Link to="/signup" className={styles.navItem}>
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300 }}
              className={styles.navLink}
            >
              <FaUserPlus className={styles.icon} />
              <span>Sign up</span>
            </motion.div>
          </Link>
        )}
      </div>
    </header>
  );
}

export default Header;
