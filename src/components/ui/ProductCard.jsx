import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import locationIcon from "../../assets/icons/Location-icon.svg"; 

const ProductCard = ({ id, image, title, description, price, location, category }) => {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  console.log('ProductCard received id:', id); // Add this line
  
  const handleCardClick = () => {
    console.log('Navigating to item:', id); // And this line
    navigate(`/items/${id}`);
  };

  return (
    <div 
      className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition duration-300 relative cursor-pointer"
      onClick={handleCardClick}
    >
      
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
          className={`w-full object-contain ${isLoading ? "opacity-0" : "opacity-100"} transition-opacity duration-500`}
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
        <h3 className="mt-2 font-medium text-[#363636]">{title}</h3>
        <p className="text-[#363636] mt-1 font-light truncate">{description}</p>
        <p className="text-[#3A3A3A] text-2xl my-2 font-semibold">{price}</p>

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