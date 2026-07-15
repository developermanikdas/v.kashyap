import MessageCard from "./MessageCard";
import { messageSections } from "../../data/messageSections";

const ShowMessageCards = ({ onCardClick }) => {
  return (
    <section
      className="
      mx-auto

      grid
      gap-6

      px-5
      pb-10

      [grid-template-columns:repeat(auto-fit,minmax(320px,1fr))]

      max-w-7xl
      "
    >
      {messageSections.map((section) => (
        <MessageCard
          key={section.id}
          step={section.step}
          title={section.title}
          subtitle={section.subtitle}
          icon={section.icon}
          color={section.color}
          path={section.path}
          status={section.status}
          onClick={() => onCardClick(section.id)}
        />
      ))}
    </section>
  );
};

export default ShowMessageCards;
