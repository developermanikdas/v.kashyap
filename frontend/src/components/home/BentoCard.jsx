import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const BentoCard = ({ title, subtitle, image, icon: Icon, path }) => {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(path)}
      className="
      group
      relative
      overflow-hidden
      rounded-[32px]
      aspect-square
      md:aspect-auto
      md:h-72
      cursor-pointer

      border border-white/20
      bg-white/10
      shadow-lg

      transition-all
      duration-500
      hover:-translate-y-2
      hover:shadow-2xl
      "
    >
      {/* Background */}
      <img
        src={image}
        alt={title}
        className="
        absolute
        inset-0
        h-full
        w-full
        object-cover

        transition-transform
        duration-700
        group-hover:scale-110
        "
      />

      {/* Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

      {/* Purple Glow */}
      <div
        className="
        absolute
        -top-16
        -right-16
        h-40
        w-40
        rounded-full
        bg-violet-400/30
        blur-3xl
        transition-all
        duration-700
        group-hover:scale-125
        "
      />

      {/* Glass Shine */}
      <div
        className="
        absolute
        -left-full
        top-0
        h-full
        w-1/2
        rotate-12
        bg-white/10
        blur-2xl

        transition-all
        duration-1000

        group-hover:left-[140%]
        "
      />

      {/* Content */}
      <div className="relative flex h-full flex-col justify-between p-6 text-white">
        {/* Icon */}
        <div
          className="
          flex
          h-14
          w-14
          items-center
          justify-center

          rounded-2xl

          bg-white/20
          backdrop-blur-xl

          border
          border-white/20

          shadow-xl

          transition-all
          duration-500

          group-hover:scale-110
          group-hover:rotate-6
          "
        >
          <Icon size={26} />
        </div>

        {/* Bottom */}
        <div>
          <div className="flex items-center justify-between">
            <h2
              className="
              text-2xl
              md:text-3xl
              font-semibold
              tracking-tight
              "
            >
              {title}
            </h2>

            <ChevronRight
              size={24}
              className="
              transition-all
              duration-300
              group-hover:translate-x-2
              group-hover:scale-110
              "
            />
          </div>

          <p
            className="
            mt-3
            max-w-[90%]

            text-sm
            leading-relaxed

            text-white/80
            "
          >
            {subtitle}
          </p>
        </div>
      </div>
    </div>
  );
};

export default BentoCard;
