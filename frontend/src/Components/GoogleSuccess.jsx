import React, { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const GoogleSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/auth/google/success", {
          withCredentials: true,
        });

        const user = response.data;
        console.log("✅ Google user:", user);

        if (user) {
          // ✅ Store user in localStorage
          localStorage.setItem("user", JSON.stringify(user));

          // ✅ Force Navbar update
          window.dispatchEvent(new Event("storage"));

          // ✅ Redirect to home page
          navigate("/");
        } else {
          console.error("❌ No user data received.");
          navigate("/login");
        }
      } catch (error) {
        console.error("❌ Error fetching Google user:", error);
        navigate("/login");
      }
    };

    fetchUser();
  }, [navigate]);

  return <div>Logging in with Google...</div>;
};

export default GoogleSuccess;