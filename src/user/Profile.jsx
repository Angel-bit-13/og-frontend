import React, { useEffect, useState } from "react";
import axios from "axios";
import API from "../api/axios";
import { FaUserCircle } from "react-icons/fa";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({});

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await API.get("/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
      setLoading(false);
    } catch (err) {
      alert("Failed to load profile");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const startEditing = () => {
    setEditData({
      name: user.name,
      place: user.place,
      age: user.age,
      education: user.education,
      phone: user.phone,
    });
    setEditMode(true);
  };

  const saveChanges = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        "http://localhost:5000/api/users/me",
        editData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUser(res.data);
      setEditMode(false);
      alert("Account details updated successfully");
    } catch (err) {
      alert("Update failed");
    }
  };

  const returnBook = async (bookId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:5000/api/books/return/${bookId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Book returned");
      fetchUser();
    } catch (err) {
      alert("Return failed");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!user) return <p className="text-center mt-10">No user found</p>;

 return (
  <div className="min-h-screen bg-[#0b0f19] flex justify-center py-12 px-4 text-white">
    <div className="w-full max-w-5xl">

      {/* PROFILE HEADER */}
      <div className="text-center mb-12">
        <div className="flex justify-center mb-4">
          <div className="w-24 h-24 rounded-full bg-white/10 backdrop-blur-xl flex items-center justify-center shadow-xl border border-blue-500/30">
            <FaUserCircle size={70} className="text-blue-400" />
          </div>
        </div>

        <h2 className="text-3xl font-semibold uppercase tracking-wide text-blue-400 drop-shadow-md">
          Profile
        </h2>
      </div>

      {/* PROFILE DETAILS TABLE */}
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 overflow-hidden mb-12">
        <table className="w-full border-collapse">
          <tbody>
            {[
              ["Full Name", user.name],
              ["Email Address", user.email],
              ["Place", user.place],
              ["Age", user.age],
              ["Education", user.education],
              ["Phone Number", user.phone],
            ].map(([label, value], index) => (
              <tr
                key={label}
                className={index % 2 === 0 ? "bg-white/5" : "bg-white/10"}
              >
                <td className="px-8 py-4 font-semibold w-1/3 text-slate-200">
                  {label}
                </td>
                <td className="px-8 py-4 text-slate-300">
                  {value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="text-center py-6">
          <button
            onClick={startEditing}
            className="px-10 py-3 rounded-full
                       bg-blue-500 text-white
                       hover:bg-blue-600 transition
                       shadow-[0_0_30px_rgba(59,130,246,0.45)]"
          >
            Edit Account
          </button>
        </div>
      </div>

      {/* RENTED BOOKS */}
      <h3 className="text-2xl font-semibold text-blue-400 text-center mb-6">
        Rented Books
      </h3>

      {user.rentedBooksWithDue?.length === 0 ? (
        <p className="text-center text-slate-400">
          No books found
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {user.rentedBooksWithDue.map((book) => (
            <div
              key={book._id}
              className="bg-white/10 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-white/20"
            >
              <h4 className="font-semibold text-white">
                {book.title}
              </h4>
              <p className="text-slate-300">{book.author}</p>
              <p className="text-sm text-slate-400">{book.genre}</p>

              {/* Due Date */}
              {book.expiresAt && (
                <p className="text-sm text-red-400 mt-2">
                  Due Date: {new Date(book.expiresAt).toLocaleDateString()}
                </p>
              )}

              <button
                onClick={() => returnBook(book._id)}
                className="mt-4 px-6 py-2 rounded-full
                           bg-blue-500 text-white
                           hover:bg-blue-600 transition
                           shadow-[0_0_25px_rgba(59,130,246,0.35)]"
              >
                Return Book
              </button>
            </div>
          ))}
        </div>
      )}

      {/* EDIT MODAL */}
      {editMode && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
          <div className="bg-white/10 backdrop-blur-xl p-8 rounded-2xl shadow-2xl w-full max-w-md border border-white/20">
            <h3 className="text-xl font-semibold text-blue-400 mb-6 text-center">
              Edit Account Information
            </h3>

            {Object.keys(editData).map((key) => (
              <div key={key} className="mb-4">
                <label className="block text-sm font-medium text-slate-300 mb-1 capitalize">
                  {key}
                </label>
                <input
                  className="w-full p-3 rounded-md border border-white/20
                             bg-white/5 text-white
                             placeholder-slate-400
                             focus:ring-2 focus:ring-blue-500 outline-none"
                  value={editData[key]}
                  onChange={(e) =>
                    setEditData({ ...editData, [key]: e.target.value })
                  }
                />
              </div>
            ))}

            <div className="flex justify-center gap-4 mt-6">
              <button
                onClick={() => setEditMode(false)}
                className="px-6 py-2 bg-white/20 rounded-full hover:bg-white/30 transition"
              >
                Cancel
              </button>
              <button
                onClick={saveChanges}
                className="px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  </div>
);

};

export default Profile;
