import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Home = () => {
  const [search, setSearch] = useState("");
  const [books, setBooks] = useState([]);

  // 20 frontend sample books
  const fallbackBooks = [
    { id: 1, title: "The Silent Library", author: "Aria Bloom" },
    { id: 2, title: "Whispers of Time", author: "Nova Hart" },
    { id: 3, title: "Finding Luna", author: "Ezra Hale" },
    { id: 4, title: "Dust & Daydreams", author: "Mira Solis" },
    { id: 5, title: "Paper Hearts", author: "Jude Rowan" },
    { id: 6, title: "Beyond the Pages", author: "Elle Carter" },
    { id: 7, title: "A Room Full of Stories", author: "Kai Moon" },
    { id: 8, title: "The Last Bookmark", author: "Lena Cross" },
    { id: 9, title: "Chapters of Us", author: "Sage Rivers" },
    { id: 10, title: "Whispers in Ink", author: "Arlo James" },
    { id: 11, title: "The Bookmaker’s Daughter", author: "Faye Arden" },
    { id: 12, title: "Eternal Letters", author: "Rowan Vale" },
    { id: 13, title: "Woven Tales", author: "Sienna Vale" },
    { id: 14, title: "The Lost Manuscript", author: "Theo Quinn" },
    { id: 15, title: "Moonlit Stories", author: "Ivy Storm" },
    { id: 16, title: "Inkbound", author: "Callum Frost" },
    { id: 17, title: "Velvet Pages", author: "Lyra Bloom" },
    { id: 18, title: "A Shelf of Suns", author: "Elias Wren" },
    { id: 19, title: "Wildflower Books", author: "Willa Jade" },
    { id: 20, title: "Autumn Chapters", author: "Finn Hale" },
  ];

  // fetch books from backend, else fallback
  useEffect(() => {
    fetch("http://localhost:5000/books?limit=20")
      .then((res) => res.json())
      .then((data) => setBooks(data))
      .catch(() => setBooks(fallbackBooks));
  }, []);

  return (
    <div className="min-h-screen bg-[#F5EFE6] p-10">

      {/* NAVBAR */}
      <nav className="bg-[#E8DFCA] shadow-md px-8 py-4 flex justify-between items-center rounded-2xl mb-12 border border-[#D8CDBA]">

        {/* LOGO */}
        <h1 className="text-3xl font-bold text-[#6F4E37] tracking-wide">
          📚 BeigeReads
        </h1>

        {/* SEARCH */}
        <div className="flex items-center bg-white px-4 py-2 rounded-xl shadow-sm w-full max-w-md mx-6 border border-[#D8CDBA]">
          <input
            type="text"
            placeholder="Search books..."
            className="w-full bg-transparent outline-none text-[#6F4E37]"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* LINKS */}
        <div className="space-x-6 text-lg">
          <Link to="/" className="text-[#6F4E37] hover:text-black">Home</Link>
          <Link to="/signup" className="text-[#6F4E37] hover:text-black">Signup</Link>
          <Link to="/login" className="text-[#6F4E37] hover:text-black">Login</Link>
          <Link to="/profile" className="text-[#6F4E37] hover:text-black">Profile</Link>
        </div>
      </nav>

      {/* TITLE */}
      <h2 className="text-4xl font-bold text-[#6F4E37] mb-8">
        Explore Our Cozy Book Collection ☕📖
      </h2>

      {/* BOOK GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
        {books
          .filter((b) =>
            b.title?.toLowerCase().includes(search.toLowerCase()) ||
            b.author?.toLowerCase().includes(search.toLowerCase())
          )
          .map((book) => (
            <div
              key={book.id || book._id}
              className="bg-[#FAF6F0] border border-[#E3DCCE] rounded-3xl p-6 shadow-md hover:shadow-xl transition-all hover:-translate-y-1"
            >
              <h3 className="text-xl font-bold text-[#6F4E37] mb-2">
                {book.title}
              </h3>
              <p className="text-[#8C6E54]">✍ {book.author}</p>
              <p className="text-[#A18D7A] text-sm mt-1">
                {book.genre || "Fiction"}
              </p>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Home;
