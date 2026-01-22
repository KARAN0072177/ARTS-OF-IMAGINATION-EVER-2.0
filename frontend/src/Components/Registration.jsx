import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { FcGoogle } from "react-icons/fc";
import { FaDiscord, FaGithub } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Helmet } from 'react-helmet-async';
import { motion } from "framer-motion";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import { useCallback } from "react";

function Registration() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const password = watch("password");
  const [isLoading, setIsLoading] = useState(false);

  const particlesInit = useCallback(async (engine) => {
    console.log("Initializing particles engine", engine);
    try {
      await loadFull(engine);
      console.log("Particles engine fully loaded", engine);
    } catch (error) {
      console.error("Error loading particles engine:", error);
    }
  }, []);

  const closed = () => {
    navigate("/");
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/api/register", data, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.data.success) {
        alert("OTP sent to your email! Please verify.");
        localStorage.setItem("userEmail", data.email);
        navigate("/otp", { state: { email: data.email, username: data.username, password: data.password } });
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Registration error:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:5000/auth/google";
  };

  const handleGitHubLogin = () => {
    window.location.href = "http://localhost:5000/api/github/auth";
  };

  const handleDiscordLogin = () => {
    window.location.href = "http://localhost:5000/auth/discord";
  };

  return (
    <>
      <Helmet>
        <title>Register | ARTS OF IMAGINATION EVER</title>
        <meta name="description" content="Create an account on ARTS OF IMAGINATION EVER. Register today to explore and share creative works in our gallery." />
        <meta property="og:title" content="Register | ARTS OF IMAGINATION EVER" />
        <meta property="og:description" content="Create an account on ARTS OF IMAGINATION EVER. Register today to explore and share creative works in our gallery." />
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
              background: {
                color: {
                  value: "transparent",
                },
              },
              fpsLimit: 120,
              interactivity: {
                events: {
                  onClick: {
                    enable: true,
                    mode: "push",
                  },
                  onHover: {
                    enable: true,
                    mode: "repulse",
                  },
                },
                modes: {
                  push: {
                    quantity: 4,
                  },
                  repulse: {
                    distance: 100,
                    duration: 0.4,
                  },
                },
              },
              particles: {
                color: {
                  value: "#3b82f6",
                },
                links: {
                  color: "#3b82f6",
                  distance: 150,
                  enable: true,
                  opacity: 0.3,
                  width: 1,
                },
                collisions: {
                  enable: true,
                },
                move: {
                  direction: "none",
                  enable: true,
                  outModes: {
                    default: "bounce",
                  },
                  random: false,
                  speed: 2,
                  straight: false,
                },
                number: {
                  density: {
                    enable: true,
                    area: 800,
                  },
                  value: 60,
                },
                opacity: {
                  value: 0.5,
                },
                shape: {
                  type: "circle",
                },
                size: {
                  value: { min: 1, max: 3 },
                },
              },
              detectRetina: true,
            }}
          />
        )}

        <div className="container mx-auto px-4 py-12 flex flex-col md:flex-row items-center justify-center min-h-screen">
          {/* Left Side - Enhanced Art Showcase */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="hidden md:flex flex-col items-center justify-center w-full md:w-1/2 lg:w-2/5 mb-10 md:mb-0 px-4"
          >
            <div className="relative w-full max-w-lg">
              {/* Animated background blobs */}
              <div className="absolute -top-20 -left-20 w-64 h-64 bg-blue-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
              <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-indigo-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
              <div className="absolute top-1/2 left-1/4 w-56 h-56 bg-purple-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>

              {/* Featured Art Gallery */}
              <div className="relative bg-[#121E3A]/80 backdrop-blur-sm border border-blue-500/30 rounded-2xl p-8 shadow-2xl shadow-blue-500/20 overflow-hidden">
                <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 mb-4">
                  Welcome to <br />Art of Imagination Ever
                </h1>
                <p className="text-gray-300 mb-6">
                  Join our creative community of talented artists showcasing their work to the world.
                </p>

                {/* Mini Art Gallery Preview */}
                <div className="grid grid-cols-3 gap-2 mb-6">
                  {[
                    '/images/h1.jpg',
                    '/images/h2.jpeg',
                    '/images/h3.jpeg',
                    '/images/h4.jpeg',
                    '/images/h5.jpeg',
                    '/images/h6.jpeg'
                  ].map((img, i) => (
                    <motion.div
                      key={i}
                      whileHover={{ scale: 1.05 }}
                      className="aspect-square overflow-hidden rounded-lg border border-gray-700/50"
                    >
                      <img
                        src={img}
                        alt="Artwork sample"
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </motion.div>
                  ))}
                </div>

                {/* Trending Tags */}
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-gray-400 mb-2">TRENDING TAGS</h3>
                  <div className="flex flex-wrap gap-2">
                    {['Scenery', 'City', 'Blue', 'Nature', 'Cyberpunk', 'Anime', 'Sky', 'Night', 'Purple'].map((tag, i) => (
                      <motion.span
                        key={tag}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        whileHover={{ scale: 1.05 }}
                        className="px-3 py-1 bg-blue-900/50 text-blue-200 text-sm rounded-full border border-blue-700/50 cursor-pointer hover:bg-blue-800/70 transition-all"
                      >
                        #{tag}
                      </motion.span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Floating decorative elements */}
              <div className="absolute -bottom-10 -left-10 w-20 h-20 bg-blue-500 rounded-full opacity-10"></div>
              <div className="absolute -top-10 -right-10 w-24 h-24 bg-purple-500 rounded-full opacity-10"></div>
            </div>
          </motion.div>

          {/* Right Side - Registration Form */}
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
                  Create Account
                </motion.h2>
                <p className="text-gray-400">Join our creative community</p>
              </div>

              {/* Social Login Buttons */}
              <div className="flex justify-center gap-4 mb-6">
                <motion.button
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleGoogleLogin}
                  className="bg-cyan-500 hover:bg-cyan-600 text-white p-3 rounded-full transition-all"
                  aria-label="Login with Google"
                >
                  <FcGoogle size={20} />
                </motion.button>

                <motion.button
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleGitHubLogin}
                  className="bg-gray-800 hover:bg-gray-900 text-white p-3 rounded-full transition-all"
                  aria-label="Login with GitHub"
                >
                  <FaGithub size={20} />
                </motion.button>

                <motion.button
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleDiscordLogin}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-full transition-all"
                  aria-label="Login with Discord"
                >
                  <FaDiscord size={20} className="text-indigo-400" />
                </motion.button>
              </div>

              <div className="relative flex items-center justify-center mb-6">
                <div className="flex-1 border-t border-gray-700"></div>
                <span className="mx-4 text-gray-400 text-sm">OR</span>
                <div className="flex-1 border-t border-gray-700"></div>
              </div>

              {/* Registration Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {[
                  {
                    id: 'username',
                    label: 'Username',
                    type: 'text',
                    validation: { required: "Username is required" },
                    placeholder: "Enter your creative username"
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
                  },
                  {
                    id: 'confirm',
                    label: 'Confirm Password',
                    type: 'password',
                    validation: {
                      required: "Confirm Password is required",
                      validate: (val) => val === password || "Passwords do not match",
                      minLength: {
                        value: 6,
                        message: "Confirm Password must be at least 6 characters",
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

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isLoading}
                  className={`w-full mt-6 py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all ${isLoading ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating Account...
                    </span>
                  ) : (
                    "Register Now"
                  )}
                </motion.button>
              </form>

              {/* Login Redirect */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-6 text-center text-sm text-gray-400"
              >
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="text-blue-400 hover:text-blue-300 underline transition-colors"
                >
                  Sign In
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      <style jsx = "true" global = "true">{`
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
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </>
  );
}

export default Registration;