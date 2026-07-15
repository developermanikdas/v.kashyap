import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CircleHelp, Heart, Sparkles } from "lucide-react";

const QuestionHelp = ({ why, hint }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">

      <button
        onClick={() => setOpen(true)}
        className="
          rounded-full
          p-2

          text-neutral-400

          transition

          hover:bg-neutral-100
          hover:text-neutral-700
        "
      >
        <CircleHelp size={20} />
      </button>

      <AnimatePresence>

        {open && (

          <motion.div
            initial={{
              opacity: 0,
              y: 8,
              scale: 0.96,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: 8,
              scale: 0.96,
            }}
            transition={{
              duration: 0.2,
            }}
            className="
              absolute

              right-0
              top-12

              z-50

              w-[360px]

              rounded-3xl

              border
              border-neutral-200

              bg-white

              p-7

              shadow-2xl
            "
          >

            <div className="flex items-center gap-2">

              <Heart
                size={18}
                className="text-rose-400"
              />

              <h3 className="font-semibold">
                Why I'm asking
              </h3>

            </div>

            <p className="mt-3 leading-7 text-neutral-600">
              {why}
            </p>

            <div className="my-6 h-px bg-neutral-100" />

            <div className="flex items-center gap-2">

              <Sparkles
                size={18}
                className="text-amber-400"
              />

              <h3 className="font-semibold">
                Not sure what to write?
              </h3>

            </div>

            <p className="mt-3 leading-7 text-neutral-600">
              {hint}
            </p>

            <button
              onClick={() => setOpen(false)}
              className="
                mt-8

                w-full

                rounded-2xl
                border

                py-3

                text-sm
                font-medium

                text-blask

                transition

                hover:bg-slate-100
              "
            >
              I understand, let's continue. 😊
            </button>

          </motion.div>

        )}

      </AnimatePresence>

    </div>
  );
};

export default QuestionHelp;