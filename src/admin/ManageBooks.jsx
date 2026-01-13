import { useEffect, useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function ManageBooks() {
  const [books, setBooks] = useState([]);
  const navigate = useNavigate();

  const fetchBooks = async () => {
    try {
      const res = await API.get("/admin/books");
      setBooks(res.data);
    } catch (err) {
      console.log("Error fetching books:", err);
    }
  };

  const deleteBook = async (id) => {
    try {
      await API.delete(`/admin/books/${id}`);
      setBooks((prev) => prev.filter((b) => b._id !== id));
    } catch (err) {
      console.log("Error removing book:", err);
    }
  };

  const toggleStatus = async (book) => {
    try {
      const newStatus = book.status === "available" ? "rented" : "available";
      await API.put(`/admin/books/${book._id}`, { status: newStatus });
      setBooks((prev) =>
        prev.map((b) =>
          b._id === book._id ? { ...b, status: newStatus } : b
        )
      );
    } catch (err) {
      console.log("Error updating status:", err);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <div className="min-h-screen bg-[#020617] p-10">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-extrabold text-blue-400 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]">
          Manage Books
        </h1>

        <button
          onClick={() => navigate("/admin/books/add")}
          className="px-6 py-3 rounded-full
                     bg-gradient-to-r from-blue-600 to-blue-500
                     text-white font-bold
                     shadow-[0_0_25px_rgba(59,130,246,0.6)]
                     hover:shadow-[0_0_40px_rgba(59,130,246,0.9)]
                     hover:from-blue-500 hover:to-blue-400
                     transition-all duration-300"
        >
          + Add Book
        </button>
      </div>

      {/* Books Container */}
      <div
        className="max-w-5xl mx-auto
                   bg-[#020b2d]/80 backdrop-blur-xl
                   border border-blue-900/40
                   rounded-3xl shadow-[0_0_50px_rgba(59,130,246,0.35)]
                   p-6"
      >
        {books.length === 0 ? (
          <p className="text-center text-blue-300 py-10 text-lg">
            No books found
          </p>
        ) : (
          books.map((book) => (
            <div
              key={book._id}
              className="flex justify-between items-center
                         bg-[#020b2d]/60 backdrop-blur-sm
                         border border-blue-900/30
                         rounded-2xl p-5 mb-4 last:mb-0
                         shadow-[0_0_15px_rgba(59,130,246,0.2)]
                         hover:shadow-[0_0_30px_rgba(59,130,246,0.5)]
                         transition"
            >
              {/* Book Info */}
              <div>
                <h2 className="text-lg font-semibold text-blue-200">
                  {book.title}
                </h2>
                <p className="text-blue-300 text-sm">{book.author}</p>

                <span
                  className={`inline-block mt-3 px-4 py-1 text-sm rounded-full font-semibold ${
                    book.status === "available"
                      ? "bg-green-500/20 text-green-400 border border-green-400/40"
                      : "bg-red-500/20 text-red-400 border border-red-400/40"
                  }`}
                >
                  {book.status}
                </span>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => toggleStatus(book)}
                  className="px-4 py-2 rounded-full
                             bg-blue-600/20 text-blue-300
                             border border-blue-500/40
                             hover:bg-blue-600/40 hover:text-white
                             transition"
                >
                  Toggle Status
                </button>

                <button
                  onClick={() => deleteBook(book._id)}
                  className="px-4 py-2 rounded-full
                             bg-red-600/20 text-red-400
                             border border-red-500/40
                             hover:bg-red-600/40 hover:text-white
                             transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
