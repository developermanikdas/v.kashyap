import BentoCard from "./BentoCard";
import { features } from "../../data/Features";

const ShowBentoCards = () => {
  return (
    <section className="grid grid-cols-1 gap-6 p-4 md:grid-cols-2 lg:grid-cols-4">
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
