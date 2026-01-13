import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

export default function AddBook() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    author: "",
    genre: "",
    publicationYear: "",
    coverImage: "",
    status: "available",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/admin/books", {
        ...form,
        publicationYear: Number(form.publicationYear),
      });
      alert("Book added successfully");
      navigate("/admin/books");
    } catch (err) {
      console.error(err);
      alert("Failed to add book");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-[#030a1f]">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xl bg-[#fffaf3] p-12 rounded-2xl
                   shadow-xl border border-[#dff1f0]"
      >
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-semibold text-[#05163a]">
            Add New Book
          </h2>
          <p className="text-sm text-[#0e1d50] mt-2">
            Enter book details to add it to the library
          </p>
        </div>

        {/* Inputs */}
        {[
          { key: "title", label: "Book Title" },
          { key: "author", label: "Author" },
          { key: "genre", label: "Genre" },
          { key: "publicationYear", label: "Publication Year", type: "number" },
          { key: "coverImage", label: "Cover Image URL" },
        ].map(({ key, label, type }) => (
          <div key={key} className="mb-6">
            <label className="block text-sm font-medium text-[#0f3952] mb-2">
              {label}
            </label>
            <input
              type={type || "text"}
              name={key}
              value={form[key]}
              onChange={handleChange}
              required
              className="w-full max-w-md mx-auto p-3 
                         rounded-md border border-[#b2c9d6]
                         bg-[#e8f1f7] text-[#153457]
                         focus:outline-none focus:ring-2 focus:ring-[#9aaac8]
                         transition"
            />
          </div>
        ))}

        {/* Status (hidden but consistent) */}
        <input type="hidden" name="status" value="available" />

        {/* Submit Button */}
        <div className="text-center mt-10">
          <button
            type="submit"
            className="px-12 py-3 rounded-md
                       bg-[#0f1569] text-white font-medium
                       hover:bg-[#24397c] transition shadow-md"
          >
            Add Book
          </button>
        </div>
      </form>
    </div>
  );
}
