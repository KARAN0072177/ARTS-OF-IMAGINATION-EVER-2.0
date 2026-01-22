import React from "react";
import { motion } from "framer-motion";
import { MdFacebook } from "react-icons/md";
import { FaInstagram, FaDiscord } from "react-icons/fa";
import { FaXTwitter, FaArrowRight } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export const Footer = () => {
  const navigate = useNavigate();

  const navigateTo = (path) => {
    navigate(path);
    window.scrollTo(0, 0);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <footer className="relative overflow-hidden bg-gradient-to-b from-[#0A0F1F] via-[#0a1229] to-[#050914] px-5 py-16">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-blue-900/10 blur-3xl"></div>
        <div className="absolute -left-20 -bottom-20 w-72 h-72 rounded-full bg-indigo-900/10 blur-3xl"></div>
        <div className="absolute left-1/2 bottom-0 w-96 h-96 -translate-x-1/2 rounded-full bg-purple-900/5 blur-3xl"></div>
      </div>

      {/* Main content */}
      <div className="relative max-w-7xl mx-auto z-10">
        {/* Grid layout with animations */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          {/* Quick Links */}
          <motion.div variants={itemVariants}>
            <h3 className="text-[#E5E7EB] font-bold text-xl mb-6 pb-3 border-b border-blue-900/30 flex items-center">
              <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                Quick Links
              </span>
              <FaArrowRight className="ml-2 text-blue-400/60 text-sm" />
            </h3>
            <ul className="space-y-3.5">
              {[
                { name: "Home", path: "/" },
                { name: "Gallery", path: "/gallery" },
                { name: "Contact Us", path: "/contact" }
              ].map((item) => (
                <motion.li
                  key={item.name}
                  whileHover={{ x: 5 }}
                  className="text-[#D1D5DB] hover:text-blue-300 transition-colors cursor-pointer flex items-center group"
                  onClick={() => navigateTo(item.path)}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  {item.name}
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Explore More */}
          <motion.div variants={itemVariants}>
            <h3 className="text-[#E5E7EB] font-bold text-xl mb-6 pb-3 border-b border-blue-900/30 flex items-center">
              <span className="bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
                Explore More
              </span>
              <FaArrowRight className="ml-2 text-purple-400/60 text-sm" />
            </h3>
            <ul className="space-y-3.5">
              {[
                { name: "About Us", path: "/aboutus" },
                { name: "Recent Uploads", path: "/recent-uploads" }
              ].map((item) => (
                <motion.li
                  key={item.name}
                  whileHover={{ x: 5 }}
                  className="text-[#D1D5DB] hover:text-purple-300 transition-colors cursor-pointer flex items-center group"
                  onClick={() => navigateTo(item.path)}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  {item.name}
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Resource */}
          <motion.div variants={itemVariants}>
            <h3 className="text-[#E5E7EB] font-bold text-xl mb-6 pb-3 border-b border-blue-900/30 flex items-center">
              <span className="bg-gradient-to-r from-cyan-400 to-cyan-600 bg-clip-text text-transparent">
                Resource
              </span>
              <FaArrowRight className="ml-2 text-cyan-400/60 text-sm" />
            </h3>
            <ul className="space-y-3.5">
              {[
                { name: "Documentation", path: "/docs" },
                { name: "Patch Notes", path: "/patch" }
              ].map((item) => (
                <motion.li
                  key={item.name}
                  whileHover={{ x: 5 }}
                  className="text-[#D1D5DB] hover:text-cyan-300 transition-colors cursor-pointer flex items-center group"
                  onClick={() => navigateTo(item.path)}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  {item.name}
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Legal */}
          <motion.div variants={itemVariants}>
            <h3 className="text-[#E5E7EB] font-bold text-xl mb-6 pb-3 border-b border-blue-900/30 flex items-center">
              <span className="bg-gradient-to-r from-indigo-400 to-indigo-600 bg-clip-text text-transparent">
                Legal
              </span>
              <FaArrowRight className="ml-2 text-indigo-400/60 text-sm" />
            </h3>
            <ul className="space-y-3.5">
              {[
                { name: "Terms of Services", path: "/terms" },
                { name: "Cookies Policy", path: "/cookie_policy" },
                { name: "Privacy Policy", path: "/privacy" },
                { name: "Data Processing", path: "/data-process" }
              ].map((item) => (
                <motion.li
                  key={item.name}
                  whileHover={{ x: 5 }}
                  className="text-[#D1D5DB] hover:text-indigo-300 transition-colors cursor-pointer flex items-center group"
                  onClick={() => navigateTo(item.path)}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  {item.name}
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Right Side Content - Enhanced Creative Elements */}
          <motion.div
            className="md:col-span-2 lg:col-span-4"
            variants={itemVariants}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
              {/* Creative Spotlight Card */}
              <motion.div
                whileHover={{ y: -5 }}
                className="relative bg-gradient-to-br from-[#0e0e22] via-[#1a1a3a] to-[#0e0e22] rounded-xl p-6 shadow-2xl hover:shadow-purple-900/30 transition-all duration-500 border border-purple-900/30 overflow-hidden"
              >
                <div className="absolute -right-10 -top-10 w-32 h-32 rounded-full bg-purple-500/10 blur-xl"></div>

                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-5">
                    <div>
                      <h2 className="text-[#E5E7EB] font-bold text-xl mb-1">Creator Spotlight</h2>
                      <span className="text-[#9CA3AF] text-sm">Featured artist this week</span>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-purple-600/20 flex items-center justify-center">
                      <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                      </svg>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex-shrink-0 overflow-hidden">
                      {/* Placeholder for artist avatar */}
                      <div className="w-full h-full flex items-center justify-center text-white font-bold">AE</div>
                    </div>
                    <div>
                      <h3 className="text-[#E5E7EB] font-medium">Alexa Evans</h3>
                      <p className="text-[#9CA3AF] text-xs">Digital Illustrator</p>
                    </div>
                  </div>

                  <p className="text-[#D1D5DB] text-sm mb-4">
                    "Creating immersive worlds through digital brushstrokes and imagination."
                  </p>

                  <Link to="/artists/alexa-evans" className="block">
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-gradient-to-r from-purple-600 to-blue-700 text-white py-2 px-4 rounded-lg text-xs font-medium flex items-center justify-center space-x-2 hover:shadow-lg hover:shadow-purple-500/20 transition-all"
                    >
                      <span>View Portfolio</span>
                      <FaArrowRight className="text-xs" />
                    </motion.button>
                  </Link>
                </div>
              </motion.div>

              {/* Quick Stats Panel */}
              <motion.div
                whileHover={{ y: -5 }}
                className="relative bg-gradient-to-br from-[#0e0e22] via-[#1a1a3a] to-[#0e0e22] rounded-xl p-6 shadow-2xl hover:shadow-blue-900/30 transition-all duration-500 border border-blue-900/30 overflow-hidden"
              >
                <div className="absolute -right-10 -bottom-10 w-32 h-32 rounded-full bg-blue-500/10 blur-xl"></div>

                <div className="relative z-10">
                  <h2 className="text-[#E5E7EB] font-bold text-xl mb-4">Community Stats</h2>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#0A0F1F]/50 rounded-lg p-3 border border-blue-900/20">
                      <div className="text-blue-400 text-2xl font-bold mb-1">1.2K+</div>
                      <div className="text-[#9CA3AF] text-xs">Active Creators</div>
                    </div>
                    <div className="bg-[#0A0F1F]/50 rounded-lg p-3 border border-blue-900/20">
                      <div className="text-purple-400 text-2xl font-bold mb-1">5.7K</div>
                      <div className="text-[#9CA3AF] text-xs">Artworks Shared</div>
                    </div>
                    <div className="bg-[#0A0F1F]/50 rounded-lg p-3 border border-blue-900/20">
                      <div className="text-cyan-400 text-2xl font-bold mb-1">24/7</div>
                      <div className="text-[#9CA3AF] text-xs">Support</div>
                    </div>
                    <div className="bg-[#0A0F1F]/50 rounded-lg p-3 border border-blue-900/20">
                      <div className="text-indigo-400 text-2xl font-bold mb-1">100+</div>
                      <div className="text-[#9CA3AF] text-xs">Tutorials</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        {/* Animated divider */}
        <motion.div
          className="h-px bg-gradient-to-r from-transparent via-blue-900/40 to-transparent my-12"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        ></motion.div>

        {/* Footer bottom with animations */}
        <motion.div
          className="flex flex-col md:flex-row justify-between items-center gap-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center space-x-2">
            <span className="text-[#E5E7EB] font-medium text-sm md:text-base">
              © {new Date().getFullYear()} Arts of Imagination Ever. All rights reserved.
            </span>
          </div>

          <div className="flex space-x-5">
            {[
              { icon: <FaInstagram size={20} />, color: "from-purple-500 to-pink-500" },
              { icon: <MdFacebook size={20} />, color: "from-blue-500 to-blue-700" },
              { icon: <FaXTwitter size={20} />, color: "from-black to-gray-700" },
              { icon: <FaDiscord size={20} />, color: "from-indigo-500 to-purple-600" }
            ].map((social, index) => (
              <motion.a
                key={index}
                href="#"
                className="bg-gradient-to-br rounded-full p-2 flex items-center justify-center hover:shadow-lg transition-all"
                style={{
                  background: (() => {
                    if (typeof social.color === 'string') {
                      const parts = social.color.split(' ');
                      const from = parts.find(p => p.startsWith('from-'))?.replace('from-', '') || '#444';
                      const to = parts.find(p => p.startsWith('to-'))?.replace('to-', '') || '#222';
                      return `linear-gradient(135deg, ${from}, ${to})`;
                    }
                    return 'linear-gradient(135deg, #444, #222)';
                  })()
                }}
                whileHover={{ y: -3, scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <div className="text-white text-opacity-90 hover:text-opacity-100 transition-all">
                  {social.icon}
                </div>
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>
    </footer>
  );
};