import { useEffect, useState } from "react";
import API from "../api/axios";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [editingUserId, setEditingUserId] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", email: "" });

  const fetchUsers = async () => {
    try {
      const res = await API.get("/users");
      setUsers(res.data);
    } catch (err) {
      console.log("Error fetching users:", err);
    }
  };

  const deleteUser = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await API.delete(`/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers();
    } catch (err) {
      console.error("Error removing user:", err.response?.data || err);
      alert("Failed to delete user");
    }
  };

  const startEditing = (user) => {
    setEditingUserId(user._id);
    setEditForm({ name: user.name, email: user.email });
  };

  const cancelEditing = () => {
    setEditingUserId(null);
    setEditForm({ name: "", email: "" });
  };

  const updateUser = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await API.put(`/users/${id}`, editForm, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEditingUserId(null);
      fetchUsers();
    } catch (err) {
      console.error("Error updating user:", err.response?.data || err);
      alert("Failed to update user");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen bg-[#020617] p-10">
      <h1 className="text-4xl font-extrabold text-blue-400 mb-10 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]">
        Manage Users
      </h1>

      <div
        className="max-w-5xl mx-auto
                   bg-[#020b2d]/80 backdrop-blur-xl
                   border border-blue-900/40
                   rounded-3xl
                   shadow-[0_0_50px_rgba(59,130,246,0.35)]
                   p-6"
      >
        {users.length === 0 ? (
          <p className="text-center text-blue-300 py-10 text-lg">
            No users found
          </p>
        ) : (
          users.map((user) => (
            <div
              key={user._id}
              className="flex justify-between items-center
                         bg-[#020b2d]/60 backdrop-blur-sm
                         border border-blue-900/30
                         rounded-2xl p-5 mb-4 last:mb-0
                         shadow-[0_0_15px_rgba(59,130,246,0.2)]
                         hover:shadow-[0_0_30px_rgba(59,130,246,0.5)]
                         transition"
            >
              {/* User Info / Edit */}
              <div className="flex-1">
                {editingUserId === user._id ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) =>
                        setEditForm({ ...editForm, name: e.target.value })
                      }
                      className="w-full px-4 py-2 rounded-xl
                                 bg-[#020617]/80
                                 border border-blue-900/50
                                 text-white placeholder-blue-400
                                 focus:ring-2 focus:ring-blue-500
                                 outline-none"
                      placeholder="Name"
                    />
                    <input
                      type="email"
                      value={editForm.email}
                      onChange={(e) =>
                        setEditForm({ ...editForm, email: e.target.value })
                      }
                      className="w-full px-4 py-2 rounded-xl
                                 bg-[#020617]/80
                                 border border-blue-900/50
                                 text-white placeholder-blue-400
                                 focus:ring-2 focus:ring-blue-500
                                 outline-none"
                      placeholder="Email"
                    />
                  </div>
                ) : (
                  <>
                    <h2 className="text-lg font-semibold text-blue-200">
                      {user.name}
                    </h2>
                    <p className="text-blue-300 text-sm">{user.email}</p>
                  </>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2 ml-4">
                {editingUserId === user._id ? (
                  <>
                    <button
                      onClick={() => updateUser(user._id)}
                      className="px-4 py-2 rounded-full
                                 bg-green-500/20 text-green-400
                                 border border-green-400/40
                                 hover:bg-green-500/40 hover:text-white
                                 transition"
                    >
                      Save
                    </button>

                    <button
                      onClick={cancelEditing}
                      className="px-4 py-2 rounded-full
                                 bg-gray-500/20 text-gray-300
                                 border border-gray-400/40
                                 hover:bg-gray-500/40 hover:text-white
                                 transition"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => startEditing(user)}
                      className="px-4 py-2 rounded-full
                                 bg-blue-600/20 text-blue-300
                                 border border-blue-500/40
                                 hover:bg-blue-600/40 hover:text-white
                                 transition"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => {
                        if (
                          window.confirm(
                            `Are you sure you want to delete ${user.name}?`
                          )
                        ) {
                          deleteUser(user._id);
                        }
                      }}
                      className="px-4 py-2 rounded-full
                                 bg-red-600/20 text-red-400
                                 border border-red-500/40
                                 hover:bg-red-600/40 hover:text-white
                                 transition"
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
