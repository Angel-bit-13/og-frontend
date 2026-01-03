import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axios";

const Signup = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    place: "",
    age: "",
    email: "",
    education: "",
    phone: "",
    password: ""
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};

    if (!/^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/.test(form.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!/^\d{10}$/.test(form.phone)) {
      newErrors.phone = "Phone number must be 10 digits";
    }

    if (!/^(?=.*\d).{6,}$/.test(form.password)) {
      newErrors.password = "Password must be 6+ characters and include a number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      // ✅ CORRECT ENDPOINT (NO /api HERE)
      await API.post("/auth/register", form);

      const loginRes = await API.post("/auth/login", {
        email: form.email,
        password: form.password,
      });

      localStorage.setItem("token", loginRes.data.token);
      localStorage.setItem("role", loginRes.data.role);

      navigate("/home");
    } catch (err) {
      console.error("Signup error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Signup failed");
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
      <div className="absolute inset-0 bg-[#f5f0e6]/70 backdrop-blur-sm"></div>

      <form
        onSubmit={handleSubmit}
        className="relative z-10 max-w-md w-full bg-white/70 backdrop-blur-lg rounded-3xl p-10 shadow-2xl border border-[#e0d6c3]"
      >
        <h2 className="text-3xl font-extrabold text-[#7c6651] mb-6 text-center">
          Create Account
        </h2>

        {["name", "place", "age", "email", "education", "phone", "password"].map((key) => (
          <div key={key} className="mb-4">
            <input
              type={key === "password" ? "password" : key === "age" ? "number" : "text"}
              placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
              className={`w-full p-4 rounded-xl border bg-[#fffaf0] text-[#7c6651]
                ${errors[key] ? "border-red-500" : "border-[#d8c7aa]"}`}
              value={form[key]}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              required
            />
            {errors[key] && (
              <p className="text-red-500 text-sm mt-1">{errors[key]}</p>
            )}
          </div>
        ))}

        <button
          type="submit"
          className="w-full p-4 rounded-full bg-[#d8c7aa] text-[#7c6651] font-bold hover:bg-[#c9b492]"
        >
          Sign Up
        </button>

        <p className="text-center mt-6 text-[#7c6651]">
          Already have an account?{" "}
          <Link to="/login" className="underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;