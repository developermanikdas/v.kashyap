import { useNavigate } from "react-router-dom";
import styles from "./SafetyBanner.module.css";

const SafetyBanner = () => {
  const navigate = useNavigate();

  return (
    <section className={styles.section}>
      <div className={styles.card}>
        <div className={styles.imageArea}>
          <img
            src="/safety.png"
            alt="Safety Hub Lotus Illustration"
            className={styles.image}
          />
        </div>

        <div className={styles.contentArea}>
          <h2 className={styles.title}>Safety Hub</h2>
          <p className={styles.description}>
            Cultivating a balanced environment requires both mental fortitude
            and physical discipline. Explore our comprehensive resources designed
            to guide your practice, maintain your instruments, and protect your
            well-being in the studio.
          </p>
          <button
            type="button"
            className={styles.actionBtn}
            onClick={() => navigate("/safety-hub")}
          >
            Explore Hub
          </button>
        </div>
      </div>
    </section>
  );
};

export default SafetyBanner;
