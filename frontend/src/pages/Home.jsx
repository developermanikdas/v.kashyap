import Navbar from "../components/layouts/Navbar";
import ShowBentoCards from "../components/home/ShowBentoCards";
import Hero from "../components/home/Horo";
// import ShowBentoCards from "../components/ShowBentoCards";

const Home = () => {
  return (
    <>
      <Navbar />
      <Hero />  
      <ShowBentoCards />
    </>
  );
};

export default Home;
