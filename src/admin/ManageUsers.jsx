import { useEffect, useState } from "react";
import API from "../api/axios";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);

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
    const res = await API.delete(`/users/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    alert(res.data.message || "User deleted");
    fetchUsers();
  } catch (err) {
    console.error("Error removing user:", err.response?.data || err);
    alert("Failed to delete user. Admin access required.");
  }
};


  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="p-10 bg-[#F5EFE6] min-h-screen">
      <h1 className="text-3xl font-bold  text-[#6F4E37] mb-4">Manage Users</h1>

      <div className="bg-white shadow rounded-lg p-5">
        {users.map((user) => (
          <div key={user._id} className="border-b py-3 flex justify-between">

            <div>
              <h2 className="font-semibold">{user.name}</h2>
              <p className="text-gray-600">{user.email}</p>
            </div>

           <button onClick={() => {
              if (window.confirm(`Are you sure you want to delete ${user.name}?`)) {
                deleteUser(user._id);
              }
            }}
            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
          >
            Delete User
          </button>


          </div>
        ))}
      </div>
    </div>
  );
}
