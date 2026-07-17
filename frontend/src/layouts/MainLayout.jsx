import { Outlet } from "react-router-dom";
import Navbar from "../components/layouts/Navbar";

const MainLayout = () => {
  return (
    <div className="relative min-h-screen bg-gradient-to-tr from-[#f5f3ff] via-[#faf9ff] to-[#fffafb] overflow-x-hidden">
      {/* Global Background Blobs */}
      <div 
        className="absolute -top-20 -left-20 h-[30rem] w-[30rem] rounded-full bg-violet-300/25 blur-[120px] pointer-events-none"
        style={{ animation: "floatGlobal 15s ease-in-out infinite" }}
      />
      <div 
        className="absolute top-1/4 right-0 translate-x-20 h-[35rem] w-[35rem] rounded-full bg-orange-200/30 blur-[130px] pointer-events-none"
        style={{ animation: "floatGlobalReverse 18s ease-in-out infinite" }}
      />
      <div 
        className="absolute bottom-10 left-1/4 h-[25rem] w-[25rem] rounded-full bg-sky-200/20 blur-[110px] pointer-events-none"
        style={{ animation: "floatGlobal 14s ease-in-out infinite" }}
      />

      <Navbar />
      <main className="pt-28 md:pt-32 pb-12">
        <Outlet />
      </main>

      <style>{`
        @keyframes floatGlobal {
          0%, 100% {
            transform: translateY(0px) scale(1);
          }
          50% {
            transform: translateY(-25px) scale(1.05);
          }
        }
        @keyframes floatGlobalReverse {
          0%, 100% {
            transform: translateY(0px) scale(1);
          }
          50% {
            transform: translateY(25px) scale(0.95);
          }
        }
      `}</style>
    </div>
  );
};

export default MainLayout;