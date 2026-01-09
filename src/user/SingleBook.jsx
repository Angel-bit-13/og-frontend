import { useParams,Link } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../api/axios";
import { FaUser, FaTag, FaCalendarAlt, FaBook, FaStar, FaThumbsUp, FaThumbsDown } from "react-icons/fa";
import { motion } from "framer-motion";

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
      console.error(err);
      setError("Failed to load book. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getUser = async () => {
    if (!token) return;
    try {
      const res = await API.get("/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
      localStorage.setItem("userId", res.data._id);
    } catch (err) {
      console.error(err);
    }
  };
useEffect(() => {
  const loadData = async () => {
    if (token) {
      await getUser();
    }
    await getBook();
  };
  loadData();
}, []);


  const handleLike = async () => {
    if (!token) return alert("Please login first!");
    try {
      await API.post(`/books/like/${id}`);
      setLiked(true);
      setDisliked(false);
      getBook();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUnlike = async () => {
    if (!token) return alert("Please login first!");
    try {
      await API.post(`/books/dislike/${id}`);
      setDisliked(true);
      setLiked(false);
      getBook();
    } catch (err) {
      console.error(err);
    }
  };

 const submitComment = async () => {
  if (!newComment.trim()) return;

  try {
    const res = await API.post(`/books/comment/${id}`, {
      text: newComment,
    });
    setComments([...comments, res.data]);
    setNewComment("");
  } catch (err) {
    console.error("Comment failed:", err.response?.data);
  }
};
  const submitRating = async (value) => {
  try {
    const res = await API.post(`/books/rate/${id}`, {
      rating: Number(value),
    });
    setRating(res.data.averageRating);
  } catch (err) {
    console.error("Rating failed:", err.response?.data);
  }
};


  const rentBook = async () => {
    if (!token) return alert("Please login first!");
    try {
      await API.post(`/books/rent/${id}`, {}, { headers: { Authorization: `Bearer ${token}` } });
      alert("Book rented successfully!");
      getBook();
    } catch (err) {
      console.error(err);
      alert("Failed to rent book");
    }
  };

  const returnBook = async () => {
    if (!token) return alert("Please login first!");
    try {
      await API.post(`/books/return/${id}`, {}, { headers: { Authorization: `Bearer ${token}` } });
      alert("Book returned successfully!");
      getBook();
    } catch (err) {
      console.error(err);
      alert("Failed to return book");
    }
  };

  if (loading) return <p className="text-center mt-20 text-lg">Loading book...</p>;
  if (error) return <p className="text-center mt-20 text-lg text-red-600">{error}</p>;
  if (!book) return <p className="text-center mt-20 text-lg">Book not found</p>;

  const isRented = book.status === "rented";
  const userId = localStorage.getItem("userId");

  const isMyRental =
  isRented &&
  (
    book.rentedBy === userId ||
    book.currentRental?.user === userId
  );

return (
  <div className="min-h-screen bg-gradient-to-br from-[#2a57cb] via-[#08142e] to-[#112684] p-6 text-white">

    {/* NAVBAR */}
    <nav className="bg-[#0b1635]/80 backdrop-blur-xl shadow-[0_0_30px_rgba(59,130,246,0.25)]
                    px-8 py-4 flex justify-between items-center rounded-2xl mb-12
                    border border-blue-900/40">
      <h1 className="text-3xl font-bold tracking-wide text-blue-400">
        BeigeReads
      </h1>

      <div className="space-x-6 text-lg">
        <Link to="/home" className="text-blue-200 hover:text-blue-400 transition">
          Home
        </Link>
        <Link to="/profile" className="text-blue-200 hover:text-blue-400 transition">
          Profile
        </Link>
        <Link to="/login" className="text-blue-200 hover:text-red-400 transition">
          Logout
        </Link>
      </div>
    </nav>

    <div className="flex justify-center">
      <div className="bg-[#0a1228]/80 backdrop-blur-xl
                      shadow-[0_0_60px_rgba(59,130,246,0.25)]
                      rounded-3xl p-10 max-w-4xl w-full
                      border border-blue-900/40
                      flex flex-col items-center gap-10">

        <h1 className="text-5xl md:text-6xl font-bold text-center
                       text-blue-300 drop-shadow-[0_0_20px_rgba(59,130,246,0.6)]
                       tracking-wide">
          {book.title}
        </h1>

        <div className="flex flex-col md:flex-row gap-10 w-full">
          <div className="shrink-0">
            {book.coverImage ? (
              <img
                src={book.coverImage}
                alt={book.title}
                className="w-64 h-96 object-cover rounded-xl
                           shadow-[0_0_40px_rgba(59,130,246,0.35)]"
              />
            ) : (
              <div className="w-64 h-96 flex items-center justify-center
                              bg-[#0f1b3d] rounded-xl text-blue-300">
                No Image
              </div>
            )}
          </div>

          <div className="flex-1">
            <div className="bg-[#0b1635]/70 backdrop-blur-xl
                            p-6 rounded-xl
                            shadow-[inset_0_0_25px_rgba(59,130,246,0.2)]
                            border border-blue-900/40">
              <table className="w-full">
                <tbody className="divide-y divide-blue-900/40">
                  <tr><th className="px-4 py-3 text-blue-300">Author</th><td className="px-4 py-3">{book.author}</td></tr>
                  <tr><th className="px-4 py-3 text-blue-300">Genre</th><td className="px-4 py-3">{book.genre}</td></tr>
                  <tr><th className="px-4 py-3 text-blue-300">Publication Year</th><td className="px-4 py-3">{book.publicationYear}</td></tr>
                  <tr><th className="px-4 py-3 text-blue-300">ISBN</th><td className="px-4 py-3">{book.ISBN}</td></tr>
                  <tr>
                    <th className="px-4 py-3 text-blue-300">Status</th>
                    <td className="px-4 py-3">
                      <span className={`px-4 py-1 rounded-full font-semibold
                        ${isRented
                          ? "bg-red-500/20 text-red-400"
                          : "bg-green-500/20 text-green-400"}`}>
                        {isRented ? "Currently Rented" : "Available"}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>

              <div className="mt-6 flex flex-wrap items-center gap-4">
                {[1,2,3,4,5].map(star => (
                  <FaStar
                    key={star}
                    size={28}
                    className={`cursor-pointer transition
                      ${(hoverRating || rating) >= star
                        ? "text-yellow-400 drop-shadow-[0_0_10px_rgba(59,130,246,0.9)]"
                        : "text-blue-900"}`}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => submitRating(star)}
                  />
                ))}
                <span className="font-semibold text-blue-300">
                  {rating.toFixed(1)}/5
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* COMMENTS */}
        <div className="w-full bg-[#0b1635]/70 backdrop-blur-xl
                        p-6 rounded-2xl border border-blue-900/40">
          <h2 className="text-2xl font-bold text-blue-300 mb-4">Comments</h2>

          <div className="flex flex-col gap-4 max-h-64 overflow-y-auto">
            {comments.length === 0 && (
              <p className="text-blue-400/60">No comments yet.</p>
            )}

            {comments.map((c, i) => (
              <div key={i}
                   className="p-4 rounded-xl bg-[#08122b]
                              border border-blue-900/40">
                <p>{c.text}</p>
                <span className="text-sm text-blue-400 block mt-1">
                  — {c.userName || "Anonymous"}
                </span>
              </div>
            ))}
          </div>

          {token && (
            <div className="mt-4 flex gap-2">
              <input
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 p-3 rounded-xl bg-[#020617]
                           border border-blue-900/50
                           text-white placeholder-blue-400
                           focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <button
                onClick={submitComment}
                className="px-6 rounded-xl bg-blue-600 hover:bg-blue-700 transition">
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
