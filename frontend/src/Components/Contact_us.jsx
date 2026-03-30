import React, { useState } from "react";
import { IoLocationOutline } from "react-icons/io5";
import { MdOutlineLocalPhone } from "react-icons/md";
import { IoMdMail } from "react-icons/io";
import { IoLogoFacebook } from "react-icons/io5";
import { BsInstagram, BsStars } from "react-icons/bs";
import { FaTwitter, FaLinkedin, FaPaperPlane } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa6";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import { Typewriter } from "react-simple-typewriter";

const Contact_us = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [hoveredField, setHoveredField] = useState(null);
  const [stars] = useState(Array(20).fill(0));

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlesubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponseMessage("");

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/contact`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();
      if (res.ok) {
        setResponseMessage("Message sent successfully!");
        setFormData({ name: "", email: "", message: "" });
        setShowPopup(true);
      } else {
        setResponseMessage(data.error || "Something went wrong.");
      }
    } catch (error) {
      setResponseMessage("Failed to send message. Try again.");
    }

    setLoading(false);
  };

  const inputVariants = {
    hover: {
      boxShadow: "0 0 15px rgba(56, 189, 248, 0.5)",
      borderColor: "#3B82F6"
    },
    focus: {
      boxShadow: "0 0 20px rgba(56, 189, 248, 0.7)",
      borderColor: "#60A5FA"
    }
  };

  return (
    <>
      <Helmet>
        <title>Contact Us | ARTS OF IMAGINATION EVER</title>
        <meta name="description" content="Get in touch with us for any inquiries, feedback, or collaboration opportunities." />
      </Helmet>

      <div className="relative min-h-screen bg-gradient-to-br from-black via-[#0A0F1F] to-[#0F172A] pt-24 px-4 pb-12 overflow-hidden">
        {/* Animated Stars Background */}
        {stars.map((_, i) => (
          <motion.div
            key={`star-${i}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.8, 0] }}
            transition={{
              duration: Math.random() * 5 + 3,
              repeat: Infinity,
              delay: Math.random() * 5,
              repeatType: "reverse"
            }}
            className="absolute rounded-full bg-white"
            style={{
              width: Math.random() * 3 + 1 + 'px',
              height: Math.random() * 3 + 1 + 'px',
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
            }}
          />
        ))}

        {/* Shooting Star */}
        <motion.div
          initial={{ x: -100, y: -100, opacity: 0 }}
          animate={{ x: "100vw", y: "100vh", opacity: [0, 1, 0] }}
          transition={{ duration: 3, delay: 1.5, repeat: Infinity, repeatDelay: 8 }}
          className="absolute top-0 left-0 w-2 h-2 bg-white rounded-full shadow-[0_0_10px_2px_#3B82F6]"
        />

        <div className="relative z-10">
          <div className="flex flex-col items-center text-center space-y-4 mb-12">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600"
            >
              <Typewriter
                words={["How can we Help...?", "Reach out to us!", "Let's connect!", "Feel Free to Contact"]}
                loop={0}
                cursor
                cursorStyle="|"
                typeSpeed={70}
                deleteSpeed={40}
                delaySpeed={1200}
              />
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-blue-200/80 text-lg"
            >
              We'd get back to you as soon as we can
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mx-auto w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 backdrop-blur-sm bg-[#121E3A]/80 p-8 md:p-12 rounded-3xl border border-blue-900/30 shadow-[0_0_30px_#1E40AF]"
          >
            {/* Contact Form */}
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-3">
                <BsStars className="text-blue-400 text-xl" />
                <h2 className="text-2xl font-semibold text-blue-100">Send us a message</h2>
              </div>

              <form className="flex flex-col space-y-6" onSubmit={handlesubmit}>
                <motion.div
                  variants={inputVariants}
                  animate={hoveredField === "name" ? "hover" : ""}
                  onHoverStart={() => setHoveredField("name")}
                  onHoverEnd={() => setHoveredField(null)}
                >
                  <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleChange}
                    onFocus={() => setHoveredField("name")}
                    onBlur={() => setHoveredField(null)}
                    className="w-full bg-[#0A0F1F]/70 text-blue-100 px-5 py-3 rounded-xl border border-blue-900/50 outline-none transition-all duration-300 placeholder-blue-400/50"
                    required
                  />
                </motion.div>

                <motion.div
                  variants={inputVariants}
                  animate={hoveredField === "email" ? "hover" : ""}
                  onHoverStart={() => setHoveredField("email")}
                  onHoverEnd={() => setHoveredField(null)}
                >
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={() => setHoveredField("email")}
                    onBlur={() => setHoveredField(null)}
                    className="w-full bg-[#0A0F1F]/70 text-blue-100 px-5 py-3 rounded-xl border border-blue-900/50 outline-none transition-all duration-300 placeholder-blue-400/50"
                    required
                  />
                </motion.div>

                <motion.div
                  variants={inputVariants}
                  animate={hoveredField === "message" ? "hover" : ""}
                  onHoverStart={() => setHoveredField("message")}
                  onHoverEnd={() => setHoveredField(null)}
                >
                  <textarea
                    name="message"
                    placeholder="Your Message"
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    onFocus={() => setHoveredField("message")}
                    onBlur={() => setHoveredField(null)}
                    className="w-full bg-[#0A0F1F]/70 text-blue-100 px-5 py-3 rounded-xl border border-blue-900/50 outline-none transition-all duration-300 placeholder-blue-400/50"
                    required
                  />
                </motion.div>

                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="relative bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700 text-white py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-blue-500/30 flex justify-center items-center gap-2 overflow-hidden"
                >
                  {loading ? (
                    <motion.div
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"
                      initial={{ rotate: 0 }}
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, ease: "linear", duration: 1 }}
                    />
                  ) : (
                    <>
                      <FaPaperPlane className="text-lg" />
                      <span>Send Message</span>
                      <motion.span
                        initial={{ x: -30, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        className="absolute right-4 text-blue-200"
                      >
                        →
                      </motion.span>
                    </>
                  )}
                </motion.button>
              </form>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              className="space-y-8 text-blue-200/90"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-3">
                <BsStars className="text-blue-400 text-xl" />
                <h2 className="text-2xl font-semibold text-blue-100">Contact Information</h2>
              </div>

              <div className="space-y-6">
                <motion.div
                  whileHover={{ x: 5 }}
                  className="flex items-start gap-4 p-4 bg-[#0A0F1F]/50 rounded-xl border border-blue-900/30"
                >
                  <IoLocationOutline className="text-blue-400 text-xl mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-blue-100">Our Location</h3>
                    <p>No.26 Shubham Plaza, Surat, Gujarat</p>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ x: 5 }}
                  className="flex items-start gap-4 p-4 bg-[#0A0F1F]/50 rounded-xl border border-blue-900/30"
                >
                  <MdOutlineLocalPhone className="text-blue-400 text-xl mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-blue-100">Phone Number</h3>
                    <p>+91 98765 12345</p>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ x: 5 }}
                  className="flex items-start gap-4 p-4 bg-[#0A0F1F]/50 rounded-xl border border-blue-900/30"
                >
                  <IoMdMail className="text-blue-400 text-xl mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-blue-100">Email Address</h3>
                    <p>aoieservices247@gmail.com</p>
                  </div>
                </motion.div>
              </div>

              <div className="pt-4">
                <h3 className="text-lg font-medium text-blue-100 mb-4">Follow Us</h3>
                <div className="flex gap-5 text-2xl">
                  <motion.a
                    href="#"
                    whileHover={{ y: -5, color: "#3B82F6" }}
                    className="text-blue-300 hover:text-blue-400 transition-colors"
                  >
                    <IoLogoFacebook />
                  </motion.a>
                  <motion.a
                    href="#"
                    whileHover={{ y: -5, color: "#E1306C" }}
                    className="text-blue-300 hover:text-blue-400 transition-colors"
                  >
                    <BsInstagram />
                  </motion.a>
                  <motion.a
                    href="#"
                    whileHover={{ y: -5, color: "#1DA1F2" }}
                    className="text-blue-300 hover:text-blue-400 transition-colors"
                  >
                    <FaTwitter />
                  </motion.a>
                  <motion.a
                    href="#"
                    whileHover={{ y: -5, color: "#FF0000" }}
                    className="text-blue-300 hover:text-blue-400 transition-colors"
                  >
                    <FaYoutube />
                  </motion.a>
                  <motion.a
                    href="#"
                    whileHover={{ y: -5, color: "#0077B5" }}
                    className="text-blue-300 hover:text-blue-400 transition-colors"
                  >
                    <FaLinkedin />
                  </motion.a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Success Popup */}
        <AnimatePresence>
          {showPopup && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm"
            >
              <div className="relative bg-gradient-to-br from-[#121E3A] to-[#0A0F1F] p-8 rounded-2xl border border-blue-900/50 text-center shadow-[0_0_30px_#1E40AF] max-w-sm w-full">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute -top-20 -right-20 w-40 h-40 rounded-full border-2 border-blue-500/20"
                />
                <h3 className="text-2xl font-bold text-blue-100 mb-3">Success!</h3>
                <p className="text-blue-200 mb-6">{responseMessage}</p>
                <motion.button
                  onClick={() => setShowPopup(false)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-800 text-white font-medium shadow-lg hover:shadow-blue-500/30"
                >
                  Close
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default Contact_us;