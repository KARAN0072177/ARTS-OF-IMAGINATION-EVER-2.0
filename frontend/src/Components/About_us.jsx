import React from "react";
import { motion } from "framer-motion";
import { BsInstagram, BsStars } from "react-icons/bs";
import { IoMdMail, IoMdRocket } from "react-icons/io";
import { FaPaintBrush, FaUsers, FaHandshake, FaGlobe, FaShieldAlt, FaMobileAlt, FaHeart, FaShare, FaDownload } from "react-icons/fa";
import { useRef, useEffect, useState } from "react";
import { Helmet } from 'react-helmet-async';
import { Typewriter } from "react-simple-typewriter";

const Team_Members = [
  {
    name: "Ashok Suthar",
    role: "React Developer",
    image: "../images/profilepic.jpg",
    email: "ashoksuthar1707@gmail.com",
  },
  {
    name: "Vani Karan",
    role: "MERN Developer",
    image: "../images/profilepic.jpg",
    email: "karanvani2003@gmail.com",
  },
  {
    name: "Varma Ankit",
    role: "Python Developer",
    image: "../images/profilepic.jpg",
    email: "varmaankitvm@gmail.com",
  },
  {
    name: "Parmar Smit",
    role: "React Developer",
    image: "../images/profilepic.jpg",
    email: "parmarsmit2410@gmail.com",
  },
];

