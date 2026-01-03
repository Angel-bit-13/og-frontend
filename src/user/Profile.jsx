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
    <div className="min-h-screen bg-[#f4efe6] flex justify-center py-12">
      <div className="w-full max-w-5xl">

        {/* PROFILE HEADER */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="w-24 h-24 rounded-full bg-[#e6dcc7] flex items-center justify-center shadow-md">
              <FaUserCircle size={70} className="text-[#5a4632]" />
            </div>
          </div>

          <h2 className="text-3xl font-semibold text-[#5a4632] uppercase tracking-wide">
            Profile
          </h2>
        </div>

        {/* PROFILE DETAILS TABLE */}
        <div className="bg-[#fffaf3] rounded-xl shadow-lg border border-[#e2d6c2] overflow-hidden mb-12">
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
                  className={index % 2 === 0 ? "bg-[#f7f1e8]" : "bg-[#fffaf3]"}
                >
                  <td className="px-8 py-4 font-semibold text-[#5a4632] w-1/3">
                    {label}
                  </td>
                  <td className="px-8 py-4 text-[#6f4e37]">
                    {value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="text-center py-6">
            <button
              onClick={startEditing}
              className="px-10 py-3 rounded-md
                         bg-[#8b6a45] text-white
                         hover:bg-[#7a5c3b] transition shadow"
            >
              Edit Account
            </button>
          </div>
        </div>

        {/* BORROWED BOOKS */}
        <h3 className="text-2xl font-semibold text-[#5a4632] text-center mb-6">
          Borrowed Books
        </h3>

        {user.likedBooks?.length === 0 ? (
          <p className="text-center text-[#8b7358]">
            No borrowed books found
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {user.likedBooks.map((book) => (
              <div
                key={book._id}
                className="bg-[#fffaf3] p-6 rounded-xl shadow-md border border-[#e2d6c2]"
              >
                <h4 className="font-semibold text-[#5a4632]">
                  {book.title}
                </h4>
                <p className="text-[#7a6248]">{book.author}</p>
                <p className="text-sm text-[#9c8466]">{book.genre}</p>

                <button
                  onClick={() => returnBook(book._id)}
                  className="mt-4 px-6 py-2 rounded-md
                             bg-[#b04a3f] text-white
                             hover:bg-[#9a3f36] transition"
                >
                  Return Book
                </button>
              </div>
            ))}
          </div>
        )}

        {/* EDIT MODAL */}
        {editMode && (
          <div className="fixed inset-0 bg-[#f4efe6]/80 flex justify-center items-center">
            <div className="bg-[#fffaf3] p-8 rounded-xl shadow-xl w-full max-w-md">
              <h3 className="text-xl font-semibold text-[#5a4632] mb-6 text-center">
                Edit Account Information
              </h3>

              {Object.keys(editData).map((key) => (
                <div key={key} className="mb-4">
                  <label className="block text-sm font-medium text-[#6f4e37] mb-1 capitalize">
                    {key}
                  </label>
                  <input
                    className="w-full p-3 rounded-md border border-[#d6c7b2]
                               bg-[#f7f1e8] text-[#5a4632]
                               focus:ring-2 focus:ring-[#c8b59a] outline-none"
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
                  className="px-6 py-2 bg-gray-300 rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={saveChanges}
                  className="px-6 py-2 bg-[#8b6a45] text-white rounded-md"
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