import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";

import "react-circular-progressbar/dist/styles.css";

const QuestionHeader = ({
  currentQuestion,
  totalQuestions,
}) => {
  const percentage =
    ((currentQuestion + 1) / totalQuestions) * 100;

  return (
    <header className="flex items-center justify-between">

      <Link
        to="/message"
        className="
          flex
          items-center
          gap-2

          text-neutral-500

          transition

          hover:text-neutral-900
        "
      >
        <ArrowLeft size={18} />

        <span>Back</span>
      </Link>

      <div className="h-11 w-11">

        <CircularProgressbar
          value={percentage}
          text={`${Math.round(percentage)}%`}
          strokeWidth={8}
          styles={buildStyles({
            textSize: "26px",
            pathColor: "#171717",
            trailColor: "#ECECEC",
            textColor: "#737373",
          })}
        />

      </div>

    </header>
  );
};

export default QuestionHeader;