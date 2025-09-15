import React, { useState } from 'react';
import Head from 'next/head';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const SignupPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Here you would typically call your backend API to create the user
      // For now, we'll simulate a successful signup and redirect to login with success message
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirect to login page with success parameter
      if (typeof window !== 'undefined') {
        window.location.href = '/?signup=success';
      }
    } catch (error) {
      console.error('Signup failed:', error);
      setIsLoading(false);
      // Handle error (show error message, etc.)
    }
  };

  const handleBackToLogin = () => {
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  };

  return (
    <>
      <Head>
        <title>Create Account - SocialAuth</title>
        <meta name="description" content="Create your SocialAuth account" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-white flex items-center justify-center p-4 relative overflow-hidden">
        {/* Blue gradient semi-circle - top right */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full -translate-y-32 translate-x-32 opacity-20"></div>
        
        {/* Blue gradient semi-circle - top left */}
        <div className="absolute top-0 left-0 w-48 h-48 bg-gradient-to-br from-blue-300 to-blue-500 rounded-full -translate-y-24 -translate-x-24 opacity-15"></div>

        <div className="w-full max-w-md relative z-10">
          {/* Back button */}
          <button
            onClick={handleBackToLogin}
            className="flex items-center text-gray-600 hover:text-blue-600 transition-colors mb-8"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            <span className="text-sm font-medium">Back</span>
          </button>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create account</h1>
            <p className="text-gray-600">
              Already have an account?{' '}
              <button
                onClick={handleBackToLogin}
                className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                sign in
              </button>
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Input */}
            <div>
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-4 bg-white border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            {/* Email Input */}
            <div>
              <input
                type="email"
                name="email"
                placeholder="Email or phone"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-4 bg-white border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            {/* Password Input */}
            <div>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-4 bg-white border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            {/* Sign Up Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              <span>{isLoading ? 'Creating account...' : 'Sign up'}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>

        </div>
      </div>
    </>
  );
};

export default SignupPage;
