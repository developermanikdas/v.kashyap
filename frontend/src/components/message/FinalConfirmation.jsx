import { Gift, ArrowLeft, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

const FinalConfirmation = ({ open, onClose, onConfirm }) => {
  const navigate = useNavigate();

  const handleWish = () => {
    onClose();
    navigate("/sending");
  };
  if (!open) return null;

  return (
    <div
      onClick={onClose}
      className="
      fixed
      inset-0
      z-[999]

      overflow-hidden

      flex
      items-center
      justify-center

      bg-white/30
      backdrop-blur-xl
      "
    >
      {/* ========= FULL SCREEN BACKGROUND ========= */}

      <div className="absolute inset-0 overflow-hidden">
        {/* Blob 1 */}

        <div
          className="
          absolute

          -top-40
          -left-40

          h-[34rem]
          w-[34rem]

          rounded-full

          bg-violet-300/25

          blur-[120px]

          animate-pulse
          "
        />

        {/* Blob 2 */}

        <div
          className="
          absolute

          top-1/4
          -right-44

          h-[36rem]
          w-[36rem]

          rounded-full

          bg-pink-300/20

          blur-[120px]

          animate-pulse
          delay-500
          "
        />

        {/* Blob 3 */}

        <div
          className="
          absolute

          bottom-[-10rem]
          left-1/4

          h-[30rem]
          w-[30rem]

          rounded-full

          bg-sky-200/20

          blur-[120px]

          animate-pulse
          delay-1000
          "
        />

        {/* Sparkles */}

        <Sparkles
          size={18}
          className="
          absolute

          left-20
          top-28

          text-violet-300

          animate-pulse
          "
        />

        <Sparkles
          size={14}
          className="
          absolute

          right-24
          bottom-40

          text-pink-300

          animate-pulse
          "
        />

        <Sparkles
          size={12}
          className="
          absolute

          top-1/2
          left-1/2

          text-violet-200

          animate-pulse
          "
        />
      </div>

      {/* ========= CARD ========= */}

      <div
        onClick={(e) => e.stopPropagation()}
        className="
        relative

        z-10

        w-full
        max-w-md

        mx-5

        rounded-[36px]

        border
        border-white/60

        bg-white/65

        backdrop-blur-3xl

        shadow-[0_30px_100px_rgba(124,58,237,.12)]

        p-8
        "
      >
        {/* Gift */}

        <div
          className="
          mx-auto

          flex

          h-24
          w-24

          items-center
          justify-center

          rounded-full

          bg-white/70

          shadow-xl

          backdrop-blur-xl
          "
        >
          <Gift
            size={38}
            className="
            text-violet-600

            transition-transform
            duration-500

            hover:rotate-12
            "
          />
        </div>

        {/* Heading */}

        <h1
          className="
          mt-10

          text-center

          font-serif

          text-4xl

          leading-tight

          text-neutral-900
          "
        >
          Everything
          <br />
          is Ready
        </h1>

        {/* Subtitle */}

        <p
          className="
          mt-6

          text-center

          text-[15px]

          leading-8

          text-neutral-500
          "
        >
          Every word you've written will become part of a birthday surprise.
        </p>

        <p
          className="
          mt-4

          text-center

          text-sm

          leading-7

          text-neutral-400
          "
        >
          After continuing, your responses can no longer be edited.
        </p>

        {/* Button */}

        <button
          onClick={handleWish}
          className="
          group

          relative

          mt-12

          w-full

          overflow-hidden

          rounded-full

          p-[2px]

          bg-gradient-to-r

          from-violet-500
          via-fuchsia-500
          to-pink-500

          transition-all
          duration-500

          hover:scale-[1.02]

          hover:shadow-[0_20px_60px_rgba(168,85,247,.25)]
          "
        >
          {/* Animated Border */}

          <div
            className="
            absolute

            inset-0

            bg-[length:200%_100%]

            bg-gradient-to-r

            from-violet-500
            via-pink-500
            to-violet-500

            animate-pulse
            "
          />

          {/* Glass */}

          <div
            className="
            relative

            flex

            items-center
            justify-center
            gap-3

            rounded-full

            bg-white/90

            py-4

            backdrop-blur-xl
            "
          >
            <Gift
              size={18}
              className="
              text-violet-600

              transition-transform
              duration-300

              group-hover:rotate-12
              "
            />

            <span
              className="
              font-medium

              tracking-wide
              "
            >
              Wish Manik 🎂
            </span>
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

        {/* Back */}

        <button
          onClick={onClose}
          className="
          mt-6

          flex

          w-full

          items-center
          justify-center
          gap-2

          text-neutral-500

          transition

          hover:text-neutral-800
          "
        >
          <ArrowLeft size={17} />
          Continue Editing
        </button>
      </div>
    </div>
  );
};

export default FinalConfirmation;
