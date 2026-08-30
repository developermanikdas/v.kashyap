import { Link } from "react-router-dom";
import styles from "./Footer.module.css";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.brand}>The Many Strings</div>

        <ul className={styles.links}>
          <li>
            <Link to="/" className={styles.link}>
              Home
            </Link>
          </li>
          <li>
            <Link to="/safety-hub" className={styles.link}>
              Safety Hub
            </Link>
          </li>
          <li>
            <Link to="/stories" className={styles.link}>
              Stories
            </Link>
          </li>
          <li>
            <Link to="/resources" className={styles.link}>
              Resources
            </Link>
          </li>
          <li>
            <Link to="/acknowledgement" className={styles.link}>
              Acknowledgement
            </Link>
          </li>
        </ul>

        <div className={styles.copyright}>
          &copy; The Many Strings. Printed in Archive.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
