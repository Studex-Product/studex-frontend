import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '@/components/layout/DashboardLayout';
import PersonalDetailsTab from '@/pages/Dashboard/settings/PersonalDetailsTab';
import PasswordTab from '@/pages/Dashboard/settings/PasswordTab';
import NotificationTab from '@/pages/Dashboard/settings/NotificationTab';
import PrivacySecurityTab from '@/pages/Dashboard/settings/PrivacySecurityTab';
import AccountManagementTab from '@/pages/Dashboard/settings/AccountManagementTab';
import { ChevronLeft } from 'lucide-react';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('Personal Details');
  const tabs = ['Personal Details', 'Password', 'Notification', 'Privacy & Security', 'Account Management'];
  const navigate = useNavigate();

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Personal Details':
        return <PersonalDetailsTab />;
      case 'Password':
        return <PasswordTab />;
      case 'Notification':
        return <NotificationTab />;
      case 'Privacy & Security':
        return <PrivacySecurityTab />;
      case 'Account Management':
        return <AccountManagementTab />;
      default:
        return <PersonalDetailsTab />;
    }
  };

  const handleNavigation = () => {
    navigate("/dashboard");
  };

  return (
    <DashboardLayout>
      <div className="p-6 bg-gray-50/50 min-h-full">
        <div className="">
          <div className="mb-6 flex gap-2 items-center">
            <button onClick={handleNavigation} className=" p-2 rounded-full text-xl hover:text-gray-900 hover:bg-gray-200 font-semibold transition-all duration-200 cursor-pointer">
              <ChevronLeft size={16} className=" hover:scale-3d" />
            </button>
            <span className="text-2xl font-medium text-gray-900">
              Account Settings
            </span>
          </div>

          <div className="border-b border-gray-200 mb-6">
            <nav className="flex -mb-px space-x-8 overflow-x-auto">
              {tabs.map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-1 whitespace-nowrap border-b-2 text-sm font-medium transition-colors cursor-pointer ${
                    activeTab === tab 
                    ? 'border-purple-600 text-purple-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          <div className=''>
            {renderTabContent()}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;