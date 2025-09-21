import React from 'react';
import { MapPin } from 'lucide-react';

const RoommateCard = ({ name, image, university, location, price, tags }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer">
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