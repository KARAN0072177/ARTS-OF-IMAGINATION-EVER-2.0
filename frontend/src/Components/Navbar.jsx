import React, { useState, useEffect, useCallback } from "react";
import { FaHome, FaInfo, FaCrown } from "react-icons/fa";
import { IoMdPhotos, IoMdMenu, IoMdClose, IoMdLogIn, IoMdLogOut } from "react-icons/io";
import { RiContactsBook3Fill } from "react-icons/ri";
import { CgProfile } from "react-icons/cg";
import { useNavigate, useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Throttle scroll handler
  const handleScroll = useCallback(() => {
    setIsScrolled(window.scrollY > 10);
  }, []);

  // Check authentication state
  const checkLoginState = useCallback(() => {
    const googleUser = JSON.parse(localStorage.getItem("user"));
    const githubUser = JSON.parse(localStorage.getItem("githubuser"));
    const discordUser = JSON.parse(localStorage.getItem("discorduser"));

    const loggedIn = !!(googleUser || githubUser || discordUser);
    setIsLoggedIn(loggedIn);
    setUserData(googleUser || githubUser || discordUser);
  }, []);

  // Effects
  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    checkLoginState();

    const handleStorageChange = () => checkLoginState();
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [checkLoginState]);

  const handleLoginClick = () => {
    navigate("/login");
    setIsOpen(false);
  };

  const handleLogoutClick = async () => {
    try {
      await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/logout`,
        {
          method: "GET",
          credentials: "include",
        }
      );
    } catch (error) {
      console.error("Error logging out:", error);
    }

    ["user", "githubuser", "discorduser"].forEach(key => localStorage.removeItem(key));
    setIsLoggedIn(false);
    setUserData(null);
    navigate("/");
    setIsOpen(false);
  };

  const handleProfileClick = () => {
    navigate("/profile");
    setIsOpen(false);
  };

  const navLinks = [
    { name: "Home", link: "/", icon: <FaHome /> },
    { name: "Gallery", link: "/gallery", icon: <IoMdPhotos /> },
    { name: "Premium Gallery", link: "/pgallery", icon: <FaCrown />, isPro: true },
    { name: "Contact", link: "/contact", icon: <RiContactsBook3Fill /> },
    { name: "About us", link: "/aboutus", icon: <FaInfo /> },
  ];

  const navVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 }
  };

  const itemVariants = {
    open: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    },
    closed: { opacity: 0, y: 20, transition: { duration: 0.2 } }
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{
        type: "spring",
        stiffness: 100,
        damping: 15
      }}
      className={`fixed w-full top-0 left-0 z-50 transition-all duration-300 ${isScrolled
          ? "bg-[#0A0F1F]/90 backdrop-blur-md shadow-lg"
          : "bg-[#0A0F1F]"
        }`}
      role="banner"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex-shrink-0 flex items-center"
          >
            <Link
              to="/"
              className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500"
              aria-label="Home"
            >
              AOIE
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <ul className="flex space-x-1">
              {navLinks.map((link) => (
                <motion.li
                  key={link.name}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative"
                  variants={navVariants}
                >
                  <Link
                    to={link.link}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${location.pathname === link.link
                        ? "text-cyan-400 font-medium"
                        : "text-gray-300 hover:text-cyan-400"
                      }`}
                    aria-current={location.pathname === link.link ? "page" : undefined}
                  >
                    <span className="text-lg">{link.icon}</span>
                    {link.name}
                    {link.isPro && (
                      <span className="ml-2 px-2 py-0.5 text-xs font-bold bg-gradient-to-r from-yellow-400 to-amber-600 rounded-full">
                        PRO
                      </span>
                    )}
                    {location.pathname === link.link && (
                      <motion.span
                        layoutId="activeIndicator"
                        className="absolute left-0 bottom-0 w-full h-0.5 bg-cyan-400"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-2 ml-6">
            {isLoggedIn ? (
              <>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleProfileClick}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-300 hover:bg-slate-800/50 transition-colors"
                  aria-label="Profile"
                >
                  <CgProfile size={18} />
                  <span className="text-sm">Profile</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogoutClick}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-300 hover:bg-slate-800/50 transition-colors"
                  aria-label="Logout"
                >
                  <IoMdLogOut size={18} />
                  <span className="text-sm">Logout</span>
                </motion.button>
              </>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLoginClick}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-300 hover:bg-slate-800/50 transition-colors"
                aria-label="Login"
              >
                <IoMdLogIn size={18} />
                <span className="text-sm">Login</span>
              </motion.button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            {isLoggedIn ? (
              <>
                <button
                  onClick={handleProfileClick}
                  className="p-2 rounded-full text-gray-300 hover:bg-slate-800/50 transition-colors"
                  aria-label="Profile"
                >
                  <CgProfile size={20} />
                </button>
                <button
                  onClick={handleLogoutClick}
                  className="p-2 rounded-full text-gray-300 hover:bg-slate-800/50 transition-colors"
                  aria-label="Logout"
                >
                  <IoMdLogOut size={20} />
                </button>
              </>
            ) : (
              <button
                onClick={handleLoginClick}
                className="p-2 rounded-full text-gray-300 hover:bg-slate-800/50 transition-colors"
                aria-label="Login"
              >
                <IoMdLogIn size={20} />
              </button>
            )}

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-full text-gray-300 hover:bg-slate-800/50 transition-colors"
              aria-label={isOpen ? "Close menu" : "Open menu"}
              aria-expanded={isOpen}
            >
              {isOpen ? <IoMdClose size={24} /> : <IoMdMenu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", bounce: 0, duration: 0.3 }}
            className="md:hidden fixed inset-0 top-16 bg-[#0A0F1F] z-40 overflow-y-auto"
            role="dialog"
            aria-modal="true"
          >
            <div className="px-4 pt-2 pb-8 space-y-1">
              {navLinks.map((link) => (
                <motion.div
                  key={link.name}
                  variants={itemVariants}
                  initial="closed"
                  animate="open"
                  exit="closed"
                >
                  <Link
                    to={link.link}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 text-lg rounded-lg ${location.pathname === link.link
                        ? "bg-slate-800/50 text-cyan-400"
                        : "text-gray-300 hover:bg-slate-800/30"
                      }`}
                    aria-current={location.pathname === link.link ? "page" : undefined}
                  >
                    <span className="text-xl">{link.icon}</span>
                    {link.name}
                    {link.isPro && (
                      <span className="ml-auto px-2 py-0.5 text-xs font-bold bg-gradient-to-r from-yellow-400 to-amber-600 rounded-full">
                        PRO
                      </span>
                    )}
                  </Link>
                </motion.div>
              ))}

              <motion.div
                variants={itemVariants}
                initial="closed"
                animate="open"
                exit="closed"
                className="pt-4 border-t border-slate-800"
              >
                {isLoggedIn ? (
                  <button
                    onClick={handleLogoutClick}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-slate-800/50 rounded-lg text-gray-300 hover:bg-slate-800/70 transition-colors"
                  >
                    <IoMdLogOut size={20} />
                    <span>Logout</span>
                  </button>
                ) : (
                  <button
                    onClick={handleLoginClick}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-slate-800/50 rounded-lg text-gray-300 hover:bg-slate-800/70 transition-colors"
                  >
                    <IoMdLogIn size={20} />
                    <span>Login</span>
                  </button>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};