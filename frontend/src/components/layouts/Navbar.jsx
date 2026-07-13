import { Leaf, User } from "lucide-react";
import { Navigate } from "react-router-dom";
import logo from "../../assets/images/logo.webp";

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between px-5 py-4 sticky top-0 bg-white backdrop-blur-md shadow-sm z-99">
      {/* Logo */}
      <div className="flex items-center gap-2" onClick={Navigate("/")}>
        <img src={logo} alt="Logo" style={{ width: "120px" }} />
      </div>

      {/* Profile */}
      <button className="text-neutral-600 hover:text-black transition-colors duration-300">
        <User size={22} strokeWidth={1.8} />
      </button>
    </nav>
  );
};

export default Navbar;
