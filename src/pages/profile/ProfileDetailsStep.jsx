import React, { useState } from 'react';
import { Check } from 'lucide-react';

const personalityTags = [
  "Social", "Night Owl", "Early Bird", "Likes Quiet", 
  "Loud", "Smoker", "Introvert", "Religious", 
  "Very Tidy", "Bookworm"
];

const ProfileDetailsStep = ({ aboutMe, personalities, onNext }) => {
  const [about, setAbout] = useState(aboutMe || '');
  const [selectedTags, setSelectedTags] = useState(personalities || []);

  const handleTagToggle = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleContinue = () => {
    // Optional: Add validation, e.g., ensure 'about' is not empty
    onNext({ aboutMe: about, personalities: selectedTags });
  };

return (
    <div>
        <h2 className="text-2xl font-medium text-gray-900">Profile Details</h2>
        <p className="text-gray-600 mt-2">Tell the community a little bit about yourself and your personality.</p>

        {/* About Me Section */}
        <div className="mt-8">
            <label htmlFor="aboutMe" className="block text-sm font-medium text-gray-700 mb-1">About Me</label>
            <textarea
                id="aboutMe"
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                rows={4}
                placeholder="Write a brief bio..."
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
            />
        </div>

        {/* Personality & Habits Section */}
        <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Personality/Habits</label>
            <div className="flex flex-wrap gap-3">
                {personalityTags.map(tag => {
                    const isSelected = selectedTags.includes(tag);
                    return (
                        <button
                            key={tag}
                            type="button"
                            onClick={() => handleTagToggle(tag)}
                            className={`flex items-center px-4 py-2 rounded-lg border text-sm font-medium transition-colors cursor-pointer ${
                                isSelected 
                                ? 'bg-purple-600 text-white border-purple-600' 
                                : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                            }`}
                        >
                            {isSelected && <Check size={16} className="mr-2" />}
                            {tag}
                        </button>
                    );
                })}
            </div>
        </div>

        {/* Navigation Button */}
        <div className="mt-8 flex justify-end">
            <button 
                onClick={handleContinue}
                disabled={!about.trim()}
                className="px-8 py-2.5 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 disabled:bg-purple-300 transition-all duration-200 cursor-pointer disabled:cursor-not-allowed"
            >
                Continue
            </button>
        </div>
    </div>
);
};

export default ProfileDetailsStep;