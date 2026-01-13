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
    date
      ? new Date(date).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "-";

  const activeRentals = rentals.filter((r) => r.status === "active");

  return (
    <div className="min-h-screen bg-[#020617] p-10 flex flex-col items-center">
      <h1 className="text-4xl font-extrabold text-blue-400 mb-10 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]">
        Book Rentals
      </h1>

      <div className="w-full max-w-4xl bg-[#020b2d]/80 backdrop-blur-xl rounded-3xl border border-blue-900/40 shadow-[0_0_50px_rgba(59,130,246,0.4)] p-6">
        {activeRentals.length === 0 ? (
          <p className="text-center text-blue-300 py-10 text-lg">
            No active rentals found
          </p>
        ) : (
          activeRentals.map((r) => (
            <div
              key={r._id}
              className="bg-[#020b2d]/60 backdrop-blur-sm border border-blue-900/30 rounded-2xl p-5 mb-5 last:mb-0 
                         shadow-[0_0_15px_rgba(59,130,246,0.2)]
                         hover:shadow-[0_0_25px_rgba(59,130,246,0.5)] transition"
            >
              <div className="space-y-2 text-blue-200">
                <p>
                  <span className="font-semibold text-blue-300">Book:</span>{" "}
                  {r.book?.title || "N/A"}
                </p>
                <p>
                  <span className="font-semibold text-blue-300">User:</span>{" "}
                  {r.user?.name || "N/A"}
                </p>
                <p>
                  <span className="font-semibold text-blue-300">Rented On:</span>{" "}
                  {formatDate(r.rentedAt)}
                </p>
                <p>
                  <span className="font-semibold text-blue-300">Due Date:</span>{" "}
                  {formatDate(r.expiresAt)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
