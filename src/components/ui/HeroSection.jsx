import React from "react";
import { useNavigate } from "react-router-dom";
import HeroImg1 from "@/assets/images/HeroImg1.jpg";
import HeroImg2 from "@/assets/images/HeroImg2.jpg";

const HeroSection = () => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <section className="bg-white pt-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Hero Content */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl lg:text-[56px] font-semibold text-[#9046CF] mb-6">
            Your Campus Companion
          </h1>
          <p className="text-sm sm:text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            Empowering your campus hustle with smart tools and seamless access,
            built for students, by students.
          </p>

          {/* CTA Buttons */}
          <div className="flex gap-5 sm:gap-8 justify-center">
            <button
              onClick={() => handleNavigation("/items")}
              className="bg-[#9046CF] text-white max-sm:w-full px-4 sm:px-8 py-2 sm:py-3 rounded-lg font-medium text-lg hover:bg-purple-700 transition-colors cursor-pointer"
            >
              Browse Listing
            </button>
            <button
              onClick={() => handleNavigation("/register")}
              className="text-purple-700 border border-purple-700 max-sm:w-full px-4 sm:px-8 py-2 sm:py-3 rounded-lg font-medium text-lg hover:bg-purple-100 transition-colors cursor-pointer"
            >
              Join Now
            </button>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-10 relative">
          {/* Left Card */}
          <div className="relative rounded-xs sm:rounded-xl p-1 sm:p-2 max-sm:ml-10 overflow-hidden sm:h-64 shadow-md">
            <img
              src={HeroImg1}
              alt="Happy student holding a pc and cash"
              className="w-full h-full object-cover rounded-xs sm:rounded-sm"
            />
          </div>
          <div className="absolute bottom-90 sm:bottom-2 -left-1 sm:-left-26">
            <div className="bg-[#1C7D22] text-white text-sm text-center px-2 sm:px-4 py-1 sm:py-2 rounded-sm font-semibold">
              202+
              <div className="text-[10px] sm:text-xs font-light">
                Over hundreds of sellers
              </div>
            </div>
          </div>

          {/* Right Card */}
          <div className="relative rounded-xs sm:rounded-xl p-1 sm:p-2 max-sm:mr-10 overflow-hidden sm:h-64 shadow-md">
            <img
              src={HeroImg2}
              alt="Student celebrating with a laptop on his lap outdoors"
              className="w-full h-full object-cover rounded-xs sm:rounded-sm"
            />
          </div>
          <div className="absolute top-70 -right-2 sm:top-2 sm:-right-26">
            <div className="bg-[#1C7D22] text-white text-sm text-center px-2 sm:px-4 py-1 sm:py-2 rounded-sm font-semibold">
              4.9 <span className="text-yellow-400">★</span>
              <div className="text-[10px] sm:text-xs font-light">
                Trusted by hundreds
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
