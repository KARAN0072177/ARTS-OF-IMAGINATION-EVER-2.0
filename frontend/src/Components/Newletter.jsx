import React, { useState, useRef, useEffect } from "react";
import { IoMdMail } from "react-icons/io";
import { FaRegPaperPlane } from "react-icons/fa";
import { MdOutlineNewspaper } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import Confetti from "react-confetti";
import useWindowSize from "react-use/lib/useWindowSize";

export const Newletter = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [inputFocused, setInputFocused] = useState(false);
  const [shake, setShake] = useState(false);
  const newsletterRef = useRef(null);
  const fullText = "Be The First Who See The News";
  const { width, height } = useWindowSize();
  const [loadingText, setLoadingText] = useState("Subscribing");

// Typewriter Effect with Reverse Animation & 5s Pause at End
useEffect(() => {
  let index = 1; // Start from 1 so "B" is always visible
  let isDeleting = false;

  const startTyping = () => {
    const interval = setInterval(() => {
      if (isDeleting) {
        index--;
        setTypedText(fullText.slice(0, index));

        if (index === 1) {
          isDeleting = false;
          clearInterval(interval); // Restart typing immediately
          startTyping();
        }
      } else {
        index++;
        setTypedText(fullText.slice(0, index));

        if (index === fullText.length) {
          clearInterval(interval); // Stop the current interval
          setTimeout(() => {
            isDeleting = true; // After 5s, start deleting
            startTyping(); // Restart the process
          }, 3000); // 5 seconds delay before deleting
        }
      }
    }, 100);
  };

  startTyping();

  return () => clearInterval(); // Cleanup on unmount
}, []);


  // Email validation function
  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  useEffect(() => {
    if (!loading) return;

    const loadingStates = ["Subscribing", "Subscribing.", "Subscribing..", "Subscribing..."];
    let index = 0;

    const interval = setInterval(() => {
      setLoadingText(loadingStates[index]);
      index = (index + 1) % loadingStates.length; // Loops through the array
    }, 500);

    return () => clearInterval(interval);
  }, [loading]);

  // Handle form submission
  const handleSubscribe = async () => {
    if (!isValidEmail(email)) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/newsletter/subscribe",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      if (response.ok) {
        setShowPopup(true);
        setEmail(""); // Reset input field after subscription
      }
    } catch (error) {
      console.error("Subscription failed:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle animation on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (!newsletterRef.current) return;
      const rect = newsletterRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      if (rect.top < windowHeight * 0.8 && rect.bottom > 0) {
        newsletterRef.current.style.animation = "fadeIn 0.6s ease-out forwards";
      } else {
        newsletterRef.current.style.animation = "fadeOut 0.6s ease-out forwards";
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(50px); }
            to { opacity: 1; transform: translateY(0); }
          }

          @keyframes fadeOut {
            from { opacity: 1; transform: translateY(0); }
            to { opacity: 0; transform: translateY(50px); }
          }

          @keyframes blink {
            50% { opacity: 0; }
          }

          .cursor {
            display: inline-block;
            width: 5px;
            height: 30px;
            background-color: #38BDF8;
            animation: blink 0.8s infinite;
            margin-left: 2px;
          }

          @keyframes shake {
            0% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            50% { transform: translateX(5px); }
            75% { transform: translateX(-5px); }
            100% { transform: translateX(0); }
          }

          .shake {
            animation: shake 0.3s ease-in-out;
          }

          .input-focused {
            box-shadow: 0 0 15px #60A5FA;
            border-color: #60A5FA;
          }

          .subscribe-btn {
            transition: all 0.3s ease;
            background: #38BDF8;
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            font-weight: bold;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            min-width: 170px;
          }

          .icon {
            font-size: 1.2rem;
          }

          .subscribe-btn:hover {
            transform: scale(1.05);
            box-shadow: 0 4px 10px rgba(56, 189, 248, 0.5);
          }

          .popup {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(10px);
            padding: 20px;
            border-radius: 10px;
            text-align: center;
            color: white;
            z-index: 1000;
            width: 300px;
            animation: fadeInPopup 0.4s ease-out;
          }

          @keyframes fadeInPopup {
            from { opacity: 0; transform: translate(-50%, -55%); }
            to { opacity: 1; transform: translate(-50%, -50%); }
          }

          @keyframes fadeOutPopup {
            from { opacity: 1; transform: translate(-50%, -50%); }
            to { opacity: 0; transform: translate(-50%, -55%); }
          }

          .popup.fade-out {
            animation: fadeOutPopup 0.4s ease-in forwards;
          }

          .popup-close {
            position: absolute;
            top: 5px;
            right: 10px;
            cursor: pointer;
            font-size: 20px;
          }
        `}
      </style>

      {/* Confetti Popup 🎊 - Moved outside newsletter container */}
      {showPopup && (
        <>
          {/* Confetti Wrapper - Ensures it Stays on Top */}
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              pointerEvents: "none", // Ensures it doesn't block clicks
              zIndex: 9999, // Keeps it above all other components
            }}
          >
            <Confetti width={width} height={height} numberOfPieces={300} recycle={false} />
          </div>

          {/* Popup Message */}
          <div className={`popup ${!showPopup ? "fade-out" : ""}`}>
            <IoClose className="popup-close" onClick={() => setShowPopup(false)} />
            <h2 className="text-2xl font-bold">🎉 Subscription Successful! 🎉</h2>
            <p className="text-sm mt-2">Thank you for subscribing!</p>
          </div>
        </>
      )}

      <div
        ref={newsletterRef}
        className="newsletter-container md:p-4 bg-black p-2 pb-4 md:mb-0 md:py-9"
      >
        <div className="flex text-center gap-3 px-2 justify-center items-center flex-col">
          <h1 className="font-bold text-[#E5E7EB] text-4xl flex items-center gap-2">
            <MdOutlineNewspaper className="text-[#38BDF8]" />
            {typedText}
            <span className="cursor"></span>
          </h1>
          <p className="text-[#D1D5DB]">
          Artistry Unveiled: Be the First to See Stunning Creations!
          </p>
        </div>

        <div className="mt-4 px-2">
          <div className="flex md:flex-row flex-col justify-center items-center gap-3">
            <input
              className={`md:w-64 w-full px-5 py-2 shadow-[0_0_10px_#93C5FD] rounded-lg outline-none transition-all duration-300 ${shake ? "shake" : ""} ${inputFocused ? "input-focused" : ""}`}
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setInputFocused(true)}
              onBlur={() => setInputFocused(false)}
            />
            <button className="subscribe-btn" onClick={handleSubscribe} disabled={loading}>
              {loading ? loadingText : <>Subscribe <FaRegPaperPlane className="icon" /></>}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};