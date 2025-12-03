import { Link } from "react-router-dom";

const AdminDashboard = () => {
  return (
    <div className="px-6 py-10">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Link
          to="/admin/books"
          className="p-6 bg-blue-600 text-white rounded shadow hover:opacity-90"
        >
          Manage Books
        </Link>

        <Link
          to="/admin/users"
          className="p-6 bg-green-600 text-white rounded shadow hover:opacity-90"
        >
          Manage Users
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
