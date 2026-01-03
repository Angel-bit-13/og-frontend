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
      setBooks(defaultBooks);
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
        prev.map((b) => (b._id === book._id ? { ...b, status: newStatus } : b))
      );
    } catch (err) {
      console.log("Error updating status:", err);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <div className="p-10 bg-[#F5EFE6] min-h-screen">
      {/* Header + Add Book Button */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-[#6F4E37]">Manage Books</h1>

        <button
          onClick={() => navigate("/admin/books/add")}
          className="px-5 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition"
        >
          + Add Book
        </button>
      </div>
      <div className="bg-white shadow rounded-lg p-5 border border-[#E3DCCE]">
        {books.map((book) => (
          <div
            key={book._id}
            className="border-b py-3 flex justify-between items-center last:border-b-0"
          >
            <div>
              <h2 className="font-semibold text-[#6F4E37]">{book.title}</h2>
              <p className="text-[#8C6E54]">{book.author}</p>
              <p>
                Status: <span className="font-bold">{book.status}</span>
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => toggleStatus(book)}
                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
              >
                Toggle Status
              </button>

              <button
                onClick={() => deleteBook(book._id)}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}