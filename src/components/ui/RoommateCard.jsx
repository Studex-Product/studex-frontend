import React from 'react';
import { MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const RoommateCard = ({ id, name, image, university, location, price, tags, view = 'grid' }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/roommates/${id}`);
  };

  if (view === "list") {
    return (
      <div
        onClick={handleCardClick}
        className="bg-white flex items-center rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer"
      >
        <div className="flex-shrink-0">
          <img
            src={image}
            alt={name}
            className="object-cover w-40 h-40 rounded-l-lg"
          />
        </div>

        <div className="flex items-center justify-between w-full p-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {name}
            </h3>
            <div className="flex items-center mt-1 text-sm text-gray-500">
              <MapPin size={14} className="mr-1.5 flex-shrink-0" />
              <span>{university} - {location}</span>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span key={tag} className="bg-gray-100 text-xs px-2 py-1 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div className="flex-shrink-0 text-right ml-4">
            <div className="text-xl font-semibold text-gray-900">{price}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      onClick={handleCardClick}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
    >
      <img src={image} alt={name} className="w-full h-64 object-cover" />
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
        <div className="flex items-center justify-between text-sm text-gray-600 mt-1">
          <div className="flex items-center">
            <MapPin size={14} className="mr-1 text-gray-400" />
            <span>{university} - {location}</span>
          </div>
          <span className="font-semibold">{price}</span>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {tags.slice(0, 3).map((tag, index) => (
            <span key={index} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
              {tag}
            </span>
          ))}
          {tags.length > 3 && (
            <span className="bg-gray-200 text-gray-800 text-xs font-bold px-2 py-1 rounded-full">
              +{tags.length - 3}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoommateCard;