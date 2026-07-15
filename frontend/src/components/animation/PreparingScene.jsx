import React from "react";
import { motion } from "framer-motion";

function PreparingScene() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="relative flex h-screen items-center justify-center overflow-hidden bg-[#faf8f4]"
    >
      {/* Background glow */}
      <div className="absolute h-[450px] w-[450px] rounded-full bg-blue-200/30 blur-3xl animate-pulse" />
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(25)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-2 w-2 rounded-full bg-blue-300"
            initial={{
              x: Math.random() * window.innerWidth,
              y: window.innerHeight + 50,
              opacity: 0,
            }}
            animate={{
              y: -100,
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration: 6 + Math.random() * 3,
              delay: Math.random() * 3,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>
      {/* Main content */}
      <div className="relative flex flex-col items-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative flex h-28 w-28 items-center justify-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute h-40 w-40 rounded-full border-2 border-blue-300"
          />

          <motion.div
            animate={{ rotate: -360 }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute h-52 w-52 rounded-full border border-blue-200"
          />

          <motion.div
            animate={{
              scale: [1, 1.15, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
            className="h-20 w-20 rounded-full bg-blue-500 shadow-[0_0_70px_rgba(59,130,246,0.8)]"
          />
        </motion.div>

        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-10 text-3xl font-semibold"
        >
          Preparing your letter...
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-3 text-gray-500"
        >
          Gathering memories and choosing the perfect words.
        </motion.p>

        {/* Progress cards */}
        <motion.div
          className="mt-12 grid grid-cols-2 gap-4"
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.3,
              },
            },
          }}
        >
          {[
            { icon: "🧠", text: "Collecting memories" },
            { icon: "❤️", text: "Understanding emotions" },
            { icon: "📷", text: "Choosing moments" },
            { icon: "✨", text: "Final touch" },
          ].map((item) => (
            <motion.div
              key={item}
              variants={{
                hidden: {
                  opacity: 0,
                  x: -80,
                  scale: 0.8,
                },
                visible: {
                  opacity: [0, 1, 1, 0],
                  x: [-80, 0, 0, 0],
                  y: [0, 0, 0, -120],
                  scale: [0.8, 1, 1, 0.2],
                },
              }}
              transition={{
                duration: 3,
                delay: 1.5,
              }}
              className="rounded-xl bg-white px-6 py-4 shadow-lg border border-blue-100"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{item.icon}</span>

                <span className="font-medium">{item.text}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}

export default PreparingScene;
