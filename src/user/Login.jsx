import React, { useState } from "react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-r from-gray-900 to-gray-700 p-6">
      <div className="backdrop-blur-xl bg-white/10 p-10 rounded-3xl shadow-lg w-full max-w-md border border-white/20">
        
        <h2 className="text-3xl text-white font-bold mb-6 text-center">
          Welcome Back 👋
        </h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 p-3 rounded-xl bg-white/20 text-white focus:outline-none"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-6 p-3 rounded-xl bg-white/20 text-white focus:outline-none"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="w-full bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-xl">
          Login
        </button>
      </div>
    </div>
  );
};

export default Login;
