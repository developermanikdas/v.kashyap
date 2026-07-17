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
      <main className="min-h-[75vh] flex flex-col items-start justify-start px-6 py-6 md:py-12 max-w-5xl mx-auto w-full bg-transparent">
        {/* Back Button Container */}
        <div className="w-full flex justify-start mb-8 md:mb-12">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-neutral-600 hover:text-black transition-colors cursor-pointer"
          >
            <ArrowLeft size={20} />
            <span>Back</span>
          </button>
        </div>

        {/* Quote Section */}
        <section 
          key={quote.content} 
          className="relative w-full flex flex-col items-start justify-start text-left animate-[quoteFade_700ms_ease]"
        >
          {/* Large Background Quote */}
          <span className="absolute -top-12 md:-top-24 left-0 text-[7rem] md:text-[15rem] font-black text-neutral-200 opacity-40 leading-none select-none pointer-events-none">
            “
          </span>

          {/* Quote */}
          <h1 className="relative z-10 text-left text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-light leading-tight tracking-tight text-neutral-900 md:text-center md:w-full">
            {quote.content}
          </h1>

          {/* Author */}
          <p className="relative z-10 mt-6 md:mt-8 text-left text-xs md:text-base text-neutral-500 uppercase tracking-[0.25em] md:text-center md:w-full">
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
