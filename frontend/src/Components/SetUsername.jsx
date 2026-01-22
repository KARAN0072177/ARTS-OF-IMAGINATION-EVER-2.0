import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function SetUsername() {
  const location = useLocation();
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);
  const [loginMethod, setLoginMethod] = useState(null);
  const [username, setUsername] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const googleId = queryParams.get("googleId");
    const githubId = queryParams.get("githubId");
    const discordId = queryParams.get("discordId");

    if (googleId) {
      setUserId(googleId);
      setLoginMethod("google");
    } else if (githubId) {
      setUserId(githubId);
      setLoginMethod("github");
    } else if (discordId) {
      setUserId(discordId);
      setLoginMethod("discord");
    } else {
      setError("User ID not found. Please try logging in again.");
    }
  }, [location]);

  const handleUsernameSubmit = async () => {
    if (!username.trim()) {
      setError("Username cannot be empty.");
      return;
    }
    if (!userId || !loginMethod) {
      setError("User ID is missing. Please log in again.");
      return;
    }

    let requestBody = { username };
    let endpoint = "";

    if (loginMethod === "google") {
      requestBody.googleId = userId;
      endpoint = "http://localhost:5000/set-username";
    } else if (loginMethod === "github") {
      requestBody.githubId = userId;
      endpoint = "http://localhost:5000/api/github/set-username";
    } else if (loginMethod === "discord") {
      requestBody.discordId = userId;
      endpoint = "http://localhost:5000/auth/set-username";
    }

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();
      if (response.ok) {
        navigate("/login");
      } else {
        setError(data.message || "An error occurred.");
      }
    } catch (err) {
      console.error("Error:", err);
      setError("Server error. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f172a] via-[#0a1120] to-black px-4">
      <div className="bg-[#0d1326] shadow-[0_0_20px_rgba(93,188,252,0.2)] border border-[#1e293b] backdrop-blur-sm p-8 rounded-2xl max-w-md w-full">
        <h2 className="text-3xl font-bold text-center text-blue-300 mb-6 tracking-wide">
          Set Your Username
        </h2>

        {error && (
          <div className="bg-red-500/10 text-red-400 border border-red-400 px-4 py-2 mb-4 rounded-md text-center text-sm">
            {error}
          </div>
        )}

        <input
          type="text"
          placeholder="Choose a unique username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full bg-[#0a0f1f] text-blue-200 placeholder-blue-400 border border-blue-500/30 shadow-inner shadow-blue-500/10 py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 mb-5"
        />

        <button
          onClick={handleUsernameSubmit}
          disabled={!userId}
          className="w-full bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-600 hover:to-indigo-600 text-white font-semibold py-2.5 rounded-xl transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-blue-800/30"
        >
          Set Username
        </button>
      </div>
    </div>
  );
}

export default SetUsername;