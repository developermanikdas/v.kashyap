import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { ArrowLeft, LogOut, User, Mail } from "lucide-react";
import profileImg from "../assets/images/devi-ji.png";

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      <main className="relative min-h-[85vh] flex items-center justify-center px-6 overflow-hidden">
        {/* Background Blur Blobs */}
        <div className="absolute -top-24 -left-20 h-80 w-80 rounded-full bg-violet-300/30 blur-[120px] animate-[float_10s_ease-in-out_infinite]" />
        <div className="absolute bottom-12 right-0 h-80 w-80 rounded-full bg-purple-200/40 blur-[130px] animate-[floatReverse_12s_ease-in-out_infinite]" />

        {/* Profile Card Container */}
        <section className="relative z-10 max-w-md w-full rounded-[36px] border border-white/20 bg-white/70 backdrop-blur-xl p-8 shadow-[0_12px_40px_0_rgba(120,119,198,0.1)] text-center animate-[profileFade_800ms_ease]">
          
          {/* Back Button */}
          <button
            onClick={() => navigate("/")}
            className="absolute top-6 left-6 flex items-center gap-1.5 text-sm text-neutral-500 hover:text-black transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Back</span>
          </button>

          {/* Avatar Area */}
          <div className="mt-6 flex justify-center">
            <div className="relative group">
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-violet-500 via-purple-400 to-orange-300 blur-[8px] opacity-75 group-hover:opacity-100 transition duration-500" />
              <div className="relative flex h-24 w-24 overflow-hidden items-center justify-center rounded-full bg-white shadow-md">
                <img src={profileImg} alt="Profile" className="h-[80%] w-[70%] object-contain" />
              </div>
            </div>
          </div>

          {/* User Details */}
          <div className="mt-6">
            <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">
              {user?.fullName || "User Profile"}
            </h1>
            <p className="mt-1 text-sm text-purple-600 font-medium tracking-wide">
              @{user?.username || "username"}
            </p>
          </div>

          <div className="mt-8 space-y-4 text-left">
            {/* Email Field */}
            <div className="flex items-center gap-3.5 rounded-2xl border border-neutral-100 bg-white/50 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-500">
                <Mail size={18} />
              </div>
              <div>
                <p className="text-xs text-neutral-400 font-medium uppercase tracking-wider">Email Address</p>
                <p className="text-sm font-semibold text-neutral-800 mt-0.5">{user?.email || "N/A"}</p>
              </div>
            </div>

            {/* Account Status Field */}
            <div className="flex items-center gap-3.5 rounded-2xl border border-neutral-100 bg-white/50 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-500">
                <User size={18} />
              </div>
              <div>
                <p className="text-xs text-neutral-400 font-medium uppercase tracking-wider">Account Role</p>
                <p className="text-sm font-semibold text-neutral-800 mt-0.5">Administrator</p>
              </div>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="mt-8 w-full flex items-center justify-center gap-2 rounded-2xl bg-neutral-950 py-4 text-white font-semibold transition-all duration-300 hover:bg-black hover:scale-[1.02] active:scale-[0.98] shadow-md"
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>

        </section>
      </main>

      <style>{`
        @keyframes profileFade {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes float {
          0%,100%{
            transform: translateY(0px);
          }
          50%{
            transform: translateY(-15px);
          }
        }
        @keyframes floatReverse {
          0%,100%{
            transform: translateY(0px);
          }
          50%{
            transform: translateY(15px);
          }
        }
      `}</style>
    </>
  );
};

export default Profile;
