import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import ToggleSwitch from "@/components/ui/ToggleSwitch";

const NotificationRow = ({ title, description, checked, onChange }) => (
  <div className="md:flex items-center justify-between p-4 border rounded-lg bg-white">
    <div className="mb-2 md:mb-0">
      <h3 className="font-semibold text-gray-800">{title}</h3>
      <p className="text-sm text-gray-500">{description}</p>
    </div>
    <ToggleSwitch checked={checked} onChange={onChange} />
  </div>
);

const NotificationTab = () => {
  const { user, updateUser } = useAuth();

  // Set default state, which will be updated by useEffect
  const [settings, setSettings] = useState({
    inApp: true,
    email: true,
    promotions: false,
    security: true,
    messages: false,
  });

  // Load the user's saved settings when the component mounts
  useEffect(() => {
    if (user && user.notificationSettings) {
      setSettings(user.notificationSettings);
    }
  }, [user]);

  const handleToggle = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSaveChanges = () => {
    // Create an updated user object with the new settings
    const updatedUser = {
      ...user,
      notificationSettings: settings,
    };
    // Call the updateUser function from the context
    updateUser(updatedUser);
    toast.success("Notification settings saved!");
  };

  return (
    <div className="">
      <h2 className="text-xl font-medium text-gray-900">Notifications</h2>
      <p className="text-sm text-gray-500 mt-1">
        Control how you receive updates about your account and posts.
      </p>

      <div className="max-w-2xl mx-auto">
        <div className="mt-8 space-y-4">
          <NotificationRow
            title="In-App Notifications"
            description="Get alerts directly inside the app for important updates."
            checked={settings.inApp}
            onChange={() => handleToggle("inApp")}
          />
          <NotificationRow
            title="Email Notifications"
            description="Receive updates and summaries via your registered email."
            checked={settings.email}
            onChange={() => handleToggle("email")}
          />
          <NotificationRow
            title="Promotions & Tips"
            description="Get occasional platform tips, feature updates, or promotional offers."
            checked={settings.promotions}
            onChange={() => handleToggle("promotions")}
          />
          <NotificationRow
            title="Security Alerts"
            description="Stay informed about sign-ins from new devices and password changes."
            checked={settings.security}
            onChange={() => handleToggle("security")}
          />
          <NotificationRow
            title="Message Alerts"
            description="Receive instant alerts whenever you get a new message."
            checked={settings.messages}
            onChange={() => handleToggle("messages")}
          />
        </div>
        <div className="mt-8">
          <button
            onClick={handleSaveChanges}
            className="px-6 py-2 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-all duration-200 cursor-pointer"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationTab;
