'use client';

/**
 * Profile Page - User Profile Management
 * Personal information, preferences, and health profile settings
 */

import { Suspense } from 'react';
import { motion } from 'framer-motion';
import { pageVariants, containerVariants, itemVariants } from '@/animations/motionVariants';

const userProfile = {
  personal: {
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@email.com',
    phone: '+1 (555) 123-4567',
    dateOfBirth: '1985-03-15',
    gender: 'Female',
    emergencyContact: {
      name: 'John Johnson',
      relationship: 'Spouse',
      phone: '+1 (555) 987-6543'
    }
  },
  medical: {
    bloodType: 'A+',
    height: '5\'6"',
    weight: '135 lbs',
    allergies: ['Penicillin', 'Shellfish'],
    medications: ['Multivitamin', 'Vitamin D3'],
    conditions: ['Mild Hypertension'],
    physician: {
      name: 'Dr. Emily Rodriguez',
      specialty: 'Internal Medicine',
      phone: '+1 (555) 456-7890',
      email: 'e.rodriguez@healthcenter.com'
    }
  },
  preferences: {
    units: 'Imperial',
    timezone: 'EST (UTC-5)',
    language: 'English',
    notifications: {
      medication: true,
      appointments: true,
      insights: true,
      emergency: true
    },
    privacy: {
      shareData: false,
      anonymousAnalytics: true,
      marketing: false
    }
  },
  goals: [
    {
      id: 1,
      category: 'fitness',
      title: 'Daily Steps',
      target: 8000,
      current: 7500,
      unit: 'steps',
      progress: 94
    },
    {
      id: 2,
      category: 'nutrition',
      title: 'Water Intake',
      target: 2.5,
      current: 2.1,
      unit: 'liters',
      progress: 84
    },
    {
      id: 3,
      category: 'sleep',
      title: 'Sleep Duration',
      target: 8,
      current: 7.5,
      unit: 'hours',
      progress: 94
    },
    {
      id: 4,
      category: 'wellness',
      title: 'Meditation',
      target: 15,
      current: 12,
      unit: 'minutes',
      progress: 80
    }
  ]
};

const achievements = [
  {
    id: 1,
    title: 'Consistency Champion',
    description: '30-day tracking streak',
    icon: '🏆',
    date: '2024-01-15',
    category: 'tracking'
  },
  {
    id: 2,
    title: 'Heart Health Hero',
    description: 'Maintained optimal heart rate for 3 months',
    icon: '❤️',
    date: '2024-01-10',
    category: 'cardiovascular'
  },
  {
    id: 3,
    title: 'Sleep Master',
    description: 'Achieved 90%+ sleep quality for 2 weeks',
    icon: '😴',
    date: '2024-01-05',
    category: 'sleep'
  },
  {
    id: 4,
    title: 'Hydration Expert',
    description: 'Met daily water goals for 21 days',
    icon: '💧',
    date: '2023-12-28',
    category: 'nutrition'
  }
];

