import { motion } from "framer-motion";
import { Heart, Sprout, Gift } from "lucide-react";

const cards = [
  {
    icon: Heart,
    title: "Things You Like About Me",
    subtitle: "6 / 6 Completed",
    color: "from-rose-100 to-pink-100",
  },
  {
    icon: Sprout,
    title: "Help Me Become Better",
    subtitle: "6 / 6 Completed",
    color: "from-emerald-100 to-green-100",
  },
  {
    icon: Gift,
    title: "Birthday Letter",
    subtitle: "Completed",
    color: "from-violet-100 to-purple-100",
  },
];

const SectionCardsScene = () => {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#FAF8FF] px-6">

      {/* Background */}

      <div className="absolute inset-0">

        <div className="absolute -left-24 top-0 h-96 w-96 rounded-full bg-violet-300/20 blur-[120px]" />

        <div className="absolute -right-24 bottom-0 h-[30rem] w-[30rem] rounded-full bg-pink-300/20 blur-[120px]" />

      </div>

      <div className="relative z-10 w-full max-w-md space-y-5">

        {cards.map((card, index) => {

          const Icon = card.icon;

          return (

            <motion.div
              key={card.title}
              initial={{
                opacity: 0,
                y: 60,
                scale: .9,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              transition={{
                delay: index * .45,
                duration: .7,
              }}
              className={`
              rounded-[30px]

              border
              border-white/60

              bg-gradient-to-br

              ${card.color}

              backdrop-blur-xl

              shadow-xl

              p-6
              `}
            >

              <div className="flex items-center gap-5">

                <div
                  className="
                  flex

                  h-14
                  w-14

                  items-center
                  justify-center

                  rounded-2xl

                  bg-white/70

                  shadow-md
                  "
                >
                  <Icon
                    size={22}
                    className="text-neutral-700"
                  />
                </div>

                <div>

                  <h2 className="font-serif text-xl">
                    {card.title}
                  </h2>

                  <p className="mt-1 text-sm text-neutral-500">
                    {card.subtitle}
                  </p>

                </div>

              </div>

            </motion.div>

          );

        })}

      </div>

    </section>
  );
};

export default SectionCardsScene;