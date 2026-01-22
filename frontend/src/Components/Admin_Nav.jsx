import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiMenu, FiX, FiHome, FiUsers, FiClock, FiDatabase, FiLogOut, FiUploadCloud, FiShield } from "react-icons/fi";
import { GiDiamondTrophy } from "react-icons/gi";
import { RiAdminLine } from "react-icons/ri";

const Admin_Nav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const [activeAdmin, setActiveAdmin] = useState("");

  useEffect(() => {
    // Check scroll position for navbar effect
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    
    // Get admin name from localStorage
    const admin = localStorage.getItem("adminName");
    if (admin) setActiveAdmin(admin);
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);

  const navItems = [
    { to: "/admin-panel", text: "Dashboard", icon: <FiHome /> },
    { to: "/admin-data", text: "Analytics", icon: <FiDatabase /> },
    { to: "/admin-history", text: "Activity Log", icon: <FiClock /> },
    { to: "/puploads", text: "Premium Uploads", icon: <GiDiamondTrophy />, premium: true },
    { to: "/admin-logout", text: "Logout", icon: <FiLogOut /> }
  ];

  return (
    <>
      {/* Backdrop for mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleMenu}
            className="fixed inset-0 bg-black/70 z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Main Navbar */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          scrolled ? "bg-gray-900/95 backdrop-blur-md shadow-xl" : "bg-gray-900/80 backdrop-blur-sm"
        } border-b ${scrolled ? "border-gray-800" : "border-transparent"}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo / Brand */}
            <motion.div whileHover={{ scale: 1.05 }} className="flex items-center space-x-2">
              <FiShield className="text-blue-400 text-2xl" />
              <Link to="/admin-panel" className="text-xl font-bold bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">
                Admin Portal
              </Link>
              {activeAdmin && (
                <span className="hidden md:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-900 text-blue-100 ml-2">
                  <RiAdminLine className="mr-1" /> {activeAdmin}
                </span>
              )}
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item, index) => (
                <NavItem 
                  key={index}
                  to={item.to}
                  text={item.text}
                  icon={item.icon}
                  isActive={location.pathname === item.to}
                  premium={item.premium}
                />
              ))}
            </div>

            {/* Mobile menu button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={toggleMenu}
              className="md:hidden p-2 rounded-md text-gray-400 hover:text-white focus:outline-none"
              aria-label="Toggle menu"
            >
              {isOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="md:hidden absolute top-16 left-0 right-0 bg-gray-800/95 backdrop-blur-lg shadow-xl z-40 border-t border-gray-700"
            >
              <div className="px-2 pt-2 pb-3 space-y-1">
                {navItems.map((item, index) => (
                  <MobileNavItem
                    key={index}
                    to={item.to}
                    text={item.text}
                    icon={item.icon}
                    isActive={location.pathname === item.to}
                    toggleMenu={toggleMenu}
                    premium={item.premium}
                  />
                ))}
                {activeAdmin && (
                  <div className="px-3 py-2 text-sm text-gray-400 border-t border-gray-700 mt-2 flex items-center">
                    <RiAdminLine className="mr-2" /> Logged in as: {activeAdmin}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
};

// Desktop Nav Item Component
const NavItem = ({ to, text, icon, isActive, premium }) => (
  <Link
    to={to}
    className={`relative group flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
      isActive 
        ? premium 
          ? "bg-gradient-to-r from-yellow-600/20 to-yellow-400/20 text-yellow-400" 
          : "bg-gray-800 text-white"
        : "text-gray-300 hover:bg-gray-700/50 hover:text-white"
    } ${premium ? "border border-yellow-500/30" : ""}`}
  >
    <span className={`mr-2 ${isActive ? "text-current" : "text-gray-400 group-hover:text-current"}`}>
      {icon}
    </span>
    {text}
    {premium && (
      <span className="absolute -top-2 -right-2">
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500"></span>
        </span>
      </span>
    )}
    {isActive && (
      <motion.div 
        layoutId="navActiveIndicator"
        className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-400"
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      />
    )}
  </Link>
);

// Mobile Nav Item Component
const MobileNavItem = ({ to, text, icon, isActive, toggleMenu, premium }) => (
  <Link
    to={to}
    onClick={toggleMenu}
    className={`flex items-center px-3 py-3 rounded-md text-base font-medium ${
      isActive 
        ? premium 
          ? "bg-gradient-to-r from-yellow-600/20 to-yellow-400/20 text-yellow-400" 
          : "bg-gray-700 text-white"
        : "text-gray-300 hover:bg-gray-700/50 hover:text-white"
    } ${premium ? "border border-yellow-500/30" : ""}`}
  >
    <span className={`mr-3 ${isActive ? "text-current" : "text-gray-400"}`}>
      {icon}
    </span>
    {text}
    {premium && (
      <span className="ml-auto bg-yellow-500/10 text-yellow-400 text-xs px-2 py-0.5 rounded-full">
        Premium
      </span>
    )}
  </Link>
);

export default Admin_Nav;