'use client';

/**
 * Insights Page - Enhanced with HCI Components
 * Tabbed Windows, Floating Filter Palette, Context Menus, Popup Details
 */

// Force dynamic rendering to avoid window is not defined error
export const dynamic = 'force-dynamic';

import { Suspense, useState } from 'react';
import { motion } from 'framer-motion';
import { pageVariants, containerVariants, itemVariants } from '@/animations/motionVariants';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { STORAGE_KEYS, HealthInsight } from '@/lib/localStorage';
import { ContextMenu, ContextMenuItem, PieMenu, PieMenuItem } from '@/components/HCIMenus';
import { Dialog, TabbedWindow, Tab, MessageWindow, ToastMessage, PopupWindow, FloatingWindow } from '@/components/HCIWindows';

function InsightsContent() {
  const [insights] = useLocalStorage<HealthInsight[]>(STORAGE_KEYS.HEALTH_INSIGHTS, []);
  const [contextMenu, setContextMenu] = useState<{ items: ContextMenuItem[]; position: { x: number; y: number } } | null>(null);
  const [pieMenu, setPieMenu] = useState<{ items: PieMenuItem[]; center: { x: number; y: number } } | null>(null);
  const [dialogState, setDialogState] = useState<{ isOpen: boolean; type: 'dismiss' | 'share' | 'report'; data?: any }>({ isOpen: false, type: 'dismiss' });
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [detailsPopup, setDetailsPopup] = useState<{ isOpen: boolean; data?: HealthInsight }>({ isOpen: false });
  const [filterPalette, setFilterPalette] = useState(false);
  const [filters, setFilters] = useState({
    priority: 'all' as 'all' | 'high' | 'medium' | 'low',
    category: 'all' as 'all' | 'cardiovascular' | 'sleep' | 'stress' | 'nutrition' | 'activity',
    sortBy: 'recent' as 'recent' | 'priority' | 'confidence'
  });

  const showToast = (type: ToastMessage['type'], title: string, message: string) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, type, title, message, duration: 3000 }]);
  };

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Default insights if none in storage
  const defaultInsights: HealthInsight[] = [
    {
      id: Date.now().toString() + '1',
      category: 'cardiovascular',
      priority: 'low',
      title: 'Excellent Cardiovascular Health',
      message: 'Your heart rate and blood pressure readings consistently fall within optimal ranges. Continue your current exercise routine.',
      timestamp: new Date().toISOString(),
      confidence: 94
    },
    {
      id: Date.now().toString() + '2',
      category: 'sleep',
      priority: 'medium',
      title: 'Sleep Quality Optimization',
      message: 'Your sleep duration is good, but deep sleep percentage could be improved. Try reducing screen time before bed.',
      timestamp: new Date().toISOString(),
      confidence: 87
    },
    {
      id: Date.now().toString() + '3',
      category: 'stress',
      priority: 'low',
      title: 'Stress Management Success',
      message: 'Your stress levels have decreased by 25% over the past month. Your meditation practice is showing excellent results.',
      timestamp: new Date().toISOString(),
      confidence: 91
    },
    {
      id: Date.now().toString() + '4',
      category: 'nutrition',
      priority: 'medium',
      title: 'Hydration Pattern Analysis',
      message: 'Your hydration levels show room for improvement, especially during afternoon hours. Increase water intake by 16oz daily.',
      timestamp: new Date().toISOString(),
      confidence: 83
    }
  ];

  const displayInsights = insights.length > 0 ? insights : defaultInsights;

  // Apply filters
  const filteredInsights = displayInsights.filter(insight => {
    if (filters.priority !== 'all' && insight.priority !== filters.priority) return false;
    if (filters.category !== 'all' && insight.category !== filters.category) return false;
    return true;
  }).sort((a, b) => {
    if (filters.sortBy === 'priority') {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    } else if (filters.sortBy === 'confidence') {
      return b.confidence - a.confidence;
    }
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });

  // Context menu for insights
  const handleInsightContextMenu = (e: React.MouseEvent, insight: HealthInsight) => {
    e.preventDefault();
    setContextMenu({
      position: { x: e.clientX, y: e.clientY },
      items: [
        {
          id: 'view',
          label: 'View Full Details',
          icon: '👁️',
          action: () => {
            setDetailsPopup({ isOpen: true, data: insight });
            setContextMenu(null);
            showToast('info', 'Opening', 'Loading full insight details');
          }
        },
        {
          id: 'mark-read',
          label: 'Mark as Read',
          icon: '✓',
          action: () => {
            showToast('success', 'Marked', 'Insight marked as read');
            setContextMenu(null);
          }
        },
        {
          id: 'share',
          label: 'Share',
          icon: '📤',
          action: () => {},
          submenu: [
            {
              id: 'copy',
              label: 'Copy Link',
              icon: '🔗',
              action: () => {
                showToast('success', 'Copied!', 'Link copied to clipboard');
                setContextMenu(null);
              }
            },
            {
              id: 'email',
              label: 'Email to Doctor',
              icon: '📧',
              action: () => {
                setDialogState({ isOpen: true, type: 'share', data: insight });
                setContextMenu(null);
              }
            }
          ]
        },
        {
          id: 'divider-1',
          label: '',
          icon: '',
          action: () => {},
          divider: true
        },
        {
          id: 'dismiss',
          label: 'Dismiss Insight',
          icon: '✖️',
          action: () => {
            setDialogState({ isOpen: true, type: 'dismiss', data: insight });
            setContextMenu(null);
          }
        },
        {
          id: 'report',
          label: 'Report Issue',
          icon: '⚠️',
          danger: true,
          action: () => {
            setDialogState({ isOpen: true, type: 'report', data: insight });
            setContextMenu(null);
          }
        }
      ]
    });
  };

  // Pie menu for quick actions
  const handleInsightPieMenu = (e: React.MouseEvent, insight: HealthInsight) => {
    setPieMenu({
      center: { x: e.clientX, y: e.clientY },
      items: [
        {
          id: 'details',
          label: 'Details',
          icon: '📋',
          color: '#1B4D4F',
          action: () => {
            setDetailsPopup({ isOpen: true, data: insight });
            setPieMenu(null);
          }
        },
        {
          id: 'share',
          label: 'Share',
          icon: '📤',
          color: '#C79549',
          action: () => {
            setDialogState({ isOpen: true, type: 'share', data: insight });
            setPieMenu(null);
          }
        },
        {
          id: 'read',
          label: 'Mark Read',
          icon: '✓',
          color: '#10B981',
          action: () => {
            showToast('success', 'Marked', 'Insight marked as read');
            setPieMenu(null);
          }
        },
        {
          id: 'dismiss',
          label: 'Dismiss',
          icon: '✖️',
          color: '#EF4444',
          action: () => {
            setDialogState({ isOpen: true, type: 'dismiss', data: insight });
            setPieMenu(null);
          }
        }
      ]
    });
  };

  // Handle dialog actions
  const handleDialogConfirm = () => {
    if (dialogState.type === 'dismiss') {
      showToast('success', 'Dismissed', 'Insight has been dismissed');
    } else if (dialogState.type === 'share') {
      showToast('success', 'Shared', 'Insight shared successfully');
    } else if (dialogState.type === 'report') {
      showToast('success', 'Reported', 'Issue reported to our team');
    }
    setDialogState({ isOpen: false, type: 'dismiss' });
  };

  // Get category icon
  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: string } = {
      cardiovascular: '❤️',
      sleep: '😴',
      stress: '🧘',
      nutrition: '🥗',
      activity: '🏃',
      general: '💡'
    };
    return icons[category] || '💡';
  };

  // AI Insights Tab Content
  const AIInsightsTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-heading font-bold text-navy-900">AI-Powered Insights</h3>
          <p className="text-navy-600 font-body mt-1">Personalized health recommendations from advanced AI analysis</p>
        </div>
        <button
          onClick={() => setFilterPalette(true)}
          className="px-4 py-2 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white rounded-lg font-body font-medium shadow-luxury transition-all flex items-center space-x-2"
        >
          <span>🔍</span>
          <span>Filters</span>
        </button>
      </div>

      {/* Health Score Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl p-6 text-white shadow-clinical"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="text-4xl">🎯</div>
            <div className="text-xs uppercase font-semibold tracking-wide opacity-90">Overall</div>
          </div>
          <div className="text-5xl font-heading font-bold mb-2">89</div>
          <div className="text-teal-100 font-body text-sm">Health Score</div>
          <div className="mt-4 pt-4 border-t border-teal-400">
            <div className="flex items-center justify-between text-sm">
              <span className="text-teal-100">vs Last Month</span>
              <span className="font-semibold">+7 points</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-clinical"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="text-4xl">✅</div>
            <div className="text-xs uppercase font-semibold tracking-wide opacity-90">Active</div>
          </div>
          <div className="text-5xl font-heading font-bold mb-2">12</div>
          <div className="text-green-100 font-body text-sm">Positive Insights</div>
          <div className="mt-4 pt-4 border-t border-green-400">
            <div className="flex items-center justify-between text-sm">
              <span className="text-green-100">Improved Areas</span>
              <span className="font-semibold">4 categories</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl p-6 text-white shadow-clinical"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="text-4xl">⚡</div>
            <div className="text-xs uppercase font-semibold tracking-wide opacity-90">Action</div>
          </div>
          <div className="text-5xl font-heading font-bold mb-2">5</div>
          <div className="text-yellow-100 font-body text-sm">Recommendations</div>
          <div className="mt-4 pt-4 border-t border-yellow-400">
            <div className="flex items-center justify-between text-sm">
              <span className="text-yellow-100">Requires Attention</span>
              <span className="font-semibold">2 priority</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* AI Analysis Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 rounded-xl p-6 shadow-clinical mb-6"
      >
        <div className="flex items-start space-x-4">
          <div className="text-5xl">🤖</div>
          <div className="flex-1">
            <h4 className="text-xl font-heading font-bold text-navy-900 mb-3">AI Analysis Summary</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/60 rounded-lg p-4">
                <div className="text-sm text-navy-600 font-body mb-1">Data Points Analyzed</div>
                <div className="text-3xl font-heading font-bold text-indigo-600">1,247</div>
                <div className="text-xs text-navy-500 font-body mt-1">Last 30 days</div>
              </div>
              <div className="bg-white/60 rounded-lg p-4">
                <div className="text-sm text-navy-600 font-body mb-1">Pattern Recognition</div>
                <div className="text-3xl font-heading font-bold text-purple-600">94%</div>
                <div className="text-xs text-navy-500 font-body mt-1">Accuracy rate</div>
              </div>
              <div className="bg-white/60 rounded-lg p-4">
                <div className="text-sm text-navy-600 font-body mb-1">Predictive Model</div>
                <div className="text-3xl font-heading font-bold text-pink-600">v3.2</div>
                <div className="text-xs text-navy-500 font-body mt-1">Neural network</div>
              </div>
              <div className="bg-white/60 rounded-lg p-4">
                <div className="text-sm text-navy-600 font-body mb-1">Recommendation Engine</div>
                <div className="text-3xl font-heading font-bold text-teal-600">Active</div>
                <div className="text-xs text-navy-500 font-body mt-1">Real-time analysis</div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Insights List */}
      {filteredInsights.length === 0 ? (
        <div className="bg-white/80 backdrop-blur-sm border border-teal-200/30 rounded-xl p-12 text-center shadow-clinical">
          <div className="text-6xl mb-4">🔍</div>
          <h4 className="text-xl font-heading font-semibold text-navy-900 mb-2">No Insights Found</h4>
          <p className="text-navy-600 font-body">Adjust your filters or check back later for new insights</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredInsights.map((insight, index) => (
            <motion.div
              key={insight.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onContextMenu={(e) => handleInsightContextMenu(e, insight)}
              onDoubleClick={(e) => handleInsightPieMenu(e, insight)}
              className="bg-white/80 backdrop-blur-sm border border-teal-200/30 rounded-xl p-6 shadow-clinical hover:shadow-clinical-hover transition-all duration-300 cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="text-4xl">{getCategoryIcon(insight.category)}</div>
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <div className={`w-2 h-2 rounded-full ${
                        insight.priority === 'high' ? 'bg-red-500' :
                        insight.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                      }`} />
                      <span className="text-xs uppercase font-body font-semibold text-navy-500 tracking-wide">
                        {insight.category}
                      </span>
                    </div>
                    <h4 className="text-lg font-heading font-semibold text-navy-900">
                      {insight.title}
                    </h4>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-navy-500 font-body mb-1">Confidence</div>
                  <div className="text-xl font-heading font-bold text-teal-600">{insight.confidence}%</div>
                </div>
              </div>
              
              <p className="text-navy-700 font-body leading-relaxed mb-4">
                {insight.message}
              </p>

              {/* Action Items */}
              <div className="bg-gradient-to-r from-teal-50 to-blue-50 rounded-lg p-4 mb-4">
                <div className="text-xs uppercase font-body font-semibold text-navy-600 mb-2">Recommended Actions</div>
                <div className="space-y-2">
                  {insight.category === 'cardiovascular' && (
                    <>
                      <div className="flex items-center space-x-2 text-sm">
                        <span>✓</span>
                        <span className="text-navy-700 font-body">Maintain 30min cardio, 5 days/week</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <span>✓</span>
                        <span className="text-navy-700 font-body">Continue stress management techniques</span>
                      </div>
                    </>
                  )}
                  {insight.category === 'sleep' && (
                    <>
                      <div className="flex items-center space-x-2 text-sm">
                        <span>✓</span>
                        <span className="text-navy-700 font-body">Reduce blue light exposure 2 hours before bed</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <span>✓</span>
                        <span className="text-navy-700 font-body">Maintain consistent sleep schedule (10PM-6AM)</span>
                      </div>
                    </>
                  )}
                  {insight.category === 'stress' && (
                    <>
                      <div className="flex items-center space-x-2 text-sm">
                        <span>✓</span>
                        <span className="text-navy-700 font-body">Continue 15min meditation sessions</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <span>✓</span>
                        <span className="text-navy-700 font-body">Add breathing exercises during work breaks</span>
                      </div>
                    </>
                  )}
                  {insight.category === 'nutrition' && (
                    <>
                      <div className="flex items-center space-x-2 text-sm">
                        <span>✓</span>
                        <span className="text-navy-700 font-body">Increase water intake to 64oz daily</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <span>✓</span>
                        <span className="text-navy-700 font-body">Set hourly hydration reminders</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-navy-500 font-body">
                  {new Date(insight.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setDetailsPopup({ isOpen: true, data: insight });
                  }}
                  className="text-teal-600 hover:text-teal-700 font-body font-medium opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  View Details →
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );

  // Trends Tab Content
  const TrendsTab = () => (
    <div className="space-y-6">
      <h3 className="text-2xl font-heading font-bold text-navy-900 mb-6">Health Trends Analysis</h3>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/80 backdrop-blur-sm border border-teal-200/30 rounded-xl p-6 shadow-clinical"
        >
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-heading font-semibold text-navy-900">7-Day Wellness</h4>
            <span className="text-2xl">📈</span>
          </div>
          <div className="text-4xl font-heading font-bold text-green-600 mb-2">+15%</div>
          <p className="text-navy-600 font-body text-sm">Overall improvement this week</p>
          <div className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-green-500 to-green-600" style={{ width: '85%' }} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white/80 backdrop-blur-sm border border-teal-200/30 rounded-xl p-6 shadow-clinical"
        >
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-heading font-semibold text-navy-900">Top Category</h4>
            <span className="text-2xl">🏆</span>
          </div>
          <div className="text-2xl font-heading font-bold text-teal-600 mb-2">❤️ Cardiovascular</div>
          <p className="text-navy-600 font-body text-sm">Most improved area</p>
          <div className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-teal-500 to-teal-600" style={{ width: '92%' }} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white/80 backdrop-blur-sm border border-teal-200/30 rounded-xl p-6 shadow-clinical"
        >
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-heading font-semibold text-navy-900">Insights Generated</h4>
            <span className="text-2xl">🧠</span>
          </div>
          <div className="text-4xl font-heading font-bold text-navy-900 mb-2">{displayInsights.length}</div>
          <p className="text-navy-600 font-body text-sm">Total recommendations</p>
          <div className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-navy-500 to-navy-600" style={{ width: '100%' }} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white/80 backdrop-blur-sm border border-teal-200/30 rounded-xl p-6 shadow-clinical"
        >
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-heading font-semibold text-navy-900">Avg Confidence</h4>
            <span className="text-2xl">✨</span>
          </div>
          <div className="text-4xl font-heading font-bold text-gold-600 mb-2">
            {Math.round(displayInsights.reduce((acc, i) => acc + i.confidence, 0) / displayInsights.length)}%
          </div>
          <p className="text-navy-600 font-body text-sm">AI prediction accuracy</p>
          <div className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-gold-500 to-gold-600" style={{ width: '89%' }} />
          </div>
        </motion.div>
      </div>

      {/* Category Breakdown Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white/80 backdrop-blur-sm border border-teal-200/30 rounded-xl p-6 shadow-clinical"
      >
        <h4 className="text-xl font-heading font-semibold text-navy-900 mb-6">Insights by Category</h4>
        <div className="space-y-4">
          {[
            { category: 'Cardiovascular', count: 5, percentage: 42, color: 'red', icon: '❤️' },
            { category: 'Sleep Quality', count: 3, percentage: 25, color: 'purple', icon: '😴' },
            { category: 'Stress Management', count: 2, percentage: 17, color: 'blue', icon: '🧘' },
            { category: 'Nutrition', count: 2, percentage: 16, color: 'green', icon: '🥗' }
          ].map((item, index) => (
            <motion.div
              key={item.category}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="relative"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{item.icon}</span>
                  <span className="font-body font-medium text-navy-900">{item.category}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-navy-600 font-body">{item.count} insights</span>
                  <span className="text-sm font-semibold text-navy-900">{item.percentage}%</span>
                </div>
              </div>
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${item.percentage}%` }}
                  transition={{ delay: 0.7 + index * 0.1, duration: 0.8, ease: 'easeOut' }}
                  className={`h-full bg-gradient-to-r from-${item.color}-500 to-${item.color}-600`}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Weekly Trend Line */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white/80 backdrop-blur-sm border border-teal-200/30 rounded-xl p-6 shadow-clinical"
      >
        <h4 className="text-xl font-heading font-semibold text-navy-900 mb-6">7-Day Health Score Trend</h4>
        <div className="relative h-64">
          {/* Y-axis labels */}
          <div className="absolute left-0 top-0 bottom-0 w-12 flex flex-col justify-between text-sm text-navy-500 font-body">
            <span>100</span>
            <span>75</span>
            <span>50</span>
            <span>25</span>
            <span>0</span>
          </div>
          
          {/* Chart area */}
          <div className="ml-12 h-full relative">
            {/* Grid lines */}
            <div className="absolute inset-0">
              {[0, 25, 50, 75, 100].map((val) => (
                <div
                  key={val}
                  className="absolute w-full border-t border-gray-200"
                  style={{ bottom: `${val}%` }}
                />
              ))}
            </div>
            
            {/* Line chart */}
            <svg className="absolute inset-0 w-full h-full">
              <defs>
                <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#14b8a6" />
                  <stop offset="100%" stopColor="#0d9488" />
                </linearGradient>
                <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#14b8a6" stopOpacity="0" />
                </linearGradient>
              </defs>
              {/* Area under curve */}
              <path
                d="M 0 180 L 60 150 L 120 140 L 180 160 L 240 130 L 300 120 L 360 110 L 360 256 L 0 256 Z"
                fill="url(#areaGradient)"
              />
              {/* Line */}
              <path
                d="M 0 180 L 60 150 L 120 140 L 180 160 L 240 130 L 300 120 L 360 110"
                stroke="url(#lineGradient)"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Data points */}
              {[
                { x: 0, y: 180 },
                { x: 60, y: 150 },
                { x: 120, y: 140 },
                { x: 180, y: 160 },
                { x: 240, y: 130 },
                { x: 300, y: 120 },
                { x: 360, y: 110 }
              ].map((point, i) => (
                <circle
                  key={i}
                  cx={point.x}
                  cy={point.y}
                  r="5"
                  fill="#14b8a6"
                  className="cursor-pointer hover:r-7 transition-all"
                />
              ))}
            </svg>
            
            {/* X-axis labels */}
            <div className="absolute -bottom-6 left-0 right-0 flex justify-between text-xs text-navy-500 font-body">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                <span key={day}>{day}</span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Priority Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="text-3xl">✅</div>
            <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center">
              <span className="text-2xl font-heading font-bold text-white">
                {displayInsights.filter(i => i.priority === 'low').length}
              </span>
            </div>
          </div>
          <h5 className="text-lg font-heading font-semibold text-green-900 mb-1">Low Priority</h5>
          <p className="text-sm text-green-700 font-body">Positive insights & maintenance</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-6 border border-yellow-200"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="text-3xl">⚡</div>
            <div className="w-16 h-16 rounded-full bg-yellow-500 flex items-center justify-center">
              <span className="text-2xl font-heading font-bold text-white">
                {displayInsights.filter(i => i.priority === 'medium').length}
              </span>
            </div>
          </div>
          <h5 className="text-lg font-heading font-semibold text-yellow-900 mb-1">Medium Priority</h5>
          <p className="text-sm text-yellow-700 font-body">Optimization opportunities</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6 border border-red-200"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="text-3xl">🚨</div>
            <div className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center">
              <span className="text-2xl font-heading font-bold text-white">
                {displayInsights.filter(i => i.priority === 'high').length}
              </span>
            </div>
          </div>
          <h5 className="text-lg font-heading font-semibold text-red-900 mb-1">High Priority</h5>
          <p className="text-sm text-red-700 font-body">Requires immediate attention</p>
        </motion.div>
      </div>
    </div>
  );

  // History Tab Content
  const HistoryTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-heading font-bold text-navy-900">Insight History</h3>
          <p className="text-navy-600 font-body mt-1">Complete timeline of AI-generated recommendations</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-navy-600 font-body">
          <span>Total Insights:</span>
          <span className="font-semibold text-navy-900">{displayInsights.length}</span>
        </div>
      </div>

      {/* Timeline Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg p-4 text-white">
          <div className="text-2xl mb-2">📅</div>
          <div className="text-3xl font-heading font-bold mb-1">30</div>
          <div className="text-teal-100 text-sm font-body">Days Tracked</div>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-4 text-white">
          <div className="text-2xl mb-2">🔄</div>
          <div className="text-3xl font-heading font-bold mb-1">87%</div>
          <div className="text-purple-100 text-sm font-body">Followed Rate</div>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-4 text-white">
          <div className="text-2xl mb-2">⭐</div>
          <div className="text-3xl font-heading font-bold mb-1">9</div>
          <div className="text-orange-100 text-sm font-body">Saved Favorites</div>
        </div>
        <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-lg p-4 text-white">
          <div className="text-2xl mb-2">✓</div>
          <div className="text-3xl font-heading font-bold mb-1">24</div>
          <div className="text-pink-100 text-sm font-body">Completed</div>
        </div>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-teal-500 via-purple-500 to-pink-500" />
        
        <div className="space-y-6">
          {displayInsights.map((insight, index) => (
            <motion.div
              key={insight.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative pl-20"
            >
              {/* Timeline dot */}
              <div className={`absolute left-6 w-5 h-5 rounded-full border-4 border-white ${
                insight.priority === 'high' ? 'bg-red-500' :
                insight.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
              } shadow-lg`} />
              
              {/* Content card */}
              <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl p-5 hover:border-teal-300 hover:shadow-clinical transition-all cursor-pointer group">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3 flex-1">
                    <div className="text-3xl">{getCategoryIcon(insight.category)}</div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-xs uppercase font-body font-semibold text-navy-500 tracking-wide">
                          {insight.category}
                        </span>
                        <span className="text-xs text-navy-400">•</span>
                        <span className="text-xs text-navy-500 font-body">
                          {new Date(insight.timestamp).toLocaleDateString('en-US', { 
                            month: 'long', 
                            day: 'numeric', 
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                      <h4 className="font-heading font-semibold text-navy-900 text-lg group-hover:text-teal-600 transition-colors">
                        {insight.title}
                      </h4>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="text-xs text-navy-500 font-body">Confidence</div>
                      <div className="text-lg font-heading font-bold text-teal-600">{insight.confidence}%</div>
                    </div>
                  </div>
                </div>
                
                <p className="text-navy-700 font-body text-sm leading-relaxed mb-3 pl-11">
                  {insight.message}
                </p>

                {/* Action badges */}
                <div className="flex items-center space-x-2 pl-11">
                  <span className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-xs font-body font-medium">
                    📊 Analyzed
                  </span>
                  {index % 3 === 0 && (
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-body font-medium">
                      ✓ Followed
                    </span>
                  )}
                  {index % 4 === 0 && (
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-body font-medium">
                      ⭐ Favorited
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Monthly Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 rounded-xl p-6 mt-8"
      >
        <h4 className="text-xl font-heading font-semibold text-navy-900 mb-4">Monthly Summary</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/60 rounded-lg p-4">
            <div className="text-2xl mb-2">📈</div>
            <div className="text-2xl font-heading font-bold text-indigo-600 mb-1">+18</div>
            <div className="text-sm text-navy-700 font-body">New insights this month</div>
          </div>
          <div className="bg-white/60 rounded-lg p-4">
            <div className="text-2xl mb-2">🎯</div>
            <div className="text-2xl font-heading font-bold text-purple-600 mb-1">92%</div>
            <div className="text-sm text-navy-700 font-body">Goal achievement rate</div>
          </div>
          <div className="bg-white/60 rounded-lg p-4">
            <div className="text-2xl mb-2">🌟</div>
            <div className="text-2xl font-heading font-bold text-pink-600 mb-1">3rd</div>
            <div className="text-sm text-navy-700 font-body">Consecutive improvement month</div>
          </div>
        </div>
      </motion.div>
    </div>
  );

  const tabs: Tab[] = [
    {
      id: 'ai',
      label: 'AI Insights',
      icon: '🧠',
      badge: filteredInsights.length,
      content: <AIInsightsTab />
    },
    {
      id: 'trends',
      label: 'Trends',
      icon: '📈',
      content: <TrendsTab />
    },
    {
      id: 'history',
      label: 'History',
      icon: '📅',
      content: <HistoryTab />
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-ivory-50 via-white to-teal-50">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-radial from-gold-200/20 via-gold-100/10 to-transparent rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-radial from-teal-200/20 via-teal-100/10 to-transparent rounded-full blur-3xl animate-pulse-slow" />
      </div>

      <motion.main
        initial="initial"
        animate="animate"
        variants={pageVariants}
        className="relative z-10 container mx-auto px-4 py-8"
      >
        {/* Header */}
        <motion.section variants={itemVariants} className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-heading font-bold text-navy-900 mb-2">
                Health Insights
              </h1>
              <p className="text-lg text-navy-600 font-body">
                AI-powered analysis and personalized health recommendations
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-navy-500 font-body">Active Filters</div>
              <div className="text-lg font-semibold text-navy-700 font-body">
                {filters.priority !== 'all' || filters.category !== 'all' ? 'Custom' : 'All'}
              </div>
            </div>
          </div>
        </motion.section>

        {/* Tabbed Content */}
        <motion.section variants={containerVariants} className="mb-8">
          <TabbedWindow
            defaultTab="ai"
            tabs={tabs}
            onChange={(tabId) => {
              showToast('info', 'View Changed', `Switched to ${tabs.find(t => t.id === tabId)?.label}`);
            }}
          />
        </motion.section>
      </motion.main>

      {/* HCI Components */}
      {/* Context Menu */}
      {contextMenu && (
        <ContextMenu
          items={contextMenu.items}
          position={contextMenu.position}
          onClose={() => setContextMenu(null)}
        />
      )}

      {/* Pie Menu */}
      {pieMenu && (
        <PieMenu
          items={pieMenu.items}
          center={pieMenu.center}
          onClose={() => setPieMenu(null)}
        />
      )}

      {/* Floating Filter Palette */}
      <FloatingWindow
        isOpen={filterPalette}
        onClose={() => setFilterPalette(false)}
        title="Filter Insights"
        initialPosition={{ x: typeof window !== 'undefined' ? window.innerWidth - 400 : 800, y: 100 }}
        width={350}
        height={450}
      >
        <div className="space-y-6">
          {/* Priority Filter */}
          <div>
            <label className="block text-sm font-body font-semibold text-navy-700 mb-3">
              Priority Level
            </label>
            <div className="space-y-2">
              {(['all', 'high', 'medium', 'low'] as const).map((priority) => (
                <button
                  key={priority}
                  onClick={() => {
                    setFilters({ ...filters, priority });
                    showToast('info', 'Filter Applied', `Priority: ${priority}`);
                  }}
                  className={`w-full px-4 py-2 rounded-lg text-left font-body font-medium transition-colors ${
                    filters.priority === priority
                      ? 'bg-teal-600 text-white'
                      : 'bg-gray-100 text-navy-700 hover:bg-gray-200'
                  }`}
                >
                  <span className="capitalize">{priority}</span>
                  {priority !== 'all' && (
                    <span className={`ml-2 w-2 h-2 inline-block rounded-full ${
                      priority === 'high' ? 'bg-red-500' :
                      priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                    }`} />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-sm font-body font-semibold text-navy-700 mb-3">
              Category
            </label>
            <div className="space-y-2">
              {(['all', 'cardiovascular', 'sleep', 'stress', 'nutrition', 'activity'] as const).map((category) => (
                <button
                  key={category}
                  onClick={() => {
                    setFilters({ ...filters, category });
                    showToast('info', 'Filter Applied', `Category: ${category}`);
                  }}
                  className={`w-full px-4 py-2 rounded-lg text-left font-body font-medium transition-colors ${
                    filters.category === category
                      ? 'bg-teal-600 text-white'
                      : 'bg-gray-100 text-navy-700 hover:bg-gray-200'
                  }`}
                >
                  {category !== 'all' && <span className="mr-2">{getCategoryIcon(category)}</span>}
                  <span className="capitalize">{category}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-sm font-body font-semibold text-navy-700 mb-3">
              Sort By
            </label>
            <select
              value={filters.sortBy}
              onChange={(e) => {
                setFilters({ ...filters, sortBy: e.target.value as any });
                showToast('info', 'Sort Changed', `Sorting by ${e.target.value}`);
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent font-body"
            >
              <option value="recent">Most Recent</option>
              <option value="priority">Priority</option>
              <option value="confidence">Confidence</option>
            </select>
          </div>

          {/* Reset Button */}
          <button
            onClick={() => {
              setFilters({ priority: 'all', category: 'all', sortBy: 'recent' });
              showToast('success', 'Reset', 'Filters cleared');
            }}
            className="w-full px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-body font-medium transition-colors"
          >
            Reset All Filters
          </button>
        </div>
      </FloatingWindow>

      {/* Details Popup Window */}
      <PopupWindow
        isOpen={detailsPopup.isOpen}
        onClose={() => setDetailsPopup({ isOpen: false })}
        title={detailsPopup.data?.title || 'Insight Details'}
        width={700}
        height={500}
      >
        {detailsPopup.data && (
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-teal-50 to-gold-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="text-5xl">{getCategoryIcon(detailsPopup.data.category)}</div>
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <div className={`w-3 h-3 rounded-full ${
                      detailsPopup.data.priority === 'high' ? 'bg-red-500' :
                      detailsPopup.data.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                    }`} />
                    <span className="text-sm uppercase font-body font-semibold text-navy-600 tracking-wide">
                      {detailsPopup.data.category} • {detailsPopup.data.priority} Priority
                    </span>
                  </div>
                  <h3 className="text-2xl font-heading font-bold text-navy-900">
                    {detailsPopup.data.title}
                  </h3>
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm text-navy-600 font-body mb-1">Confidence</div>
                <div className="text-4xl font-heading font-bold text-teal-600">
                  {detailsPopup.data.confidence}%
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="text-lg font-heading font-semibold text-navy-900 mb-3">Analysis</h4>
              <p className="text-navy-700 font-body leading-relaxed">
                {detailsPopup.data.message}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm text-navy-600 font-body mb-1">Generated</div>
                <div className="text-base font-body font-medium text-navy-900">
                  {new Date(detailsPopup.data.timestamp).toLocaleString()}
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm text-navy-600 font-body mb-1">Category</div>
                <div className="text-base font-body font-medium text-navy-900 capitalize">
                  {detailsPopup.data.category}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => {
                  showToast('success', 'Shared', 'Insight shared with your doctor');
                  setDetailsPopup({ isOpen: false });
                }}
                className="flex-1 px-4 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-body font-medium transition-colors"
              >
                📧 Share with Doctor
              </button>
              <button
                onClick={() => {
                  showToast('success', 'Saved', 'Insight saved to favorites');
                  setDetailsPopup({ isOpen: false });
                }}
                className="flex-1 px-4 py-3 bg-gold-600 hover:bg-gold-700 text-white rounded-lg font-body font-medium transition-colors"
              >
                ⭐ Save Favorite
              </button>
            </div>
          </div>
        )}
      </PopupWindow>

      {/* Dismiss Dialog */}
      <Dialog
        isOpen={dialogState.isOpen && dialogState.type === 'dismiss'}
        onClose={() => setDialogState({ isOpen: false, type: 'dismiss' })}
        title="Dismiss Insight"
        type="warning"
        size="md"
        actions={
          <>
            <button
              onClick={() => setDialogState({ isOpen: false, type: 'dismiss' })}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-body font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDialogConfirm}
              className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-body font-medium transition-colors"
            >
              Dismiss
            </button>
          </>
        }
      >
        <p className="text-navy-700 font-body">
          Are you sure you want to dismiss this insight? You can always view it again in your history.
        </p>
      </Dialog>

      {/* Share Dialog */}
      <Dialog
        isOpen={dialogState.isOpen && dialogState.type === 'share'}
        onClose={() => setDialogState({ isOpen: false, type: 'share' })}
        title="Share Insight"
        type="default"
        size="lg"
        actions={
          <>
            <button
              onClick={() => setDialogState({ isOpen: false, type: 'share' })}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-body font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDialogConfirm}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-body font-medium transition-colors"
            >
              Send Email
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-body font-medium text-navy-700 mb-1">
              Doctor's Email
            </label>
            <input
              type="email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent font-body"
              placeholder="doctor@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-body font-medium text-navy-700 mb-1">
              Additional Message (Optional)
            </label>
            <textarea
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent font-body"
              rows={4}
              placeholder="Add context or questions for your doctor..."
            />
          </div>
        </div>
      </Dialog>

      {/* Report Dialog */}
      <Dialog
        isOpen={dialogState.isOpen && dialogState.type === 'report'}
        onClose={() => setDialogState({ isOpen: false, type: 'report' })}
        title="Report Issue"
        type="error"
        size="md"
        actions={
          <>
            <button
              onClick={() => setDialogState({ isOpen: false, type: 'report' })}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-body font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDialogConfirm}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-body font-medium transition-colors"
            >
              Report
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-navy-700 font-body">
            Help us improve by reporting any issues with this insight.
          </p>
          <div>
            <label className="block text-sm font-body font-medium text-navy-700 mb-1">
              What's wrong?
            </label>
            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent font-body">
              <option>Inaccurate information</option>
              <option>Not relevant to me</option>
              <option>Too general</option>
              <option>Technical issue</option>
              <option>Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-body font-medium text-navy-700 mb-1">
              Details (Optional)
            </label>
            <textarea
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent font-body"
              rows={3}
              placeholder="Provide more details about the issue..."
            />
          </div>
        </div>
      </Dialog>

      {/* Toast Notifications */}
      <MessageWindow
        messages={toasts}
        onDismiss={dismissToast}
        position="top-right"
      />
    </div>
  );
}

export default function InsightsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-ivory-50 via-white to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gold-200 border-t-gold-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-navy-600 font-body">Loading insights...</p>
        </div>
      </div>
    }>
      <InsightsContent />
    </Suspense>
  );
}
