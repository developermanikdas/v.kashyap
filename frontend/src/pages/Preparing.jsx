import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import styles from "./Preparing.module.css";

const Preparing = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        Something thoughtful
        <br />
        is being prepared.
      </h1>

      <p className={styles.subtitle}>
        Every detail of this space is being carefully crafted for the archive.
        Thank you for your patience.
      </p>

      <button
        type="button"
        className={styles.backBtn}
        onClick={() => navigate("/")}
      >
        <ArrowLeft size={16} />
        <span>Return to Home</span>
      </button>
    </div>
  );
};

export default Preparing;