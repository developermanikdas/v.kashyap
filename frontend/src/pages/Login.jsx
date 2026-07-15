import { User, Lock, HeartHandshake } from "lucide-react";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../services/auth.service.js";
import { useAuth } from "../hooks/useAuth";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const data = await loginUser(formData);

      console.log(data);

      login(data.token, data.user);

      navigate("/");
    } catch (error) {
      alert(error.response?.data?.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="h-screen w-screen overflow-hidden bg-white">
      <div className="grid h-full w-full lg:grid-cols-2">
        {/* Left - IMAGE */}

        <div className="relative hidden h-full lg:block">
          <img
            src="https://cdn.pixabay.com/photo/2026/06/20/14/41/mohamed_hassan-jungle-10341915_1280.png"
            alt="Login"
            className="absolute inset-0 h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-black/40"></div>

          <div className="absolute inset-0 flex flex-col justify-between p-12 text-white">
            <div>
              <h2 className="text-6xl font-bold leading-tight">
                Welcome
                <br />
                Back.
              </h2>

              <p className="mt-6 max-w-md text-lg opacity-90">
                Continue writing heartfelt letters that create lasting memories
                for the people who matter most.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <HeartHandshake />

              <span>Every memory deserves to be remembered.</span>
            </div>
          </div>
        </div>

        {/* Right - FORM */}

        <div className="flex h-full items-center justify-center px-8 sm:px-12 lg:px-20">
          <div className="w-full max-w-md">
            <div className="mb-10">
              <h1 className="text-5xl font-bold tracking-tight">
                Welcome Back
              </h1>

              <p className="mt-3 text-gray-500">
                Sign in and continue creating heartfelt memories.
              </p>
            </div>

            {/* Username or Email */}

            <form onSubmit={handleSubmit}>
              <div className="mb-5">
                <label className="mb-2 block font-medium">
                  Username or Email
                </label>

                <div className="flex items-center rounded-xl border border-gray-300 px-4 transition focus-within:border-black">
                  <User size={18} className="text-gray-400" />

                  <input
                    type="text"
                    name="identifier"
                    value={formData.identifier}
                    onChange={handleChange}
                    placeholder="Username or Email"
                    className="w-full bg-transparent px-3 py-4 outline-none"
                  />
                </div>
              </div>

              {/* Password */}

              <div className="mb-3">
                <label className="mb-2 block font-medium">Password</label>

                <div className="flex items-center rounded-xl border border-gray-300 px-4 transition focus-within:border-black">
                  <Lock size={18} className="text-gray-400" />

                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Password"
                    className="w-full bg-transparent px-3 py-4 outline-none"
                  />
                </div>
              </div>

              {/* Forgot Password */}

              <div className="mb-8 flex justify-end">
                <button className="text-sm font-medium text-gray-500 transition hover:text-black">
                  Forgot Password?
                </button>
              </div>

              {/* Login Button */}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-black py-4 text-lg font-semibold text-white transition-all duration-300 hover:bg-neutral-800 disabled:opacity-60"
              >
                {loading ? "Logging In..." : "Login"}
              </button>
            </form>

            {/* Register */}

            <p className="mt-8 text-center text-gray-600">
              Don't have an account?
              <Link
                to="/register"
                className="ml-2 font-semibold text-black hover:underline"
              >
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
