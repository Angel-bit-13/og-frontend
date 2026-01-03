import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";
import { FaHeart, FaRegHeart } from "react-icons/fa";

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
    <div className="min-h-screen bg-[#F5EFE6] p-10">
      {/* NAVBAR */}
      <nav className="bg-[#E8DFCA] shadow-md px-8 py-4 flex justify-between items-center rounded-2xl mb-12 border border-[#D8CDBA]">
        <h1 className="text-3xl font-bold text-[#6F4E37] tracking-wide">📚 BeigeReads</h1>
        <div className="flex items-center bg-white px-4 py-2 rounded-xl shadow-sm w-full max-w-md mx-6 border border-[#D8CDBA]">
          <input
            type="text"
            placeholder="Search books..."
            className="w-full bg-transparent outline-none text-[#6F4E37]"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="space-x-6 text-lg">
          <Link to="/home" className="text-[#6F4E37] hover:text-black">Home</Link>
          
          
          
          <Link to="/profile" className="text-[#6F4E37] hover:text-black">Profile</Link>
        </div>
      </nav>

      <h2 className="text-4xl font-bold text-[#6F4E37] mb-8">
        Explore Our Cozy Book Collection ☕📖
      </h2>

      {/* MATRIX BOOK SHELF */}
      <div className="grid grid-cols-5 gap-x-6 gap-y-8 justify-items-center">
        {books
          ?.filter((b) =>
            b.title?.toLowerCase().includes(search.toLowerCase()) ||
            b.author?.toLowerCase().includes(search.toLowerCase())
          )
          .map((book) => {
            const isRented = book.status === "rented";
            const rentedByUser = user && book.rentedBy === user._id;
            const liked = likes[book._id] || false;

            return (
              <div
                key={book._id}
                className="relative w-[6cm] h-[10cm] bg-[#FAF6F0] border border-[#E3DCCE] rounded-3xl shadow-md hover:shadow-xl transition-all flex flex-col items-center"
              >
                <Link to={`/book/${book._id}`} className="absolute inset-0 z-0"></Link>

                {/* Book Image */}
                {book.coverImage ? (
                  <img
                    src={book.coverImage}
                    alt={book.title}
                    className="w-full h-[70%] object-cover rounded-t-2xl mb-2"
                  />
                ) : (
                  <div className="w-full h-[70%] flex items-center justify-center bg-[#E3DCCE] text-[#6F4E37] font-bold">
                    No Image
                  </div>
                )}

                {/* Book Info */}
                <div className="flex flex-col items-center justify-between p-2 h-[30%] w-full">
                  <h3 className="text-sm font-bold text-center truncate">{book.title}</h3>
                  <p className="text-xs text-center text-[#8C6E54] truncate">✍ {book.author}</p>

                  <div className="flex justify-between w-full mt-1">
                    {/* Like Button */}
                    <button
                      onClick={() => toggleLike(book._id)}
                      className="text-red-600 hover:text-red-700 transition text-lg"
                    >
                      {liked ? <FaHeart /> : <FaRegHeart />}
                    </button>

                    {/* Status */}
                    <span
                      className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                        isRented
                          ? rentedByUser
                            ? "bg-blue-300 text-blue-800"
                            : "bg-red-300 text-red-800"
                          : "bg-green-300 text-green-800"
                      }`}
                    >
                      {isRented ? (rentedByUser ? "Rented by you" : "Rented") : "Available"}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default Home;