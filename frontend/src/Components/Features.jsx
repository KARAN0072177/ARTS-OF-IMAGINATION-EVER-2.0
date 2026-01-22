import React, { useEffect, useRef } from "react";
import { FaMobileAlt } from "react-icons/fa";
import { MdHighQuality } from "react-icons/md";
import { TbNoCopyright } from "react-icons/tb";
import { IoMdLock } from "react-icons/io";

export const Features = () => {
  const featureRefs = useRef([]);

  useEffect(() => {
    const handleScroll = () => {
      featureRefs.current.forEach((el) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        if (rect.top < windowHeight * 0.8 && rect.bottom > 0) {
          el.style.transition = "transform 0.4s ease-out, opacity 0.4s ease-out";
          el.style.opacity = "1";
          el.style.transform = "translateY(0) scale(1)"; // Scale = 1 (default)
        } else {
          el.style.opacity = "0";
          el.style.transform = "translateY(40px) scale(1)"; // Scale = 1 (default)
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleMouseEnter = (index) => {
    if (featureRefs.current[index]) {
      featureRefs.current[index].style.transform = "translateY(0) scale(1.07)"; // Scale up
    }
  };

  const handleMouseLeave = (index) => {
    if (featureRefs.current[index]) {
      featureRefs.current[index].style.transform = "translateY(0) scale(1)"; // Reset scale
    }
  };

  const data = [
    {
      icons: <FaMobileAlt />,
      name: "Mobile Friendly",
      description:
        "Experience smooth and seamless browsing across all devices, from smartphones to tablets. "
        + "Our platform is fully optimized to deliver a flawless user experience, no matter where you access it from.",
    },
    {
      icons: <MdHighQuality />,
      name: "High Quality Collection Upto 4K",
      description:
        "Immerse yourself in breathtaking visuals with images available in stunning 4K resolution. "
        + "Every detail is captured to ensure you enjoy exceptional clarity and quality.",
    },
    {
      icons: <TbNoCopyright />,
      name: "No Copyright Images",
      description:
        "Access a curated collection of non-copyrighted images, giving you the freedom to explore, "
        + "use, and enjoy artwork without legal concerns or restrictions.",
    },
    {
      icons: <IoMdLock />,
      name: "Secured Authentication",
      description:
        "Browse and shop with confidence knowing your data and transactions are protected. "
        + "Our advanced secured authentication ensures a safe and reliable experience for all users.",
    },
  ];

  return (
    <div className="bg-black p-10">
      <h1 className="text-center text-[#E5E7EB] font-bold text-4xl md:mt-5">
        Features
      </h1>

      <div className="flex flex-col text-[#D1D5DB] sm:flex-wrap md:flex-row md:gap-10 gap-5 sm:space-x-2 items-center justify-center mt-8">
        {data.map((val, index) => (
          <div
            key={index}
            ref={(el) => (featureRefs.current[index] = el)}
            className="feature-card flex flex-col cursor-pointer rounded-lg shadow-lg shadow-[#172554] h-80 p-7 md:mb-5 mb-3 text-center items-center w-72 gap-2"
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={() => handleMouseLeave(index)}
            style={{
              opacity: 0,
              transform: "translateY(40px) scale(1)",
              transition: "transform 0.4s ease-out, opacity 0.4s ease-out",
            }}
          >
            <div className="text-3xl text-[#1E40AF]">{val.icons}</div>
            <h1 className="font-bold text-[#E5E7EB]">{val.name}</h1>
            <p className="text-[#D1D5DB]">{val.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};