const About_us = () => {
  const [stars] = useState(Array(30).fill(0));
  const [hoveredTeamMember, setHoveredTeamMember] = useState(null);

  return (
    <>
      <Helmet>
        <title>About Us | ARTS OF IMAGINATION EVER</title>
        <meta name="description" content="Learn more about ARTS OF IMAGINATION EVER and our mission to bring stunning art to the world." />
        <meta property="og:title" content="About Us | ARTS OF IMAGINATION EVER" />
        <meta property="og:description" content="Learn more about ARTS OF IMAGINATION EVER and our mission to bring stunning art to the world." />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="relative bg-gradient-to-b from-black via-[#0A0F1F] to-[#0F172A] min-h-screen pt-24 pb-16 px-6 overflow-hidden">
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

        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-6xl mx-auto text-center mb-24 relative z-10"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="absolute -top-20 -left-20 w-64 h-64 rounded-full border border-blue-900/20 opacity-50"
          />

          <h1 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600 mb-6">
            <Typewriter
              words={['About Our Cosmic Journey', 'Our Story', 'The Team Behind the Art']}
              loop={false}
              cursor
              cursorStyle="|"
              typeSpeed={70}
              deleteSpeed={50}
              delaySpeed={2000}
            />
          </h1>
          <p className="text-xl text-blue-200/80 max-w-3xl mx-auto leading-relaxed">
            Where creativity meets the cosmos. We're building bridges between artists and art lovers across the universe.
          </p>
        </motion.section>

        {/* About Section */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ amount: 0.2 }}
          transition={{ duration: 0.8 }}
          className="max-w-6xl mx-auto mb-32 relative z-10"
        >
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="relative flex-shrink-0"
            >
              <div className="w-64 h-64 rounded-full bg-gradient-to-br from-blue-900/30 to-purple-900/30 flex items-center justify-center text-blue-400 text-8xl">
                <FaPaintBrush />
              </div>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full border-2 border-blue-500/20 border-dashed"
              />
            </motion.div>

            <div>
              <h2 className="text-4xl font-bold text-blue-100 mb-6 flex items-center">
                <BsStars className="mr-3 text-yellow-400" /> Our Vision
              </h2>
              <p className="text-lg text-blue-200/90 leading-relaxed">
                At <span className="text-blue-400 font-medium">ARTS-OF-IMAGINATION-EVER</span>, we believe art should transcend boundaries.
                Our platform is a galaxy where artists can showcase their creations and art lovers can discover
                works that speak to their souls. We're committed to creating a space where creativity knows no limits.
              </p>
            </div>
          </div>
        </motion.section>

        {/* Mission Section */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ amount: 0.2 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-6xl mx-auto mb-32 relative z-10"
        >
          <div className="flex flex-col lg:flex-row-reverse items-center gap-12">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="relative flex-shrink-0"
            >
              <div className="w-64 h-64 rounded-full bg-gradient-to-br from-blue-800/20 to-indigo-900/30 flex items-center justify-center text-blue-400 text-8xl">
                <IoMdRocket />
              </div>
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full border-2 border-blue-400/20 border-dashed"
              />
            </motion.div>

            <div>
              <h2 className="text-4xl font-bold text-blue-100 mb-6 flex items-center">
                <FaGlobe className="mr-3 text-green-400" /> Our Mission
              </h2>
              <p className="text-lg text-blue-200/90 leading-relaxed mb-6">
                We're on a mission to launch artistic careers into orbit while giving collectors front-row seats
                to the most exciting creative works in the universe. Our platform is designed to:
              </p>
              <ul className="space-y-3">
                {[
                  "Connect artists with their ideal audiences",
                  "Provide secure transactions with cosmic-level encryption",
                  "Offer intuitive tools for showcasing and discovering art",
                  "Create a community that celebrates all forms of creativity"
                ].map((item, i) => (
                  <li key={i} className="flex items-start">
                    <span className="text-blue-400 mr-2 mt-1">✦</span>
                    <span className="text-blue-200/90">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.section>

        {/* Features Section */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ amount: 0.2 }}
          transition={{ duration: 0.8 }}
          className="max-w-6xl mx-auto mb-32 relative z-10"
        >
          <h2 className="text-4xl font-bold text-center text-blue-100 mb-16 relative">
            <span className="relative inline-block">
              Our Stellar Features
              <motion.span
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                transition={{ duration: 1 }}
                className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-transparent"
              />
            </span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: <FaShieldAlt className="text-4xl" />, title: "Secure Authentication", desc: "Military-grade encryption protecting your data" },
              { icon: <FaMobileAlt className="text-4xl" />, title: "Mobile Optimized", desc: "Beautiful experience on any device" },
              { icon: <FaHeart className="text-4xl" />, title: "Like & Save", desc: "Bookmark your favorite artworks" },
              { icon: <FaShare className="text-4xl" />, title: "Social Sharing", desc: "Share masterpieces with friends" },
              { icon: <FaDownload className="text-4xl" />, title: "Download Options", desc: "High-res downloads for collectors" },
              { icon: <FaUsers className="text-4xl" />, title: "Community", desc: "Connect with fellow art enthusiasts" },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                viewport={{ amount: 0.2 }}
                whileHover={{ y: -10 }}
                className="bg-gradient-to-br from-[#121E3A] to-[#0A0F1F] p-8 rounded-xl shadow-lg shadow-blue-900/20 border border-blue-900/30"
              >
                <div className="text-blue-400 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-blue-100 mb-2">{feature.title}</h3>
                <p className="text-blue-200/80">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Team Section */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ amount: 0.2 }}
          transition={{ duration: 0.8 }}
          className="max-w-6xl mx-auto mb-32 relative z-10"
        >
          <h2 className="text-4xl font-bold text-center text-blue-100 mb-16 relative">
            <span className="relative inline-block">
              Meet Our Cosmic Crew
              <motion.span
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                transition={{ duration: 1 }}
                className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-transparent"
              />
            </span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {Team_Members.map((member, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                viewport={{ amount: 0.2 }}
                onHoverStart={() => setHoveredTeamMember(i)}
                onHoverEnd={() => setHoveredTeamMember(null)}
                className="relative group overflow-hidden rounded-xl bg-gradient-to-br from-[#121E3A] to-[#0A0F1F] p-6 shadow-lg shadow-blue-900/20 border border-blue-900/30"
              >
                <div className="relative z-10">
                  <div className="w-32 h-32 mx-auto mb-6 rounded-full border-4 border-blue-400/50 overflow-hidden shadow-lg">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-blue-100 text-center mb-1">{member.name}</h3>
                  <p className="text-blue-400 text-center mb-4">{member.role}</p>
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{
                      opacity: hoveredTeamMember === i ? 1 : 0,
                      height: hoveredTeamMember === i ? "auto" : 0
                    }}
                    className="overflow-hidden text-center"
                  >
                    <a
                      href={`mailto:${member.email}`}
                      className="text-blue-300 hover:text-blue-200 text-sm"
                    >
                      {member.email}
                    </a>
                  </motion.div>
                </div>

                {/* Animated background elements */}
                {hoveredTeamMember === i && (
                  <>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.5 }}
                      className="absolute inset-0 bg-gradient-to-br from-blue-900/10 to-purple-900/10"
                    />
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      className="absolute -bottom-20 -right-20 w-40 h-40 rounded-full border-2 border-blue-400/20"
                    />
                  </>
                )}
              </motion.div>
            ))}
          </div>

          <h2 className="text-4xl font-bold text-center text-blue-100 mb-16 mt-16 relative">
            <span className="relative inline-block">
              "-Ignore the hate, show the world that we love the opps"
              <motion.span
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                transition={{ duration: 1 }}
                className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-transparent"
              />
            </span>
          </h2>
        </motion.section>

        {/* Contact Section */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ amount: 0.2 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto relative z-10"
        >
          <div className="bg-gradient-to-br from-[#121E3A] to-[#0A0F1F] rounded-2xl p-12 shadow-2xl shadow-blue-900/20 border border-blue-900/30 text-center">
            <h2 className="text-4xl font-bold text-blue-100 mb-6">Ready to Explore?</h2>
            <p className="text-xl text-blue-200/80 mb-10 max-w-2xl mx-auto">
              Join our cosmic art community today or reach out if you have questions about our galaxy of features.
            </p>

            <div className="flex flex-wrap justify-center gap-8">
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="mailto:aoieservices247@gmail.com"
                className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg text-white font-medium shadow-lg hover:shadow-blue-500/30"
              >
                <IoMdMail className="text-xl" />
                Email Us
              </motion.a>

              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="https://instagram.com/karan007k_"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg text-white font-medium shadow-lg hover:shadow-pink-500/30"
              >
                <BsInstagram className="text-xl" />
                Instagram
              </motion.a>
            </div>
          </div>
        </motion.section>
      </div>
    </>
  );
};

export default About_us;