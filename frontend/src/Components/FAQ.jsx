import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronDown, FaChevronUp, FaQuestionCircle, FaStar, FaRocket, FaLightbulb } from 'react-icons/fa';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  
  const particlesInit = async (engine) => {
    await loadFull(engine);
  };

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqItems = [
    {
      question: "How do I get started with Arts of Imagination Ever?",
      answer: "Getting started is easy! Simply create an account, explore our gallery for inspiration, and begin uploading your artwork. We offer tutorials and resources to help you along your creative journey.",
      icon: <FaRocket className="text-blue-400" />
    },
    {
      question: "What types of artwork can I share on the platform?",
      answer: "We welcome all forms of digital art including illustrations, 3D renders, digital paintings, concept art, and more. Our platform supports JPG, PNG, and GIF formats with file sizes up to 20MB.",
      icon: <FaLightbulb className="text-yellow-400" />
    },
    {
      question: "How can I connect with other artists?",
      answer: "Join our community forums, participate in weekly challenges, or comment on artworks you admire. We also host live Q&A sessions with professional artists every month.",
      icon: <FaStar className="text-purple-400" />
    },
    {
      question: "Are there any fees for using the platform?",
      answer: "Our basic features are completely free! We offer premium memberships with additional tools and benefits, but you can enjoy most of what Arts of Imagination Ever offers without any cost.",
      icon: <FaQuestionCircle className="text-green-400" />
    }
  ];

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#0A0F1F] to-[#050914] overflow-hidden">
      {/* Enhanced Particles Background */}
      <div className="absolute inset-0 z-0">
        <Particles
          id="tsparticles"
          init={particlesInit}
          options={{
            fullScreen: { 
              enable: true,
              zIndex: -1 
            },
            particles: {
              number: {
                value: 80,
                density: {
                  enable: true,
                  value_area: 1000
                }
              },
              color: {
                value: ["#6366f1", "#8b5cf6", "#ec4899", "#3b82f6"]
              },
              shape: {
                type: "circle",
                stroke: {
                  width: 0,
                  color: "#000000"
                },
              },
              opacity: {
                value: 0.7,
                random: true,
                anim: {
                  enable: true,
                  speed: 1,
                  opacity_min: 0.1,
                  sync: false
                }
              },
              size: {
                value: { min: 1, max: 5 },
                random: true,
                anim: {
                  enable: true,
                  speed: 4,
                  size_min: 0.3,
                  sync: false
                }
              },
              links: {
                enable: true,
                distance: 180,
                color: "#3b82f6",
                opacity: 0.4,
                width: 1,
                triangles: {
                  enable: true,
                  color: "#6366f1",
                  opacity: 0.1
                }
              },
              move: {
                enable: true,
                speed: 1.5,
                direction: "none",
                random: true,
                straight: false,
                out_mode: "out",
                bounce: false,
                attract: {
                  enable: true,
                  rotateX: 800,
                  rotateY: 1600
                }
              }
            },
            interactivity: {
              detect_on: "window",
              events: {
                onhover: {
                  enable: true,
                  mode: "bubble"
                },
                onclick: {
                  enable: true,
                  mode: "push"
                },
                resize: true
              },
              modes: {
                bubble: {
                  distance: 200,
                  size: 6,
                  duration: 2,
                  opacity: 0.8,
                },
                push: {
                  particles_nb: 6
                }
              }
            },
            retina_detect: true,
            background: {
              color: "transparent"
            }
          }}
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <motion.h2 
            className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, ease: "easeOut" }}
          >
            Frequently Asked Questions
          </motion.h2>
          <motion.p
            className="text-lg text-[#D1D5DB] max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, ease: "easeOut" }}
          >
            Find answers to common questions about our platform and community.
          </motion.p>
        </motion.div>

        <motion.div 
          className="max-w-4xl mx-auto space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, ease: "easeOut" }}
        >
          {faqItems.map((item, index) => (
            <motion.div
              key={index}
              className="bg-[#0e0e22]/80 backdrop-blur-sm rounded-xl overflow-hidden border border-blue-900/30 shadow-lg"
              whileHover={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <motion.button
                className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                onClick={() => toggleAccordion(index)}
                initial={false}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center space-x-4">
                  <motion.div
                    className="p-3 rounded-full bg-[#1a1a3a]"
                    animate={{ rotate: activeIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    {item.icon}
                  </motion.div>
                  <h3 className="text-lg md:text-xl font-medium text-[#E5E7EB]">
                    {item.question}
                  </h3>
                </div>
                <motion.div
                  animate={{ rotate: activeIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  {activeIndex === index ? (
                    <FaChevronUp className="text-blue-400" />
                  ) : (
                    <FaChevronDown className="text-blue-400" />
                  )}
                </motion.div>
              </motion.button>

              <AnimatePresence>
                {activeIndex === index && (
                  <motion.div
                    className="overflow-hidden"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ 
                      opacity: 1, 
                      height: 'auto',
                      transition: {
                        opacity: { duration: 0.2, ease: "easeOut" },
                        height: { 
                          duration: 0.3, 
                          ease: [0.04, 0.62, 0.23, 0.98] 
                        }
                      }
                    }}
                    exit={{ 
                      opacity: 0, 
                      height: 0,
                      transition: {
                        opacity: { duration: 0.15, ease: "easeIn" },
                        height: { 
                          duration: 0.25, 
                          ease: [0.04, 0.62, 0.23, 0.98] 
                        }
                      }
                    }}
                  >
                    <div className="px-6 pb-6 text-[#D1D5DB]">
                      <div className="pl-16 pr-4">
                        <div className="border-l-2 border-blue-500/30 pl-4">
                          <p className="text-[#D1D5DB]">{item.answer}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>

        {/* Floating decorative elements */}
        <motion.div
          className="absolute -right-20 top-1/3 w-40 h-40 rounded-full bg-purple-600/10 blur-3xl"
          animate={{
            y: [0, -20, 0],
            scale: [1, 1.05, 1]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute -left-20 bottom-1/4 w-48 h-48 rounded-full bg-blue-600/10 blur-3xl"
          animate={{
            y: [0, 20, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
      </div>
    </div>
  );
};

export default FAQ;