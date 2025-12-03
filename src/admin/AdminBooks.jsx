import { useEffect, useState } from "react";
import axios from "axios";

const AdminBooks = () => {
  const [books, setBooks] = useState([]);

  const load = async () => {
    const res = await axios.get("http://localhost:5000/books");
    setBooks(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  const toggleStatus = async (id) => {
    await axios.put(`http://localhost:5000/admin/book-status/${id}`);
    load();
  };

  return (
    <div className="px-6 py-10">
      <h1 className="text-3xl font-bold mb-4">Manage Books</h1>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">Title</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Action</th>
          </tr>
        </thead>
        <tbody>
          {books.map((b) => (
            <tr key={b._id}>
              <td className="p-2 border">{b.title}</td>
              <td className="p-2 border">{b.status}</td>
              <td className="p-2 border">
                <button
                  onClick={() => toggleStatus(b._id)}
                  className="px-3 py-1 bg-blue-600 text-white rounded"
                >
                  Toggle Status
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
};

export default AdminBooks;
