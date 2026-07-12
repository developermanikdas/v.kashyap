import { Sparkles } from "lucide-react";

const Hero = () => {
  return (
    <>
      <section className="relative overflow-hidden px-6 py-12">
        {/* Background Blobs */}
        <div className="absolute -top-24 -left-20 h-72 w-72 rounded-full bg-violet-300/30 blur-[110px] animate-[float_10s_ease-in-out_infinite]" />

        <div className="absolute top-12 right-0 h-72 w-72 rounded-full bg-orange-200/40 blur-[120px] animate-[floatReverse_12s_ease-in-out_infinite]" />

        <div className="absolute bottom-0 left-1/2 h-60 w-60 -translate-x-1/2 rounded-full bg-sky-200/30 blur-[100px] animate-[float_9s_ease-in-out_infinite]" />

        {/* Floating Sparkles */}
        <Sparkles className="absolute left-16 top-44 h-5 w-5 text-violet-300 animate-pulse" />

        <Sparkles className="absolute right-24 top-60 h-4 w-4 text-orange-300 animate-pulse delay-300" />

        <Sparkles className="absolute bottom-20 right-1/4 h-5 w-5 text-violet-200 animate-pulse delay-700" />

        {/* Content */}
        <div className="relative z-10 mx-auto max-w-5xl text-center">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white/80 px-5 py-2 shadow-sm backdrop-blur-md">
            <Sparkles size={15} className="text-violet-500" />
            <span className="text-sm font-medium text-neutral-700">
              Welcome to Serenity
            </span>
          </div>

          {/* Heading */}
          <h1
            className="mt-8 text-6xl leading-[0.9] tracking-tight text-neutral-900 md:text-8xl"
            style={{
              fontFamily: '"Cormorant Garamond", serif',
            }}
          >
            Discover little
            <br />
            <span className="bg-gradient-to-r from-violet-500 via-purple-400 to-orange-300 bg-clip-text text-transparent">
              moments of peace.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-neutral-500">
            Gentle inspiration, thoughtful stories, and beautiful moments—
            crafted to bring a little more calm into your day.
          </p>
        </div>
      </section>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&display=swap');

        @keyframes float {
          0%,100%{
            transform:translateY(0px);
          }
          50%{
            transform:translateY(-20px);
          }
        }

        @keyframes floatReverse {
          0%,100%{
            transform:translateY(0px);
          }
          50%{
            transform:translateY(20px);
          }
        }
      `}</style>
    </>
  );
};

export default Hero;