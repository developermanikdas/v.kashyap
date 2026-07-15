import { motion } from "framer-motion";
import { Lock, Sparkles } from "lucide-react";

const LockScene = () => {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#FAF8FF]">

      {/* Background */}

      <div className="absolute inset-0">

        <motion.div
          animate={{
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 12,
          }}
          className="absolute -top-40 -left-40 h-[36rem] w-[36rem] rounded-full bg-violet-300/20 blur-[120px]"
        />

        <motion.div
          animate={{
            x: [0, -40, 0],
            y: [0, 30, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 14,
          }}
          className="absolute bottom-0 right-0 h-[34rem] w-[34rem] rounded-full bg-pink-300/20 blur-[120px]"
        />

      </div>

      {/* Envelope */}

      <motion.div
        initial={{ scale: .95 }}
        animate={{ scale: 1 }}
        transition={{ duration: .6 }}
        className="
        relative

        h-48
        w-72

        rounded-2xl

        bg-white

        shadow-[0_30px_80px_rgba(0,0,0,.12)]
        "
      >

        {/* Flap */}

        <div
          className="
          absolute

          top-0

          h-24
          w-full

          bg-neutral-100

          [clip-path:polygon(0_0,100%_0,50%_100%)]
          "
        />

        {/* Wax Seal */}

        <motion.div

          initial={{
            scale:0,
            opacity:0
          }}

          animate={{
            scale:1,
            opacity:1
          }}

          transition={{
            delay:.8,
            type:"spring",
            stiffness:120
          }}

          className="
          absolute

          left-1/2
          top-1/2

          flex

          h-16
          w-16

          -translate-x-1/2
          -translate-y-1/2

          items-center
          justify-center

          rounded-full

          bg-gradient-to-br

          from-violet-500
          to-fuchsia-500

          shadow-xl
          "

        >

          <Lock
            size={22}
            className="text-white"
          />

        </motion.div>

      </motion.div>

      {/* Text */}

      <motion.div

        initial={{
          opacity:0,
          y:20
        }}

        animate={{
          opacity:1,
          y:0
        }}

        transition={{
          delay:1.5
        }}

        className="
        absolute

        bottom-28

        text-center
        "

      >

        <h2 className="font-serif text-2xl">
          Protected
        </h2>

        <p className="mt-3 text-neutral-500">
          Your birthday wish has been sealed.
        </p>

      </motion.div>

      {/* Sparkles */}

      <motion.div
        animate={{
          rotate:360
        }}
        transition={{
          repeat:Infinity,
          duration:8,
          ease:"linear"
        }}
        className="
        absolute

        h-40
        w-40
        "
      >

        <Sparkles
          className="
          absolute
          left-0
          top-10

          text-violet-300
          "
        />

        <Sparkles
          className="
          absolute

          right-0
          bottom-8

          text-pink-300
          "
        />

      </motion.div>

    </section>
  );
};

export default LockScene;