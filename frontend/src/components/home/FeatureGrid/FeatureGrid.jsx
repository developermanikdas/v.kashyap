import { useNavigate } from "react-router-dom";
import styles from "./FeatureGrid.module.css";

const FeatureGrid = () => {
  const navigate = useNavigate();

  return (
    <section className={styles.section}>
      <div className={styles.grid}>
        {/* Row 1, Col 1: Safety Hub Lotus Image */}
        <div className={`${styles.cell} ${styles.topLeft}`}>
          <div className={styles.imageWrapper}>
            <img
              src="/safety.png"
              alt="Safety Hub Illustration"
              className={styles.featureImage}
            />
          </div>
        </div>

        {/* Row 1, Col 2: Safety Hub Text & CTA */}
        <div className={`${styles.cell} ${styles.topRight}`}>
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

        {/* Row 2, Col 1: Acknowledgments Text & CTA */}
        <div className={`${styles.cell} ${styles.bottomLeft}`}>
          <h2 className={styles.title}>My Acknowledgments</h2>
          <p className={styles.description}>
            To those who have lent their voices, their time, and their quiet
            reflections to the archive. A registry of gratitude, penned in the
            margins for every shared silence, understanding, and kind word.
          </p>
          <button
            type="button"
            className={styles.actionBtn}
            onClick={() => navigate("/acknowledgement")}
          >
            See All
          </button>
        </div>

        {/* Row 2, Col 2: Acknowledgments Mascot Image */}
        <div className={`${styles.cell} ${styles.bottomRight}`}>
          <div className={styles.imageWrapper}>
            <img
              src="/thankyou.png"
              alt="Acknowledgments Illustration"
              className={styles.featureImage}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureGrid;
