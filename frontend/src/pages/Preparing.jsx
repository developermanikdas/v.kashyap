import { ArrowLeft, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Preparing = () => {
  const navigate = useNavigate();

  return (
    <>
      <main className="relative min-h-screen overflow-hidden bg-neutral-50 flex items-center justify-center px-6">

        {/* Background Blur */}
        <div className="absolute -top-32 -left-24 w-72 h-72 bg-violet-300/40 rounded-full blur-[120px] animate-pulse" />

        <div
          className="absolute bottom-0 right-0 w-80 h-80 bg-sky-300/40 rounded-full blur-[140px]"
          style={{
            animation: "float 8s ease-in-out infinite",
          }}
        />

        {/* Back Button */}
        <button
          onClick={() => navigate("/")}
          className="absolute top-8 left-8 flex items-center gap-2 text-neutral-600 hover:text-black transition"
        >
          <ArrowLeft size={20} />
          Back
        </button>

        {/* Content */}
        <section className="relative z-10 max-w-2xl text-center animate-[fadeUp_.8s_ease]">

          <div
            className="mx-auto mb-10 flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-xl"
            style={{
              animation: "float 5s ease-in-out infinite",
            }}
          >
            <Sparkles
              className="text-violet-500"
              size={34}
              strokeWidth={1.8}
            />
          </div>

          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-neutral-900">
            Something beautiful
            <br />
            is on its way.
          </h1>

          <p className="mt-8 text-lg md:text-xl leading-8 text-neutral-500">
            I'm carefully preparing this space for you.
            <br />
            Every detail is being crafted with care.
          </p>

          <p className="mt-10 text-sm uppercase tracking-[0.35em] text-neutral-400">
            Thank you for your patience.
          </p>

          <button
            onClick={() => navigate("/")}
            className="mt-14 rounded-full bg-neutral-900 px-7 py-3 text-white transition duration-300 hover:scale-105 hover:bg-black"
          >
            Back Home
          </button>

        </section>

      </main>

      <style>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%,100%{
            transform: translateY(0px);
          }
          50%{
            transform: translateY(-15px);
          }
        }
      `}</style>
    </>
  );
};

export default Preparing;