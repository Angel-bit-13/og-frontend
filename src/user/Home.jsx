import { useEffect, useState } from "react";
import axios from "axios";
import BookCard from "../components/BookCard";

const Home = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const load = async () => {
      const res = await axios.get("http://localhost:5000/books/random");
      setBooks(res.data);
    };
    load();
  }, []);

  return (
    <div className="px-6 py-10">
      <h1 className="text-3xl font-bold mb-6">Newest Books</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {books.map((b) => (
          <BookCard key={b._id} book={b} />
        ))}
      </div>
    </div>
  );
};

export default Home;
