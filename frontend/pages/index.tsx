import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import SocialButton from '../components/SocialButton';
import Logo from '../components/Logo';
import { authAPI, User } from '../lib/api';

const HomePage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [showSignupSuccess, setShowSignupSuccess] = useState(false);

  useEffect(() => {
    checkBackendConnection();
    
    // Check if user was redirected from signup
    if (typeof window !== 'undefined' && window.location.search.includes('signup=success')) {
      setShowSignupSuccess(true);
      // Hide success message after 3 seconds
      setTimeout(() => setShowSignupSuccess(false), 3000);
    }
  }, []);

  const checkBackendConnection = async () => {
    // Only run on client side to avoid SSR issues
    if (typeof window === 'undefined') {
      setIsLoading(false);
      return;
    }
    
    try {
      // Check auth status without health check to avoid loading delay
      const userData = await authAPI.getMe();
      setUser(userData);
      // Redirect to profile if already logged in
      window.location.href = '/profile/';
    } catch (error) {
      console.log('❌ User not authenticated:', error);
      // User is not authenticated, stay on login page
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLinkedInLogin = () => {
    window.location.href = authAPI.getLinkedInAuthUrl();
  };

  const handleTikTokLogin = () => {
    window.location.href = authAPI.getTikTokAuthUrl();
  };

  // Remove loading splash - show content immediately

  return (
    <>
      <Head>
        <title>SocialAuth - Sign in quickly</title>
        <meta name="description" content="Sign in quickly with your social account" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-white flex items-center justify-center p-4 relative overflow-hidden">
        {/* Blue gradient semi-circle - top left */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full -translate-y-32 -translate-x-32 opacity-20"></div>
        
        {/* Blue gradient semi-circle - top right */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-blue-300 to-blue-500 rounded-full -translate-y-24 translate-x-24 opacity-15"></div>

        <div className="w-full max-w-md relative z-10">
          {/* Logo */}
          <div className="text-center mb-8">
            <Logo />
          </div>

          {/* Success Message */}
          {showSignupSuccess && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-800">
                    Account created successfully! Please sign in to continue.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">Welcome Back</h2>
            <p className="text-gray-600">
              Don't have an account?{' '}
              <button
                onClick={() => window.location.href = '/signup/'}
                className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                sign up
              </button>
            </p>
          </div>

          {/* Social Login Buttons */}
          <div className="space-y-4 mb-8">
            <SocialButton
              provider="linkedin"
              onClick={handleLinkedInLogin}
            />
            <SocialButton
              provider="tiktok"
              onClick={handleTikTokLogin}
            />
          </div>

        </div>
      </div>
    </>
  );
};

export default HomePage;
