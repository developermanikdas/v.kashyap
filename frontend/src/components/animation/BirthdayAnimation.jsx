import { useEffect, useState } from "react";

import PreparingScene from "./PreparingScene";
import LetterScene from "./LetterScene";
import SuccessScene from "./SuccessScene";
import EnvelopeScene from "./EnvelopeScene";

const BirthdayAnimation = () => {
  const [scene, setScene] = useState(0);

  useEffect(() => {
    const durations = [
      5000, // Preparing
      7000, // Letter Assembly (all animations happen here)
      4000, // Envelope
    ];

    if (scene >= durations.length) return;

    const timer = setTimeout(() => {
      setScene((prev) => prev + 1);
    }, durations[scene]);

    return () => clearTimeout(timer);
  }, [scene]);

  switch (scene) {
    case 0:
      return <PreparingScene />;

    case 1:
      return <LetterScene />;

    case 2:
      return <EnvelopeScene />;

    default:
      return <SuccessScene />;
  }
};

export default BirthdayAnimation;
