import { motion } from "framer-motion";
import { Heart, Sprout, Gift } from "lucide-react";

const cards = [
  {
    icon: Heart,
    color: "bg-rose-100",
    x: -120,
    y: -90,
  },
  {
    icon: Sprout,
    color: "bg-emerald-100",
    x: 120,
    y: -90,
  },
  {
    icon: Gift,
    color: "bg-violet-100",
    x: 0,
    y: 120,
  },
];

const MergeScene = () => {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#FAF8FF]">

      {/* Background */}

      <div className="absolute inset-0">
        <div className="absolute -top-40 -left-40 h-[30rem] w-[30rem] rounded-full bg-violet-300/20 blur-[120px]" />

        <div className="absolute bottom-0 right-0 h-[32rem] w-[32rem] rounded-full bg-pink-300/20 blur-[120px]" />
      </div>

      {/* Flying Cards */}

      {cards.map((card, index) => {

        const Icon = card.icon;

        return (

          <motion.div
            key={index}
            initial={{
              x: card.x,
              y: card.y,
              scale: 1,
              opacity: 1,
            }}
            animate={{
              x: 0,
              y: 0,
              scale: 0.15,
              opacity: 0,
            }}
            transition={{
              duration: 2,
              delay: index * 0.2,
              ease: "easeInOut",
            }}
            className={`
            absolute

            flex

            h-40
            w-72

            items-center
            justify-center

            rounded-[30px]

            ${card.color}

            shadow-xl
            `}
          >
            <Icon
              size={34}
              className="text-neutral-700"
            />
          </motion.div>

        );

      })}

      {/* Letter */}

      <motion.div
        initial={{
          scale: 0,
          opacity: 0,
        }}
        animate={{
          scale: 1,
          opacity: 1,
        }}
        transition={{
          delay: 1.8,
          duration: .8,
          ease: "easeOut",
        }}
        className="
        relative

        flex

        h-72
        w-56

        flex-col

        rounded-[22px]

        bg-white

        shadow-2xl

        p-6
        "
      >

        <div className="h-3 w-24 rounded-full bg-violet-200" />

        <div className="mt-6 h-2 rounded-full bg-neutral-200" />

        <div className="mt-3 h-2 rounded-full bg-neutral-200" />

        <div className="mt-3 h-2 w-4/5 rounded-full bg-neutral-200" />

        <div className="mt-3 h-2 rounded-full bg-neutral-200" />

        <div className="mt-3 h-2 w-2/3 rounded-full bg-neutral-200" />

      </motion.div>

    </section>
  );
};

export default MergeScene;