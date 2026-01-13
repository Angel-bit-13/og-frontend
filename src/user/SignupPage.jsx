import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axios";

const SignupPage = () => {
  const navigate = useNavigate();
 const [showTerms, setShowTerms] = useState(false);
 const [agreeTerms, setAgreeTerms] = useState(false);
  const [form, setForm] = useState({
    name: "",
    place: "",
    age: "",
    email: "",
    education: "",
    phone: "",
    password: "",
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
      newErrors.password =
        "Password must be at least 6 characters and include a number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
     if (!agreeTerms) {
    alert("Please agree to the Terms & Conditions to continue.");
    return;
  }

    try {
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
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#020617]/90 via-[#050b1a]/85 to-[#020617]/95 backdrop-blur-sm"></div>

      <form
        onSubmit={handleSubmit}
        className="relative z-10 max-w-md w-full
                   bg-[#0b1635]/80 backdrop-blur-xl
                   rounded-3xl p-10
                   shadow-[0_0_50px_rgba(59,130,246,0.35)]
                   border border-blue-900/40
                   flex flex-col items-center"
      >
        {/* LOGO */}
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

        {/* TITLE */}
        <h1 className="text-3xl font-extrabold text-blue-400 mb-1 tracking-wide">
          NeonReads
        </h1>

        <h2 className="text-xl font-semibold text-blue-300 mb-6 text-center">
          Create Account
        </h2>

        {/* INPUTS */}
        {["name", "place", "age", "email", "education", "phone", "password"].map(
          (key) => (
            <div key={key} className="mb-4 w-full">
              <input
                type={
                  key === "password"
                    ? "password"
                    : key === "age"
                    ? "number"
                    : "text"
                }
                placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                className={`w-full p-4 rounded-xl
                  bg-[#020617]/80
                  text-white placeholder-blue-400
                  border ${
                    errors[key]
                      ? "border-red-500"
                      : "border-blue-900/50"
                  }
                  focus:ring-2 focus:ring-blue-500
                  outline-none transition-all duration-300`}
                value={form[key]}
                onChange={(e) =>
                  setForm({ ...form, [key]: e.target.value })
                }
                required
              />
              {errors[key] && (
                <p className="text-red-400 text-sm mt-1">
                  {errors[key]}
                </p>
              )}
            </div>
          )
        )}
        {/* Terms & Conditions */}
                 <div className="mb-6 flex items-start gap-3 text-[#65b3d8]">
                   <input
                     type="checkbox"
                     id="terms"
                     checked={agreeTerms}
                     onChange={(e) => setAgreeTerms(e.target.checked)}
                     className="mt-1 accent-[#c9b492] cursor-pointer"
                     required
                   />
                   <label htmlFor="terms" className="text-sm cursor-pointer">
                     I agree to the{" "}
                     <span
                       className="underline hover:text-[#1c8bd4]"
                       onClick={(e) => {
                         e.preventDefault();
                         setShowTerms(true);
                       }}
                     >
                       Terms & Conditions
                     </span>
                   </label>
                   {showTerms && (
                   <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
                     <div className="bg-[#fffaf0] max-w-sm w-full rounded-2xl p-6 shadow-2xl border border-[#bbe0f5]">
                       <h3 className="text-xl font-bold text-[#116877] mb-4">
                         Terms & Conditions
                       </h3>
         
                       <p className="text-[#193363] text-sm leading-relaxed">
                         If the book is not returned within the due date, a fine will be charged.
                       </p>
         
                       <button
                         onClick={() => setShowTerms(false)}
                         className="mt-6 w-full py-2 rounded-full bg-[#9ab6da] text-[#0e2850] font-semibold hover:bg-[#669aaf] transition"
                       >
                         Close
                       </button>
                     </div>
                   </div>
                 )}
         
                 </div>
         

        {/* SUBMIT */}
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
          Sign Up
        </button>

        {/* LOGIN LINK */}
        <p className="text-center mt-6 text-blue-300">
          Already have an account?{" "}
          <Link
            to="/login"
            className="underline hover:text-blue-400 transition"
          >
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default SignupPage;
