import { useNavigate } from "react-router-dom";

const MessageCard = ({
  step,
  title,
 subtitle,
  icon: Icon,
  path,

  status = "not-started",

  completed = 0,
  total = 6,
}) => {
  const navigate = useNavigate();

  const statusColor =
    status === "completed"
      ? "bg-emerald-500"
      : status === "in-progress"
      ? "bg-amber-500"
      : "bg-rose-500";

  const statusText =
    status === "completed"
      ? "Completed"
      : status === "in-progress"
      ? "In Progress"
      : "Not Started";

  const statusTextColor =
    status === "completed"
      ? "text-emerald-600"
      : status === "in-progress"
      ? "text-amber-600"
      : "text-rose-600";

  return (
    <button
      onClick={() => navigate(path)}
      className="
        group
        relative

        w-full
        min-h-[290px]

        overflow-hidden

        rounded-[34px]

        border
        border-neutral-200

        bg-white

        p-8

        text-left

        shadow-[0_20px_60px_rgba(0,0,0,.05)]

        transition-all
        duration-300

        hover:-translate-y-1
        hover:border-neutral-300
        hover:shadow-[0_28px_80px_rgba(0,0,0,.08)]
      "
    >
      {/* Huge Number */}

      <span
        className="
          absolute

          right-6
          top-2

          select-none

          text-[120px]
          font-black

          leading-none

          text-neutral-100
        "
      >
        {step}
      </span>

      <div className="relative flex h-full flex-col justify-between">
        {/* Icon */}

        <div
          className="
            flex

            h-14
            w-14

            items-center
            justify-center

            rounded-2xl

            border
            border-neutral-100

            bg-white

            shadow-sm
          "
        >
          <Icon
            size={22}
            className="text-neutral-700"
          />
        </div>

        {/* Content */}

        <div className="mt-8">
          <h2
            className="
              font-serif

              text-[34px]

              leading-tight

              text-neutral-900
            "
          >
            {title}
          </h2>

          <p
            className="
              mt-4

              max-w-md

              text-[16px]

              leading-8

              text-neutral-500
            "
          >
            {subtitle}
          </p>
        </div>

        {/* Divider */}

        <div className="my-8 h-px bg-neutral-100" />

        {/* Footer */}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span
              className={`h-2.5 w-2.5 rounded-full ${statusColor}`}
            />

            <span
              className={`text-sm font-medium ${statusTextColor}`}
            >
              {statusText}
            </span>
          </div>

          <span className="text-sm font-medium text-neutral-400">
            {completed} / {total}
          </span>
        </div>
      </div>
    </button>
  );
};

export default MessageCard;