import React, { useState } from 'react';
import { User, LogOut, Linkedin, Music } from 'lucide-react';
import { authAPI, User as UserType } from '../lib/api';

interface ProfileCardProps {
  user: UserType;
  onLogout: () => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ user, onLogout }) => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await authAPI.logout();
      onLogout();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const getProviderIcon = () => {
    return user.provider === 'linkedin' ? (
      <Linkedin className="w-5 h-5" />
    ) : (
      <Music className="w-5 h-5" />
    );
  };

  const getProviderColor = () => {
    return user.provider === 'linkedin' 
      ? 'bg-linkedin-blue text-white' 
      : 'bg-gradient-to-r from-tiktok-pink to-tiktok-black text-white';
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-xl p-8 max-w-md w-full mx-4">
      <div className="text-center">
        {/* Avatar */}
        <div className="relative mb-6">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="w-24 h-24 rounded-full mx-auto border-4 border-gray-200 shadow-lg"
            />
          ) : (
            <div className="w-24 h-24 rounded-full mx-auto bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center border-4 border-gray-200 shadow-lg">
              <User className="w-12 h-12 text-white" />
            </div>
          )}
        </div>

        {/* User Info */}
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{user.name}</h2>
        
        {user.email && (
          <p className="text-gray-600 mb-4">{user.email}</p>
        )}

        {/* Provider Badge */}
        <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full ${getProviderColor()} mb-6`}>
          {getProviderIcon()}
          <span className="font-medium capitalize">{user.provider}</span>
        </div>

        {/* Sign Out Button */}
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-2xl transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
        >
          <LogOut className="w-5 h-5" />
          <span>{isLoggingOut ? 'Signing out...' : 'Sign out'}</span>
        </button>
      </div>
    </div>
  );
};

export default ProfileCard;
