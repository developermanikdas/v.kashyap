import { useNavigate } from "react-router-dom";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";
import api from "../../api/axios";
import styles from "./QuoteCard.module.css";

const fallbackQuotes = [
  {
    content: "Precision without curiosity is merely a ledger. Curiosity without precision is but a sketch.",
    author: "Archive Reflection",
  },
  {
    content: "Consistency beats intensity when intensity does not last.",
    author: "Marcus Aurelius",
  },
  {
    content: "Genuine strength looks quiet: simply continuing forward, even when things are difficult.",
    author: "The Many Strings",
  },
  {
    content: "Someone else's notification is not the measurement of your peace or your worth.",
    author: "Mindful Notes",
  },
];

const QuoteCard = () => {
  const navigate = useNavigate();
  const [quote, setQuote] = useState(fallbackQuotes[0]);
  const [loading, setLoading] = useState(false);
  const [fallbackIndex, setFallbackIndex] = useState(0);

  const fetchQuote = async () => {
    try {
      setLoading(true);
      const response = await api.get("/quotes/random");
      if (response.data?.success && response.data?.quote) {
        setQuote(response.data.quote);
      } else {
        cycleFallback();
      }
    } catch {
      cycleFallback();
    } finally {
      setLoading(false);
    }
  };

  const cycleFallback = () => {
    const nextIdx = (fallbackIndex + 1) % fallbackQuotes.length;
    setFallbackIndex(nextIdx);
    setQuote(fallbackQuotes[nextIdx]);
  };

  useEffect(() => {
    fetchQuote();
  }, []);

  return (
    <div className={styles.container}>
      <button
        type="button"
        className={styles.backBtn}
        onClick={() => navigate("/")}
      >
        <ArrowLeft size={16} />
        <span>Return to Archive</span>
      </button>

      <div className={styles.quoteSection}>
        <div className={styles.decorativeQuoteMark}>&ldquo;</div>
        <blockquote className={styles.quoteText}>
          &ldquo;{quote.content}&rdquo;
        </blockquote>
        <p className={styles.author}>— {quote.author || "Archive"}</p>
      </div>

      <button
        type="button"
        className={styles.refreshBtn}
        onClick={fetchQuote}
        disabled={loading}
      >
        <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
        <span>{loading ? "Fetching..." : "Next Thought"}</span>
      </button>
    </div>
  );
};

export default QuoteCard;
