import React, { useState } from 'react';
import ToggleSwitch from '@/components/ui/ToggleSwitch';

const PrivacyRow = ({ title, description, checked, onChange }) => (
  <div className="flex items-center justify-between p-4 border rounded-lg">
    <div>
      <h3 className="font-semibold text-gray-800">{title}</h3>
      <p className="text-sm text-gray-500">{description}</p>
    </div>
    <ToggleSwitch checked={checked} onChange={onChange} />
  </div>
);

const PrivacySecurityTab = () => {
  const [settings, setSettings] = useState({
    showPhoneNumber: true,
    showOnlineStatus: false,
  });

  const handleToggle = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="">
      <h2 className="text-xl font-medium text-gray-900">Privacy & Security</h2>
      <p className="text-sm text-gray-500 mt-1">Take control over what information is visible to other users.</p>
      
      
      <div className="max-w-2xl mx-auto">
      <div className="mt-8 space-y-4">
        <PrivacyRow 
          title="Show My Phone Number"
          description="Allow other users to see my phone number."
          checked={settings.showPhoneNumber}
          onChange={() => handleToggle('showPhoneNumber')}
        />
        <PrivacyRow 
          title="Show My Online Status"
          description="Let others know when I was last active."
          checked={settings.showOnlineStatus}
          onChange={() => handleToggle('showOnlineStatus')}
        />
      </div>
      </div>
    </div>
  );
};

export default PrivacySecurityTab;