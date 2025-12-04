import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const BookDetails = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/books/${id}`)
      .then((res) => res.json())
      .then((data) => setBook(data));
  }, [id]);

  if (!book) return <p className="text-center mt-20">Loading…</p>;

  return (
    <div className="min-h-screen bg-[#f7f6f9] p-10 flex justify-center">
      <div className="bg-white shadow-lg p-10 rounded-3xl w-full max-w-3xl">

        <h1 className="text-4xl font-bold mb-4 text-purple-700">
          {book.title}
        </h1>

        <p className="text-gray-700 text-xl mb-2">✍ {book.author}</p>
        <p className="text-gray-600">Genre: {book.genre}</p>
        <p className="text-gray-600">Published: {book.publicationYear}</p>
        <p className="text-gray-600">ISBN: {book.isbn}</p>

        <p
          className={`mt-6 text-xl font-bold ${
            book.isRented ? "text-red-500" : "text-green-500"
          }`}
        >
          Status: {book.isRented ? "Rented" : "Available"}
        </p>

        <button className="mt-6 w-full bg-purple-600 text-white py-3 rounded-xl hover:bg-purple-700">
          Request Rental
        </button>
      </div>
    </div>
  );
};

export default BookDetails;
