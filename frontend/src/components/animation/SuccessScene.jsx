import { motion } from "framer-motion";
import { CheckCircle2, Home, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SuccessScene = () => {
  const navigate = useNavigate();

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#FAF8FF] px-6">
      {/* Background */}

      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            x: [0, 40, 0],
            y: [0, -30, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 14,
          }}
          className="absolute -top-40 -left-32 h-[34rem] w-[34rem] rounded-full bg-violet-300/20 blur-[120px]"
        />

        <motion.div
          animate={{
            x: [0, -40, 0],
            y: [0, 30, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 16,
          }}
          className="absolute bottom-0 right-0 h-[34rem] w-[34rem] rounded-full bg-pink-300/20 blur-[120px]"
        />
      </div>

      {[...Array(25)].map((_, i) => (
        <motion.div
          key={i}
          initial={{
            y: -250,
            opacity: 0,
            x: (Math.random() - 0.5) * 500,
          }}
          animate={{
            y: 500,
            opacity: [0, 1, 1, 0],
            rotate: 360,
          }}
          transition={{
            duration: 4,
            delay: i * 0.08,
          }}
          className="absolute h-2 w-2 rounded-full bg-violet-400"
        />
      ))}

      <motion.div
        animate={{
          rotate: 360,
        }}
        transition={{
          repeat: Infinity,
          duration: 25,
          ease: "linear",
        }}
        className="absolute h-[450px] w-[450px]"
      >
        <Sparkles
          size={18}
          className="absolute left-8 top-16 text-violet-300"
        />

        <Sparkles
          size={15}
          className="absolute right-8 bottom-20 text-pink-300"
        />

        <Sparkles
          size={12}
          className="absolute top-1/2 left-0 text-violet-200"
        />
      </motion.div>

      {/* Content */}

      <motion.div
        initial={{
          opacity: 0,
          y: 40,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.9,
        }}
        className="relative z-10 max-w-md text-center"
      >
        <motion.div
          initial={{
            scale: 0,
            rotate: -180,
          }}
          animate={{
            scale: [0, 1.15, 1],
            rotate: 0,
          }}
          transition={{
            duration: 0.8,
            ease: "easeOut",
          }}
          transition={{
            repeat: Infinity,
            duration: 2.5,
          }}
          className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-white/70 shadow-xl backdrop-blur-xl"
        >
          <CheckCircle2 size={46} className="text-green-500" />
        </motion.div>

        <h1 className="mt-10 font-serif text-5xl text-neutral-900">
          Your Wish Is Safe 💜
        </h1>

        <p className="mx-auto mt-8 max-w-sm text-[15px] leading-8 text-neutral-500">
          Your birthday wish has been carefully wrapped, sealed and safely
          stored.
        </p>

        <p className="mt-4 text-neutral-400 leading-7">
          Thank you for making this birthday a little more meaningful.
        </p>

        <button
          onClick={() => navigate("/")}
          className="
          group
          relative

          mt-14

          overflow-hidden

          rounded-full

          p-[2px]

          bg-gradient-to-r
          from-violet-500
          via-fuchsia-500
          to-pink-500

          transition-all
          duration-500

          hover:scale-[1.03]
          hover:shadow-[0_20px_60px_rgba(168,85,247,.25)]
          "
        >
          <div
            className="
            relative

            flex
            items-center
            justify-center
            gap-3

            rounded-full

            bg-white/90

            px-8
            py-4

            backdrop-blur-xl
            "
          >
            <Home size={18} className="text-violet-600" />

            <span className="font-medium">Return Home</span>
          </div>

          <div
            className="
            absolute
            inset-0

            -translate-x-full

            bg-gradient-to-r

            from-transparent
            via-white/40
            to-transparent

            transition-transform
            duration-1000

            group-hover:translate-x-full
            "
          />
        </button>
      </motion.div>
    </section>
  );
};

export default SuccessScene;
