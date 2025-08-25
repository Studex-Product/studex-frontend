import React from 'react';

const Banner = () => {
  const bannerItems = [
    { text: "Best Value", icon: "★" },
    { text: "Fast Sale", icon: "★" },
    { text: "Top Sellers", icon: "★" },
    { text: "Hot Deals", icon: "★" },
    { text: "Best Value", icon: "★" },
    { text: "Fast Sale", icon: "★" },
    { text: "Top Sellers", icon: "★" },
    { text: "Hot Deals", icon: "★" },
  ];

  return (
    <div className="bg-[#9046CF] py-6 overflow-hidden">
      <div className="flex animate-scroll whitespace-nowrap">
        {/* First set of items */}
        <div className="flex items-center space-x-12 mr-12">
          {bannerItems.map((item, index) => (
            <div key={`first-${index}`} className="flex items-center space-x-2 text-white font-medium">
              <span>{item.text}</span>
              <span className="text-white">{item.icon}</span>
            </div>
          ))}
        </div>

        {/* Duplicate set for seamless loop */}
        <div className="flex items-center space-x-12">
          {bannerItems.map((item, index) => (
            <div key={`second-${index}`} className="flex items-center space-x-2 text-white font-medium">
              <span>{item.text}</span>
              <span className="text-white">{item.icon}</span>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        .animate-scroll {
          animation: scroll 20s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default Banner;