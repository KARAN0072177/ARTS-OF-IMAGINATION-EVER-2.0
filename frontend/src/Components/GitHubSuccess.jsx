import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const GitHubSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGitHubUser = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/github/auth/success`,
          {
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch GitHub user");
        }

        const userData = await response.json();

        // ✅ Store user details in localStorage
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("loginMethod", "github");

        console.log("GitHub user stored in localStorage:", userData);

        // ✅ Force Navbar update
        window.dispatchEvent(new Event("storage"));

        // ✅ Redirect to home page after storing data
        navigate("/");
      } catch (error) {
        console.error("Error fetching GitHub user:", error);
        navigate("/login");
      }
    };

    fetchGitHubUser();
  }, [navigate]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
      <h2 className="text-2xl">Processing GitHub login...</h2>
    </div>
  );
};

export default GitHubSuccess;