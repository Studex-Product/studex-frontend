import React from "react";
import { useNavigate } from "react-router-dom";
import locationIcon from "../../assets/icons/Location-icon.svg";

const ProductCard = ({
  id,
  image,
  title,
  description,
  price,
  location,
  category,
  view = "grid",
}) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/items/${id}`);
  };

  if (view === "list") {
    return (
      <div
        key={id}
        onClick={handleCardClick}
        className="bg-white flex items-center rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer"
      >
        <div className="flex-shrink-0 relative">
          <img
            src={image}
            alt={title}
            className="object-cover border-r w-42 h-40 rounded-l-lg"
          />
          <span
            className={`absolute top-2 left-2 px-3 py-1 text-xs font-semibold rounded-sm ${
              category === "New"
                ? "bg-[#1C7D22] text-white"
                : "bg-[#3A3A3A] text-white"
            }`}
          >
            {category}
          </span>
        </div>

        <div className="flex items-center justify-between w-full">
          <div className="flex-1 min-w-0 p-4">
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {title}
            </h3>
            <p className="text-gray-600 text-sm mt-1 line-clamp-2">
              {description}
            </p>
            <div className="flex items-center mt-2 text-gray-500 text-xs">
              <img src={locationIcon} alt="location" className="w-4 h-4 mr-1" />
              <span>{location}</span>
            </div>
          </div>
          <div className="flex-shrink-0 text-right">
            <div className="text-2xl font-semibold text-gray-900">{price}</div>
            {/* Example of conditional text */}
            {/* {category === "Apartment" && (
              <div className="text-sm text-gray-500">/ year</div>
            )} */}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition duration-300 cursor-pointer flex flex-col"
      onClick={handleCardClick}
    >
      <div className="relative">
        <img
          src={image}
          alt={title}
          className="w-full h-48 object-cover"
          loading="lazy"
        />
        <span
          className={`absolute top-2 left-2 px-3 py-1 text-xs font-semibold rounded-sm 
            ${
              category === "New"
                ? "bg-[#1C7D22] text-white"
                : "bg-[#3A3A3A] text-white"
            }`}
        >
          {category}
        </span>
      </div>
      <div className="flex flex-col flex-1 p-4">
        <h3 className="font-medium text-[#363636]">{title}</h3>
        <p className="text-[#363636] mt-1 text-sm font-light truncate">
          {description}
        </p>
        <p className="text-[#3A3A3A] text-xl my-2 font-semibold">{price}</p>
        <div className="flex items-center gap-1 text-[#595959] text-xs mt-auto">
          <img src={locationIcon} alt="location" className="w-4 h-4" />
          <span>{location}</span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
