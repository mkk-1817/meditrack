'use client';

/**
 * Insights Page - AI-Powered Health Analytics
 * Advanced health insights with AI recommendations and trend analysis
 */

import { Suspense } from 'react';
import { motion } from 'framer-motion';
import { pageVariants, containerVariants, itemVariants } from '@/animations/motionVariants';

const healthInsights = [
  {
    id: 1,
    category: 'cardiovascular',
    priority: 'low' as 'high' | 'medium' | 'low',
    title: 'Excellent Cardiovascular Health',
    description: 'Your heart rate and blood pressure readings consistently fall within optimal ranges.',
    recommendation: 'Continue your current exercise routine. Consider adding 15 minutes of cardio 3x per week to maintain excellent heart health.',
    confidence: 94,
    impact: 'high',
    timeframe: 'Maintain current habits',
    metrics: ['Heart Rate: 72 bpm', 'BP: 120/80 mmHg', 'Resting HR: 65 bpm'],
    timestamp: '2 hours ago',
    readTime: '2 min read'
  },
  {
    id: 2,
    category: 'sleep',
    priority: 'medium' as 'high' | 'medium' | 'low',
    title: 'Sleep Quality Optimization Opportunity',
    description: 'Your sleep duration is good, but deep sleep percentage could be improved for better recovery.',
    recommendation: 'Try reducing screen time 1 hour before bed and consider a consistent bedtime routine. Room temperature of 65-68°F may help.',
    confidence: 87,
    impact: 'medium',
    timeframe: '2-3 weeks',
    metrics: ['Sleep Duration: 7.5 hrs', 'Deep Sleep: 18%', 'REM Sleep: 22%'],
    timestamp: '1 day ago',
    readTime: '3 min read'
  },
  {
    id: 3,
    category: 'stress',
    priority: 'low' as 'high' | 'medium' | 'low',
    title: 'Stress Management Success',
    description: 'Your stress levels have decreased by 25% over the past month. Your meditation practice is showing excellent results.',
    recommendation: 'Continue your current stress management techniques. Consider adding breathing exercises during high-stress periods.',
    confidence: 91,
    impact: 'high',
    timeframe: 'Ongoing',
    metrics: ['Stress Level: 32%', 'HRV: Improved', 'Cortisol: Normal'],
    timestamp: '3 hours ago',
    readTime: '2 min read'
  },
  {
    id: 4,
    category: 'nutrition',
    priority: 'medium' as 'high' | 'medium' | 'low',
    title: 'Hydration Pattern Analysis',
    description: 'Your hydration levels show room for improvement, especially during afternoon hours.',
    recommendation: 'Increase water intake by 16oz daily. Set reminders every 2 hours between 12-6 PM for optimal hydration.',
    confidence: 83,
    impact: 'medium',
    timeframe: '1-2 weeks',
    metrics: ['Daily Intake: 2.1L', 'Target: 2.5L', 'Afternoon Gap: 40%'],
    timestamp: '5 hours ago',
    readTime: '3 min read'
  },
  {
    id: 5,
    category: 'activity',
    priority: 'low' as 'high' | 'medium' | 'low',
    title: 'Activity Level Trends',
    description: 'Your step count and activity levels are consistently above recommended guidelines.',
    recommendation: 'Excellent work maintaining active lifestyle. Consider adding strength training twice weekly for comprehensive fitness.',
    confidence: 89,
    impact: 'medium',
    timeframe: 'Next 4 weeks',
    metrics: ['Daily Steps: 8,500', 'Active Minutes: 45', 'Calories: 2,200'],
    timestamp: '6 hours ago',
    readTime: '2 min read'
  }
];

