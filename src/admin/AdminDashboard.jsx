import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axios";
import { BookOpen, Users, ClipboardList, LogOut } from "lucide-react";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalBooks: 0,
    totalUsers: 0,
    totalRentals: 0,
  });

  const [books, setBooks] = useState([]);

  const fetchDashboardData = async () => {
    try {
      const statsRes = await API.get("/admin/stats");
      setStats({
        totalBooks: statsRes.data.totalBooks,
        totalUsers: statsRes.data.totalUsers,
        totalRentals: statsRes.data.rentedBooks,
      });

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
    <div className="flex min-h-screen bg-[#020617] text-white font-sans">

      {/* SIDEBAR */}
      <aside className="w-72 bg-[#020b2d]/90 backdrop-blur-xl border-r border-blue-900/40 shadow-[0_0_40px_rgba(59,130,246,0.2)] p-6 flex flex-col">
        <h1 className="text-2xl font-extrabold flex items-center gap-3 mb-10 text-blue-400">
          <BookOpen size={28} />
          NeonReads
        </h1>

        <nav className="flex flex-col gap-3">
          <Link className="p-4 rounded-xl bg-blue-600/20 border border-blue-800/40 shadow-[0_0_20px_rgba(59,130,246,0.3)] flex items-center gap-3 font-semibold">
            <ClipboardList size={20} /> Dashboard
          </Link>

          <Link
            to="/admin/books"
            className="p-4 rounded-xl hover:bg-blue-500/10 border border-transparent hover:border-blue-800/40 flex items-center gap-3 transition"
          >
            <BookOpen size={20} /> Manage Books
          </Link>

          <Link
            to="/admin/users"
            className="p-4 rounded-xl hover:bg-blue-500/10 border border-transparent hover:border-blue-800/40 flex items-center gap-3 transition"
          >
            <Users size={20} /> Manage Users
          </Link>

          <Link
            to="/admin/rentals"
            className="p-4 rounded-xl hover:bg-blue-500/10 border border-transparent hover:border-blue-800/40 flex items-center gap-3 transition"
          >
            <ClipboardList size={20} /> Rentals
          </Link>

          <Link
            to="/login"
            className="mt-auto p-4 rounded-xl hover:bg-red-500/10 border border-transparent hover:border-red-500/40 flex items-center gap-3 transition text-red-400"
          >
            <LogOut size={20} /> Logout
          </Link>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-10">

        {/* HEADER */}
        <h2 className="text-3xl font-bold text-blue-400 mb-10">
          Admin Dashboard
        </h2>

        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          {[
            { label: "Total Books", value: stats.totalBooks },
            { label: "Total Users", value: stats.totalUsers },
            { label: "Total Rentals", value: stats.totalRentals },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-[#020b2d]/80 backdrop-blur-xl rounded-2xl p-6 border border-blue-900/40 shadow-[0_0_30px_rgba(59,130,246,0.35)] text-center"
            >
              <h3 className="text-4xl font-extrabold text-blue-400">
                {item.value}
              </h3>
              <p className="mt-2 text-blue-300">{item.label}</p>
            </div>
          ))}
        </div>

        {/* BOOKS TABLE */}
        <h3 className="text-xl font-semibold mb-4 text-blue-300">
          Books List
        </h3>

        <div className="bg-[#020b2d]/80 backdrop-blur-xl rounded-2xl border border-blue-900/40 shadow-[0_0_40px_rgba(59,130,246,0.25)] overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-blue-900/40">
              <tr>
                <th className="p-4 text-blue-300 font-medium">Title</th>
                <th className="p-4 text-blue-300 font-medium">Author</th>
                <th className="p-4 text-blue-300 font-medium">Genre</th>
                <th className="p-4 text-blue-300 font-medium">Status</th>
              </tr>
            </thead>

            <tbody>
              {books.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-4 text-blue-400/60">
                    No books found
                  </td>
                </tr>
              ) : (
                books.map((book) => (
                  <tr
                    key={book._id}
                    className="border-b border-blue-900/30 hover:bg-blue-500/5 transition"
                  >
                    <td className="p-4">{book.title}</td>
                    <td className="p-4">{book.author}</td>
                    <td className="p-4">{book.genre}</td>
                    <td className="p-4">
                      <span
                        className={`px-4 py-1 rounded-full text-sm font-semibold ${
                          book.status === "available"
                            ? "bg-green-500/20 text-green-400 border border-green-500/40"
                            : "bg-red-500/20 text-red-400 border border-red-500/40"
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
      </main>
    </div>
  );
};

export default AdminDashboard;
