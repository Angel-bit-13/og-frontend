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
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-[#f5f0e6]/70 backdrop-blur-sm"></div>

      {/* Glassy login card */}
      <form
        onSubmit={handleLogin}
        className="relative z-10 max-w-md w-full bg-white/70 backdrop-blur-lg rounded-3xl p-10 shadow-2xl border border-[#e0d6c3]"
      >
        <h2 className="text-4xl font-extrabold text-[#7c6651] mb-6 text-center">
          Welcome Back
        </h2>

        {/* Email */}
        <div className="mb-5">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-4 rounded-xl border border-[#d8c7aa] bg-[#fffaf0] placeholder-[#a38c6e] text-[#7c6651] focus:ring-2 focus:ring-[#c9b492] outline-none transition-all duration-300"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* Password */}
        <div className="mb-5">
          <input
            type="password"
            placeholder="Password"
            className="w-full p-4 rounded-xl border border-[#d8c7aa] bg-[#fffaf0] placeholder-[#a38c6e] text-[#7c6651] focus:ring-2 focus:ring-[#c9b492] outline-none transition-all duration-300"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {/* Login Button */}
        <button
          type="submit"
          className="w-full p-4 rounded-full bg-[#d8c7aa] text-[#7c6651] font-bold shadow-md hover:bg-[#c9b492] transition-all duration-300"
        >
          Login
        </button>

        {/* Signup Link */}
        <p className="text-center mt-6 text-[#7c6651] font-medium">
          Don't have an account?{" "}
          <Link to="/signup" className="underline hover:text-[#a38c6e]">
            Sign Up
          </Link>
        </p>
      </form>

      {/* Decorative book image */}
      <img
        src="https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=400&q=80"
        alt="Books"
        className="absolute bottom-0 right-0 w-64 opacity-20 pointer-events-none"
      />
    </div>
  );
};

export default Login;