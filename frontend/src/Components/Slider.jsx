import React, { useState, useEffect, useRef } from "react";
import { TfiAngleDoubleLeft, TfiAngleDoubleRight } from "react-icons/tfi";

const Slider = () => {
  const [selected, setSelected] = useState(0);
  const sliderRef = useRef(null); // Ref for tracking the slider
  const items = [
    { id: 1, color: "#393E46", img: "public/imgs/img1.jpg" },
    { id: 2, color: "#393E46", img: "public/imgs/img2.jpg" },
    { id: 3, color: "#393E46", img: "public/imgs/img3.jpg" },
    { id: 4, color: "#393E46", img: "public/imgs/img4.jpg" },
    { id: 5, color: "#393E46", img: "public/imgs/img5.jpg" },
  ];
  const radius = 400;

  useEffect(() => {
    const handleScroll = () => {
      if (!sliderRef.current) return;
      const rect = sliderRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      if (rect.top < windowHeight * 0.8 && rect.bottom > 0) {
        sliderRef.current.style.animation = "fadeIn 0.6s ease-out forwards";
      } else {
        sliderRef.current.style.animation = "fadeOut 0.6s ease-out forwards";
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Run once on mount
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 3000);
    return () => clearInterval(interval);
  }, [selected]);

  const handleNext = () => {
    setSelected((prev) => (prev + 1) % items.length);
  };

  const handlePrev = () => {
    setSelected((prev) => (prev - 1 + items.length) % items.length);
  };

  const handleDotClick = (index) => {
    setSelected(index);
  };

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

          .slider-container {
            opacity: 0;
          }
        `}
      </style>

      <div
        ref={sliderRef}
        className="slider-container h-[80vh] bg-black flex flex-col items-center justify-center relative overflow-hidden"
      >
        <h1 className="text-4xl text-[#E5E7EB] font-bold text-shadow-md md:mt-10 md:mb-8 mt-6 mx-5 text-center">
          Trending Collections
        </h1>

        <main
          id="carousel"
          className="relative w-full h-[60vh] sm:h-[70vh] md:h-[500px] flex items-center justify-center [transform-style:preserve-3d] [perspective:1200px]"
        >
          {items.map((item, index) => {
            const angle = ((index - selected) * 360) / items.length;
            return (
              <div
                key={item.id}
                className="absolute w-[150px] h-[200px] border-[4px] rounded-xl shadow-[#172554] shadow-md  sm:w-[250px] sm:h-[300px] md:w-[200px] md:h-[250px] transition-all duration-300"
                style={{
                  transform: `rotateY(${angle}deg) translateZ(${radius}px)`,
                }}
              >
                <img
                  className="w-full h-full object-cover rounded-lg"
                  src={item.img}
                  alt="Artwork"
                />
              </div>
            );
          })}
        </main>

        <div className="w-full flex mb-5 md:mb-0 justify-between md:absolute md:top-[50%] md:px-5 md:transform md:-translate-y-1/2 sm:relative sm:top-auto sm:mt-4">
          <button
            onClick={handlePrev}
            className="bg-[#1E40AF] text-[#D1D5DB] px-4 py-2 rounded hover:bg-[#1E3A8A] md:absolute md:left-10 sm:relative sm:mx-auto"
          >
            <TfiAngleDoubleLeft />
          </button>
          <button
            onClick={handleNext}
            className="bg-[#1E40AF] text-[#D1D5DB] px-4 py-2 rounded hover:bg-[#1E3A8A] md:absolute md:right-10 sm:relative sm:mx-auto"
          >
            <TfiAngleDoubleRight />
          </button>
        </div>

        <div className="absolute bottom-4 flex space-x-2">
          {items.map((item, index) => (
            <button
              key={item.id}
              onClick={() => handleDotClick(index)}
              className={`w-3 h-3 rounded-full ${
                selected === index ? "bg-[#1E3ABA]" : "bg-[#FFFF]"
              }`}
            ></button>
          ))}
        </div>
      </div>
    </>
  );
};

export default Slider;