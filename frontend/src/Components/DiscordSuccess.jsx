import React, { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const DiscordSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDiscordUser = async () => {
      try {
        const response = await axios.get("http://localhost:5000/auth/discord/success", {
          withCredentials: true, // ✅ Ensures cookies are included
        });

        if (!response.data) {
          throw new Error("Failed to fetch Discord user");
        }

        const userData = response.data;
        console.log("✅ Discord user:", userData);

        // ✅ Store user details in localStorage
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("loginMethod", "discord");

        // ✅ Force Navbar update
        window.dispatchEvent(new Event("storage"));

        // ✅ Redirect to home page
        navigate("/");
      } catch (error) {
        console.error("❌ Error fetching Discord user:", error);
        navigate("/login");
      }
    };

    fetchDiscordUser();
  }, [navigate]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
      <h2 className="text-2xl">Processing Discord login...</h2>
    </div>
  );
};

export default DiscordSuccess;