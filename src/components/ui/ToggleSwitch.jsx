import React from 'react';

const ToggleSwitch = ({ checked, onChange }) => {
  return (
    <button
      type="button"
      className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors cursor-pointer ${
        checked ? 'bg-purple-800' : 'bg-gray-200'
      }`}
      onClick={() => onChange(!checked)}
    >
      <span
        className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );
};

export default ToggleSwitch;