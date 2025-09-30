import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { User, Settings, Headphones } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import LogoutIcon from "@/assets/icons/logout-icon.svg";

const ProfileDropdown = ({ isOpen, onClose }) => {
  const dropdownRef = useRef(null);
  const { logout } = useAuth();

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const menuItems = [
    { icon: <User size={20} />, text: 'My profile', path: '/profile' },
    { icon: <Settings size={20} />, text: 'Settings', path: '/settings' },
    { icon: <Headphones size={20} />, text: 'Help & Support', path: '/contact' },
  ];

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50"
    >
      <div className="py-2">
        {menuItems.map((item) => (
          <Link
            key={item.text}
            to={item.path}
            onClick={onClose}
            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer transition duration-300"
          >
            <span className="mr-3 text-gray-500">{item.icon}</span>
            {item.text}
          </Link>
        ))}
        <hr className="my-1 border-gray-200" />
        <button
          onClick={() => {
            logout();
            onClose();
          }}
          className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
        >
          <span className="mr-3"><img src={LogoutIcon} alt="logout icon" className='w-4 h-4' /> </span>
          Log Out
        </button>
      </div>
    </div>
  );
};

export default ProfileDropdown;