import { useEffect, useState } from "react";
import axios from "axios";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);

  const load = async () => {
    const res = await axios.get("http://localhost:5000/admin/users");
    setUsers(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  const blockUser = async (id) => {
    await axios.put(`http://localhost:5000/admin/block/${id}`);
    load();
  };

  return (
    <div className="px-6 py-10">
      <h1 className="text-3xl font-bold mb-4">Manage Users</h1>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Action</th>
          </tr>
        </thead>

        <tbody>
          {users.map((u) => (
            <tr key={u._id}>
              <td className="p-2 border">{u.name}</td>
              <td className="p-2 border">{u.email}</td>
              <td className="p-2 border">{u.isBlocked ? "Blocked" : "Active"}</td>
              <td className="p-2 border">
                <button
                  onClick={() => blockUser(u._id)}
                  className="px-3 py-1 bg-red-600 text-white rounded"
                >
                  Block/Unblock
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
};

export default AdminUsers;
