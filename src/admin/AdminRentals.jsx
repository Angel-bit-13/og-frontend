import { useEffect, useState } from "react";
import API from "../api/axios";

export default function AdminRentals() {
  const [rentals, setRentals] = useState([]);

  const fetchRentals = async () => {
    try {
      const res = await API.get("/rentals");
      setRentals(res.data);
    } catch (err) {
      console.log("Error fetching rentals:", err);
    }
  };
  useEffect(() => {
    fetchRentals();
  }, []);

  const formatDate = (date) =>
    date ? new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }) : "-";

  return (
    <div className="p-10 bg-[#F5EFE6] min-h-screen">
      <h1 className="text-3xl font-bold text-[#6F4E37] mb-4">Book Rentals</h1>

      <div className="bg-white shadow rounded-lg p-5">
        {rentals.map((r) => (
          <div
            key={r._id}
            className="border-b py-3 flex justify-between items-center"
          >
            <div>
              <p><strong>Book:</strong> {r.book?.title}</p>
              <p><strong>User:</strong> {r.user?.name}</p>
              <p><strong>Status:</strong> {r.status}</p>
              <p><strong>Rented On:</strong> {formatDate(r.rentedAt)}</p>
              {r.status === "active" && (
                <p><strong>Due Date:</strong> {formatDate(r.expiresAt)}</p>
              )}
              {r.status === "returned" && (
                <p><strong>Returned On:</strong> {formatDate(r.returnedAt)}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