function ProfileContent() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-ivory-50 via-white to-teal-50">
      {/* Wellness Aura Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-radial from-gold-200/20 via-gold-100/10 to-transparent rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-radial from-teal-200/20 via-teal-100/10 to-transparent rounded-full blur-3xl animate-pulse-slow" />
      </div>

      <motion.main
        initial="initial"
        animate="animate"
        variants={pageVariants}
        className="relative z-10 container mx-auto px-4 py-8"
        id="main-content"
      >
        {/* Header Section */}
        <motion.section variants={itemVariants} className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-heading font-bold text-navy-900 mb-2">
                My Profile
              </h1>
              <p className="text-lg text-navy-600 font-body">
                Manage your personal information and health preferences.
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-white px-6 py-3 rounded-xl font-body font-medium shadow-clinical hover:shadow-clinical-hover transition-all duration-300"
            >
              Edit Profile
            </motion.button>
          </div>
        </motion.section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Personal Info & Medical */}
          <div className="lg:col-span-2 space-y-8">
            {/* Personal Information */}
            <motion.section variants={containerVariants}>
              <motion.h2 
                variants={itemVariants}
                className="text-2xl font-heading font-semibold text-navy-900 mb-6"
              >
                Personal Information
              </motion.h2>
              <motion.div
                variants={itemVariants}
                className="bg-white/80 backdrop-blur-sm border border-gold-200/30 rounded-2xl p-6 shadow-luxury"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-body font-medium text-navy-600 mb-2 block">
                      First Name
                    </label>
                    <div className="text-lg font-body text-navy-900">
                      {userProfile.personal.firstName}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-body font-medium text-navy-600 mb-2 block">
                      Last Name
                    </label>
                    <div className="text-lg font-body text-navy-900">
                      {userProfile.personal.lastName}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-body font-medium text-navy-600 mb-2 block">
                      Email
                    </label>
                    <div className="text-lg font-body text-navy-900">
                      {userProfile.personal.email}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-body font-medium text-navy-600 mb-2 block">
                      Phone
                    </label>
                    <div className="text-lg font-body text-navy-900">
                      {userProfile.personal.phone}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-body font-medium text-navy-600 mb-2 block">
                      Date of Birth
                    </label>
                    <div className="text-lg font-body text-navy-900">
                      {new Date(userProfile.personal.dateOfBirth).toLocaleDateString()}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-body font-medium text-navy-600 mb-2 block">
                      Gender
                    </label>
                    <div className="text-lg font-body text-navy-900">
                      {userProfile.personal.gender}
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200/50">
                  <h3 className="text-lg font-heading font-semibold text-navy-900 mb-4">
                    Emergency Contact
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-body font-medium text-navy-600 mb-2 block">
                        Name
                      </label>
                      <div className="text-lg font-body text-navy-900">
                        {userProfile.personal.emergencyContact.name}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-body font-medium text-navy-600 mb-2 block">
                        Relationship
                      </label>
                      <div className="text-lg font-body text-navy-900">
                        {userProfile.personal.emergencyContact.relationship}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-body font-medium text-navy-600 mb-2 block">
                        Phone
                      </label>
                      <div className="text-lg font-body text-navy-900">
                        {userProfile.personal.emergencyContact.phone}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.section>

            {/* Medical Information */}
            <motion.section variants={containerVariants}>
              <motion.h2 
                variants={itemVariants}
                className="text-2xl font-heading font-semibold text-navy-900 mb-6"
              >
                Medical Information
              </motion.h2>
              <motion.div
                variants={itemVariants}
                className="bg-white/80 backdrop-blur-sm border border-teal-200/30 rounded-2xl p-6 shadow-clinical"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div>
                    <label className="text-sm font-body font-medium text-navy-600 mb-2 block">
                      Blood Type
                    </label>
                    <div className="text-lg font-body text-navy-900">
                      {userProfile.medical.bloodType}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-body font-medium text-navy-600 mb-2 block">
                      Height
                    </label>
                    <div className="text-lg font-body text-navy-900">
                      {userProfile.medical.height}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-body font-medium text-navy-600 mb-2 block">
                      Weight
                    </label>
                    <div className="text-lg font-body text-navy-900">
                      {userProfile.medical.weight}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="text-sm font-body font-medium text-navy-600 mb-2 block">
                      Allergies
                    </label>
                    <div className="space-y-1">
                      {userProfile.medical.allergies.map((allergy, index) => (
                        <span 
                          key={index}
                          className="inline-block bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-body mr-2 mb-1"
                        >
                          {allergy}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-body font-medium text-navy-600 mb-2 block">
                      Current Medications
                    </label>
                    <div className="space-y-1">
                      {userProfile.medical.medications.map((medication, index) => (
                        <span 
                          key={index}
                          className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-body mr-2 mb-1"
                        >
                          {medication}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-body font-medium text-navy-600 mb-2 block">
                      Medical Conditions
                    </label>
                    <div className="space-y-1">
                      {userProfile.medical.conditions.map((condition, index) => (
                        <span 
                          key={index}
                          className="inline-block bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-body mr-2 mb-1"
                        >
                          {condition}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200/50">
                  <h3 className="text-lg font-heading font-semibold text-navy-900 mb-4">
                    Primary Physician
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-body font-medium text-navy-600 mb-2 block">
                        Name & Specialty
                      </label>
                      <div className="text-lg font-body text-navy-900">
                        {userProfile.medical.physician.name}
                      </div>
                      <div className="text-sm font-body text-navy-500">
                        {userProfile.medical.physician.specialty}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-body font-medium text-navy-600 mb-2 block">
                        Contact Information
                      </label>
                      <div className="text-lg font-body text-navy-900">
                        {userProfile.medical.physician.phone}
                      </div>
                      <div className="text-sm font-body text-navy-500">
                        {userProfile.medical.physician.email}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.section>
          </div>

          {/* Right Column - Goals & Achievements */}
          <div className="space-y-8">
            {/* Health Goals */}
            <motion.section variants={containerVariants}>
              <motion.h2 
                variants={itemVariants}
                className="text-2xl font-heading font-semibold text-navy-900 mb-6"
              >
                Health Goals
              </motion.h2>
              <div className="space-y-4">
                {userProfile.goals.map((goal, index) => (
                  <motion.div
                    key={goal.id}
                    variants={itemVariants}
                    custom={index}
                    whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                    className="bg-white/80 backdrop-blur-sm border border-gold-200/30 rounded-xl p-4 shadow-luxury hover:shadow-luxury-hover transition-all duration-300"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-heading font-semibold text-navy-900">
                        {goal.title}
                      </h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        goal.category === 'fitness' ? 'bg-green-100 text-green-700' :
                        goal.category === 'nutrition' ? 'bg-blue-100 text-blue-700' :
                        goal.category === 'sleep' ? 'bg-purple-100 text-purple-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {goal.category}
                      </span>
                    </div>
                    <div className="mb-3">
                      <div className="flex items-center justify-between text-sm font-body text-navy-600 mb-1">
                        <span>{goal.current} / {goal.target} {goal.unit}</span>
                        <span>{goal.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-500 ${
                            goal.progress >= 90 ? 'bg-green-500' :
                            goal.progress >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${goal.progress}%` }}
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>

            {/* Recent Achievements */}
            <motion.section variants={containerVariants}>
              <motion.h2 
                variants={itemVariants}
                className="text-2xl font-heading font-semibold text-navy-900 mb-6"
              >
                Recent Achievements
              </motion.h2>
              <div className="space-y-4">
                {achievements.map((achievement, index) => (
                  <motion.div
                    key={achievement.id}
                    variants={itemVariants}
                    custom={index}
                    whileHover={{ y: -2, transition: { duration: 0.2 } }}
                    className="bg-white/80 backdrop-blur-sm border border-teal-200/30 rounded-xl p-4 shadow-clinical hover:shadow-clinical-hover transition-all duration-300"
                  >
                    <div className="flex items-start space-x-3">
                      <div className="text-2xl">{achievement.icon}</div>
                      <div className="flex-1">
                        <h3 className="text-lg font-heading font-semibold text-navy-900 mb-1">
                          {achievement.title}
                        </h3>
                        <p className="text-navy-600 font-body text-sm mb-2">
                          {achievement.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            achievement.category === 'tracking' ? 'bg-purple-100 text-purple-700' :
                            achievement.category === 'cardiovascular' ? 'bg-red-100 text-red-700' :
                            achievement.category === 'sleep' ? 'bg-blue-100 text-blue-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {achievement.category}
                          </span>
                          <span className="text-xs text-navy-500 font-body">
                            {new Date(achievement.date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          </div>
        </div>
      </motion.main>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-ivory-50 via-white to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gold-200 border-t-gold-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-navy-600 font-body">Loading your profile...</p>
        </div>
      </div>
    }>
      <ProfileContent />
    </Suspense>
  );
}