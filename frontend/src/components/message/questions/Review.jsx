import { motion } from "framer-motion";
import { ArrowLeft, Pencil, Send } from "lucide-react";

const Review = ({ flow, answers, onEdit, onBack, onSubmit }) => {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#FCFBFF] to-[#F8F7FF]">
      <section className="mx-auto flex min-h-screen max-w-3xl flex-col px-6 py-8 md:px-10">
        {/* Header */}

        <button
          onClick={onBack}
          className="flex w-fit items-center gap-2 text-neutral-500 transition hover:text-neutral-900"
        >
          <ArrowLeft size={18} />
          <span>Back</span>
        </button>

        {/* Title */}

        <div className="mt-14">
          <p className="text-xs uppercase tracking-[0.35em] text-neutral-400">
            {flow.title}
          </p>

          <h1 className="mt-5 text-4xl font-serif font-light leading-tight text-neutral-900 md:text-5xl">
            Review Your Responses
          </h1>

          <p className="mt-4 max-w-2xl leading-8 text-neutral-500">
            Take a moment to read through your responses before sending. You can
            always edit anything you'd like.
          </p>
        </div>

        {/* Answers */}

        <div className="mt-16 space-y-12">
          {flow.questions.map((item, index) => (
            <motion.div
              key={index}
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: index * 0.08,
              }}
              className="border-b border-neutral-200 pb-10"
            >
              {/* Question */}

              <h2 className="text-xl font-serif text-neutral-900">
                {item.question}
              </h2>

              {/* Answer */}

              <p
                className={`mt-5 whitespace-pre-wrap leading-8 ${
                  answers[index]
                    ? "text-neutral-700"
                    : "italic text-neutral-400"
                }`}
              >
                {answers[index] || "No response provided."}
              </p>

              {/* Edit */}

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => onEdit(index)}
                  className="flex items-center gap-2 rounded-full border border-neutral-200 px-5 py-2 text-sm text-neutral-700 transition hover:bg-neutral-100"
                >
                  <Pencil size={15} />
                  Edit
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer */}

        <div className="mt-auto flex items-center justify-between pt-16">
          <button
            onClick={onBack}
            className="flex items-center gap-2 rounded-full border border-neutral-200 px-6 py-3 text-sm transition hover:bg-neutral-100"
          >
            <ArrowLeft size={16} />
            Back
          </button>

          <button
            onClick={onSubmit}
            className="flex items-center gap-2 rounded-full bg-neutral-900 px-7 py-3 text-sm font-medium text-white transition hover:bg-black"
          >
            Finish This Section
          </button>
        </div>
      </section>
    </main>
  );
};

export default Review;
