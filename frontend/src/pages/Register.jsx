import { Link } from "react-router-dom";
import { useState } from "react";
import { registerUser } from "../services/auth.service.js";
import { Mail, Lock, User, AtSign, HeartHandshake } from "lucide-react";

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
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
      const data = await registerUser(formData);

      console.log(data);

      alert("Registration successful!");

      setFormData({
        fullName: "",
        username: "",
        email: "",
        password: "",
      });
    } catch (error) {
      console.error(error);

      alert(error.response?.data?.message || "Something went wrong.");
    }
  };

  return (
    <section className="h-screen w-screen overflow-hidden bg-white">
      <div className="grid h-full w-full lg:grid-cols-2">
        {/* Left - IMAGE */}

        <div className="relative hidden h-full lg:block">
          <img
            src="https://cdn.pixabay.com/photo/2026/05/17/09/32/09-32-57-920_1280.jpg"
            alt="Register"
            className="absolute inset-0 h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-black/35"></div>

          <div className="absolute inset-0 flex flex-col justify-between p-12 text-white">
            <div>
              <h2 className="text-6xl font-bold leading-tight">
                Begin
                <br />
                Your Story.
              </h2>

              <p className="mt-6 max-w-md text-lg opacity-90">
                Every unforgettable letter starts with one small step. Create
                your account and preserve meaningful memories.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <HeartHandshake />

              <span>Beautiful words deserve a beautiful home.</span>
            </div>
          </div>
        </div>

        {/* Right - FORM */}

        <div className="flex h-full items-center justify-center px-8 sm:px-12 lg:px-20">
          <div className="w-full max-w-md">
            <div className="mb-10">
              <h1 className="text-5xl font-bold tracking-tight">
                Create Account
              </h1>

              <p className="mt-3 text-gray-500">
                Start creating meaningful letters for the people you love.
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Full Name */}

              <div className="mb-5">
                <label className="mb-2 block font-medium">Full Name</label>

                <div className="flex items-center rounded-xl border border-gray-300 px-4 transition focus-within:border-black">
                  <User size={18} className="text-gray-400" />

                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full bg-transparent px-3 py-4 outline-none"
                  />
                </div>
              </div>

              {/* Username */}

              <div className="mb-5">
                <label className="mb-2 block font-medium">Username</label>

                <div className="flex items-center rounded-xl border border-gray-300 px-4 transition focus-within:border-black">
                  <AtSign size={18} className="text-gray-400" />

                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="john_doe"
                    className="w-full bg-transparent px-3 py-4 outline-none"
                  />
                </div>
              </div>

              {/* Email */}

              <div className="mb-5">
                <label className="mb-2 block font-medium">Email Address</label>

                <div className="flex items-center rounded-xl border border-gray-300 px-4 transition focus-within:border-black">
                  <Mail size={18} className="text-gray-400" />

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    className="w-full bg-transparent px-3 py-4 outline-none"
                  />
                </div>
              </div>

              {/* Password */}

              <div className="mb-8">
                <label className="mb-2 block font-medium">Password</label>

                <div className="flex items-center rounded-xl border border-gray-300 px-4 transition focus-within:border-black">
                  <Lock size={18} className="text-gray-400" />

                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a secure password"
                    className="w-full bg-transparent px-3 py-4 outline-none"
                  />
                </div>
              </div>

              {/* Submit */}

              <button
                type="submit"
                className="w-full rounded-xl bg-black py-4 text-lg font-semibold text-white transition-all duration-300 hover:bg-neutral-800 hover:scale-[1.01] active:scale-100"
              >
                Create Account
              </button>
            </form>

            <p className="mt-8 text-center text-gray-600">
              Already have an account?
              <Link
                to="/login"
                className="ml-2 font-semibold text-black hover:underline"
              >
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Register;
