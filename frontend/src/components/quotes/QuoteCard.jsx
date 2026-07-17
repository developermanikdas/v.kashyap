import { useNavigate } from "react-router-dom";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";
import api from "../../api/axios";

const QuoteCard = () => {
  const navigate = useNavigate();

  const [quote, setQuote] = useState({
    content: "Loading inspiration...",
    author: "Please wait...",
  });
  const [loading, setLoading] = useState(false);

  const fetchQuote = async () => {
    try {
      setLoading(true);
      const response = await api.get("/quotes/random");
      if (response.data?.success && response.data?.quote) {
        setQuote(response.data.quote);
      }
    } catch (error) {
      console.error("Failed to fetch quote:", error);
      setQuote({
        content: "Consistency beats intensity when intensity doesn't last.",
        author: "Unknown",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      await Promise.resolve();
      fetchQuote();
    };
    init();
  }, []);

  return (
    <>
      <main className="max-h-screen flex items-start justify-center px-6 my-36 bg-white">
        <button
          onClick={() => navigate("/")}
          className="absolute top-24 left-6 md:left-10 flex items-center gap-2 text-neutral-600 hover:text-black transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Back</span>
        </button>
        <section key={quote.content} className="relative max-w-6xl w-full animate-[quoteFade_700ms_ease]">
          {/* Large Background Quote */}
          <span className="absolute -top-16 left-0 text-[9rem] sm:text-[12rem] md:text-[15rem] font-black text-neutral-200 opacity-40 leading-none select-none pointer-events-none">
            “
          </span>

          {/* Quote */}
          <h1 className="relative z-10 text-left md:text-center text-5xl sm:text-4xl md:text-6xl lg:text-8xl sm:font-bold leading-tight tracking-tight text-neutral-900 ">
            {quote.content}
          </h1>

          {/* Author */}
          <p className="relative z-10 mt-8 text-left md:text-center text-sm md:text-base text-neutral-500 uppercase tracking-[0.25em]">
            {quote.author}
          </p>
        </section>
      </main>

      {/* Floating Button */}
      <button
        onClick={fetchQuote}
        disabled={loading}
        className="fixed bottom-18 left-1/2 -translate-x-1/2 flex items-center gap-2 rounded-full border border-neutral-300 bg-black text-white px-6 py-3 shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-75"
      >
        <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
        <span className="">{loading ? "Loading..." : "New Quote"}</span>
      </button>

      <style>
        {`
          @keyframes quoteFade {
            from {
              opacity: 0;
              transform: translateY(25px) scale(0.98);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
        `}
      </style>
    </>
  );
};

export default QuoteCard;
