import {
  CheckCircle2,
  Circle,
  Pencil,
  ChevronRight,
} from "lucide-react";

const ReviewModal = ({
  open,
  onClose,
  onContinue,
}) => {
  if (!open) return null;

  const sections = [
    {
      id: 1,
      title: "Things You Like About Me",
      completed: 6,
      total: 6,
      edit: () => console.log("Edit Likes"),
    },
    {
      id: 2,
      title: "Help Me Become Better",
      completed: 4,
      total: 6,
      edit: () => console.log("Edit Improve"),
    },
    {
      id: 3,
      title: "Birthday Letter",
      completed: 1,
      total: 1,
      edit: () => console.log("Edit Letter"),
    },
  ];

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/25 backdrop-blur-md px-5"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="
        relative
        w-full
        max-w-sm

        overflow-hidden

        rounded-[32px]

        border
        border-white/40

        bg-white/80

        backdrop-blur-3xl

        shadow-[0_25px_80px_rgba(124,58,237,0.18)]

        p-6

        animate-in
        fade-in
        slide-in-from-bottom-4
        duration-300
        "
      >
        {/* Background Glow */}

        <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-violet-200/30 blur-3xl" />

        <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-pink-200/20 blur-3xl" />

        <div className="relative">

          <h2 className="text-center text-3xl font-serif">
            Review
          </h2>

          <p className="mt-2 text-center text-sm text-neutral-500">
            One last look before continuing.
          </p>

          <div className="mt-8 space-y-4">

            {sections.map((section) => {

              const completed =
                section.completed === section.total;

              return (
                <div
                  key={section.id}
                  className="
                  rounded-3xl

                  border
                  border-white/40

                  bg-white/60

                  backdrop-blur-xl

                  p-4
                  "
                >
                  <div className="flex items-center justify-between">

                    <div>

                      <h3 className="font-medium text-neutral-800">
                        {section.title}
                      </h3>

                      <div
                        className={`mt-2 flex items-center gap-2 text-sm ${
                          completed
                            ? "text-emerald-600"
                            : "text-amber-500"
                        }`}
                      >
                        {completed ? (
                          <CheckCircle2 size={16} />
                        ) : (
                          <Circle size={16} />
                        )}

                        <span>
                          {section.completed} / {section.total}
                        </span>

                      </div>

                    </div>

                    <button
                      onClick={section.edit}
                      className="
                      rounded-full

                      bg-neutral-100/70

                      px-3
                      py-2

                      text-sm

                      transition-all

                      duration-300

                      hover:bg-neutral-200

                      flex
                      items-center
                      gap-1
                      "
                    >
                      <Pencil size={14} />
                      Edit
                    </button>

                  </div>
                </div>
              );
            })}
          </div>

          {/* Continue Button */}

          <button
            onClick={onContinue}
            className="
            group

            relative

            mt-8

            w-full

            overflow-hidden

            rounded-full

            p-[1.5px]

            bg-gradient-to-r

            from-violet-500
            via-fuchsia-500
            to-pink-500

            transition-all

            duration-500

            hover:scale-[1.02]

            hover:shadow-[0_20px_50px_rgba(168,85,247,0.25)]
            "
          >
            <div
              className="
              flex

              items-center
              justify-center
              gap-2

              rounded-full

              bg-white/90

              backdrop-blur-xl

              py-3.5

              font-medium

              text-neutral-800
              "
            >
              Continue

              <ChevronRight
                size={18}
                className="
                transition-transform

                duration-300

                group-hover:translate-x-1
                "
              />
            </div>

            {/* Shine */}

            <div
              className="
              absolute

              inset-0

              -translate-x-full

              bg-gradient-to-r

              from-transparent

              via-white/40

              to-transparent

              transition-transform

              duration-1000

              group-hover:translate-x-full
              "
            />
          </button>

        </div>
      </div>
    </div>
  );
};

export default ReviewModal;