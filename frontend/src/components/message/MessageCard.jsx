import { CheckCircle2, Circle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const MessageCard = ({
  step,
  title,
  subtitle,
  icon: Icon,
  color,
  path,
  completed = 0,
  total = 6,
}) => {
  const navigate = useNavigate();

  const finished = completed === total;

  return (
    <button
      onClick={() => navigate(path)}
      className="
      group
      relative

      w-full
      min-h-[280px]

      overflow-hidden

      rounded-[34px]

      border
      border-white/70

      bg-gradient-to-br
      backdrop-blur-3xl

      shadow-[0_20px_70px_rgba(120,120,120,.08)]

      transition-all
      duration-500

      hover:-translate-y-1
      hover:shadow-[0_25px_80px_rgba(120,120,120,.12)]
      "
    >
      {/* Background Gradient */}

      <div
        className={`
        absolute
        inset-0

        bg-gradient-to-br

        ${color}
        `}
      />

      {/* Top Glass Highlight */}

      <div className="absolute left-0 top-0 h-px w-full bg-white/80" />

      {/* Glow */}

      <div
        className="
        absolute
        -right-10
        -top-10

        h-44
        w-44

        rounded-full

        bg-white/40

        blur-3xl
        "
      />

      {/* Huge Step */}

      <span
        className="
        absolute

        right-6
        top-4

        text-8xl

        font-black

        text-white/25

        select-none
        "
      >
        {step}
      </span>

      <div className="relative flex h-full flex-col justify-between p-7">

        {/* Icon */}

        <div
          className="
          flex

          h-14
          w-14

          items-center
          justify-center

          rounded-2xl

          bg-white/70

          backdrop-blur-xl

          shadow-md
          "
        >
          <Icon
            size={22}
            className="text-neutral-700"
          />
        </div>

        {/* Title */}

        <div>

          <h2
            className="
            mt-6

            text-xl
            md:text-2xl

            font-serif

            leading-tight

            text-neutral-900
            "
          >
            {title}
          </h2>

          <p
            className="
            mt-3

            text-sm

            leading-7

            text-neutral-600
            "
          >
            {subtitle}
          </p>

        </div>

        {/* Divider */}

        <div className="my-6 h-px w-full bg-white/60" />

        {/* Progress */}

        <div className="flex items-center justify-between">

          <div
            className={`
            flex
            items-center
            gap-2

            rounded-full

            px-3
            py-2

            text-sm

            ${
              finished
                ? "bg-emerald-100 text-emerald-700"
                : completed === 0
                ? "bg-neutral-100 text-neutral-600"
                : "bg-amber-100 text-amber-700"
            }
            `}
          >
            {finished ? (
              <CheckCircle2 size={16} />
            ) : (
              <Circle size={16} />
            )}

            <span>

              {finished
                ? `${completed}/${total}`
                : completed === 0
                ? "Not Started"
                : `${total - completed} Left`}

            </span>

          </div>

          <span
            className="
            text-xs

            tracking-[0.25em]

            uppercase

            text-neutral-500
            "
          >
            Step {step}
          </span>

        </div>

      </div>
    </button>
  );
};

export default MessageCard;