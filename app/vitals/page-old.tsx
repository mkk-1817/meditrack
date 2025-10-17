'use client';

/**
 * Vitals Page - Detailed Health Metrics Tracking
 * Comprehensive vital signs monitoring with historical data and trends
 */

import { Suspense } from 'react';
import { motion } from 'framer-motion';
import { pageVariants, containerVariants, itemVariants } from '@/animations/motionVariants';

// Enhanced vitals data with historical tracking
const vitalsData = [
  {
    id: 'heart-rate',
    title: 'Heart Rate',
    value: '72',
    unit: 'bpm',
    trend: 'stable' as 'increasing' | 'decreasing' | 'stable',
    status: 'normal' as const,
    lastUpdated: '2 minutes ago',
    icon: '❤️',
    range: { min: 60, max: 100, optimal: [60, 80] },
    history: [68, 70, 72, 74, 72, 69, 71],
    timeLabels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  {
    id: 'blood-pressure',
    title: 'Blood Pressure',
    value: '120/80',
    unit: 'mmHg',
    trend: 'stable' as 'increasing' | 'decreasing' | 'stable',
    status: 'normal' as const,
    lastUpdated: '5 minutes ago',
    icon: '🩸',
    range: { min: 90, max: 140, optimal: [90, 120] },
    history: [118, 120, 122, 119, 120, 121, 120],
    timeLabels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  {
    id: 'temperature',
    title: 'Body Temperature',
    value: '98.6',
    unit: '°F',
    trend: 'stable' as 'increasing' | 'decreasing' | 'stable',
    status: 'normal' as const,
    lastUpdated: '10 minutes ago',
    icon: '🌡️',
    range: { min: 97, max: 100, optimal: [98, 99] },
    history: [98.4, 98.6, 98.5, 98.7, 98.6, 98.5, 98.6],
    timeLabels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  {
    id: 'oxygen-saturation',
    title: 'Oxygen Saturation',
    value: '98',
    unit: '%',
    trend: 'stable' as 'increasing' | 'decreasing' | 'stable',
    status: 'normal' as const,
    lastUpdated: '3 minutes ago',
    icon: '🫁',
    range: { min: 95, max: 100, optimal: [95, 100] },
    history: [97, 98, 98, 99, 98, 97, 98],
    timeLabels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  {
    id: 'glucose',
    title: 'Blood Glucose',
    value: '95',
    unit: 'mg/dL',
    trend: 'increasing' as 'increasing' | 'decreasing' | 'stable',
    status: 'normal' as const,
    lastUpdated: '1 hour ago',
    icon: '🍯',
    range: { min: 70, max: 140, optimal: [80, 120] },
    history: [102, 98, 95, 92, 95, 97, 95],
    timeLabels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  {
    id: 'weight',
    title: 'Weight',
    value: '70.2',
    unit: 'kg',
    trend: 'stable' as 'increasing' | 'decreasing' | 'stable',
    status: 'normal' as const,
    lastUpdated: 'This morning',
    icon: '⚖️',
    range: { min: 50, max: 100, optimal: [65, 75] },
    history: [70.5, 70.3, 70.1, 70.0, 70.2, 70.1, 70.2],
    timeLabels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  }
];

const quickActions = [
  {
    id: 'manual-entry',
    title: 'Manual Entry',
    description: 'Log your vitals manually',
    icon: '✍️',
    color: 'gold',
    action: 'log-vitals'
  },
  {
    id: 'device-sync',
    title: 'Sync Devices',
    description: 'Connect wearables & monitors',
    icon: '📱',
    color: 'teal',
    action: 'sync-devices'
  },
  {
    id: 'export-data',
    title: 'Export Data',
    description: 'Download health records',
    icon: '📊',
    color: 'navy',
    action: 'export-data'
  },
  {
    id: 'set-alerts',
    title: 'Set Alerts',
    description: 'Configure health notifications',
    icon: '🔔',
    color: 'purple',
    action: 'set-alerts'
  }
];

function VitalsContent() {
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
                Vital Signs
              </h1>
              <p className="text-lg text-navy-600 font-body">
                Monitor your health metrics with precision and historical insights.
              </p>
            </div>
            <div className="text-right">
              <div className="bg-white/80 backdrop-blur-sm border border-gold-200/30 rounded-xl p-4 shadow-luxury">
                <p className="text-sm text-navy-500 font-body mb-1">Overall Health Score</p>
                <p className="text-3xl font-heading font-bold text-gold-600">92/100</p>
                <p className="text-xs text-green-600 font-body">Excellent</p>
              </div>
            </div>
          </div>

          {/* Status Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Normal', count: 5, color: 'green' },
              { label: 'Attention', count: 1, color: 'yellow' },
              { label: 'Critical', count: 0, color: 'red' },
              { label: 'Missing', count: 0, color: 'gray' }
            ].map((status, index) => (
              <motion.div
                key={status.label}
                variants={itemVariants}
                custom={index}
                className="bg-white/70 backdrop-blur-sm border border-gray-200/50 rounded-lg p-4 text-center"
              >
                <div className={`text-2xl font-bold mb-1 ${
                  status.color === 'green' ? 'text-green-600' :
                  status.color === 'yellow' ? 'text-yellow-600' :
                  status.color === 'red' ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {status.count}
                </div>
                <div className="text-sm text-navy-600 font-body">{status.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Vitals Grid */}
        <motion.section variants={containerVariants} className="mb-8">
          <motion.h2 
            variants={itemVariants}
            className="text-2xl font-heading font-semibold text-navy-900 mb-6"
          >
            Current Readings
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vitalsData.map((vital, index) => (
              <motion.div
                key={vital.id}
                variants={itemVariants}
                custom={index}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="group"
              >
                <div className="bg-white/80 backdrop-blur-sm border border-gold-200/30 rounded-2xl p-6 shadow-luxury hover:shadow-luxury-hover transition-all duration-300">
                  {/* Vital Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="text-3xl">{vital.icon}</div>
                      <div>
                        <h3 className="text-lg font-heading font-semibold text-navy-900">
                          {vital.title}
                        </h3>
                        <p className="text-sm text-navy-500 font-body">{vital.lastUpdated}</p>
                      </div>
                    </div>
                    <div className={`w-3 h-3 rounded-full ${
                      vital.status === 'normal' ? 'bg-green-500' :
                      vital.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                    }`} />
                  </div>

                  {/* Current Value */}
                  <div className="text-center mb-4">
                    <div className="text-4xl font-heading font-bold text-navy-900 mb-1">
                      {vital.value}
                      <span className="text-lg text-navy-500 ml-1">{vital.unit}</span>
                    </div>
                    <div className={`text-sm font-body ${
                      vital.trend === 'increasing' ? 'text-green-600' :
                      vital.trend === 'decreasing' ? 'text-red-600' : 'text-navy-600'
                    }`}>
                      {vital.trend === 'stable' ? 'Stable' :
                       vital.trend === 'increasing' ? '↗ Increasing' : '↘ Decreasing'}
                    </div>
                  </div>

                  {/* Range Indicator */}
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-navy-500 font-body mb-1">
                      <span>{vital.range.min}</span>
                      <span>Optimal: {vital.range.optimal[0]}-{vital.range.optimal[1]}</span>
                      <span>{vital.range.max}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-green-400 to-green-500 h-2 rounded-full relative"
                        style={{
                          width: `${((vital.range.optimal[1] - vital.range.optimal[0]) / (vital.range.max - vital.range.min)) * 100}%`,
                          marginLeft: `${((vital.range.optimal[0] - vital.range.min) / (vital.range.max - vital.range.min)) * 100}%`
                        }}
                      >
                        <div 
                          className="absolute top-0 w-1 h-2 bg-navy-700 rounded-full transform -translate-x-1/2"
                          style={{
                            left: `${((parseFloat(vital.value.split('/')[0]) - vital.range.optimal[0]) / (vital.range.optimal[1] - vital.range.optimal[0])) * 100}%`
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Mini Chart */}
                  <div className="h-16 flex items-end space-x-1">
                    {vital.history.map((value, idx) => (
                      <div
                        key={idx}
                        className="flex-1 bg-gradient-to-t from-teal-300 to-teal-500 rounded-t opacity-70 group-hover:opacity-100 transition-opacity duration-300"
                        style={{ 
                          height: `${(value / Math.max(...vital.history)) * 100}%`,
                          minHeight: '4px'
                        }}
                      />
                    ))}
                  </div>
                  <div className="flex justify-between text-xs text-navy-400 font-body mt-1">
                    <span>{vital.timeLabels[0]}</span>
                    <span>{vital.timeLabels[vital.timeLabels.length - 1]}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Quick Actions */}
        <motion.section variants={containerVariants} className="mb-8">
          <motion.h2 
            variants={itemVariants}
            className="text-2xl font-heading font-semibold text-navy-900 mb-6"
          >
            Quick Actions
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <motion.button
                key={action.id}
                variants={itemVariants}
                custom={index}
                whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                whileTap={{ scale: 0.98 }}
                className={`
                  p-6 rounded-xl text-left transition-all duration-300 transform
                  ${action.color === 'gold' ? 'bg-gradient-to-br from-gold-50 to-gold-100 hover:from-gold-100 hover:to-gold-200 text-gold-800' :
                    action.color === 'teal' ? 'bg-gradient-to-br from-teal-50 to-teal-100 hover:from-teal-100 hover:to-teal-200 text-teal-800' :
                    action.color === 'navy' ? 'bg-gradient-to-br from-navy-50 to-navy-100 hover:from-navy-100 hover:to-navy-200 text-navy-800' :
                    'bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 text-purple-800'
                  }
                  shadow-luxury hover:shadow-luxury-hover
                `}
              >
                <div className="text-3xl mb-3">{action.icon}</div>
                <div className="font-heading font-semibold mb-1">{action.title}</div>
                <div className="text-sm opacity-80 font-body">{action.description}</div>
              </motion.button>
            ))}
          </div>
        </motion.section>

        {/* Historical Trends */}
        <motion.section variants={containerVariants}>
          <motion.h2 
            variants={itemVariants}
            className="text-2xl font-heading font-semibold text-navy-900 mb-6"
          >
            7-Day Trends
          </motion.h2>
          <motion.div
            variants={itemVariants}
            className="bg-white/80 backdrop-blur-sm border border-gold-200/30 rounded-2xl p-6 shadow-luxury"
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Heart Rate Trend */}
              <div>
                <h3 className="text-lg font-heading font-semibold text-navy-900 mb-4">Heart Rate</h3>
                <div className="h-32 flex items-end space-x-2">
                  {vitalsData[0].history.map((value, idx) => (
                    <div key={idx} className="flex-1 text-center">
                      <div
                        className="bg-gradient-to-t from-red-300 to-red-500 rounded-t mb-1"
                        style={{ height: `${(value / Math.max(...vitalsData[0].history)) * 100}%` }}
                      />
                      <div className="text-xs text-navy-500 font-body">
                        {vitalsData[0].timeLabels[idx]}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Blood Pressure Trend */}
              <div>
                <h3 className="text-lg font-heading font-semibold text-navy-900 mb-4">Blood Pressure</h3>
                <div className="h-32 flex items-end space-x-2">
                  {vitalsData[1].history.map((value, idx) => (
                    <div key={idx} className="flex-1 text-center">
                      <div
                        className="bg-gradient-to-t from-blue-300 to-blue-500 rounded-t mb-1"
                        style={{ height: `${(value / Math.max(...vitalsData[1].history)) * 100}%` }}
                      />
                      <div className="text-xs text-navy-500 font-body">
                        {vitalsData[1].timeLabels[idx]}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Temperature Trend */}
              <div>
                <h3 className="text-lg font-heading font-semibold text-navy-900 mb-4">Temperature</h3>
                <div className="h-32 flex items-end space-x-2">
                  {vitalsData[2].history.map((value, idx) => (
                    <div key={idx} className="flex-1 text-center">
                      <div
                        className="bg-gradient-to-t from-yellow-300 to-yellow-500 rounded-t mb-1"
                        style={{ height: `${(value / Math.max(...vitalsData[2].history)) * 100}%` }}
                      />
                      <div className="text-xs text-navy-500 font-body">
                        {vitalsData[2].timeLabels[idx]}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.section>
      </motion.main>
    </div>
  );
}

export default function VitalsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-ivory-50 via-white to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gold-200 border-t-gold-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-navy-600 font-body">Loading vital signs...</p>
        </div>
      </div>
    }>
      <VitalsContent />
    </Suspense>
  );
}