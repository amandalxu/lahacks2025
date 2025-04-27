import React from 'react';
import { useNavigate } from 'react-router-dom';

function Navbar({ username }) {
  const navigate = useNavigate();

  return (
    <nav className="bg-white text-blue-600 p-4 shadow-md border-b border-gray-200 relative z-20">
      <div className="max-w-4xl mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold">CHIPS TO SPARE</h1>
        </div>
        <div className="flex items-center">
          {username && <span className="hidden md:inline font-bold mr-6">Welcome, {username}</span>}
          <button
            onClick={() => navigate("/Profile", { state: { username } })}
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-200"
          >
            Profile
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;