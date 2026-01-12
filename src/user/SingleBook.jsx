import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../api/axios";
import {
  FaUser,
  FaTag,
  FaCalendarAlt,
  FaBook,
  FaStar,
  FaThumbsUp,
  FaThumbsDown,
} from "react-icons/fa";

function SingleBook() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [user, setUser] = useState(null);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  const getBook = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/books/${id}`);
      setBook(res.data);
      setComments(res.data.comments || []);
      setRating(res.data.averageRating || 0);

      if (token) {
        const userId = localStorage.getItem("userId");
        setLiked(res.data.likes?.some(id => id.toString() === userId) || false);
        setDisliked(res.data.dislikes?.some(id => id.toString() === userId) || false);
      }
      setError("");
    } catch (err) {
      setError("Failed to load book.");
    } finally {
      setLoading(false);
    }
  };

  const getUser = async () => {
    if (!token) return;
    const res = await API.get("/users/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setUser(res.data);
    localStorage.setItem("userId", res.data._id);
  };

  useEffect(() => {
    const load = async () => {
      if (token) await getUser();
      await getBook();
    };
    load();
  }, []);

  const handleLike = async () => {
    if (!token) return alert("Login first");
    await API.post(`/books/like/${id}`);
    setLiked(true);
    setDisliked(false);
    getBook();
  };

  const handleUnlike = async () => {
    if (!token) return alert("Login first");
    await API.post(`/books/dislike/${id}`);
    setDisliked(true);
    setLiked(false);
    getBook();
  };

  const submitComment = async () => {
    if (!newComment.trim()) return;
    const res = await API.post(`/books/comment/${id}`, { text: newComment });
    setComments([...comments, res.data]);
    setNewComment("");
  };

  const submitRating = async (value) => {
    const res = await API.post(`/books/rate/${id}`, { rating: value });
    setRating(res.data.averageRating);
  };

  const rentBook = async () => {
    if (!token) return alert("Login first");
    await API.post(`/books/rent/${id}`);
    alert("Book rented!");
    getBook();
  };

  const returnBook = async () => {
    if (!token) return alert("Login first");
    await API.post(`/books/return/${id}`);
    alert("Book returned!");
    getBook();
  };

  if (loading) return <p className="text-center mt-20 text-blue-200">Loading...</p>;
  if (error) return <p className="text-center mt-20 text-red-400">{error}</p>;
  if (!book) return null;

  const isRented = book.status === "rented";
  const userId = localStorage.getItem("userId");
  const isMyRental =
    isRented &&
    (book.rentedBy === userId || book.currentRental?.user === userId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b1220] to-[#0e1628] p-6">

      {/* NAVBAR */}
      <nav className="bg-[#101a30] border border-[#1e2a4a] shadow-[0_0_20px_#2563eb55] px-8 py-4 flex justify-between items-center rounded-2xl mb-12">
        <div className="flex items-center gap-4">
           <svg
          width="60"
          height="60"
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-[0_0_15px_rgba(59,130,246,0.6)]"
        >
          <path d="M10 14 L30 10 L30 54 L10 50 Z" fill="#1e3a8a" />
          <path d="M54 14 L34 10 L34 54 L54 50 Z" fill="#2563eb" />
          <rect x="30" y="10" width="4" height="44" fill="#60a5fa" rx="1" />
        </svg>
          <h1 className="text-3xl font-bold text-blue-300 tracking-wide">
            NeonReads
          </h1>
        </div>
        <div className="space-x-6 text-lg">
          <Link to="/home" className="text-blue-200 hover:text-white">Home</Link>
          <Link to="/profile" className="text-blue-200 hover:text-white">Profile</Link>
        </div>
      </nav>

      {/* CONTENT */}
      <div className="flex justify-center">
        <div className="bg-[#101a30] shadow-[0_0_40px_#2563eb55] rounded-3xl p-10 max-w-4xl w-full flex flex-col items-center gap-10 border border-[#1e2a4a]">

          <h1 className="text-5xl font-bold text-blue-300 drop-shadow-[0_0_15px_#3b82f6]">
            {book.title}
          </h1>

          <div className="flex flex-col md:flex-row gap-10 w-full">
            {book.coverImage && (
              <img
                src={book.coverImage}
                alt={book.title}
                className="w-64 h-96 object-cover rounded-xl shadow-[0_0_25px_#2563eb88]"
              />
            )}

            <div className="flex-1 bg-[#0e1628] p-6 rounded-xl border border-[#1e2a4a]">
              <table className="w-full text-blue-200">
                <tbody className="divide-y divide-[#1e2a4a]">
                  <tr><th className="px-4 py-3 flex items-center gap-2 font-semibold"><FaUser /> Author</th><td className="px-4 py-3">{book.author}</td></tr>
                   <tr><th className="px-4 py-3 flex items-center gap-2 font-semibold"><FaTag /> Genre</th><td className="px-4 py-3">{book.genre}</td></tr>
                  <tr><th className="px-4 py-3 flex items-center gap-2 font-semibold"><FaCalendarAlt /> Year</th><td className="px-4 py-3">{book.publicationYear}</td></tr>
                  <tr><th className="px-4 py-3 flex items-center gap-2 font-semibold"><FaBook /> ISBN</th><td className="px-4 py-3">{book.ISBN}</td></tr>
                   <tr><th className="px-4 py-3  flex items-center gap-2 font-semibold">Status</th>
                      <td>
                        <span className={`px-3 py-1 ml-3 rounded-full font-semibold ${isRented ? "bg-red-200 text-red-800" : "bg-green-200 text-green-800"}`}>
                          {isRented ? "Currently Rented" : "Available"}
                        </span>
                      </td>
                    </tr>
                </tbody>
              </table>

              <div className="mt-6 ml-4 flex items-center gap-4 flex-wrap">
                {[1,2,3,4,5].map(star => (
                  <FaStar
                    key={star}
                    size={26}
                    className={`cursor-pointer ${
                      (hoverRating || rating) >= star
                        ? "text-yellow-400 drop-shadow-[0_0_6px_#3b82f6]"
                        : "text-gray-600"
                    }`}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => submitRating(star)}
                  />
                ))}
                 <span className="ml-2 text-blue-200 font-semibold">{rating.toFixed(1)}/5</span>

              </div>

              <div className="ml-4 mt-6 flex gap-2 items-center flex-wrap">
                <button onClick={handleLike} className={`text-white p-3 rounded-full transition ${liked ?  "bg-blue-800 hover:bg-blue-600" : "bg-blue-400 hover:bg-blue-600"}`}>
                  <FaThumbsUp />
                </button>
                <button onClick={handleUnlike} className={`text-white p-3 rounded-full transition ${disliked ?  "bg-blue-800 hover:bg-blue-600" : "bg-blue-400 hover:bg-blue-600"}`}>
                  <FaThumbsDown />
                </button>

                {!isRented && (
                  <button onClick={rentBook} className="px-4 py-2 ml-6 rounded-md bg-green-600 text-white hover:bg-green-700 transition">
                    Rent
                  </button>
                )}
                {isMyRental && (
                  <button onClick={returnBook} className="px-4 py-2 ml-6 rounded-md bg-red-600 text-white hover:bg-red-700 transition">
                    Return
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* COMMENTS */}
          <div className="w-full bg-[#0e1628] p-6 rounded-2xl border border-[#1e2a4a]">
            <h2 className="text-2xl font-bold text-blue-300 mb-4">Comments</h2>

            {comments.map((c, i) => (
              <div key={i} className="bg-[#101a30] p-3 rounded-lg mb-2 border border-[#1e2a4a]">
                <p className="text-blue-200">{c.text}</p>
              </div>
            ))}

            {token && (
              <div className="mt-4 flex gap-2">
                <input
                  value={newComment}
                  onChange={e => setNewComment(e.target.value)}
                  className="flex-1 bg-[#101a30] border border-[#1e2a4a] p-3 rounded-xl text-blue-200"
                  placeholder="Add comment..."
                />
                <button onClick={submitComment} className="px-4 bg-blue-600 rounded-xl">
                  Send
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

export default SingleBook;
