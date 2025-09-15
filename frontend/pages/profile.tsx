import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import ProfileCard from '../components/ProfileCard';
import Logo from '../components/Logo';
import { authAPI, User } from '../lib/api';

const ProfilePage: React.FC = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    checkAuthStatus();
    
    // Check if this is a successful login redirect
    if (router.query.success === 'true') {
      setShowConfetti(true);
      // Hide confetti after animation
      setTimeout(() => setShowConfetti(false), 2000);
    }
  }, [router.query.success]);

  const checkAuthStatus = async () => {
    try {
      const userData = await authAPI.getMe();
      setUser(userData);
    } catch (error) {
      // User is not authenticated, redirect to login
      router.push('/');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    router.push('/');
  };

  // Remove loading state to prevent flash
  // if (isLoading) {
  //   return (
  //     <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 flex items-center justify-center">
  //       <div className="text-white text-xl">Loading...</div>
  //     </div>
  //   );
  // }

  if (!user) {
    return null; // Will redirect to login
  }

  return (
    <>
      <Head>
        <title>Profile - SocialAuth</title>
        <meta name="description" content="Your SocialAuth profile" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-white flex items-center justify-center p-4 relative overflow-hidden">
        {/* Confetti Animation */}
        {showConfetti && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-yellow-400 rounded-full animate-confetti"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 0.5}s`,
                  animationDuration: `${0.5 + Math.random() * 0.5}s`,
                }}
              />
            ))}
          </div>
        )}

        {/* Blue gradient semi-circle - top right */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full -translate-y-32 translate-x-32 opacity-20"></div>
        
        {/* Blue gradient semi-circle - top left */}
        <div className="absolute top-0 left-0 w-48 h-48 bg-gradient-to-br from-blue-300 to-blue-500 rounded-full -translate-y-24 -translate-x-24 opacity-15"></div>

        <div className="w-full max-w-md relative z-10">
          <div className="text-center mb-8">
            <Logo />
          </div>
          
          <ProfileCard user={user} onLogout={handleLogout} />
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
