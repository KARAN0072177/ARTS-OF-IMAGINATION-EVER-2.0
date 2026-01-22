import React from "react";
import {
  FaReact,
  FaNodeJs,
  FaDatabase,
  FaPython,
  FaShieldAlt,
  FaMobileAlt,
  FaHeart,
  FaUserShield,
  FaUsersCog,
  FaChartLine,
  FaCreditCard,
  FaHistory,
  FaGavel,
  FaUpload,
  FaUserCircle,
  FaEnvelope,
  FaBell,
  FaSync,
  FaComment,
  FaMoneyBillWave,
  FaLayerGroup,
  FaLightbulb,
  FaRocket
} from "react-icons/fa";
import { Helmet } from 'react-helmet-async';

const Documentation = () => {
  return (
    <>
      <Helmet>
        <title>Documentation | ARTS OF IMAGINATION EVER</title>
        <meta name="description" content="Technical documentation and feature overview for ARTS OF IMAGINATION EVER platform." />
        <meta property="og:title" content="Documentation | ARTS OF IMAGINATION EVER" />
        <meta property="og:description" content="Learn about the technologies, features, and future plans for our art platform." />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-black to-[#0F172A] text-[#E5E7EB] py-12 px-4 sm:px-6 mt-16">
        <div className="max-w-5xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent mb-4">
              Platform Documentation
            </h1>
            <p className="text-lg text-[#94A3B8] max-w-2xl mx-auto">
              Technical overview and feature documentation for ARTS OF IMAGINATION EVER
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-400 to-pink-500 mx-auto mt-4 rounded-full"></div>
          </div>

          {/* Tech Stack Section */}
          <section className="bg-[#1E293B] p-8 rounded-xl border border-[#334155] mb-10 hover:border-purple-400 transition-all duration-300">
            <h2 className="text-2xl font-semibold mb-6 text-white flex items-center gap-3">
              <FaRocket className="text-purple-400" /> Technology Stack
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: <FaReact className="text-blue-400 text-4xl" />,
                  title: "React JS",
                  description: "Frontend library for building interactive user interfaces"
                },
                {
                  icon: <FaNodeJs className="text-green-500 text-4xl" />,
                  title: "Node JS",
                  description: "JavaScript runtime for server-side operations"
                },
                {
                  icon: <FaDatabase className="text-yellow-400 text-4xl" />,
                  title: "MongoDB",
                  description: "NoSQL database for flexible data storage"
                },
                {
                  icon: <FaPython className="text-blue-500 text-4xl" />,
                  title: "Flask",
                  description: "Python microframework for backend services"
                },
                {
                  icon: <FaShieldAlt className="text-red-400 text-4xl" />,
                  title: "Express JS",
                  description: "Web application framework for Node.js"
                }
              ].map((tech, index) => (
                <div key={index} className="bg-[#0F172A] p-6 rounded-lg border border-[#1E293B] hover:border-[#334155] transition-colors">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 rounded-lg bg-opacity-20" style={{
                      backgroundColor: tech.icon.props.className.includes('text-blue-400') ? 'rgba(96, 165, 250, 0.1)' :
                        tech.icon.props.className.includes('text-green-500') ? 'rgba(34, 197, 94, 0.1)' :
                          tech.icon.props.className.includes('text-yellow-400') ? 'rgba(250, 204, 21, 0.1)' :
                            tech.icon.props.className.includes('text-blue-500') ? 'rgba(59, 130, 246, 0.1)' : 'rgba(248, 113, 113, 0.1)'
                    }}>
                      {tech.icon}
                    </div>
                    <h3 className="text-xl font-medium text-white">{tech.title}</h3>
                  </div>
                  <p className="text-[#94A3B8]">{tech.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Features Section */}
          <section className="bg-[#1E293B] p-8 rounded-xl border border-[#334155] mb-10 hover:border-pink-400 transition-all duration-300">
            <h2 className="text-2xl font-semibold mb-6 text-white flex items-center gap-3">
              <FaLightbulb className="text-pink-400" /> Platform Features
            </h2>
            
            <div className="space-y-6">
              {/* Authentication */}
              <div className="bg-[#0F172A] p-6 rounded-lg border border-[#1E293B]">
                <h3 className="text-xl font-semibold mb-4 text-white flex items-center gap-3">
                  <FaUserShield className="text-green-400" /> Authentication System
                </h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[#94A3B8]">
                  {[
                    "Secure password hashing (bcrypt)",
                    "Multi-login options (Email, Google, GitHub, Discord)",
                    "Login alerts and notifications",
                    "Secure session management",
                    "Account recovery system"
                  ].map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-green-400 mt-1">•</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* User Experience */}
              <div className="bg-[#0F172A] p-6 rounded-lg border border-[#1E293B]">
                <h3 className="text-xl font-semibold mb-4 text-white flex items-center gap-3">
                  <FaMobileAlt className="text-blue-400" /> User Experience
                </h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[#94A3B8]">
                  {[
                    "Fully responsive mobile-optimized design",
                    "Personalized recommendation system",
                    "Recent uploads section",
                    "Dedicated likes page",
                    "Personal profile management",
                    "User-friendly UI/UX design"
                  ].map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-blue-400 mt-1">•</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Content Management */}
              <div className="bg-[#0F172A] p-6 rounded-lg border border-[#1E293B]">
                <h3 className="text-xl font-semibold mb-4 text-white flex items-center gap-3">
                  <FaHeart className="text-red-400" /> Content Features
                </h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[#94A3B8]">
                  {[
                    "Image like/share/download system",
                    "Premium gallery access",
                    "Dedicated purchase history",
                    "Real-time updates on admin panel",
                    "Secure payment gateway integration"
                  ].map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-red-400 mt-1">•</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Administrative */}
              <div className="bg-[#0F172A] p-6 rounded-lg border border-[#1E293B]">
                <h3 className="text-xl font-semibold mb-4 text-white flex items-center gap-3">
                  <FaUsersCog className="text-yellow-400" /> Administrative Features
                </h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[#94A3B8]">
                  {[
                    "Dedicated admin panel",
                    "Content moderation tools",
                    "User management system",
                    "Analytics dashboard",
                    "Secure server infrastructure"
                  ].map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-yellow-400 mt-1">•</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Additional Features */}
              <div className="bg-[#0F172A] p-6 rounded-lg border border-[#1E293B]">
                <h3 className="text-xl font-semibold mb-4 text-white flex items-center gap-3">
                  <FaChartLine className="text-purple-400" /> Additional Features
                </h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[#94A3B8]">
                  {[
                    "Comprehensive legal pages",
                    "Contact us system",
                    "Newsletter signup",
                    "Login activity monitoring",
                    "Secure session handling"
                  ].map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-purple-400 mt-1">•</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* Future Enhancements */}
          <section className="bg-[#1E293B] p-8 rounded-xl border border-[#334155] hover:border-teal-400 transition-all duration-300">
            <h2 className="text-2xl font-semibold mb-6 text-white flex items-center gap-3">
              <FaRocket className="text-teal-400" /> Future Enhancements
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  icon: <FaComment className="text-blue-400 text-3xl" />,
                  title: "Comments System",
                  description: "Implement user comments on artworks with moderation tools"
                },
                {
                  icon: <FaMoneyBillWave className="text-green-400 text-3xl" />,
                  title: "More Payment Options",
                  description: "Add PayPal, cryptocurrency, and additional payment methods"
                },
                {
                  icon: <FaLayerGroup className="text-yellow-400 text-3xl" />,
                  title: "Improved Layouts",
                  description: "Enhanced gallery views and customizable user interfaces"
                },
                {
                  icon: <FaSync className="text-purple-400 text-3xl" />,
                  title: "Enhanced Recommendations",
                  description: "AI-powered suggestions based on user preferences and behavior"
                },
                {
                  icon: <FaUserCircle className="text-pink-400 text-3xl" />,
                  title: "Social Features",
                  description: "User following system and activity feeds"
                },
                {
                  icon: <FaBell className="text-red-400 text-3xl" />,
                  title: "Advanced Notifications",
                  description: "Customizable notification preferences and real-time updates"
                }
              ].map((enhancement, index) => (
                <div key={index} className="bg-[#0F172A] p-6 rounded-lg border border-[#1E293B] hover:border-[#334155] transition-colors">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 rounded-lg bg-opacity-20" style={{
                      backgroundColor: enhancement.icon.props.className.includes('text-blue-400') ? 'rgba(96, 165, 250, 0.1)' :
                        enhancement.icon.props.className.includes('text-green-400') ? 'rgba(74, 222, 128, 0.1)' :
                          enhancement.icon.props.className.includes('text-yellow-400') ? 'rgba(250, 204, 21, 0.1)' :
                            enhancement.icon.props.className.includes('text-purple-400') ? 'rgba(192, 132, 252, 0.1)' :
                              enhancement.icon.props.className.includes('text-pink-400') ? 'rgba(244, 114, 182, 0.1)' : 'rgba(248, 113, 113, 0.1)'
                    }}>
                      {enhancement.icon}
                    </div>
                    <h3 className="text-xl font-medium text-white">{enhancement.title}</h3>
                  </div>
                  <p className="text-[#94A3B8]">{enhancement.description}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default Documentation;