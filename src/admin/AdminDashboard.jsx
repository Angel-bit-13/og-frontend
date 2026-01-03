import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import API from "../api/axios";
import { User, BookOpen, Users, ClipboardList, LogOut } from "lucide-react";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalUsers: 0,
    totalRentals: 0,
  });

  const [books, setBooks] = useState([]);

  const BACKEND_URL = "http://localhost:5000"; // adjust if needed

  // Fetch stats + books
  const fetchDashboardData = async () => {
  try {
    // ADMIN stats
    const statsRes = await API.get("/admin/stats");
    setStats({
      totalBooks: statsRes.data.totalBooks,
      totalUsers: statsRes.data.totalUsers,
      totalRentals: statsRes.data.rentedBooks,
    });

    // ADMIN books
    const booksRes = await API.get("/admin/books");
    setBooks(booksRes.data);

  } catch (error) {
    console.error("Dashboard fetch error:", error);
  }
};

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div className="flex min-h-screen bg-[#f5f0e6] font-sans text-gray-800">

      {/* Sidebar */}
      <div className="w-64 bg-[#e0d6c3] text-gray-800 p-6 flex flex-col shadow-lg">
        <h1 className="text-2xl font-bold flex items-center gap-2 mb-10 text-[#7c6651]">
          <BookOpen size={26} /> Admin Panel
        </h1>

        <nav className="flex flex-col gap-3">
          <Link
            className="p-3 bg-[#d8c7aa] rounded-xl flex items-center gap-2 font-medium shadow hover:bg-[#c9b492] transition"
          >
            <ClipboardList size={20} /> Dashboard
          </Link>

          <Link
            to="/admin/books"
            className="p-3 hover:bg-[#c9b492] rounded-xl flex items-center gap-2 transition"
          >
            <BookOpen size={20} /> Manage Books
          </Link>

          <Link
            to="/admin/users"
            className="p-3 hover:bg-[#c9b492] rounded-xl flex items-center gap-2 transition"
          >
            <Users size={20} /> Manage Users
          </Link>

          <Link
            to="/admin/rentals"
            className="p-3 hover:bg-[#c9b492] rounded-xl flex items-center gap-2 transition"
          >
            <ClipboardList size={20} /> Rentals
          </Link>

          <Link
            to="/login"
            className="p-3 hover:bg-[#c9b492] rounded-xl flex items-center gap-2 mt-10 transition"
          >
            <LogOut size={20} /> Logout
          </Link>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        {/* Top Bar */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-semibold text-[#7c6651]">Dashboard</h2>
          <button
            onClick={() => navigate("/admin/profile")}
            className="p-2 rounded-full hover:bg-[#d8c7aa] transition"
          >
            <User size={24} />
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          {[
            { value: stats.totalBooks, label: "Total Books" },
            { value: stats.totalUsers, label: "Total Users" },
            { value: stats.totalRentals, label: "Total Rentals" },
          ].map((stat, idx) => (
            <div
              key={idx}
              className="bg-[#f5f0e6] p-6 rounded-2xl shadow-lg text-center border border-[#e0d6c3]"
            >
              <h3 className="text-4xl font-bold text-[#7c6651]">{stat.value}</h3>
              <p className="mt-2 text-[#a38c6e]">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Books Table */}
        <h3 className="text-xl font-semibold mb-4 text-[#7c6651]">Books List</h3>
        <div className="bg-[#f5f0e6] rounded-2xl shadow p-4 border border-[#e0d6c3] overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#e0d6c3]">
                <th className="p-3 text-[#7c6651] font-medium">Title</th>
                <th className="p-3 text-[#7c6651] font-medium">Author</th>
                <th className="p-3 text-[#7c6651] font-medium">Genre</th>
                <th className="p-3 text-[#7c6651] font-medium">Status</th>
              </tr>
            </thead>

            <tbody>
              {books.length === 0 ? (
                <tr>
                  <td className="p-3 text-gray-500" colSpan="4">No books found</td>
                </tr>
              ) : (
                books.map((book) => (
                  <tr key={book._id} className="border-b border-[#d8c7aa] hover:bg-[#e8dfcd] transition">
                    <td className="p-3">{book.title}</td>
                    <td className="p-3">{book.author}</td>
                    <td className="p-3">{book.genre}</td>
                    <td className="p-3">
                      <span
                        className={`px-3 py-1 rounded-lg text-white ${
                          book.status === "available" ? "bg-green-600" : "bg-red-600"
                        }`}
                      >
                        {book.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;