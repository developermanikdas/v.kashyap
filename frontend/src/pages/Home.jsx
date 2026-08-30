import HeroQuote from "../components/home/HeroQuote/HeroQuote";
import FeatureGrid from "../components/home/FeatureGrid/FeatureGrid";
import ThoughtsSection from "../components/home/ThoughtsSection/ThoughtsSection";
import FeatureSuggestion from "../components/home/FeatureSuggestion/FeatureSuggestion";
import styles from "./Home.module.css";

const Home = () => {
  return (
    <div className={styles.container}>
      <HeroQuote />
      <FeatureGrid />
      <ThoughtsSection />
      <FeatureSuggestion />
    </div>
  );
};

export default Home;
