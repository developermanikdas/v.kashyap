import { useState, useEffect } from "react";
import { RotateCw } from "lucide-react";
import api from "../../../api/axios";
import styles from "./HeroQuote.module.css";

const quotesPool = [
  "Precision without curiosity is merely a ledger. Curiosity without precision is but a sketch.",
  "Every moment is a quiet invitation to begin again with clarity and gentle presence.",
  "Genuine strength looks quiet: simply continuing forward, even when things are difficult.",
  "Someone else's notification is never the measurement of your peace or your worth.",
  "The purpose of feeling safe is to live a life meant to be explored, painted, and experienced.",
  "Setting a boundary does not make you distant—it makes you honest and whole.",
  "Admiration should not merely remain admiration; it should become motivation to grow.",
];

const HeroQuote = () => {
  const [currentQuote, setCurrentQuote] = useState(quotesPool[0]);
  const [isRotating, setIsRotating] = useState(false);
  const [isFading, setIsFading] = useState(false);
  const [fallbackIndex, setFallbackIndex] = useState(0);

  const fetchNextQuote = async () => {
    try {
      const response = await api.get("/quotes/random");
      if (response.data?.success && response.data?.quote?.content) {
        return response.data.quote.content;
      }
    } catch {
      // Fallback silently if offline or backend is initializing
    }
    const nextIdx = (fallbackIndex + 1) % quotesPool.length;
    setFallbackIndex(nextIdx);
    return quotesPool[nextIdx];
  };

  const handleRefresh = async () => {
    if (isRotating) return;
    setIsRotating(true);
    setIsFading(true);

    const nextText = await fetchNextQuote();

    setTimeout(() => {
      setCurrentQuote(nextText);
      setIsFading(false);
    }, 200);

    setTimeout(() => {
      setIsRotating(false);
    }, 600);
  };

  useEffect(() => {
    fetchNextQuote().then((text) => {
      if (text) setCurrentQuote(text);
    });
  }, []);

  return (
    <section className={styles.heroSection}>
      <div
        className={styles.quoteContainer}
        style={{
          opacity: isFading ? 0 : 1,
          transform: isFading ? "translateY(4px)" : "translateY(0)",
        }}
      >
        <blockquote className={styles.quote}>
          &ldquo;{currentQuote}&rdquo;
        </blockquote>
      </div>

      <button
        type="button"
        className={styles.refreshBtn}
        onClick={handleRefresh}
        aria-label="Refresh quote"
      >
        <span>Refresh</span>
        <RotateCw size={14} className={isRotating ? styles.spinning : ""} />
      </button>
    </section>
  );
};

export default HeroQuote;
