import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50 text-center">
      <h1 className="text-6xl font-bold text-purple-600 mb-4 animate-bounce">404</h1>
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">Page Not Found</h2>
      <p className="text-gray-500 mb-6">
        Sorry, the url might be incorrect or the page you are looking for does not exist.
      </p>
      <Link
        to="/"
        className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors"
      >
        Go back to Homepage
      </Link>
    </div>
  );
};

export default NotFound;