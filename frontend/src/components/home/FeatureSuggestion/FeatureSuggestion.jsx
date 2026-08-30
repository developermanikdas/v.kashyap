import { useState } from "react";
import { useAuth } from "../../../hooks/useAuth";
import Toast from "../../common/Toast/Toast";
import { API_BASE } from "../../../config/api";
import styles from "./FeatureSuggestion.module.css";

const FeatureSuggestion = () => {
  const { user } = useAuth();
  const [suggestion, setSuggestion] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!suggestion.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_BASE}/features/suggest`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          suggestion: suggestion.trim(),
          user: user?.username || "Archive Member",
        }),
      });

      const resData = await response.json();
      if (resData.success) {
        setToastMessage("Thank you. Your feature request has been submitted to the database.");
        setSuggestion("");
      } else {
        setToastMessage("Could not submit request. Please try again.");
      }
    } catch {
      setToastMessage("Network error. Could not connect to the database.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className={styles.wrapper}>
      <div className={styles.container}>
        <h2 className={styles.title}>Suggest a Feature</h2>

        <form className={styles.form} onSubmit={handleSubmit}>
          <input
            type="text"
            className={styles.input}
            placeholder="What should we build next?"
            value={suggestion}
            onChange={(e) => setSuggestion(e.target.value)}
            required
            disabled={isSubmitting}
          />
          <button
            type="submit"
            className={styles.submitBtn}
            disabled={!suggestion.trim() || isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </form>

        <Toast
          message={toastMessage}
          type="success"
          onClose={() => setToastMessage("")}
        />
      </div>
    </section>
  );
};

export default FeatureSuggestion;
