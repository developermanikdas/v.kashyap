import { motion } from "framer-motion";

function EnvelopeScene() {
  return (
    <div className="flex h-screen items-center justify-center bg-[#faf8f4]">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{
          opacity: [0, 1, 1, 1, 0],
          scale: [0.9, 1, 1, 0.75, 0.4],
          y: [0, 0, 0, -150, -450],
        }}
        transition={{
          duration: 4,
          times: [0, 0.2, 0.5, 0.8, 1],
        }}
        className="relative h-56 w-96"
      >
        {/* Letter */}
        <motion.div
          initial={{ y: -220 }}
          animate={{ y: -20 }}
          transition={{
            duration: 1.2,
            ease: "easeInOut",
          }}
          className="absolute left-1/2 top-0 z-0 h-48 w-72 -translate-x-1/2 rounded-lg bg-white shadow-xl"
        />

        <motion.div
          animate={{
            opacity: [0, 0.5, 0],
            scale: [0.8, 1.5, 2],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
          }}
          className="absolute left-1/2 top-1/2 -z-10 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-300 blur-3xl"
        />

        {/* Envelope Body */}
        <div className="absolute bottom-0 z-10 h-40 w-full rounded-b-xl bg-white shadow-2xl" />

        {/* Left Triangle */}
        <div
          className="absolute bottom-0 left-0 z-20 h-0 w-0
                     border-b-[80px] border-l-[192px]
                     border-b-transparent border-l-white"
        />

        {/* Right Triangle */}
        <div
          className="absolute bottom-0 right-0 z-20 h-0 w-0
                     border-b-[80px] border-r-[192px]
                     border-b-transparent border-r-white"
        />

        {/* Top Flap */}
        <motion.div
          initial={{ rotateX: -180 }}
          animate={{ rotateX: 0 }}
          transition={{
            delay: 1.2,
            duration: 0.7,
          }}
          style={{ transformPerspective: 1000 }}
          className="absolute left-0 top-0 z-30 h-0 w-0 origin-top
                     border-l-[192px] border-r-[192px] border-t-[110px]
                     border-l-transparent border-r-transparent border-t-gray-200"
        />
      </motion.div>
    </div>
  );
}

export default EnvelopeScene;
