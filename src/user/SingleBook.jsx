import { useParams,Link } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../api/axios";
import { FaUser, FaTag, FaCalendarAlt, FaBook, FaStar, FaThumbsUp, FaThumbsDown } from "react-icons/fa";

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
   
  <div className="min-h-screen bg-[#f5ede0] p-6">

    {/* NAVBAR — FULL WIDTH AT TOP */}
    <nav className="bg-[#E8DFCA] shadow-md px-8 py-4 flex justify-between items-center rounded-2xl mb-12 border border-[#D8CDBA]">
      <h1 className="text-3xl font-bold text-[#6F4E37] tracking-wide">
        📚 BeigeReads
      </h1>

      <div className="space-x-6 text-lg">
        <Link to="/home" className="text-[#6F4E37] hover:text-black">
          Home
        </Link>

        <Link to="/profile" className="text-[#6F4E37] hover:text-black">
          Profile
        </Link>

        <Link to="/login" className="text-[#6F4E37] hover:text-black">
          Logout
        </Link>
      </div>
    </nav>

    {/* CENTER ONLY THE BOOK CONTENT */}
    <div className="flex justify-center">
      
    


      <div className="bg-[#fff8f0] shadow-2xl rounded-3xl p-10 max-w-4xl w-full flex flex-col items-center gap-10 border border-[#e6dcc7]">

        <h1 className="text-5xl md:text-6xl font-bold text-center text-[#6f4e37] drop-shadow-lg tracking-wide" style={{ fontFamily: "'Dancing Script', cursive" }}>
          {book.title}
        </h1>

        <div className="flex flex-col md:flex-row items-center md:items-start gap-10 w-full">
          <div className="shrink-0">
            {book.coverImage ? (
              <img src={book.coverImage} alt={book.title} className="w-64 h-96 object-cover rounded-xl shadow-lg" />
            ) : (
              <div className="w-64 h-96 flex items-center justify-center bg-[#d6c4a0] rounded-xl shadow-lg text-gray-500">
                No Image
              </div>
            )}
          </div>

          <div className="flex-1 w-full">
            <div className="bg-[#f7eee1] p-6 rounded-xl shadow-inner border border-[#e6dcc7]">
              <table className="w-full table-auto">
                <tbody className="divide-y divide-[#e6dcc7] text-[#6f4e37]">
                  <tr className="bg-[#fff4e0]"><th className="px-4 py-3 flex items-center gap-2 font-semibold w-1/3"><FaUser /> Author</th><td className="px-4 py-3">{book.author}</td></tr>
                  <tr><th className="px-4 py-3 flex items-center gap-2 font-semibold bg-[#fff4e0]"><FaTag /> Genre</th><td className="px-4 py-3">{book.genre}</td></tr>
                  <tr className="bg-[#fff4e0]"><th className="px-4 py-3 flex items-center gap-2 font-semibold"><FaCalendarAlt /> Publication Year</th><td className="px-4 py-3">{book.publicationYear}</td></tr>
                  <tr><th className="px-4 py-3 flex items-center gap-2 font-semibold bg-[#fff4e0]"><FaBook /> ISBN</th><td className="px-4 py-3">{book.ISBN}</td></tr>
                  <tr className="bg-[#fff4e0]"><th className="px-4 py-3 font-semibold">Status</th>
                    <td className="px-4 py-3">
                      <span className={`px-3 py-1 rounded-full font-semibold ${isRented ? "bg-red-200 text-red-800" : "bg-green-200 text-green-800"}`}>
                        {isRented ? "Currently Rented" : "Available"}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>

              <div className="mt-6 flex items-center gap-4 flex-wrap">
                {[1,2,3,4,5].map((star) => (
                  <FaStar key={star} size={28} className={`cursor-pointer transition ${(hoverRating || rating) >= star ? "text-yellow-500" : "text-gray-300"}`} 
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => submitRating(star)}
                  />
                ))}
                <span className="ml-2 text-[#6f4e37] font-semibold">{rating.toFixed(1)}/5</span>

                {token && (
                  <div className="ml-6 flex gap-2 items-center flex-wrap">
                    <button onClick={handleLike} className={`text-white p-3 rounded-full transition ${liked ?  "bg-[#5a3e1b]" : "bg-[#c1a074] hover:bg-[#8c5f2c]" }`}><FaThumbsUp /></button>
                    <button onClick={handleUnlike} className={`text-white p-3 rounded-full transition ${disliked ? "bg-[#5a3e1b]" : "bg-[#c1a074] hover:bg-[#8c5f2c]"}`}><FaThumbsDown /></button>
                    {!isRented && (
                    <button
                      onClick={rentBook}
                      className="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 transition"
                    >
                      Rent
                    </button>
                  )}

                  {isMyRental && (
                    <button
                      onClick={returnBook}
                      className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition"
                    >
                      Return
                    </button>
                  )}

                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="w-full bg-[#f7eee1] p-6 rounded-2xl shadow-inner border border-[#e6dcc7]">
          <h2 className="text-2xl font-bold text-[#6f4e37] mb-4">Comments</h2>
          <div className="flex flex-col gap-4 max-h-64 overflow-y-auto">
            {comments.length === 0 && <p className="text-[#6f4e37]">No comments yet.</p>}
            {comments.map((c, index) => (
              <div key={index} className="p-3 bg-[#fff4e0] rounded-xl border border-[#e6dcc7]">
                <p className="text-[#6f4e37]">{c.text}</p>
                <span className="text-sm text-[#8C6E54] mt-1 block">— {c.userName || "Anonymous"}</span>
              </div>
            ))}
          </div>
          {token && (
            <div className="mt-4 flex gap-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 p-3 rounded-xl border border-[#e6dcc7] outline-none bg-[#fff4e0] placeholder-[#a3886c] text-[#6f4e37]"
              />
             <button onClick={submitComment}>Submit</button>

            </div>
          )}
        </div>
</div>
      </div>
    </div>
  );
}

export default SingleBook;
