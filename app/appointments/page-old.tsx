'use client';

/**
 * Appointments Page - Medical Appointment Management
 * Schedule, view, and manage medical appointments with healthcare providers
 */

import { Suspense } from 'react';
import { motion } from 'framer-motion';
import { pageVariants, containerVariants, itemVariants } from '@/animations/motionVariants';

const upcomingAppointments = [
  {
    id: 1,
    type: 'routine-checkup',
    title: 'Annual Physical Examination',
    provider: {
      name: 'Dr. Emily Rodriguez',
      specialty: 'Internal Medicine',
      image: '/api/placeholder/40/40'
    },
    date: '2024-02-15',
    time: '10:30 AM',
    duration: 60,
    location: {
      type: 'in-person',
      address: 'Health Center, 123 Medical Dr, Suite 200',
      room: 'Room 205'
    },
    status: 'confirmed',
    notes: 'Bring insurance card and list of current medications',
    reminders: ['24 hours before', '2 hours before']
  },
  {
    id: 2,
    type: 'follow-up',
    title: 'Blood Pressure Follow-up',
    provider: {
      name: 'Dr. Emily Rodriguez',
      specialty: 'Internal Medicine',
      image: '/api/placeholder/40/40'
    },
    date: '2024-02-22',
    time: '2:00 PM',
    duration: 30,
    location: {
      type: 'telemedicine',
      platform: 'Zoom',
      link: 'https://zoom.us/j/1234567890'
    },
    status: 'confirmed',
    notes: 'Review recent blood pressure readings and medication effectiveness',
    reminders: ['24 hours before', '15 minutes before']
  },
  {
    id: 3,
    type: 'specialist',
    title: 'Dermatology Consultation',
    provider: {
      name: 'Dr. Michael Chen',
      specialty: 'Dermatology',
      image: '/api/placeholder/40/40'
    },
    date: '2024-03-01',
    time: '11:15 AM',
    duration: 45,
    location: {
      type: 'in-person',
      address: 'Skin Health Clinic, 456 Wellness Ave',
      room: 'Suite 301'
    },
    status: 'pending',
    notes: 'Annual skin cancer screening',
    reminders: ['1 week before', '24 hours before']
  }
];

const pastAppointments = [
  {
    id: 4,
    type: 'routine-checkup',
    title: 'Quarterly Health Review',
    provider: {
      name: 'Dr. Emily Rodriguez',
      specialty: 'Internal Medicine'
    },
    date: '2024-01-15',
    time: '3:30 PM',
    duration: 45,
    status: 'completed',
    summary: 'All vitals normal. Continue current medication regimen. Schedule follow-up in 3 months.',
    prescriptions: ['Lisinopril 10mg daily', 'Multivitamin'],
    nextSteps: ['Monitor BP daily', 'Lab work in 6 months']
  },
  {
    id: 5,
    type: 'lab-work',
    title: 'Annual Lab Panel',
    provider: {
      name: 'Quest Diagnostics',
      specialty: 'Laboratory Services'
    },
    date: '2024-01-08',
    time: '8:00 AM',
    duration: 15,
    status: 'completed',
    summary: 'Complete blood count, lipid panel, and metabolic panel. All results within normal ranges.',
    results: ['Cholesterol: 185 mg/dL', 'Glucose: 92 mg/dL', 'Hemoglobin: 14.2 g/dL'],
    nextSteps: ['Repeat annually']
  }
];

const appointmentTypes = [
  {
    type: 'routine-checkup',
    name: 'Routine Checkup',
    description: 'Regular health examination',
    icon: '🩺',
    color: 'blue'
  },
  {
    type: 'follow-up',
    name: 'Follow-up Visit',
    description: 'Post-treatment or monitoring visit',
    icon: '📋',
    color: 'green'
  },
  {
    type: 'specialist',
    name: 'Specialist Consultation',
    description: 'Visit with a medical specialist',
    icon: '👨‍⚕️',
    color: 'purple'
  },
  {
    type: 'urgent-care',
    name: 'Urgent Care',
    description: 'Non-emergency urgent medical care',
    icon: '🚨',
    color: 'orange'
  },
  {
    type: 'telemedicine',
    name: 'Telemedicine',
    description: 'Virtual consultation',
    icon: '💻',
    color: 'teal'
  },
  {
    type: 'lab-work',
    name: 'Lab Work',
    description: 'Laboratory tests and procedures',
    icon: '🧪',
    color: 'red'
  }
];

