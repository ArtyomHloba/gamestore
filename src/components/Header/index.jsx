import { IoGameControllerOutline } from 'react-icons/io5'
import styles from './Header.module.css'

function Header () {
  return (
    <header className={styles.headerPage}>
      <div className={styles.logoContainer}>
        <a href='/' className={styles.logo}>
          <IoGameControllerOutline />
        </a>
        <p>Game Store</p>
      </div>

      <div className={styles.signUpContainer}>
        <button className={styles.loginBtn}>Login</button>
        <button className={styles.signUpBtn}>Sign up</button>
      </div>
    </header>
  )
}

export default Header
