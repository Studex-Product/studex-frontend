import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

const categories = ["Electronics", "Furniture", "Fashion & Accessories", "Kitchen & Home", "Books & Study Materials", "Others"];
const conditions = ["New", "Used"];
const locations = ["Off Campus (within 5km)", "On Campus", "Off Campus (Above 5km)"];

const FilterModal = ({ isOpen, onClose, onApplyFilters }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [priceRange, setPriceRange] = useState({ from: '0', to: '200000' });
  const [selectedCondition, setSelectedCondition] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [isRendered, setIsRendered] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsRendered(true);
    } else {
      const timer = setTimeout(() => setIsRendered(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleApply = () => {
    onApplyFilters({
      category: selectedCategory,
      priceRange,
      condition: selectedCondition,
      location: selectedLocation,
    });
    onClose();
  };

  const handleClear = () => {
    setSelectedCategory('All');
    setPriceRange({ from: '0', to: '200000' });
    setSelectedCondition('All');
    setSelectedLocation('All');
    onApplyFilters({
      category: 'All',
      priceRange: { from: '', to: '' },
      condition: 'All',
      location: 'All',
    });
    onClose();
  };

  const handleSliderChange = ([from, to]) => {
    setPriceRange({ from: String(from), to: String(to) });
  };
  
  if (!isRendered) return null;

  const renderFilterGroup = (title, options, selected, setter) => (
    <div className="py-4 border-b border-gray-200">
      <h3 className="font-semibold text-lg mb-3 flex justify-between items-center cursor-pointer">
        {title}
      </h3>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setter('All')}
          className={`px-4 py-2 text-sm rounded border cursor-pointer transition-colors ${selected === 'All' ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'}`}
        >
          All
        </button>
        {options.map(option => (
          <button
            key={option}
            onClick={() => setter(option)}
            className={`px-4 py-2 text-sm rounded border cursor-pointer transition-colors ${selected === option ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'}`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div 
      className={`fixed inset-0 z-50 flex justify-end transition-opacity duration-300 ${isOpen ? 'bg-black/50' : 'bg-black/0 pointer-events-none'}`}
      onClick={onClose}
    >
      <div 
        className={`bg-white w-full max-w-sm h-full flex flex-col transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold">Filter</h2>
          <button onClick={onClose} className="p-2 rounded-full border-2 border-gray-400 hover:bg-gray-100 cursor-pointer transition duration-300">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 p-4 overflow-y-auto">
          {renderFilterGroup('Category', categories, selectedCategory, setSelectedCategory)}
          
          <div className="py-4 border-b border-gray-200">
            <h3 className="font-semibold text-lg mb-4 flex justify-between items-center cursor-pointer">
              Price Range
                  </h3>
            <div className='px-2 pt-2'>
              <Slider
                range
                min={0}
                max={200000}
                step={1000}
                value={[Number(priceRange.from), Number(priceRange.to)]}
                onChange={handleSliderChange}
                trackStyle={[{ backgroundColor: '#10B981', height: 6 }]}
                handleStyle={[
                  { borderColor: '#10B981', borderWidth: 2, backgroundColor: 'white', height: 18, width: 18, marginTop: -6, zIndex: 1 },
                  { borderColor: '#10B981', borderWidth: 2, backgroundColor: 'white', height: 18, width: 18, marginTop: -6, zIndex: 1 }
                ]}
                railStyle={{ backgroundColor: '#E5E7EB', height: 6 }}
              />
            </div>
            <div className="flex items-center gap-4 mt-4">
              <div className='w-full relative'>
                <label className='text-xs text-gray-500'>FROM</label>
                <input
                  type="number"
                  placeholder="₦0"
                  value={priceRange.from}
                  onChange={e => setPriceRange(prev => ({ ...prev, from: e.target.value }))}
                  className="w-full py-2 pl-5 pr-2 border border-gray-300 rounded"
                />
                <span className="absolute left-2 top-[2.1rem] ">₦</span>
              </div>
              <div className='w-full relative'>
                <label className='text-xs text-gray-500'>TO</label>
                <input
                  type="number"
                  placeholder="200,000"
                  value={priceRange.to}
                  onChange={e => setPriceRange(prev => ({ ...prev, to: e.target.value }))}
                  className="w-full py-2 pl-5 pr-2 border border-gray-300 rounded"
                />
                <span className="absolute left-2 top-[2.1rem] ">₦</span>
              </div>
            </div>
          </div>

          {renderFilterGroup('Condition', conditions, selectedCondition, setSelectedCondition)}
          {renderFilterGroup('Location', locations, selectedLocation, setSelectedLocation)}
        </div>

        <div className="p-4 border-t border-gray-200 bg-white">
          <button
            onClick={handleApply}
            className="w-full bg-purple-600 text-white font-medium py-3 rounded-md hover:bg-purple-700 cursor-pointer transition-colors"
          >
            Apply Filter
          </button>
          <button
            onClick={handleClear}
            className="w-full mt-2 text-gray-600 font-medium border border-gray-300 hover:bg-gray-100 py-3 rounded-md cursor-pointer"
          >
            Clear all filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterModal;