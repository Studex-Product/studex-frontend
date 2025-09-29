import React, { useState } from "react";
import ToggleSwitch from "@/components/ui/ToggleSwitch";

const NotificationRow = ({ title, description, checked, onChange }) => (
  <div className="flex items-center justify-between p-4 border rounded-lg">
    <div>
      <h3 className="font-semibold text-gray-800">{title}</h3>
      <p className="text-sm text-gray-500">{description}</p>
    </div>
    <ToggleSwitch checked={checked} onChange={onChange} />
  </div>
);

const NotificationTab = () => {
  const [settings, setSettings] = useState({
    inApp: true,
    email: true,
    promotions: false,
    security: true,
    messages: false,
  });

  const handleToggle = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
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
      </div>
    </div>
  );
};

export default NotificationTab;
