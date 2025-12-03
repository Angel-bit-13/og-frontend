import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const SingleBook = () => {
  const { id } = useParams();
  const { token } = useContext(AuthContext);
  const [book, setBook] = useState(null);

  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    const load = async () => {
      const res = await axios.get(`http://localhost:5000/books/${id}`);
      setBook(res.data);
    };
    load();
  }, []);

  const likeBook = async () => {
    await axios.post("http://localhost:5000/books/like", { bookId: id }, { headers });
    alert("Liked!");
  };

  const rentBook = async () => {
    await axios.post("http://localhost:5000/rent", { bookId: id }, { headers });
    alert("Rental request sent!");
  };

  if (!book) return <div>Loading...</div>;

  return (
    <div className="px-6 py-10">
      <h1 className="text-4xl font-bold mb-4">{book.title}</h1>
      <p className="text-gray-600 mb-2">Author: {book.author}</p>
      <p className="text-gray-600 mb-2">Genre: {book.genre}</p>
      <p className="text-gray-600 mb-2">ISBN: {book.isbn}</p>
      <p className="text-gray-600 mb-2">Year: {book.publicationYear}</p>

      <p className="mt-4 text-lg font-bold">
        Status:
        <span
          className={`ml-2 ${
            book.status === "available" ? "text-green-600" : "text-red-600"
          }`}
        >
          {book.status}
        </span>
      </p>

      <div className="flex gap-4 mt-6">
        <button
          onClick={likeBook}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Like
        </button>

        <button
          onClick={rentBook}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Rent
        </button>
      </div>
    </div>
  );
};

export default SingleBook;
