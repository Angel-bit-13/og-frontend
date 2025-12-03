import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { userRole, logout } = useContext(AuthContext);

  return (
    <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold">📚 Bookstore</Link>

      <div className="flex gap-6">

        <Link to="/" className="hover:underline">Home</Link>

        {userRole === "user" && (
          <>
            <Link to="/books" className="hover:underline">Books</Link>
            <Link to="/profile" className="hover:underline">Profile</Link>
          </>
        )}

        {userRole === "admin" && (
          <Link to="/admin" className="hover:underline">Admin</Link>
        )}

        {!userRole && (
          <>
            <Link to="/login" className="hover:underline">Login</Link>
            <Link to="/signup" className="hover:underline">Signup</Link>
          </>
        )}

        {userRole && (
          <button
            onClick={logout}
            className="bg-red-500 px-4 py-1 rounded hover:bg-red-600"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
