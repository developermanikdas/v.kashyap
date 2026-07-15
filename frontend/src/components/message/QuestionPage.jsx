import { motion } from "framer-motion";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { CloudCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { questionFlows } from "../../data/questionFlows";

import QuestionHeader from "../../components/message/questions/QuestionHeader";
import QuestionHelp from "../../components/message/questions/QuestionHelp";
import QuestionFooter from "../../components/message/questions/QuestionFooter";
import Review from "../../components/message/questions/Review";

const QuestionPage = () => {
  const { type } = useParams();
  const navigate = useNavigate();

  const flow = questionFlows[type];

  const [currentQuestion, setCurrentQuestion] = useState(0);

  const [answers, setAnswers] = useState(Array(flow.questions.length).fill(""));

  const [step, setStep] = useState("questions");

  const question = flow.questions[currentQuestion];

  const handleChange = (e) => {
    const updated = [...answers];

    updated[currentQuestion] = e.target.value;

    setAnswers(updated);
  };

  const handleNext = () => {
    if (currentQuestion === flow.questions.length - 1) {
      console.log("Go to Review");
      setStep("review");
      return;
    }

    setCurrentQuestion((prev) => prev + 1);
  };

  const handlePrevious = () => {
    if (currentQuestion === 0) return;

    setCurrentQuestion((prev) => prev - 1);
  };

  if (step === "review") {
    return (
      <Review
        flow={flow}
        answers={answers}
        onBack={() => setStep("questions")}
        onEdit={(index) => {
          setCurrentQuestion(index);
          setStep("questions");
        }}
        onSubmit={() => {
          console.log("Proceed to animation");
          navigate("/message");
        }}
      />
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#FCFBFF] to-[#F8F7FF]">
      <section className="mx-auto flex min-h-screen max-w-3xl flex-col px-6 py-8 md:px-10">
        {/* Header */}

        <QuestionHeader
          currentQuestion={currentQuestion}
          totalQuestions={flow.questions.length}
        />

        {/* Title + Help */}

        <div className="mt-14 flex items-center justify-between">
          <p className="text-xs uppercase tracking-[0.35em] text-neutral-400">
            {flow.title}
          </p>

          <QuestionHelp why={question.why} hint={question.hint} />
        </div>

        {/* Question */}

        <motion.h1
          key={currentQuestion}
          initial={{
            opacity: 0,
            y: 15,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.25,
          }}
          className="
    mt-6

    text-4xl
    md:text-5xl

    font-serif
    font-light

    leading-tight

    text-neutral-900
  "
        >
          {question.question}
        </motion.h1>
        {/* Writing Area */}

        <motion.div
          key={`textarea-${currentQuestion}`}
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            delay: 0.1,
          }}
          className="
            mt-10

            rounded-[28px]

            border
            border-neutral-200

            bg-white

            shadow-sm

            transition-all

            focus-within:border-neutral-400
          "
        >
          <textarea
            value={answers[currentQuestion]}
            onChange={handleChange}
            placeholder="Write your thoughts..."
            className="
              min-h-[260px]
              w-full

              resize-none

              rounded-[28px]

              bg-transparent

              p-8

              text-lg
              leading-9

              text-neutral-800

              placeholder:text-neutral-300

              outline-none
            "
          />
        </motion.div>

        {/* Help */}

        <div className="mt-3 flex items-center gap-2 text-sm text-neutral-400">
          <CloudCheck size={16} />

          <span>Saved</span>
        </div>

        {/* Footer */}

        <QuestionFooter
          currentQuestion={currentQuestion}
          totalQuestions={flow.questions.length}
          onPrevious={handlePrevious}
          onNext={handleNext}
        />
      </section>
    </main>
  );
};

export default QuestionPage;
