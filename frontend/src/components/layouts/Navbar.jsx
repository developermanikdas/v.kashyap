import { User, Sparkles, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/images/logo.webp";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 w-[90%] max-w-5xl flex items-center justify-between px-6 md:px-8 py-3 rounded-full bg-white/70 backdrop-blur-xl border border-white/20 shadow-[0_8px_32px_0_rgba(120,119,198,0.1)] z-50">
      {/* Left Logo + Brand */}
      <div 
        className="flex items-center gap-2.5 cursor-pointer select-none group" 
        onClick={() => navigate("/")}
      >
        <div className="relative h-10 w-10 overflow-hidden rounded-full border border-purple-100/50 bg-purple-50/30 flex items-center justify-center transition-transform duration-500 group-hover:rotate-12">
          <img src={logo} alt="Logo" className="h-full w-full object-cover" />
        </div>
        <span 
          className="text-lg md:text-xl font-medium tracking-wide text-neutral-800 flex items-center gap-0.5"
          style={{ fontFamily: '"Cormorant Garamond", serif' }}
        >
          Serenity
          <Sparkles size={12} className="text-violet-400 -mt-2" />
        </span>
      </div>

      {/* Middle Quote Pill (Hidden on Mobile) */}
      <div className="hidden md:flex items-center gap-2.5 rounded-full bg-violet-50/40 border border-violet-100/30 px-5 py-1.5 shadow-[inset_0_1px_2px_rgba(120,119,198,0.05)]">
        <Sparkles size={14} className="text-violet-400/80" />
        <span className="text-xs md:text-sm font-medium text-neutral-700">
          Every memory we create, becomes a treasure.
        </span>
        <Heart size={13} className="fill-purple-300 text-purple-300" />
      </div>

      {/* Right Profile Icon */}
      <div className="flex items-center gap-2">
        <button 
          onClick={() => navigate("/profile")}
          className="h-10 w-10 md:h-12 md:w-12 rounded-full flex items-center justify-center bg-white shadow-sm border border-neutral-100 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer text-neutral-600 hover:text-violet-950"
        >
          <User size={20} strokeWidth={2} />
        </button>
        <Sparkles size={14} className="text-violet-300/80 animate-pulse" />
      </div>
    </nav>
  );
};

export default Navbar;
