import { useState, useEffect, useRef } from "react";
import api from "../../../api/axios";
import LotusHeroCanvas from "./LotusHeroCanvas";
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
  const lotusRef = useRef(null);

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

    // Trigger 3D Lotus Bloom animation
    if (lotusRef.current) {
      lotusRef.current.triggerBloom();
    }

    const nextText = await fetchNextQuote();

    setTimeout(() => {
      setCurrentQuote(nextText);
      setIsFading(false);
    }, 260);

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
      {/* Interactive 3D Lotus Emblem - Click/Tap to bloom and refresh reflection */}
      <LotusHeroCanvas ref={lotusRef} onLotusClick={handleRefresh} />

      <div
        className={styles.quoteContainer}
        style={{
          opacity: isFading ? 0 : 1,
          transform: isFading ? "translateY(6px)" : "translateY(0)",
        }}
      >
        <blockquote className={styles.quote}>
          &ldquo;{currentQuote}&rdquo;
        </blockquote>
      </div>
    </section>
  );
};

export default HeroQuote;
