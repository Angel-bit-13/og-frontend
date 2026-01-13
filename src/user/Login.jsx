import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axios";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);

      if (res.data.role.toLowerCase() === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/home");
      }
    } catch (error) {
      console.log(error);
      alert("Invalid login credentials");
    }
  };

  return (
  <div
    className="min-h-screen flex justify-center items-center relative bg-cover bg-center"
    style={{
      backgroundImage:
        "url('https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1400&q=80')",
    }}
  >
    {/* Dark overlay */}
    <div className="absolute inset-0 bg-gradient-to-br from-[#020617]/90 via-[#050b1a]/85 to-[#020617]/95 backdrop-blur-sm"></div>

    {/* Login form */}
    <form
      onSubmit={handleLogin}
      className="relative z-10 max-w-md w-full
                 bg-[#0b1635]/80 backdrop-blur-xl
                 rounded-3xl p-10
                 shadow-[0_0_50px_rgba(59,130,246,0.35)]
                 border border-blue-900/40
                 flex flex-col items-center"
    >
      {/* Logo */}
      <svg
        width="60"
        height="60"
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="mb-4 drop-shadow-[0_0_15px_rgba(59,130,246,0.6)]"
      >
        <path d="M10 14 L30 10 L30 54 L10 50 Z" fill="#1e3a8a" />
        <path d="M54 14 L34 10 L34 54 L54 50 Z" fill="#2563eb" />
        <rect x="30" y="10" width="4" height="44" fill="#60a5fa" rx="1" />
      </svg>

      {/* Store heading */}
      <h1 className="text-3xl font-extrabold text-blue-400 mb-1 tracking-wide">
        NeonReads
      </h1>

      {/* Subheading */}
      <h2 className="text-xl font-semibold text-blue-300 mb-6 text-center">
        Welcome Back
      </h2>

      {/* Email input */}
      <div className="mb-5 w-full">
        <input
          type="email"
          placeholder="Email"
          className="w-full p-4 rounded-xl
                     bg-[#020617]/80
                     border border-blue-900/50
                     placeholder-blue-400
                     text-white
                     focus:ring-2 focus:ring-blue-500
                     outline-none
                     transition-all duration-300"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      {/* Password input */}
      <div className="mb-5 w-full">
        <input
          type="password"
          placeholder="Password"
          className="w-full p-4 rounded-xl
                     bg-[#020617]/80
                     border border-blue-900/50
                     placeholder-blue-400
                     text-white
                     focus:ring-2 focus:ring-blue-500
                     outline-none
                     transition-all duration-300"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      {/* Login button */}
      <button
        type="submit"
        className="w-full p-4 rounded-full
                   bg-gradient-to-r from-blue-600 to-blue-500
                   text-white font-bold
                   shadow-[0_0_25px_rgba(59,130,246,0.6)]
                   hover:shadow-[0_0_40px_rgba(59,130,246,0.9)]
                   hover:from-blue-500 hover:to-blue-400
                   transition-all duration-300"
      >
        Login
      </button>

      {/* Signup link */}
      <p className="text-center mt-6 text-blue-300 font-medium">
        Don't have an account?{" "}
        <Link
          to="/signup"
          className="underline hover:text-blue-400 transition"
        >
          Sign Up
        </Link>
      </p>
    </form>

    {/* Decorative image */}
    <img
      src="https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=400&q=80"
      alt="Books"
      className="absolute bottom-0 right-0 w-64 opacity-10 pointer-events-none"
    />
  </div>
);

};

export default Login;
