import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import Modal from "../components/common/Modal/Modal";
import Button from "../components/common/Button/Button";
import Toast from "../components/common/Toast/Toast";
import { useAuth } from "../hooks/useAuth";
import { formatRelativeTime } from "../utils/timeUtils";
import { API_BASE } from "../config/api";
import styles from "./Acknowledgement.module.css";

const Acknowledgement = () => {
  const { user } = useAuth();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    quote: "",
    author: "",
    meta: "",
  });

  // Fetch strictly from MongoDB backend API
  useEffect(() => {
    fetch(`${API_BASE}/acknowledgements`)
      .then((res) => res.json())
      .then((resData) => {
        if (resData.success && Array.isArray(resData.data)) {
          setEntries(resData.data);
        }
      })
      .catch((err) => {
        console.error("Failed to load acknowledgements from MongoDB:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleOpenModal = () => {
    const defaultAuthor =
      user?.role === "master_admin" || user?.username === "developermanikdas"
        ? user?.fullName || "Manik"
        : user?.fullName || "Vanshika";
    setFormData({
      quote: "",
      author: defaultAuthor,
      meta: "",
    });
    setModalOpen(true);
  };

  const handleAddEntry = async (e) => {
    e.preventDefault();
    if (!formData.quote.trim() || !formData.author.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_BASE}/acknowledgements`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quote: formData.quote.trim(),
          author: formData.author.trim(),
          meta: formData.meta.trim() || "Archive Contributor",
        }),
      });

      const resData = await response.json();
      if (resData.success && resData.data) {
        setEntries((prev) => [resData.data, ...prev]);
        setModalOpen(false);
        setFormData({ quote: "", author: "", meta: "" });
        setToastMessage("Your reflection has been penned into the database ledger.");
      } else {
        setToastMessage("Could not save to database. Please try again.");
      }
    } catch {
      setToastMessage("Network error. Could not connect to the database.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerText}>
          <h1 className={styles.title}>Acknowledgments</h1>
          <div className={styles.titleBar} />
          <p className={styles.subtitle}>
            To those who have lent their voices, their time, and their quiet
            reflections to the archive. A registry of gratitude, penned in the
            margins.
          </p>
        </div>

        <button
          type="button"
          className={styles.addEntryBtn}
          onClick={handleOpenModal}
        >
          <Plus size={14} />
          <span>WRITE AN ACKNOWLEDGMENT</span>
        </button>
      </header>

      {loading ? (
        <div style={{ textAlign: "left", padding: "3rem 0", color: "var(--color-text-subtle)", fontStyle: "italic" }}>
          Opening the archive ledger...
        </div>
      ) : (
        <div className={styles.grid}>
          {entries.map((item) => (
            <article key={item._id || item.id} className={styles.card}>
              <p className={styles.quoteText}>
                &ldquo;{item.quote}&rdquo;
              </p>
              <div className={styles.cardFooter}>
                <span className={styles.author}>{item.author}</span>
                <span className={styles.meta}>
                  {formatRelativeTime(item.createdAt || item.date)}
                </span>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Add Entry Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Pen an Entry into the Ledger"
        size="md"
      >
        <form className={styles.form} onSubmit={handleAddEntry}>
          <div className={styles.field}>
            <label className={styles.label}>YOUR REFLECTION</label>
            <textarea
              className={styles.textarea}
              placeholder="Write your note for the archive..."
              value={formData.quote}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, quote: e.target.value }))
              }
              required
              disabled={isSubmitting}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>NAME / SIGNATURE</label>
            <input
              type="text"
              className={styles.input}
              placeholder="e.g. Vanshika Kashyap or Manik"
              value={formData.author}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, author: e.target.value }))
              }
              required
              disabled={isSubmitting}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "1rem" }}>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setModalOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" disabled={isSubmitting}>
              {isSubmitting ? "Recording..." : "Record to Archive"}
            </Button>
          </div>
        </form>
      </Modal>

      <Toast
        message={toastMessage}
        type="success"
        onClose={() => setToastMessage("")}
      />
    </div>
  );
};

export default Acknowledgement;
