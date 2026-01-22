import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaArrowRight } from "react-icons/fa";
import { useEffect, useRef, useState } from "react";

export const Hero = () => {
  const navigate = useNavigate();
  const [heading, setHeading] = useState("");
  const [cursorVisible, setCursorVisible] = useState(true);
  const fullHeading = "Where Creativity Meets Passion";
  const headingIndex = useRef(0);

  const getstart = () => {
    navigate("/login");
  };

  useEffect(() => {
    if (!fullHeading) return;

    let direction = 1; // 1 for forward, -1 for reverse
    let isPaused = false;

    let interval = setInterval(() => {
      if (isPaused) return; // Pause effect for delay

      if (direction === 1 && headingIndex.current < fullHeading.length) {
        // Typing forward
        setHeading(fullHeading.slice(0, headingIndex.current + 1));
        headingIndex.current += 1;
      } else if (direction === -1 && headingIndex.current > 0) {
        // Erasing backward
        setHeading(fullHeading.slice(0, headingIndex.current - 1));
        headingIndex.current -= 1;
      } else if (direction === 1 && headingIndex.current === fullHeading.length) {
        // When reaching full text, wait 3s before reversing
        isPaused = true;
        setTimeout(() => {
          direction = -1;
          isPaused = false;
        }, 3000);
      } else {
        // When reaching empty, immediately restart
        direction = 1;
      }
    }, 100); // Adjust speed here

    return () => clearInterval(interval);
  }, [fullHeading]);

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setCursorVisible((prev) => !prev);
    }, 500); // Cursor blinks every 0.5 seconds

    return () => clearInterval(cursorInterval);
  }, []);


  return (
    <>
      <div className="relative bg-black w-full flex flex-col md:flex-row justify-between md:p-10 p-3 min-h-screen overflow-hidden">
        {/* Background Gradient Overlay */}
        <div
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            filter: "blur(100px)",
            opacity: 0.4,
            zIndex: 0,
          }}
        ></div>

        {/* Heading Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="flex flex-col md:mt-28 mt-4 gap-7 md:items-start items-center text-center md:text-left z-10 
             md:w-[50%] w-[90%] max-w-[600px] md:pl-10"
        >
          <h1 className="md:text-6xl text-3xl font-bold text-[#E5E7EB]">
            {heading.split(" ").map((word, idx) => (
              <span
                key={idx}
                className={
                  word === "Passion"
                    ? "bg-gradient-to-r from-blue-500 to-teal-400 text-transparent bg-clip-text"
                    : ""
                }
              >
                {word}{" "}
              </span>
            ))}

            {/* Blinking Cursor */}
            <span className="text-[#E5E7EB]">{cursorVisible ? "|" : ""}</span>
          </h1>
          
          <p className="md:text-lg text-sm text-[#D1D5DB]">
            "Discover unique artworks crafted with love. From abstract designs
            to timeless classics, redefine your space with unparalleled beauty."
          </p>

          <motion.button
            onClick={getstart}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="bg-[#1E40AF] hover:bg-[#1E3A8A] text-[#D1D5DB] flex items-center gap-2 px-6 rounded-lg font-bold py-2 cursor-pointer shadow-lg transition-all duration-300"
          >
            Get Started <FaArrowRight className="text-lg" />
          </motion.button>

        </motion.div>


        {/* Images Section */}
        <div className="flex justify-center md:mt-16 gap-5">
          {/* Left Images */}
          <div className="flex flex-col gap-5">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              style={{
                width: "100%",
                maxWidth: "300px",
                borderRadius: "12px",
                backdropFilter: "blur(10px)",
                background: "rgba(255, 255, 255, 0.1)",
                border: "2px solid rgba(255, 255, 255, 0.2)",
                overflow: "hidden",
                boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.3)",
                transition: "transform 0.3s ease-in-out",
                cursor: "pointer",
              }}
              whileHover={{ scale: 1.05 }}
            >
              <img className="w-full h-auto object-cover" src="/imgs/eye.jpg" alt="Eye Art" />
            </motion.div>

            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              style={{
                width: "100%",
                maxWidth: "300px",
                borderRadius: "12px",
                backdropFilter: "blur(10px)",
                background: "rgba(255, 255, 255, 0.1)",
                border: "2px solid rgba(255, 255, 255, 0.2)",
                overflow: "hidden",
                boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.3)",
                transition: "transform 0.3s ease-in-out",
                cursor: "pointer",
              }}
              whileHover={{ scale: 1.05 }}
            >
              <img className="w-full h-auto object-cover" src="/imgs/street.jpg" alt="Street Art" />
            </motion.div>
          </div>

          {/* Right Images */}
          <div className="flex flex-col gap-5 mt-20">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              style={{
                width: "100%",
                maxWidth: "300px",
                borderRadius: "12px",
                backdropFilter: "blur(10px)",
                background: "rgba(255, 255, 255, 0.1)",
                border: "2px solid rgba(255, 255, 255, 0.2)",
                overflow: "hidden",
                boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.3)",
                transition: "transform 0.3s ease-in-out",
                cursor: "pointer",
              }}
              whileHover={{ scale: 1.05 }}
            >
              <img className="w-full h-auto object-cover" src="/imgs/fantasy.jpg" alt="Fantasy Art" />
            </motion.div>

            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.9 }}
              style={{
                width: "100%",
                maxWidth: "300px",
                borderRadius: "12px",
                backdropFilter: "blur(10px)",
                background: "rgba(255, 255, 255, 0.1)",
                border: "2px solid rgba(255, 255, 255, 0.2)",
                overflow: "hidden",
                boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.3)",
                transition: "transform 0.3s ease-in-out",
                cursor: "pointer",
              }}
              whileHover={{ scale: 1.05 }}
            >
              <img className="w-full h-auto object-cover" src="/imgs/moon.jpg" alt="Moon Art" />
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};