import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { motion } from "framer-motion";

const Home = () => {
  const [search, setSearch] = useState("");
  const [books, setBooks] = useState([]);
  const [user, setUser] = useState(null);
  const [likes, setLikes] = useState({});
  const token = localStorage.getItem("token");

  const fetchBooks = async () => {
    try {
      const res = await API.get("http://localhost:5000/api/books");
      setBooks(res.data);

      // Initialize likes
      const initialLikes = {};
      res.data.forEach((b) => {
        initialLikes[b._id] = b.likes?.includes(localStorage.getItem("userId")) || false;
      });
      setLikes(initialLikes);
    } catch (err) {
      console.log("Error fetching books:", err);
    }
  };

  const fetchUser = async () => {
    if (!token) return;
    try {
      const res = await API.get("http://localhost:5000/api/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
      localStorage.setItem("userId", res.data._id);
    } catch (err) {
      console.log("Error fetching user:", err);
    }
  };

  const toggleLike = async (bookId) => {
    if (!token) return alert("Please login to like books!");
    try {
      await API.post(
        `/books/like/${bookId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setLikes((prev) => ({
        ...prev,
        [bookId]: !prev[bookId],
      }));
    } catch (err) {
      console.log(err);
      alert("Failed to update like");
    }
  };

  useEffect(() => {
    fetchBooks();
    fetchUser();
  }, []);

  

return (
  <div className="min-h-screen bg-[#0b0f19] font-body text-white">

    {/* HERO */}
    <section className="relative h-screen flex items-center justify-center overflow-hidden">

      {/* Background image */}
      <img
        src="https://images.unsplash.com/photo-1519682337058-a94d519337bc"
        className="absolute inset-0 w-full h-full object-cover"
        alt="Books"
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/80" />

      {/* Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,#ffffff12_1px,transparent_0)] bg-[length:24px_24px]" />

      {/* Animated Content */}
      <div className="relative z-10 text-center max-w-5xl px-6">
       <motion.h1
  initial={{ opacity: 0, y: 40 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.9 }}
  className="font-heading text-6xl md:text-7xl font-bold"
>
  <span
    className="bg-gradient-to-r from-blue-400 via-indigo-500 to-blue-400
               bg-clip-text text-transparent
               drop-shadow-[0_2px_10px_rgba(37,99,235,0.7)]
               animate-blue-glow"
  >
    BeigeReads
  </span>
  <br />
  Discover Books Beautifully
</motion.h1>



        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-slate-300 text-lg mt-6 max-w-2xl mx-auto"
        >
          A modern digital library to explore, like, and rent books effortlessly.
        </motion.p>

        {/* Search */}
        <motion.input
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7 }}
          type="text"
          placeholder="Search by title or author..."
          onChange={(e) => setSearch(e.target.value)}
          className="mt-10 w-full max-w-xl px-6 py-4 rounded-xl bg-white/10 backdrop-blur-xl border border-white/20 outline-none focus:ring-2 focus:ring-blue-400 placeholder-slate-300"
        />
      </div>
    </section>

    {/* CONTENT */}
    <section className="px-10 py-20">

      {/* Navbar */}
      <nav className="max-w-7xl mx-auto flex justify-between items-center mb-16">
        <h2 className="font-heading text-3xl font-bold">BeigeReads</h2>
        <div className="flex gap-8 text-sm text-slate-300">
          <Link to="/home" className="hover:text-blue-400">Home</Link>
          <Link to="/profile" className="hover:text-blue-400">Profile</Link>
          <Link to="/login" className="text-red-400 hover:text-red-500">Logout</Link>
        </div>
      </nav>

      {/* Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10">
        {books
          ?.filter(
            (b) =>
              b.title?.toLowerCase().includes(search.toLowerCase()) ||
              b.author?.toLowerCase().includes(search.toLowerCase())
          )
          .map((book) => {
            const isRented = book.status === "rented";
            const rentedByUser = user && book.rentedBy === user._id;
            const liked = likes[book._id] || false;

            return (
              <motion.div
                key={book._id}
                whileHover={{ y: -10 }}
                className="relative rounded-2xl overflow-hidden backdrop-blur-xl bg-white/10 border border-white/20 shadow-xl"
              >
                <Link to={`/book/${book._id}`} className="absolute inset-0 z-10" />

                {/* Image */}
                <div className="h-60 overflow-hidden">
                  {book.coverImage ? (
                    <img
                      src={book.coverImage}
                      alt={book.title}
                      className="h-full w-full object-cover hover:scale-105 transition"
                    />
                  ) : (
                    <div className="h-full flex items-center justify-center bg-white/10">
                      No Image
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-5">
                  <h3 className="text-sm font-semibold truncate">{book.title}</h3>
                  <p className="text-xs text-slate-400 truncate mt-1">
                    {book.author}
                  </p>

                  <div className="flex justify-between items-center mt-4">
                    <button
                      onClick={() => toggleLike(book._id)}
                      className="text-red-400 hover:scale-110 transition"
                    >
                      {liked ? <FaHeart /> : <FaRegHeart />}
                    </button>

                    <span
                      className={`text-xs px-3 py-1 rounded-full font-medium ${
                        isRented
                          ? rentedByUser
                            ? "bg-blue-500/20 text-blue-300"
                            : "bg-red-500/20 text-red-300"
                          : "bg-green-500/20 text-green-300"
                      }`}
                    >
                      {isRented
                        ? rentedByUser
                          ? "Rented by you"
                          : "Rented"
                        : "Available"}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
      </div>
    </section>
  </div>
);


};

export default Home;
