import React from 'react';
import { User, Home, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const JoinUs = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full relative">
        {/* Close Button */}
        <button
          onClick={() => navigate('/')}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Welcome Text */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome!</h1>
          <p className="text-sm text-gray-600">Select your account type</p>
        </div>

        {/* Account Options */}
        <div className="space-y-4">
          {/* Customer Card */}
          <button 
            onClick={() => navigate('/customerlogin')}  
            className="w-full bg-white hover:bg-gray-50 border border-gray-200 rounded-2xl p-6 transition-all duration-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <User className="w-8 h-8 text-gray-700" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-1">Customer</h3>
              <p className="text-sm text-gray-500">Make reservation and order food</p>
            </div>
          </button>

          {/* Staff Member Card */}
          <button 
            onClick={() => navigate('/stafflogin')} 
            className="w-full bg-white hover:bg-gray-50 border border-gray-200 rounded-2xl p-6 transition-all duration-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Home className="w-8 h-8 text-gray-700" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-1">Staff Member</h3>
              <p className="text-sm text-gray-500">Access POS and management tools</p>
            </div>
          </button>
        </ div>
      </div>
    </div>
  );
};

export default JoinUs;