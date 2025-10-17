'use client';

/**
 * Login Page - Simple authentication without validation
 * Allows users to enter credentials and access the app
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  // Check if already logged in
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('meditrack-logged-in');
    if (isLoggedIn) {
      // Already logged in, redirect to dashboard
      router.push('/dashboard');
    }
  }, [router]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Store login state (no validation)
    localStorage.setItem('meditrack-logged-in', 'true');
    localStorage.setItem('meditrack-user-email', email);
    localStorage.setItem('meditrack-login-time', new Date().toISOString());
    
    if (rememberMe) {
      localStorage.setItem('meditrack-remember-me', 'true');
    }
    
    // Redirect to dashboard
    router.push('/dashboard');
  };

  const handleGuestLogin = () => {
    localStorage.setItem('meditrack-logged-in', 'true');
    localStorage.setItem('meditrack-user-email', 'guest@meditrack.com');
    localStorage.setItem('meditrack-login-time', new Date().toISOString());
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-ivory-50 via-white to-teal-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-radial from-gold-200/20 via-gold-100/10 to-transparent rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-radial from-teal-200/20 via-teal-100/10 to-transparent rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-navy-100/10 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          {/* Logo and Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-block mb-4"
            >
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-luxury transform hover:scale-105 transition-transform">
                <span className="text-4xl">🏥</span>
              </div>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-4xl font-heading font-bold text-navy-900 mb-2"
            >
              MediTrack
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-navy-600 font-body"
            >
              Your Personal Health Companion
            </motion.p>
          </div>

          {/* Login Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white/80 backdrop-blur-xl border border-teal-200/30 rounded-2xl shadow-clinical p-8"
          >
            <h2 className="text-2xl font-heading font-semibold text-navy-900 mb-6">
              Welcome Back
            </h2>

            <form onSubmit={handleLogin} className="space-y-5">
              {/* Email Input */}
              <div>
                <label htmlFor="email" className="block text-sm font-body font-medium text-navy-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full px-4 py-3 pl-11 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent font-body transition-all"
                  />
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-xl">📧</span>
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label htmlFor="password" className="block text-sm font-body font-medium text-navy-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 pl-11 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent font-body transition-all"
                  />
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-xl">🔒</span>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                  />
                  <span className="text-sm text-navy-700 font-body">Remember me</span>
                </label>
                <button
                  type="button"
                  className="text-sm text-teal-600 hover:text-teal-700 font-body font-medium transition-colors"
                >
                  Forgot password?
                </button>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                className="w-full px-4 py-3 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white rounded-lg font-body font-semibold shadow-luxury transition-all transform hover:scale-[1.02] active:scale-[0.98]"
              >
                Sign In
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-navy-500 font-body">Or continue with</span>
              </div>
            </div>

            {/* Guest Login */}
            <button
              onClick={handleGuestLogin}
              className="w-full px-4 py-3 bg-gray-100 hover:bg-gray-200 text-navy-900 rounded-lg font-body font-medium transition-all flex items-center justify-center space-x-2"
            >
              <span className="text-xl">👤</span>
              <span>Continue as Guest</span>
            </button>

            {/* Sign Up Link */}
            <p className="text-center text-sm text-navy-600 font-body mt-6">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  // For demo, just login as new user
                  localStorage.setItem('meditrack-logged-in', 'true');
                  localStorage.setItem('meditrack-user-email', 'newuser@meditrack.com');
                  localStorage.setItem('meditrack-login-time', new Date().toISOString());
                  router.push('/dashboard');
                }}
                className="text-teal-600 hover:text-teal-700 font-semibold transition-colors"
              >
                Sign up
              </button>
            </p>
          </motion.div>

          {/* Quick Access Demo */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-6 text-center"
          >
            <p className="text-sm text-navy-500 font-body mb-3">Quick demo access:</p>
            <div className="flex justify-center space-x-3">
              <button
                onClick={() => {
                  setEmail('demo@meditrack.com');
                  setPassword('demo123');
                }}
                className="px-4 py-2 bg-white/60 hover:bg-white/80 border border-teal-200 text-navy-700 rounded-lg text-sm font-body font-medium transition-all"
              >
                Fill Demo User
              </button>
              <button
                onClick={() => {
                  setEmail('doctor@meditrack.com');
                  setPassword('doctor123');
                }}
                className="px-4 py-2 bg-white/60 hover:bg-white/80 border border-teal-200 text-navy-700 rounded-lg text-sm font-body font-medium transition-all"
              >
                Fill Doctor User
              </button>
            </div>
          </motion.div>

          {/* Features Preview */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-8 grid grid-cols-3 gap-4"
          >
            <div className="text-center">
              <div className="text-3xl mb-2">📊</div>
              <p className="text-xs text-navy-600 font-body">Track Vitals</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">🤖</div>
              <p className="text-xs text-navy-600 font-body">AI Insights</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">📅</div>
              <p className="text-xs text-navy-600 font-body">Appointments</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
