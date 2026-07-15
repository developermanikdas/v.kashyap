import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export default function ExperienceModal({
  open,
  experience,
  onClose,
  onStart,
}) {
  if (!experience) return null;

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}

          <motion.div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}

          <motion.div
            className="fixed left-1/2 top-1/2 z-50 w-[92%] max-w-xl -translate-x-1/2 -translate-y-1/2 rounded-3xl bg-white p-10 shadow-2xl"
            initial={{
              opacity: 0,
              scale: 0.95,
              y: 20,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.95,
              y: 20,
            }}
            transition={{
              duration: 0.25,
            }}
          >
            <button
              onClick={onClose}
              className="absolute right-5 top-5 rounded-full p-2 transition hover:bg-gray-100"
            >
              <X size={20} />
            </button>

            <div className="mb-6 text-5xl">{experience.icon}</div>

            <h2 className="mb-4 text-4xl font-serif">
              {experience.title}
            </h2>

            <p className="mb-6 text-lg leading-8 text-gray-600">
              {experience.description}
            </p>

            <div className="rounded-2xl bg-gray-50 p-5">
              <h3 className="mb-2 font-semibold">
                Before you begin
              </h3>

              <p className="text-gray-600 leading-7">
                {experience.note}
              </p>
            </div>

            <div className="mt-10 flex justify-end gap-3">
              <button
                onClick={onClose}
                className="rounded-xl border px-6 py-3"
              >
                Maybe Later
              </button>

              <button
                onClick={onStart}
                className="rounded-xl bg-black px-7 py-3 text-white transition hover:opacity-90"
              >
                {experience.button}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}