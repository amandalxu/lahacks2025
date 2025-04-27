// src/pages/Login.jsx
import { auth, provider, signInWithPopup } from "../firebase";
import { useState } from "react";
import { useNavigate } from "react-router-dom"; // 🛣 import navigate

export default function Login() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate(); // 🔥 create navigate function

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
      console.log("Logged in as:", result.user.displayName);
      navigate("/profile", { state: { username: result.user.displayName } }); // 👈 pass username via state
    } catch (error) {
      console.error("Error during login:", error);
    }
  };
  

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Login to Your App</h1>
      {!user ? (
        <button
          onClick={handleLogin}
          className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-600 transition"
        >
          Sign in with Google
        </button>
      ) : (
        <div className="text-center">
          <p className="text-lg mb-4">Welcome, {user.displayName}!</p>
          <img
            src={user.photoURL}
            alt="Profile"
            className="w-20 h-20 rounded-full mx-auto"
          />
        </div>
      )}
    </div>
  );
}
