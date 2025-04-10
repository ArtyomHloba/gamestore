import styles from "./Footer.module.css";
import contactInfo from "./contactInfo";

function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <ul className={styles.contactList}>
          {contactInfo.map((item, index) => (
            <li key={index} className={styles.contactItem}>
              {item.icon && <span className={styles.icon}>{item.icon}</span>}
              {item.link ? (
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.link}
                >
                  {item.label}
                </a>
              ) : (
                <span className={styles.text}>{item.label}</span>
              )}
            </li>
          ))}
        </ul>
        <p className={styles.copyright}>
          &copy; {new Date().getFullYear()} Game Store. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