function AppointmentsContent() {
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
                Appointments
              </h1>
              <p className="text-lg text-navy-600 font-body">
                Manage your healthcare appointments and medical visits.
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-white px-6 py-3 rounded-xl font-body font-medium shadow-clinical hover:shadow-clinical-hover transition-all duration-300"
            >
              Schedule Appointment
            </motion.button>
          </div>
        </motion.section>

        {/* Quick Actions */}
        <motion.section variants={containerVariants} className="mb-8">
          <motion.h2 
            variants={itemVariants}
            className="text-2xl font-heading font-semibold text-navy-900 mb-6"
          >
            Quick Schedule
          </motion.h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {appointmentTypes.map((type, index) => (
              <motion.button
                key={type.type}
                variants={itemVariants}
                custom={index}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className={`
                  p-4 rounded-xl border-2 transition-all duration-300 text-center
                  ${type.color === 'blue' ? 'bg-blue-50 border-blue-200 hover:border-blue-300 text-blue-700' :
                    type.color === 'green' ? 'bg-green-50 border-green-200 hover:border-green-300 text-green-700' :
                    type.color === 'purple' ? 'bg-purple-50 border-purple-200 hover:border-purple-300 text-purple-700' :
                    type.color === 'orange' ? 'bg-orange-50 border-orange-200 hover:border-orange-300 text-orange-700' :
                    type.color === 'teal' ? 'bg-teal-50 border-teal-200 hover:border-teal-300 text-teal-700' :
                    'bg-red-50 border-red-200 hover:border-red-300 text-red-700'
                  }
                `}
              >
                <div className="text-2xl mb-2">{type.icon}</div>
                <div className="font-body font-semibold text-sm mb-1">{type.name}</div>
                <div className="font-body text-xs opacity-75">{type.description}</div>
              </motion.button>
            ))}
          </div>
        </motion.section>

        {/* Upcoming Appointments */}
        <motion.section variants={containerVariants} className="mb-8">
          <motion.h2 
            variants={itemVariants}
            className="text-2xl font-heading font-semibold text-navy-900 mb-6"
          >
            Upcoming Appointments
          </motion.h2>
          <div className="space-y-4">
            {upcomingAppointments.map((appointment, index) => (
              <motion.div
                key={appointment.id}
                variants={itemVariants}
                custom={index}
                whileHover={{ x: 5, transition: { duration: 0.2 } }}
                className="bg-white/80 backdrop-blur-sm border border-gold-200/30 rounded-2xl p-6 shadow-luxury hover:shadow-luxury-hover transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-gold-100 to-gold-200 rounded-full flex items-center justify-center text-gold-700 font-heading font-bold text-lg">
                      {appointment.provider.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h3 className="text-xl font-heading font-semibold text-navy-900 mb-1">
                        {appointment.title}
                      </h3>
                      <p className="text-navy-600 font-body mb-2">
                        {appointment.provider.name} • {appointment.provider.specialty}
                      </p>
                      <div className="flex items-center space-x-4 text-sm font-body text-navy-500">
                        <span>📅 {new Date(appointment.date).toLocaleDateString()}</span>
                        <span>🕒 {appointment.time}</span>
                        <span>⏱️ {appointment.duration} min</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`
                      px-3 py-1 rounded-full text-xs font-body font-medium mb-2
                      ${appointment.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                        appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-700'
                      }
                    `}>
                      {appointment.status}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-navy-50/50 rounded-lg p-4">
                    <h4 className="text-sm font-heading font-semibold text-navy-700 mb-2">
                      📍 Location
                    </h4>
                    {appointment.location.type === 'in-person' ? (
                      <div>
                        <p className="text-sm font-body text-navy-600 mb-1">
                          {appointment.location.address}
                        </p>
                        <p className="text-xs font-body text-navy-500">
                          {appointment.location.room}
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-sm font-body text-navy-600 mb-1">
                          Virtual ({appointment.location.platform})
                        </p>
                        <p className="text-xs font-body text-teal-600">
                          Join link will be sent 15 minutes before
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="bg-navy-50/50 rounded-lg p-4">
                    <h4 className="text-sm font-heading font-semibold text-navy-700 mb-2">
                      📝 Notes
                    </h4>
                    <p className="text-sm font-body text-navy-600">
                      {appointment.notes}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200/50">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-body text-navy-500">Reminders:</span>
                    {appointment.reminders.map((reminder, idx) => (
                      <span 
                        key={idx}
                        className="px-2 py-1 bg-teal-100 text-teal-700 text-xs font-body rounded-full"
                      >
                        {reminder}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 bg-navy-100 hover:bg-navy-200 text-navy-700 rounded-lg font-body font-medium text-sm transition-colors duration-200"
                    >
                      Reschedule
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg font-body font-medium text-sm transition-colors duration-200"
                    >
                      Cancel
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Past Appointments */}
        <motion.section variants={containerVariants}>
          <motion.h2 
            variants={itemVariants}
            className="text-2xl font-heading font-semibold text-navy-900 mb-6"
          >
            Recent Appointments
          </motion.h2>
          <div className="space-y-4">
            {pastAppointments.map((appointment, index) => (
              <motion.div
                key={appointment.id}
                variants={itemVariants}
                custom={index}
                whileHover={{ x: 5, transition: { duration: 0.2 } }}
                className="bg-white/80 backdrop-blur-sm border border-teal-200/30 rounded-2xl p-6 shadow-clinical hover:shadow-clinical-hover transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-teal-100 to-teal-200 rounded-full flex items-center justify-center text-teal-700 font-heading font-bold text-lg">
                      {appointment.provider.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h3 className="text-xl font-heading font-semibold text-navy-900 mb-1">
                        {appointment.title}
                      </h3>
                      <p className="text-navy-600 font-body mb-2">
                        {appointment.provider.name} • {appointment.provider.specialty}
                      </p>
                      <div className="flex items-center space-x-4 text-sm font-body text-navy-500">
                        <span>📅 {new Date(appointment.date).toLocaleDateString()}</span>
                        <span>🕒 {appointment.time}</span>
                        <span>⏱️ {appointment.duration} min</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-body font-medium">
                    {appointment.status}
                  </div>
                </div>

                <div className="bg-green-50/50 border border-green-200/30 rounded-lg p-4 mb-4">
                  <h4 className="text-sm font-heading font-semibold text-green-800 mb-2">
                    📋 Visit Summary
                  </h4>
                  <p className="text-green-700 font-body text-sm leading-relaxed mb-3">
                    {appointment.summary}
                  </p>
                  
                  {appointment.prescriptions && (
                    <div className="mb-3">
                      <h5 className="text-xs font-heading font-semibold text-green-800 mb-1">
                        Prescriptions:
                      </h5>
                      <div className="flex flex-wrap gap-2">
                        {appointment.prescriptions.map((prescription, idx) => (
                          <span 
                            key={idx}
                            className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-body rounded-full"
                          >
                            {prescription}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {appointment.results && (
                    <div className="mb-3">
                      <h5 className="text-xs font-heading font-semibold text-green-800 mb-1">
                        Results:
                      </h5>
                      <div className="flex flex-wrap gap-2">
                        {appointment.results.map((result, idx) => (
                          <span 
                            key={idx}
                            className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-body rounded-full"
                          >
                            {result}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {appointment.nextSteps && (
                    <div>
                      <h5 className="text-xs font-heading font-semibold text-green-800 mb-1">
                        Next Steps:
                      </h5>
                      <div className="flex flex-wrap gap-2">
                        {appointment.nextSteps.map((step, idx) => (
                          <span 
                            key={idx}
                            className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-body rounded-full"
                          >
                            {step}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-end space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 bg-teal-100 hover:bg-teal-200 text-teal-700 rounded-lg font-body font-medium text-sm transition-colors duration-200"
                  >
                    View Details
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 bg-navy-100 hover:bg-navy-200 text-navy-700 rounded-lg font-body font-medium text-sm transition-colors duration-200"
                  >
                    Download Report
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </motion.main>
    </div>
  );
}

export default function AppointmentsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-ivory-50 via-white to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gold-200 border-t-gold-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-navy-600 font-body">Loading your appointments...</p>
        </div>
      </div>
    }>
      <AppointmentsContent />
    </Suspense>
  );
}