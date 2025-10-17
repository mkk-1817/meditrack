'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Landing Page
 * Hero section with animated background and wellness overview
 * Redirects to login if not authenticated
 */
export default function HomePage() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('meditrack-logged-in');
    
    if (!isLoggedIn) {
      // If not logged in, redirect to login page immediately
      router.push('/login');
    } else {
      // User is authenticated, show the page
      setIsAuthenticated(true);
      setIsChecking(false);
    }
  }, [router]);

  // Show loading while checking authentication
  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-ivory-50 via-white to-teal-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-navy-600 font-body">Loading...</p>
        </div>
      </div>
    );
  }

  // Only render the landing page if authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-wellness opacity-50" />
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Main Heading */}
          <h1 className="font-heading text-5xl md:text-7xl font-bold text-gray-900 mb-6 animate-fade-in">
            Your Health,{' '}
            <span className="text-primary-600 relative">
              Refined
              <div className="absolute -bottom-2 left-0 right-0 h-3 bg-primary-200 opacity-30 rounded-full animate-pulse-slow" />
            </span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto animate-slide-up">
            Experience luxury medical tracking with AI-powered insights. 
            Monitor your vitals, analyze trends, and elevate your wellness journey.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-12">
            <a
              href="/dashboard"
              className="btn-primary text-lg px-8 py-4 min-w-[200px] group"
            >
              Track My Health
              <span className="ml-2 transform group-hover:translate-x-1 transition-transform duration-200">
                →
              </span>
            </a>
            
            <a
              href="/insights"
              className="btn-secondary text-lg px-8 py-4 min-w-[200px] group"
            >
              AI Insights
              <span className="ml-2 text-xl">🧠</span>
            </a>
          </div>
          
          {/* Trust Indicators */}
          <div className="flex flex-wrap items-center justify-center space-x-8 text-sm text-gray-500">
            <div className="flex items-center space-x-2">
              <span className="text-green-500">✓</span>
              <span>HIPAA Compliant</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-green-500">✓</span>
              <span>Bank-Level Security</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-green-500">✓</span>
              <span>24/7 Support</span>
            </div>
          </div>
        </div>
        
        {/* Floating Health Icons */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 text-4xl opacity-20 animate-float">
            ❤️
          </div>
          <div className="absolute top-1/3 right-1/4 text-3xl opacity-20 animate-float" style={{ animationDelay: '1s' }}>
            🩺
          </div>
          <div className="absolute bottom-1/3 left-1/3 text-3xl opacity-20 animate-float" style={{ animationDelay: '2s' }}>
            📊
          </div>
          <div className="absolute bottom-1/4 right-1/3 text-4xl opacity-20 animate-float" style={{ animationDelay: '3s' }}>
            🧠
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Comprehensive Health Tracking
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From vital signs to AI-powered insights, everything you need to monitor 
              and improve your health in one elegant platform.
            </p>
          </div>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Vitals Tracking */}
            <div className="card-luxury text-center group hover:transform hover:scale-105 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-luxury rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-6">
                ❤️
              </div>
              <h3 className="font-heading text-xl font-semibold text-gray-900 mb-3">
                Vital Signs Monitoring
              </h3>
              <p className="text-gray-600 mb-4">
                Track blood pressure, heart rate, temperature, and more with 
                intelligent trend analysis and alerts.
              </p>
              <a href="/vitals" className="text-primary-600 font-medium hover:text-primary-700">
                Learn More →
              </a>
            </div>

            {/* AI Insights */}
            <div className="card-luxury text-center group hover:transform hover:scale-105 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-clinical rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-6">
                🧠
              </div>
              <h3 className="font-heading text-xl font-semibold text-gray-900 mb-3">
                AI Health Insights
              </h3>
              <p className="text-gray-600 mb-4">
                Get personalized health recommendations powered by advanced 
                machine learning algorithms.
              </p>
              <a href="/insights" className="text-primary-600 font-medium hover:text-primary-700">
                Learn More →
              </a>
            </div>

            {/* Records Management */}
            <div className="card-luxury text-center group hover:transform hover:scale-105 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-luxury rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-6">
                📋
              </div>
              <h3 className="font-heading text-xl font-semibold text-gray-900 mb-3">
                Medical Records
              </h3>
              <p className="text-gray-600 mb-4">
                Securely store and organize all your medical documents with 
                intelligent categorization and search.
              </p>
              <a href="/records" className="text-primary-600 font-medium hover:text-primary-700">
                Learn More →
              </a>
            </div>

            {/* Appointments */}
            <div className="card-luxury text-center group hover:transform hover:scale-105 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-clinical rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-6">
                📅
              </div>
              <h3 className="font-heading text-xl font-semibold text-gray-900 mb-3">
                Smart Scheduling
              </h3>
              <p className="text-gray-600 mb-4">
                Book and manage appointments with integrated calendar sync 
                and automated reminders.
              </p>
              <a href="/appointments" className="text-primary-600 font-medium hover:text-primary-700">
                Learn More →
              </a>
            </div>

            {/* Analytics */}
            <div className="card-luxury text-center group hover:transform hover:scale-105 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-luxury rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-6">
                📊
              </div>
              <h3 className="font-heading text-xl font-semibold text-gray-900 mb-3">
                Advanced Analytics
              </h3>
              <p className="text-gray-600 mb-4">
                Visualize your health data with beautiful charts and discover 
                patterns in your wellness journey.
              </p>
              <a href="/dashboard" className="text-primary-600 font-medium hover:text-primary-700">
                Learn More →
              </a>
            </div>

            {/* Wellness Tracking */}
            <div className="card-luxury text-center group hover:transform hover:scale-105 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-clinical rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-6">
                🧘
              </div>
              <h3 className="font-heading text-xl font-semibold text-gray-900 mb-3">
                Wellness Programs
              </h3>
              <p className="text-gray-600 mb-4">
                Join guided wellness programs with meditation, exercise tracking, 
                and lifestyle optimization.
              </p>
              <a href="/wellness" className="text-primary-600 font-medium hover:text-primary-700">
                Learn More →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-wellness">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Ready to Transform Your Health Journey?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of users who have already elevated their wellness with Medi Track.
          </p>
          <a
            href="/dashboard"
            className="btn-primary text-xl px-10 py-4 inline-block"
          >
            Get Started Today
          </a>
        </div>
      </section>
    </>
  );
}