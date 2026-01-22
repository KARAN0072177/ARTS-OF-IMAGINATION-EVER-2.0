import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaExclamationTriangle, FaRocket, FaHome, FaSatellite, FaUserAstronaut } from "react-icons/fa";
import { GiSpaceship, GiBlackHoleBolas, GiGalaxy, GiRingedPlanet } from "react-icons/gi";
import { RiAliensFill, RiEarthFill } from "react-icons/ri";
import { IoPlanetSharp } from "react-icons/io5";
import { BsStars } from "react-icons/bs";

const NotFound = () => {
  const navigate = useNavigate();
  const [isHovering, setIsHovering] = useState(false);
  const [isExploring, setIsExploring] = useState(false);
  const [showConstellation, setShowConstellation] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [cursorVariant, setCursorVariant] = useState("default");
  const [stars, setStars] = useState([]);

  // Initialize stars for background
  useEffect(() => {
    const newStars = Array.from({ length: 100 }).map(() => ({
      id: Math.random().toString(36).substring(7),
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      opacity: Math.random() * 0.8 + 0.2,
      delay: Math.random() * 5
    }));
    setStars(newStars);

    // Mouse position tracker for parallax effects
    const handleMouseMove = (e) => {
      setMousePosition({
        x: e.clientX / window.innerWidth - 0.5,
        y: e.clientY / window.innerHeight - 0.5
      });
    };
    window.addEventListener('mousemove', handleMouseMove);

    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Floating space objects data with more variety
  const spaceObjects = [
    { icon: <GiSpaceship className="text-blue-400" />, size: 24, delay: 0, speed: 10 },
    { icon: <RiAliensFill className="text-green-400" />, size: 28, delay: 0.3, speed: 15 },
    { icon: <GiBlackHoleBolas className="text-purple-500" />, size: 32, delay: 0.6, speed: 12 },
    { icon: <FaRocket className="text-yellow-400" />, size: 22, delay: 0.9, speed: 8 },
    { icon: <GiGalaxy className="text-pink-400" />, size: 36, delay: 1.2, speed: 20 },
    { icon: <IoPlanetSharp className="text-orange-300" />, size: 30, delay: 1.5, speed: 18 },
    { icon: <FaSatellite className="text-teal-300" />, size: 26, delay: 1.8, speed: 14 },
    { icon: <RiEarthFill className="text-blue-300" />, size: 34, delay: 2.1, speed: 16 }
  ];

  // Constellation lines data
  const constellationLines = [
    { start: { x: 20, y: 30 }, end: { x: 40, y: 50 } },
    { start: { x: 40, y: 50 }, end: { x: 60, y: 30 } },
    { start: { x: 60, y: 30 }, end: { x: 80, y: 50 } },
    { start: { x: 80, y: 50 }, end: { x: 70, y: 70 } },
    { start: { x: 70, y: 70 }, end: { x: 50, y: 60 } },
    { start: { x: 50, y: 60 }, end: { x: 30, y: 70 } },
    { start: { x: 30, y: 70 }, end: { x: 20, y: 50 } },
    { start: { x: 20, y: 50 }, end: { x: 20, y: 30 } }
  ];

  // Play sound effect
  const playSound = () => {
    setAudioPlaying(true);
    const audio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-space-coin-echo-1126.mp3');
    audio.play().then(() => {
      setTimeout(() => setAudioPlaying(false), 3000);
    });
  };

  // Custom cursor variants
  const cursorVariants = {
    default: {
      x: mousePosition.x * 20,
      y: mousePosition.y * 20,
      transition: { type: "spring", mass: 0.1 }
    },
    hover: {
      scale: 2,
      backgroundColor: "rgba(255, 255, 255, 0.2)",
      backdropFilter: "blur(2px)",
      transition: { duration: 0.2 }
    },
    click: {
      scale: 0.8,
      backgroundColor: "rgba(255, 255, 255, 0.4)",
      transition: { duration: 0.1 }
    }
  };

  // Interactive exploration mode
  const toggleExploreMode = () => {
    setIsExploring(!isExploring);
    if (!isExploring) {
      document.body.style.cursor = 'none';
    } else {
      document.body.style.cursor = 'auto';
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 px-6 text-center overflow-hidden">
      {/* Interactive starry background */}
      {stars.map((star) => (
        <motion.div
          key={star.id}
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: [0, star.opacity, 0],
            scale: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 5 + Math.random() * 10,
            repeat: Infinity,
            repeatType: "reverse",
            delay: star.delay
          }}
          className="absolute rounded-full bg-white"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            boxShadow: `0 0 ${star.size * 2}px ${star.size}px rgba(255, 255, 255, 0.2)`
          }}
        />
      ))}

      {/* Parallax galaxy layer */}
      <motion.div 
        className="absolute w-full h-full opacity-20 pointer-events-none"
        animate={{
          x: mousePosition.x * 50,
          y: mousePosition.y * 50
        }}
        transition={{ type: "spring", stiffness: 100 }}
      >
        <GiGalaxy className="text-blue-400 text-9xl absolute top-1/4 left-1/4" />
        <GiGalaxy className="text-purple-400 text-7xl absolute top-3/4 right-1/4" />
        <GiRingedPlanet className="text-yellow-300 text-6xl absolute bottom-1/4 left-1/3" />
      </motion.div>

      {/* Animated space objects with parallax effect */}
      {spaceObjects.map((obj, index) => (
        <motion.div
          key={index}
          initial={{ 
            opacity: 0,
            x: Math.random() * 100 - 50,
            y: Math.random() * 100 - 50
          }}
          animate={{
            opacity: [0.2, 0.8, 0.2],
            x: [0, Math.random() * 200 - 100 + mousePosition.x * 40],
            y: [0, Math.random() * 200 - 100 + mousePosition.y * 40],
            rotate: [0, 360]
          }}
          transition={{
            duration: obj.speed + Math.random() * 10,
            repeat: Infinity,
            repeatType: "reverse",
            delay: obj.delay
          }}
          className="absolute pointer-events-none"
          style={{
            fontSize: `${obj.size}px`
          }}
        >
          {obj.icon}
        </motion.div>
      ))}

      {/* Constellation effect */}
      {showConstellation && (
        <div className="absolute inset-0 pointer-events-none">
          <svg className="w-full h-full">
            {constellationLines.map((line, index) => (
              <motion.line
                key={index}
                x1={`${line.start.x}%`}
                y1={`${line.start.y}%`}
                x2={`${line.end.x}%`}
                y2={`${line.end.y}%`}
                stroke="rgba(99, 102, 241, 0.5)"
                strokeWidth="2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1 }}
              />
            ))}
          </svg>
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                left: `${[20, 40, 60, 80, 70, 50, 30, 20][i]}%`,
                top: `${[30, 50, 30, 50, 70, 60, 70, 50][i]}%`,
                width: '8px',
                height: '8px',
                boxShadow: '0 0 10px 5px rgba(99, 102, 241, 0.5)'
              }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.1 + 0.8 }}
            />
          ))}
        </div>
      )}

      {/* Custom cursor for explore mode */}
      {isExploring && (
        <motion.div
          className="fixed w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm pointer-events-none z-50"
          variants={cursorVariants}
          animate={cursorVariant}
          style={{
            left: mousePosition.x * 20 + window.innerWidth / 2,
            top: mousePosition.y * 20 + window.innerHeight / 2
          }}
        />
      )}

      {/* Main content container */}
      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Interactive header with particle trail */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="relative mb-12"
          onMouseEnter={() => setCursorVariant("hover")}
          onMouseLeave={() => setCursorVariant("default")}
          onMouseDown={() => setCursorVariant("click")}
          onMouseUp={() => setCursorVariant("hover")}
        >
          <h1 className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 mb-4 relative">
            <span className="drop-shadow-[0_0_15px_rgba(99,102,241,0.7)]">4</span>
            <span className="drop-shadow-[0_0_15px_rgba(236,72,153,0.7)]">0</span>
            <span className="drop-shadow-[0_0_15px_rgba(59,130,246,0.7)]">4</span>
            
            {/* Particle trail effect */}
            <AnimatePresence>
              {isExploring && (
                <motion.div
                  className="absolute inset-0 overflow-hidden"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {[...Array(30)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute rounded-full bg-white"
                      initial={{
                        x: mousePosition.x * 100,
                        y: mousePosition.y * 100,
                        opacity: 1,
                        scale: 1
                      }}
                      animate={{
                        x: mousePosition.x * 100 + (Math.random() * 200 - 100),
                        y: mousePosition.y * 100 + (Math.random() * 200 - 100),
                        opacity: 0,
                        scale: 0
                      }}
                      transition={{
                        duration: 2,
                        delay: i * 0.05
                      }}
                      style={{
                        width: `${Math.random() * 6 + 2}px`,
                        height: `${Math.random() * 6 + 2}px`
                      }}
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </h1>
          
          {/* Advanced glitch effect */}
          <div className="absolute inset-0 flex justify-center mt-16">
            <span className="absolute text-9xl opacity-10 animate-glitch-1 text-blue-400">404</span>
            <span className="absolute text-9xl opacity-10 animate-glitch-2 text-pink-400">404</span>
            <span className="absolute text-9xl opacity-5 animate-glitch-3 text-white">404</span>
          </div>
        </motion.div>

        {/* Warning icon with interactive effects */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring" }}
          className="relative inline-block mt-6"
          onHoverStart={() => {
            setIsHovering(true);
            setCursorVariant("hover");
          }}
          onHoverEnd={() => {
            setIsHovering(false);
            setCursorVariant("default");
          }}
          onClick={playSound}
          whileTap={{ scale: 0.9 }}
        >
          <motion.div
            animate={{
              rotate: isHovering ? [0, 10, -10, 0] : 0,
              scale: isHovering ? 1.1 : 1
            }}
            transition={{ duration: 0.5 }}
          >
            <FaExclamationTriangle className="text-red-500 text-6xl drop-shadow-lg z-10 relative" />
          </motion.div>
          
          {/* Particle burst effect */}
          <AnimatePresence>
            {isHovering && (
              <>
                {[...Array(12)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ 
                      opacity: 1,
                      scale: 0,
                      x: 0,
                      y: 0
                    }}
                    animate={{
                      opacity: [1, 0],
                      scale: [0, 1.5],
                      x: Math.cos(i * 30 * (Math.PI/180)) * 80,
                      y: Math.sin(i * 30 * (Math.PI/180)) * 80
                    }}
                    exit={{ opacity: 0 }}
                    transition={{ 
                      duration: 0.8,
                      ease: "easeOut"
                    }}
                    className="absolute inset-0 rounded-full"
                    style={{
                      left: '50%',
                      top: '50%',
                      marginLeft: -4,
                      marginTop: -4,
                      width: '8px',
                      height: '8px',
                      background: `hsl(${i * 30}, 100%, 50%)`,
                      boxShadow: `0 0 10px hsl(${i * 30}, 100%, 50%)`
                    }}
                  />
                ))}
              </>
            )}
          </AnimatePresence>
          
          {/* Sound wave effect when audio plays */}
          <AnimatePresence>
            {audioPlaying && (
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1.5, opacity: 0.3 }}
                exit={{ scale: 2, opacity: 0 }}
                transition={{ duration: 0.8 }}
                className="absolute inset-0 rounded-full bg-blue-400 -z-10"
              />
            )}
          </AnimatePresence>
        </motion.div>

        {/* Error message with advanced typing and morphing effect */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 max-w-lg mx-auto"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 h-12">
            <motion.span
              className="inline-block overflow-hidden whitespace-nowrap"
              animate={{
                width: ["0%", "100%", "100%"],
                opacity: [0, 1, 1]
              }}
              transition={{
                duration: 2,
                times: [0, 0.8, 1]
              }}
            >
              Houston, we have a problem!
            </motion.span>
          </h2>
          <motion.p
            className="text-gray-300 text-lg leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            The page you're looking for has been abducted by aliens, drifted into a black hole, 
            or never existed in this dimension. Would you like to report this anomaly to the 
            <span 
              className="text-blue-300 cursor-help underline underline-offset-4"
              onMouseEnter={() => setShowConstellation(true)}
              onMouseLeave={() => setShowConstellation(false)}
            >
              Intergalactic Web Patrol
            </span>?
          </motion.p>
        </motion.div>

        {/* Interactive buttons with advanced effects */}
        <motion.div
          className="flex flex-col sm:flex-row justify-center gap-4 mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          <motion.button
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 0 20px rgba(59, 130, 246, 0.7)"
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/")}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold rounded-lg flex items-center justify-center gap-3 relative overflow-hidden group"
            onMouseEnter={() => setCursorVariant("hover")}
            onMouseLeave={() => setCursorVariant("default")}
          >
            <FaHome className="text-xl" />
            <span>Beam Me Home</span>
            
            {/* Button shine effect */}
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 400, opacity: [0, 0.5, 0] }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                delay: 1.5
              }}
              className="absolute inset-y-0 w-20 bg-white/30 skew-x-[-30deg]"
            />
            
            {/* Hover particles */}
            <div className="absolute inset-0 overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {[...Array(10)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full bg-white/50"
                  initial={{
                    x: Math.random() * 100,
                    y: Math.random() * 100,
                    opacity: 0,
                    scale: 0
                  }}
                  animate={{
                    x: Math.random() * 100,
                    y: Math.random() * 100,
                    opacity: [0, 0.8, 0],
                    scale: [0, Math.random() + 0.5, 0]
                  }}
                  transition={{
                    duration: 2 + Math.random() * 3,
                    repeat: Infinity,
                    delay: Math.random() * 2
                  }}
                  style={{
                    width: `${Math.random() * 6 + 2}px`,
                    height: `${Math.random() * 6 + 2}px`
                  }}
                />
              ))}
            </div>
          </motion.button>

          <motion.button
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 0 20px rgba(236, 72, 153, 0.7)"
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.history.back()}
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold rounded-lg flex items-center justify-center gap-3 group relative overflow-hidden"
            onMouseEnter={() => setCursorVariant("hover")}
            onMouseLeave={() => setCursorVariant("default")}
          >
            <FaRocket className="text-xl" />
            <span>Back to Safety</span>
            
            {/* Button pulse effect */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1.2, opacity: [0, 0.3, 0] }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                delay: 0.5
              }}
              className="absolute inset-0 rounded-lg bg-white/20"
            />
          </motion.button>
        </motion.div>

        {/* Explore mode toggle */}
        <motion.div
          className="mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8 }}
        >
          <button
            onClick={toggleExploreMode}
            className="px-6 py-3 bg-gray-800/50 border border-gray-700 rounded-full text-gray-300 hover:text-white hover:bg-gray-700/50 transition-all flex items-center gap-2 group"
          >
            <BsStars className="text-yellow-300 group-hover:animate-pulse" />
            <span>{isExploring ? "Exit Exploration Mode" : "Enter Exploration Mode"}</span>
          </button>
        </motion.div>

        {/* Easter egg - interactive astronaut */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 0.7, y: 0 }}
          transition={{ delay: 2.1 }}
          whileHover={{ opacity: 1, scale: 1.2 }}
          onClick={() => {
            alert("🚀 Astronaut tip: Try moving your mouse around in Exploration Mode!");
            playSound();
          }}
          className="mt-12 cursor-pointer flex flex-col items-center"
          onMouseEnter={() => setCursorVariant("hover")}
          onMouseLeave={() => setCursorVariant("default")}
        >
          <FaUserAstronaut className="text-blue-300 text-5xl mb-2" />
          <motion.p 
            className="text-gray-400 text-sm"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            Click me!
          </motion.p>
        </motion.div>
      </div>

      {/* CSS for advanced animations */}
      <style jsx>{`
        @keyframes glitch-1 {
          0%, 100% { transform: translate(0); clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%); }
          20% { transform: translate(-5px, 5px); clip-path: polygon(0 25%, 100% 25%, 100% 30%, 0 30%); }
          40% { transform: translate(-5px, -5px); clip-path: polygon(0 50%, 100% 50%, 100% 55%, 0 55%); }
          60% { transform: translate(5px, 5px); clip-path: polygon(0 70%, 100% 70%, 100% 75%, 0 75%); }
          80% { transform: translate(5px, -5px); clip-path: polygon(0 90%, 100% 90%, 100% 95%, 0 95%); }
        }
        @keyframes glitch-2 {
          0%, 100% { transform: translate(0); filter: hue-rotate(0deg); }
          10% { transform: translate(-5px, 0) skew(10deg); filter: hue-rotate(30deg); }
          30% { transform: translate(0, -5px) skew(-5deg); filter: hue-rotate(60deg); }
          50% { transform: translate(0, 5px) skew(5deg); filter: hue-rotate(90deg); }
          70% { transform: translate(5px, 0) skew(-10deg); filter: hue-rotate(120deg); }
          90% { transform: translate(-5px, 0) skew(5deg); filter: hue-rotate(150deg); }
        }
        @keyframes glitch-3 {
          0%, 100% { opacity: 0.1; }
          25% { opacity: 0.3; transform: translate(3px, -3px); }
          50% { opacity: 0.1; transform: translate(-3px, 3px); }
          75% { opacity: 0.3; transform: translate(-3px, -3px); }
        }
        .animate-glitch-1 {
          animation: glitch-1 2s infinite alternate;
        }
        .animate-glitch-2 {
          animation: glitch-2 3s infinite alternate;
        }
        .animate-glitch-3 {
          animation: glitch-3 4s infinite alternate;
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </div>
  );
};

export default NotFound;