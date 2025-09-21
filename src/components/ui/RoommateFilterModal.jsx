import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

const genders = ["Male", "Female"];
const distances = ["Within 1km", "1 - 3 km", "3 - 5 km", "5 km+"];
const roomTypes = [
  "Shared room",
  "Self-contained",
  "1-bedroom apartment",
  "2-bedroom apartment",
];

const RoommateFilterModal = ({ isOpen, onClose, onApplyFilters }) => {
  const [gender, setGender] = useState("Any");
  const [distance, setDistance] = useState("");
  const [roomType, setRoomType] = useState("All");
  const [budgetRange, setBudgetRange] = useState({ from: "0", to: "200000" });
  const [isRendered, setIsRendered] = useState(false);

  useEffect(() => {
    if (isOpen) setIsRendered(true);
    else {
      const timer = setTimeout(() => setIsRendered(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleApply = () => {
    onApplyFilters({ gender, distance, roomType, budgetRange });
    onClose();
  };

  const handleClear = () => {
    setGender("Any");
    setDistance("");
    setRoomType("All");
    setBudgetRange({ from: "0", to: "200000" });
    onApplyFilters({
      gender: "Any",
      distance: "",
      roomType: "All",
      budgetRange: { from: "", to: "" },
    });
    onClose();
  };

  const renderButtonGroup = (
    options,
    selected,
    setter,
    allowDeselect = false
  ) => (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <button
          key={option}
          onClick={() =>
            setter(selected === option && allowDeselect ? "" : option)
          }
          className={`px-4 py-2 text-sm rounded-lg border cursor-pointer transition-colors ${
            selected === option
              ? "bg-purple-600 text-white border-purple-600"
              : "bg-white hover:border-gray-400"
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  );

  if (!isRendered) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex justify-end transition-opacity duration-300 ${
        isOpen ? "bg-black/50" : "bg-black/0 pointer-events-none"
      }`}
      onClick={onClose}
    >
      <div
        className={`bg-white w-full max-w-md h-full flex flex-col transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold">Filter</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full border-2 border-gray-400 hover:bg-gray-100 cursor-pointer transition duration-300"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 p-4 overflow-y-auto space-y-6">
          <div>
            <h3 className="font-semibold text-lg mb-3">Gender</h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setGender("Any")}
                className={`px-4 py-2 text-sm rounded-lg border cursor-pointer ${
                  gender === "Any"
                    ? "bg-purple-600 text-white border-purple-600"
                    : "bg-white hover:border-gray-400"
                }`}
              >
                Any
              </button>
              {renderButtonGroup(genders, gender, setGender)}
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-3">Distance from school</h3>
            {renderButtonGroup(distances, distance, setDistance, true)}
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-3">Room type</h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setRoomType("All")}
                className={`px-4 py-2 text-sm rounded-lg border cursor-pointer ${
                  roomType === "All"
                    ? "bg-purple-600 text-white border-purple-600"
                    : "bg-white hover:border-gray-400"
                }`}
              >
                All
              </button>
              {renderButtonGroup(roomTypes, roomType, setRoomType)}
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-4">Budget Range (₦)</h3>
            <div className="px-2 pt-2">
              <Slider
                range
                min={0}
                max={200000}
                step={5000}
                value={[+budgetRange.from, +budgetRange.to]}
                onChange={([from, to]) =>
                  setBudgetRange({ from: `${from}`, to: `${to}` })
                }
                trackStyle={[{ backgroundColor: "#1570FA", height: 6 }]}
                handleStyle={[
                  {
                    borderColor: "#1570FA",
                    borderWidth: 2,
                    backgroundColor: "white",
                    height: 18,
                    width: 18,
                    marginTop: -6,
                    zIndex: 1,
                  },
                  {
                    borderColor: "#1570FA",
                    borderWidth: 2,
                    backgroundColor: "white",
                    height: 18,
                    width: 18,
                    marginTop: -6,
                    zIndex: 1,
                  },
                ]}
                railStyle={{ backgroundColor: "#E5E7EB", height: 6 }}
              />
            </div>
            <div className="flex items-center gap-4 mt-4">
              <div className="w-full relative">
                <label className="text-xs text-gray-500">FROM</label>
                <input
                  type="number"
                  placeholder="0"
                  value={budgetRange.from}
                  onChange={(e) =>
                    setBudgetRange((prev) => ({
                      ...prev,
                      from: e.target.value,
                    }))
                  }
                   className="w-full py-2 pl-5 pr-2 border border-gray-300 rounded-lg"
                />
                <span className="absolute left-2 top-[2.1rem] ">₦</span>
              </div>
              <div className="w-full relative">
                <label className="text-xs text-gray-500">TO</label>
                <input
                  type="number"
                  placeholder="200,000"
                  value={budgetRange.to}
                  onChange={(e) =>
                    setBudgetRange((prev) => ({ ...prev, to: e.target.value }))
                  }
                  className="w-full py-2 pl-5 pr-2 border border-gray-300 rounded-lg"
                />
                <span className="absolute left-2 top-[2.1rem] ">₦</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-gray-200 bg-white">
          <button
            onClick={handleApply}
            className="w-full bg-purple-600 text-white font-semibold py-3 rounded-lg hover:bg-purple-700 cursor-pointer transition-colors"
          >
            Apply Filter
          </button>
          <button
            onClick={handleClear}
            className="w-full mt-2 border border-gray-300 rounded-lg hover:bg-gray-100 text-gray-600 font-semibold py-3 cursor-pointer"
          >
            Clear all filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoommateFilterModal;
