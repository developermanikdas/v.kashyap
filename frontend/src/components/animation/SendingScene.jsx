import { motion } from "framer-motion";

const SendingScene = () => {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#FAF8FF]">

      {/* Background Glow */}
      <div className="absolute inset-0 overflow-hidden">

        <motion.div
          animate={{
            x: [0, 80, 0],
            y: [0, -40, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 15,
            ease: "easeInOut",
          }}
          className="absolute -left-40 top-0 h-[38rem] w-[38rem] rounded-full bg-violet-300/20 blur-[140px]"
        />

        <motion.div
          animate={{
            x: [0, -70, 0],
            y: [0, 50, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 18,
            ease: "easeInOut",
          }}
          className="absolute -right-32 bottom-0 h-[36rem] w-[36rem] rounded-full bg-pink-300/20 blur-[140px]"
        />

      </div>

      {/* Envelope */}
      <motion.div
        initial={{
          y: 0,
          x: 0,
          opacity: 1,
          scale: 1,
          rotate: 0,
        }}
        animate={{
          y: -350,
          x: 80,
          opacity: 0,
          scale: 0.6,
          rotate: 18,
        }}
        transition={{
          duration: 3,
          ease: "easeInOut",
        }}
        className="relative h-48 w-72"
      >

        {/* Glow */}
        <motion.div
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.25, 0.5, 0.25],
          }}
          transition={{
            repeat: Infinity,
            duration: 2,
          }}
          className="absolute inset-0 rounded-2xl bg-violet-300 blur-2xl"
        />

        {/* Envelope Body */}
        <div className="absolute bottom-0 h-36 w-full rounded-xl bg-white shadow-2xl" />

        {/* Flap */}
        <div
          className="absolute top-0 h-24 w-full bg-neutral-100"
          style={{
            clipPath: "polygon(0 0,100% 0,50% 100%)",
          }}
        />

      </motion.div>

      {/* Flying Particles */}
      {[...Array(20)].map((_, index) => (
        <motion.div
          key={index}
          initial={{
            opacity: 0,
            y: 20,
            x: 0,
            scale: 0,
          }}
          animate={{
            opacity: [0, 1, 1, 0],
            y: -260,
            x: (Math.random() - 0.5) * 160,
            scale: [0, 1, 0],
          }}
          transition={{
            duration: 2.8,
            delay: index * 0.08,
            repeat: Infinity,
          }}
          className="absolute h-2 w-2 rounded-full bg-violet-400"
        />
      ))}

      {/* Text */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="absolute bottom-24 text-center"
      >
        <h2 className="text-4xl font-serif font-semibold text-neutral-800">
          Sending your wishes...
        </h2>

        <p className="mt-4 max-w-md text-lg leading-8 text-neutral-500">
          Every heartfelt message deserves
          <br />
          a beautiful journey.
        </p>
      </motion.div>

    </section>
  );
};

export default SendingScene;