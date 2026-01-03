import React, { useState, useEffect } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

const EditProfile = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    place: "",
    age: "",
    education: "",
    phone: ""
  });

  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await API.get("/users/me");
        const user = res.data;

        setForm({
          name: user.name || "",
          place: user.place || "",
          age: user.age || "",
          education: user.education || "",
          phone: user.phone || ""
        });
      } catch (error) {
        console.error("Load user error:", error);
      }
    };

    loadUser();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await API.put("/users/update", {
        ...form,
        age: Number(form.age)
      });

      alert("Account details updated successfully");
      navigate("/profile");
    } catch (error) {
      console.error("Update failed:", error);
      alert("Update failed");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-[#f4efe6]">
      <form
        onSubmit={handleUpdate}
        className="w-full max-w-xl bg-[#fffaf3] p-12 rounded-2xl
                   shadow-xl border border-[#e2d6c2]"
      >
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-semibold text-[#5a4632]">
            Official Account
          </h2>
          <p className="text-sm text-[#8b7358] mt-2">
            Manage your personal information
          </p>
        </div>

        {/* Inputs */}
        {[
          { key: "name", label: "Full Name" },
          { key: "place", label: "Place of Residence" },
          { key: "age", label: "Age", type: "number" },
          { key: "education", label: "Educational Qualification" },
          { key: "phone", label: "Phone Number" }
        ].map(({ key, label, type }) => (
          <div key={key} className="mb-6 text-center">
            <label className="block text-sm font-medium text-[#5a4632] mb-2">
              {label}
            </label>
            <input
              type={type || "text"}
              value={form[key]}
              onChange={(e) =>
                setForm({ ...form, [key]: e.target.value })
              }
              className="w-full max-w-md mx-auto p-3 text-center
                         rounded-md border border-[#d6c7b2]
                         bg-[#f7f1e8] text-[#5a4632]
                         focus:outline-none focus:ring-2 focus:ring-[#c8b59a]
                         transition"
            />
          </div>
        ))}

        {/* Submit Button */}
        <div className="text-center mt-10">
          <button
            type="submit"
            className="px-12 py-3 rounded-md
                       bg-[#8b6a45] text-white font-medium
                       hover:bg-[#7a5c3b] transition shadow-md"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;