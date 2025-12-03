import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const Profile = () => {
  const { token } = useContext(AuthContext);
  const [user, setUser] = useState(null);
  const [rented, setRented] = useState(0);

  useEffect(() => {
    const load = async () => {
      const res = await axios.get("http://localhost:5000/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data.user);
      setRented(res.data.rentedCount);
    };
    load();
  }, []);

  if (!user) return <div>Loading...</div>;

  return (
    <div className="px-6 py-10 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">My Profile</h1>

      <div className="space-y-3">
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Place:</strong> {user.place}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Phone:</strong> {user.phone}</p>
        <p><strong>Books Rented:</strong> {rented}</p>
      </div>
    </div>
  );
};

export default Profile;
