import { Outlet } from "react-router-dom";
import Navbar from "../components/layouts/Navbar";

const MainLayout = () => {
  return (
    <>
      <Navbar />
      <main className="pt-28 md:pt-32 pb-12">
        <Outlet />
      </main>
    </>
  );
};

export default MainLayout;