import React, { useState } from "react";
import locationIcon from "../../assets/icons/Location-icon.svg"; 

const ProductCard = ({ image, title, description, price, location, category }) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition duration-300 relative">
      
      {isLoading && (
        <div className="absolute inset-0 bg-white flex items-center justify-center z-10">
          <span className="animate-pulse text-gray-400 text-sm">Loading...</span>
        </div>
      )}

      {/* Image */}
      <div className="relative">
        <img
          src={image}
          alt={title}
          className={`w-full h-40 object-cover ${isLoading ? "opacity-0" : "opacity-100"} transition-opacity duration-500`}
          loading="lazy"
          onLoad={() => setIsLoading(false)}
          onError={(e) => {
            e.target.src = "../../assets/Products/FallbackImg.png";
            setIsLoading(false);
          }}
        />
        {/* Category badge */}
        <span
          className={`absolute top-2 left-2 px-3 py-1 text-xs font-semibold rounded-sm 
            ${category === "New" ? "bg-[#1C7D22] text-white" : "bg-[#3A3A3A] text-white"}`}
        >
          {category}
        </span>
      </div>

      {/* Content */}
      <div className={`flex flex-col flex-1 p-4 ${isLoading ? "opacity-0" : "opacity-100"} transition-opacity duration-500`}>
        <h3 className="mt-2 font-semibold text-[#363636] text-sm">{title}</h3>
        <p className="text-[#363636] text-xs mt-1">{description}</p>
        <p className="text-[#3A3A3A] font-bold">{price}</p>

        {/* Location */}
        <div className="flex items-center gap-1 text-[#595959] text-xs mt-auto">
          <img src={locationIcon} alt="location" className="w-4 h-4" />
          <span>{location}</span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