const trendAnalysis = [
  {
    metric: 'Overall Health Score',
    current: 92,
    previous: 88,
    change: '+4',
    trend: 'improving',
    period: '30 days'
  },
  {
    metric: 'Cardiovascular Fitness',
    current: 95,
    previous: 93,
    change: '+2',
    trend: 'improving',
    period: '30 days'
  },
  {
    metric: 'Sleep Quality',
    current: 85,
    previous: 82,
    change: '+3',
    trend: 'improving',
    period: '30 days'
  },
  {
    metric: 'Stress Management',
    current: 78,
    previous: 65,
    change: '+13',
    trend: 'improving',
    period: '30 days'
  }
];

const aiRecommendations = [
  {
    type: 'immediate',
    title: 'Drink Water',
    description: 'You haven\'t logged water intake in 3 hours',
    action: 'Log 8oz water',
    urgency: 'low'
  },
  {
    type: 'daily',
    title: 'Evening Wind Down',
    description: 'Start your bedtime routine in 30 minutes',
    action: 'Begin relaxation',
    urgency: 'medium'
  },
  {
    type: 'weekly',
    title: 'Cardio Session',
    description: 'Schedule your next cardio workout',
    action: 'Plan exercise',
    urgency: 'low'
  }
];

function InsightsContent() {
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
                Health Insights
              </h1>
              <p className="text-lg text-navy-600 font-body">
                AI-powered analysis and personalized recommendations for optimal health.
              </p>
            </div>
            <div className="text-right">
              <div className="bg-white/80 backdrop-blur-sm border border-gold-200/30 rounded-xl p-4 shadow-luxury">
                <p className="text-sm text-navy-500 font-body mb-1">AI Confidence</p>
                <p className="text-3xl font-heading font-bold text-teal-600">89%</p>
                <p className="text-xs text-green-600 font-body">High Accuracy</p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Health Trends Overview */}
        <motion.section variants={containerVariants} className="mb-8">
          <motion.h2 
            variants={itemVariants}
            className="text-2xl font-heading font-semibold text-navy-900 mb-6"
          >
            Health Trends (30 Days)
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {trendAnalysis.map((trend, index) => (
              <motion.div
                key={trend.metric}
                variants={itemVariants}
                custom={index}
                whileHover={{ y: -3, transition: { duration: 0.2 } }}
                className="bg-white/80 backdrop-blur-sm border border-teal-200/30 rounded-xl p-6 shadow-clinical hover:shadow-clinical-hover transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-body font-medium text-navy-600">{trend.metric}</h3>
                  <div className={`text-xs px-2 py-1 rounded-full ${
                    trend.trend === 'improving' ? 'bg-green-100 text-green-700' :
                    trend.trend === 'stable' ? 'bg-blue-100 text-blue-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {trend.change}
                  </div>
                </div>
                <div className="text-3xl font-heading font-bold text-navy-900 mb-1">
                  {trend.current}
                </div>
                <div className="text-xs text-navy-500 font-body">
                  from {trend.previous} last period
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* AI Insights */}
        <motion.section variants={containerVariants} className="mb-8">
          <motion.h2 
            variants={itemVariants}
            className="text-2xl font-heading font-semibold text-navy-900 mb-6"
          >
            Personalized Health Insights
          </motion.h2>
          <div className="space-y-6">
            {healthInsights.map((insight, index) => (
              <motion.div
                key={insight.id}
                variants={itemVariants}
                custom={index}
                whileHover={{ x: 5, transition: { duration: 0.2 } }}
                className="bg-white/80 backdrop-blur-sm border border-gold-200/30 rounded-2xl p-6 shadow-luxury hover:shadow-luxury-hover transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className={`w-4 h-4 rounded-full flex-shrink-0 ${
                      insight.priority === 'high' ? 'bg-red-500' :
                      insight.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                    }`} />
                    <div>
                      <h3 className="text-xl font-heading font-semibold text-navy-900 mb-1">
                        {insight.title}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-navy-500 font-body">
                        <span className="capitalize">{insight.category}</span>
                        <span>•</span>
                        <span>{insight.readTime}</span>
                        <span>•</span>
                        <span>{insight.timestamp}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-sm text-navy-500 font-body mb-1">Confidence</div>
                    <div className="text-xl font-heading font-bold text-teal-600">
                      {insight.confidence}%
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-navy-700 font-body leading-relaxed mb-3">
                    {insight.description}
                  </p>
                  <div className="bg-teal-50/50 border border-teal-200/30 rounded-lg p-4">
                    <h4 className="text-sm font-heading font-semibold text-teal-800 mb-2">
                      💡 Recommendation
                    </h4>
                    <p className="text-teal-700 font-body text-sm leading-relaxed">
                      {insight.recommendation}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="text-center p-3 bg-navy-50/50 rounded-lg">
                    <div className="text-xs text-navy-500 font-body mb-1">Impact Level</div>
                    <div className={`text-sm font-semibold capitalize ${
                      insight.impact === 'high' ? 'text-green-600' :
                      insight.impact === 'medium' ? 'text-yellow-600' : 'text-blue-600'
                    }`}>
                      {insight.impact}
                    </div>
                  </div>
                  <div className="text-center p-3 bg-navy-50/50 rounded-lg">
                    <div className="text-xs text-navy-500 font-body mb-1">Timeframe</div>
                    <div className="text-sm font-semibold text-navy-700">
                      {insight.timeframe}
                    </div>
                  </div>
                  <div className="text-center p-3 bg-navy-50/50 rounded-lg">
                    <div className="text-xs text-navy-500 font-body mb-1">Priority</div>
                    <div className={`text-sm font-semibold capitalize ${
                      insight.priority === 'high' ? 'text-red-600' :
                      insight.priority === 'medium' ? 'text-yellow-600' : 'text-green-600'
                    }`}>
                      {insight.priority}
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200/50 pt-4">
                  <div className="text-xs text-navy-500 font-body mb-2">Key Metrics</div>
                  <div className="flex flex-wrap gap-2">
                    {insight.metrics.map((metric, idx) => (
                      <span 
                        key={idx}
                        className="px-3 py-1 bg-gold-50/50 text-gold-700 text-xs font-body rounded-full"
                      >
                        {metric}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* AI Recommendations */}
        <motion.section variants={containerVariants}>
          <motion.h2 
            variants={itemVariants}
            className="text-2xl font-heading font-semibold text-navy-900 mb-6"
          >
            Smart Recommendations
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {aiRecommendations.map((rec, index) => (
              <motion.div
                key={rec.type}
                variants={itemVariants}
                custom={index}
                whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                className={`
                  p-6 rounded-xl border-2 transition-all duration-300
                  ${rec.urgency === 'high' ? 'bg-red-50/50 border-red-200/50 hover:border-red-300' :
                    rec.urgency === 'medium' ? 'bg-yellow-50/50 border-yellow-200/50 hover:border-yellow-300' :
                    'bg-green-50/50 border-green-200/50 hover:border-green-300'
                  }
                `}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-heading font-semibold text-navy-900">
                    {rec.title}
                  </h3>
                  <div className={`w-3 h-3 rounded-full ${
                    rec.urgency === 'high' ? 'bg-red-500' :
                    rec.urgency === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                  }`} />
                </div>
                <p className="text-navy-600 font-body mb-4 leading-relaxed">
                  {rec.description}
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`
                    w-full py-3 px-4 rounded-lg font-body font-medium transition-all duration-200
                    ${rec.urgency === 'high' ? 'bg-red-600 hover:bg-red-700 text-white' :
                      rec.urgency === 'medium' ? 'bg-yellow-600 hover:bg-yellow-700 text-white' :
                      'bg-green-600 hover:bg-green-700 text-white'
                    }
                  `}
                >
                  {rec.action}
                </motion.button>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </motion.main>
    </div>
  );
}

export default function InsightsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-ivory-50 via-white to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gold-200 border-t-gold-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-navy-600 font-body">Analyzing your health data...</p>
        </div>
      </div>
    }>
      <InsightsContent />
    </Suspense>
  );
}