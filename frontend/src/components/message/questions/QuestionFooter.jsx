import { CloudCheck, ChevronLeft, ChevronRight } from "lucide-react";

const QuestionFooter = ({
  currentQuestion,
  totalQuestions,
  onPrevious,
  onNext,
}) => {
  const isFirst = currentQuestion === 0;
  const isLast = currentQuestion === totalQuestions - 1;

  return (
    <footer className="mt-14 flex items-center justify-between">
      <div className="flex items-center gap-2 text-sm text-neutral-400"></div>

      {/* Navigation */}

      <div className="flex items-center gap-3">
        {!isFirst && (
          <button
            onClick={onPrevious}
            className="
              flex
              items-center
              gap-2

              rounded-full

              border
              border-neutral-200

              px-5
              py-3

              text-sm

              transition

              hover:bg-neutral-100
            "
          >
            <ChevronLeft size={16} />
            Previous
          </button>
        )}

        <button
          onClick={onNext}
          className="
            flex
            items-center
            gap-2

            rounded-full

            bg-neutral-900

            px-6
            py-3

            text-sm
            font-medium
            text-white

            transition

            hover:bg-black
          "
        >
          {isLast ? "Review" : "Continue"}

          <ChevronRight size={16} />
        </button>
      </div>
    </footer>
  );
};

export default QuestionFooter;
