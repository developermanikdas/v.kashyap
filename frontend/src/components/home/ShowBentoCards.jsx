import BentoCard from "./BentoCard";
import { features } from "../../data/Features";

const ShowBentoCards = () => {
  return (
    <section className="grid grid-cols-2 gap-3 p-3 md:gap-6 md:p-6 lg:grid-cols-4">
      {features.map((feature) => (
        <BentoCard
          key={feature.id}
          title={feature.title}
          subtitle={feature.subtitle}
          image={feature.image}
          icon={feature.icon}
          path={feature.path}
        />
      ))}
    </section>
  );
};

export default ShowBentoCards;
