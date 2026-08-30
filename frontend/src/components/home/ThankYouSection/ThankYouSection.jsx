import { useNavigate } from "react-router-dom";
import styles from "./ThankYouSection.module.css";

const ThankYouSection = () => {
  const navigate = useNavigate();

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>My Acknowledgments</h2>
      <p className={styles.subtitle}>
        To those who have lent their voices, their time, and their quiet reflections to the archive.
      </p>
      <button
        type="button"
        className={styles.button}
        onClick={() => navigate("/acknowledgement")}
      >
        See all acknowledgments
      </button>
    </section>
  );
};

export default ThankYouSection;
