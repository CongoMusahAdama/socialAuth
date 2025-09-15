import React from 'react';

const Logo: React.FC = () => {
  return (
    <div className="flex flex-col items-center space-y-4 mb-8">
      {/* SocialAuth Logo */}
      <div className="flex items-center space-x-3">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center relative">
          {/* Person icon */}
          <div className="w-8 h-8 bg-blue-800 rounded-full flex items-center justify-center">
            <div className="w-6 h-6 bg-blue-800 rounded-full"></div>
          </div>
          {/* Checkmark square */}
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-800 rounded-sm flex items-center justify-center border-2 border-white">
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
        <h1 className="text-3xl font-bold text-blue-800">SocialAuth</h1>
      </div>
    </div>
  );
};

export default Logo;
