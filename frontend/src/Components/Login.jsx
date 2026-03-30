import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { FcGoogle } from "react-icons/fc";
import { IoMdClose } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaDiscord, FaGithub } from "react-icons/fa";
import { Helmet } from 'react-helmet-async';
import { motion } from "framer-motion";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import { useCallback } from 'react';

function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [loadingMethod, setLoadingMethod] = useState(null);

  const particlesInit = useCallback(async (engine) => {
    console.log("Initializing particles engine", engine);
    try {
      await loadFull(engine);
      console.log("Particles engine fully loaded", engine);
    } catch (error) {
      console.error("Error loading particles engine:", error);
    }
  }, []);


  const closed = () => navigate("/");
  const forgotpass = () => navigate("/username");

  const API_BASE = import.meta.env.VITE_API_URL;

  const handleGoogleLogin = () => {
    setLoadingMethod("google");
    localStorage.setItem("loginMethod", "google");
    console.log("Stored login method: google");
    window.location.href = `${API_BASE}/auth/google`;
  };

  const handleGitHubLogin = () => {
    setLoadingMethod("github");
    localStorage.setItem("loginMethod", "github");
    console.log("Stored login method: github");
    window.location.href = `${API_BASE}/api/github/auth`;
  };

  const handleDiscordLogin = () => {
    setLoadingMethod("discord");
    localStorage.setItem("loginMethod", "discord");
    console.log("Stored login method: discord");
    window.location.href = `${API_BASE}/auth/discord`;
  };

  // Manual Login
  const onSubmit = async (data) => {
    setLoading(true);
    setLoginError("");

    const requestData = {
      username: data.username || "",
      email: data.email || "",
      password: data.password,
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        requestData,
        {
          withCredentials: true, // This is important for cross-origin requests to send cookies
        }
      );

      if (response.data.success) {
        localStorage.setItem("loginMethod", "email");
        localStorage.setItem("user", JSON.stringify(response.data.user));
        navigate("/");
      } else {
        setLoginError("Invalid credentials. Please register first.");
        navigate("/registration");
      }
    } catch (error) {
      console.error("Login Error:", error);

      if (error.response && error.response.data.message === "❌ Incorrect password. Please try again.") {
        setLoginError("Incorrect password. Please check your password and try again.");
      } else {
        setLoginError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Login | ARTS OF IMAGINATION EVER</title>
        <meta name="description" content="Log in to your ARTS OF IMAGINATION EVER account to access premium artwork and your personalized gallery." />
        <meta property="og:title" content="Login | ARTS OF IMAGINATION EVER" />
        <meta property="og:description" content="Log in to your ARTS OF IMAGINATION EVER account to access premium artwork and your personalized gallery." />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="relative min-h-screen bg-gradient-to-br from-black to-[#0A0F1F] overflow-hidden">
        {particlesInit && (
          <Particles
            id="tsparticles"
            init={particlesInit}
            loaded={async (container) => {
              console.log("Particles container loaded", container);
            }}
            options={{
              background: { color: { value: "transparent" } },
              fpsLimit: 120,
              interactivity: {
                events: {
                  onClick: { enable: true, mode: "push" },
                  onHover: { enable: true, mode: "repulse" }
                },
                modes: {
                  push: { quantity: 4 },
                  repulse: { distance: 100, duration: 0.4 }
                }
              },
              particles: {
                color: { value: "#3b82f6" },
                links: {
                  color: "#3b82f6",
                  distance: 150,
                  enable: true,
                  opacity: 0.3,
                  width: 1
                },
                collisions: { enable: true },
                move: {
                  direction: "none",
                  enable: true,
                  outModes: { default: "bounce" },
                  random: false,
                  speed: 2,
                  straight: false
                },
                number: {
                  density: { enable: true, area: 800 },
                  value: 60
                },
                opacity: { value: 0.5 },
                shape: { type: "circle" },
                size: { value: { min: 1, max: 3 } }
              },
              detectRetina: true
            }}
          />
        )}

        <div className="container mx-auto px-4 py-12 flex flex-col md:flex-row items-center justify-center min-h-screen">
          {/* Left Side - Authentic Login Information */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="hidden md:flex flex-col items-center justify-center w-full md:w-1/2 lg:w-2/5 mb-10 md:mb-0 px-4"
          >
            <div className="relative w-full max-w-lg">
              {/* Background elements */}
              <div className="absolute -top-20 -left-20 w-64 h-64 bg-blue-600 rounded-full mix-blend-multiply filter blur-xl opacity-20"></div>
              <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-indigo-600 rounded-full mix-blend-multiply filter blur-xl opacity-20"></div>

              {/* Login Information Panel */}
              <div className="relative bg-[#121E3A]/80 backdrop-blur-sm border border-blue-500/30 rounded-2xl p-8 shadow-2xl shadow-blue-500/20 overflow-hidden">
                <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 mb-4">
                  Secure Login
                </h1>

                {/* Security Features */}
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-gray-100 mb-3">Your Security Matters</h2>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="text-blue-400 mr-3 mt-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-100">End-to-End Encryption</h3>
                        <p className="text-sm text-gray-400">All login data is securely encrypted</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="text-purple-400 mr-3 mt-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-100">Passwords Protection</h3>
                        <p className="text-sm text-gray-400">All Passwords are Hashed, We are not storing plain text passwords</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="text-indigo-400 mr-3 mt-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M10 2a5 5 0 00-5 5v2a2 2 0 00-2 2v5a2 2 0 002 2h10a2 2 0 002-2v-5a2 2 0 00-2-2H7V7a3 3 0 015.905-.75 1 1 0 001.937-.5A5.002 5.002 0 0010 2z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-100">Password Requirements</h3>
                        <p className="text-sm text-gray-400">Minimum 6 characters with complexity</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Benefits of Login Section */}
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-gray-100 mb-3">Benefits of Login</h2>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="text-green-400 mr-3 mt-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-100">Like - Share - Download Images</h3>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="text-yellow-400 mr-3 mt-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                          <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-100">Save Your Progress</h3>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="text-pink-400 mr-3 mt-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-100">Personalized Profile</h3>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Help Resources */}
                <div>
                  <h2 className="text-lg font-semibold text-gray-100 mb-3">Need Help?</h2>
                  <div className="space-y-2">
                    <Link to="/privacy" className="flex items-center text-blue-400 hover:text-blue-300 text-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      Privacy Policy
                    </Link>
                    <Link to="/faq" className="flex items-center text-blue-400 hover:text-blue-300 text-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      FAQ
                    </Link>
                    <Link to="/cookie_policy" className="flex items-center text-blue-400 hover:text-blue-300 text-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                      </svg>
                      Cookie Policy
                    </Link>
                    <Link to="/data-process" className="flex items-center text-blue-400 hover:text-blue-300 text-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                      </svg>
                      Data Processing
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Side - Login Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full md:w-1/2 lg:w-2/5 max-w-md"
          >
            <div className="relative bg-[#121E3A]/90 backdrop-blur-sm border border-blue-500/30 rounded-2xl p-8 shadow-2xl shadow-blue-500/20 overflow-hidden">
              {/* Animated Background Elements */}
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-900 rounded-full opacity-10"></div>
              <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-indigo-900 rounded-full opacity-10"></div>

              {/* Close Button */}
              <button
                onClick={closed}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                aria-label="Close"
              >
                <IoMdClose size={24} />
              </button>

              {/* Form Header */}
              <div className="text-center mb-8">
                <motion.h2
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-2"
                >
                  Sign In
                </motion.h2>
                <p className="text-gray-400">Access your creative space</p>
              </div>

              {/* Social Login Buttons */}
              <div className="flex justify-center gap-4 mb-6">
                <motion.button
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleGoogleLogin}  // Use the handleGoogleLogin function here
                  disabled={loadingMethod !== null}
                  className={`bg-cyan-500 hover:bg-cyan-600 text-white p-3 rounded-full transition-all ${loadingMethod ? 'opacity-70' : ''}`}
                  aria-label="Login with Google"
                >
                  {loadingMethod === 'google' ? (
                    <span className="inline-block h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  ) : (
                    <FcGoogle size={20} />
                  )}
                </motion.button>

                <motion.button
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleGitHubLogin}  // Use the handleGitHubLogin function here
                  disabled={loadingMethod !== null}
                  className={`bg-gray-800 hover:bg-gray-900 text-white p-3 rounded-full transition-all ${loadingMethod ? 'opacity-70' : ''}`}
                  aria-label="Login with GitHub"
                >
                  {loadingMethod === 'github' ? (
                    <span className="inline-block h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  ) : (
                    <FaGithub size={20} />
                  )}
                </motion.button>

                <motion.button
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleDiscordLogin}  // Use the handleDiscordLogin function here
                  disabled={loadingMethod !== null}
                  className={`bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-full transition-all ${loadingMethod ? 'opacity-70' : ''}`}
                  aria-label="Login with Discord"
                >
                  {loadingMethod === 'discord' ? (
                    <span className="inline-block h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  ) : (
                    <FaDiscord size={20} className="text-indigo-400" />
                  )}
                </motion.button>
              </div>

              <div className="relative flex items-center justify-center mb-6">
                <div className="flex-1 border-t border-gray-700"></div>
                <span className="mx-4 text-gray-400 text-sm">OR</span>
                <div className="flex-1 border-t border-gray-700"></div>
              </div>

              {/* Login Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {loginError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-red-900/30 border border-red-700 rounded-lg text-red-300 text-sm"
                  >
                    {loginError}
                  </motion.div>
                )}

                {[
                  {
                    id: 'username',
                    label: 'Username',
                    type: 'text',
                    validation: { required: "Username is required" },
                    placeholder: "Enter your username"
                  },
                  {
                    id: 'email',
                    label: 'Email',
                    type: 'email',
                    validation: {
                      required: "Email is required",
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Invalid email address",
                      },
                    },
                    placeholder: "your@email.com"
                  },
                  {
                    id: 'password',
                    label: 'Password',
                    type: 'password',
                    validation: {
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters",
                      },
                    },
                    placeholder: "••••••••"
                  }
                ].map((field, index) => (
                  <motion.div
                    key={field.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="space-y-1"
                  >
                    <label htmlFor={field.id} className="block text-sm font-medium text-gray-300">
                      {field.label}
                    </label>
                    <input
                      id={field.id}
                      type={field.type}
                      {...register(field.id, field.validation)}
                      placeholder={field.placeholder}
                      className={`w-full px-4 py-3 bg-[#0A0F1F]/80 border border-gray-700 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${errors[field.id] ? "border-red-500" : ""
                        }`}
                    />
                    {errors[field.id] && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-red-400 text-xs mt-1"
                      >
                        {errors[field.id].message}
                      </motion.p>
                    )}
                  </motion.div>
                ))}

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={forgotpass}
                    className="text-sm text-blue-400 hover:text-blue-300 underline transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={loading}
                  className={`w-full mt-6 py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all ${loading ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Signing In...
                    </span>
                  ) : (
                    "Login"
                  )}
                </motion.button>
              </form>

              {/* Registration Redirect */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-6 text-center text-sm text-gray-400"
              >
                Don't have an account?{' '}
                <Link
                  to="/registration"
                  className="text-blue-400 hover:text-blue-300 underline transition-colors"
                >
                  Sign Up
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      <style jsx="true" global="true">{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </>
  );
}

export default Login;