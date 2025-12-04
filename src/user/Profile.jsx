import React from "react";

const Profile = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-10 flex justify-center">
      <div className="bg-white shadow-xl p-8 rounded-3xl w-full max-w-2xl">

        <h2 className="text-3xl font-semibold mb-6 text-gray-800">My Profile</h2>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Name"
            className="w-full border p-3 rounded-xl"
          />
          <input
            type="text"
            placeholder="Place"
            className="w-full border p-3 rounded-xl"
          />
          <input
            type="text"
            placeholder="Age"
            className="w-full border p-3 rounded-xl"
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full border p-3 rounded-xl"
          />

          <button className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700">
            Update Profile
          </button>

          <p className="text-gray-700 font-semibold mt-3">
            📘 Books Rented: <span className="text-blue-600">3</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
