import React from 'react';
import { Linkedin } from 'lucide-react';

interface SocialButtonProps {
  provider: 'linkedin' | 'tiktok';
  onClick: () => void;
  disabled?: boolean;
}

const SocialButton: React.FC<SocialButtonProps> = ({ provider, onClick, disabled = false }) => {
  const isLinkedIn = provider === 'linkedin';
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full py-4 px-6 rounded-2xl font-semibold text-white transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 ${
        isLinkedIn 
          ? 'bg-linkedin-blue hover:bg-blue-700 hover:shadow-lg' 
          : 'bg-gradient-to-r from-tiktok-pink to-tiktok-black hover:shadow-lg hover:shadow-tiktok-pink/25'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      aria-label={`Continue with ${isLinkedIn ? 'LinkedIn' : 'TikTok'}`}
    >
      <div className="flex items-center justify-center space-x-3">
        {isLinkedIn ? (
          <Linkedin className="w-6 h-6" />
        ) : (
          <div className="w-6 h-6 flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white">
              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
            </svg>
          </div>
        )}
        <span>Continue with {isLinkedIn ? 'LinkedIn' : 'TikTok'}</span>
      </div>
    </button>
  );
};

export default SocialButton;
