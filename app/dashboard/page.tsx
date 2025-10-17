'use client';

/**
 * Dashboard Page - Main Health Overview with HCI Elements
 * Enhanced with Context Menus, Dialog Boxes, and Interactive Windows
 */

import { Suspense, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import VitalCard from '../../components/VitalCard';
import { motion, AnimatePresence } from 'framer-motion';
import { pageVariants, containerVariants, itemVariants } from '@/animations/motionVariants';
import { storage, STORAGE_KEYS, VitalReading, HealthInsight } from '@/lib/localStorage';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { ContextMenu, ContextMenuItem, PieMenu, PieMenuItem, DropdownMenu } from '@/components/HCIMenus';
import { Dialog, TabbedWindow, Tab, MessageWindow, ToastMessage, PopupWindow } from '@/components/HCIWindows';

interface DashboardVital {
  id: string;
  title: string;
  value: string;
  unit: string;
  trend: 'increasing' | 'decreasing' | 'stable';
  status: 'normal' | 'warning' | 'critical';
  lastUpdated: string;
  icon: string;
}

function DashboardContent() {
  const router = useRouter();
  const [vitals, setVitals] = useState<DashboardVital[]>([]);
  const [insights] = useLocalStorage<HealthInsight[]>(STORAGE_KEYS.HEALTH_INSIGHTS, []);
  const [wellnessScore, setWellnessScore] = useState(0);
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Check authentication on mount
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('meditrack-logged-in');
    if (!isLoggedIn) {
      router.push('/login');
    } else {
      setIsAuthenticated(true);
      setIsChecking(false);
    }
  }, [router]);

  // Check for dark mode
  useEffect(() => {
    const checkDarkMode = () => {
      const isDark = document.body.classList.contains('dark');
      setIsDarkMode(isDark);
    };

    checkDarkMode();

    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.body, { 
      attributes: true, 
      attributeFilter: ['class'] 
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  // HCI Component States
  const [contextMenu, setContextMenu] = useState<{ items: ContextMenuItem[]; position: { x: number; y: number } } | null>(null);
  const [pieMenu, setPieMenu] = useState<{ items: PieMenuItem[]; center: { x: number; y: number } } | null>(null);
  const [dialogState, setDialogState] = useState<{ isOpen: boolean; type: 'view' | 'edit' | 'delete'; data?: any }>({ isOpen: false, type: 'view' });
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [detailsPopup, setDetailsPopup] = useState<{ isOpen: boolean; data?: any }>({ isOpen: false });
  const [activeView, setActiveView] = useState<'overview' | 'detailed'>('overview');

  // Toast Management
  const showToast = (type: ToastMessage['type'], title: string, message: string) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, type, title, message, duration: 3000 }]);
  };

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Handle vital card right-click
  const handleVitalContextMenu = (e: React.MouseEvent, vital: DashboardVital) => {
    e.preventDefault();
    setContextMenu({
      position: { x: e.clientX, y: e.clientY },
      items: [
        {
          id: 'view',
          label: 'View Details',
          icon: '👁️',
          action: () => {
            setDetailsPopup({ isOpen: true, data: vital });
            setContextMenu(null);
            showToast('info', 'Opening Details', `Viewing ${vital.title} details`);
          }
        },
        {
          id: 'history',
          label: 'View History',
          icon: '📊',
          action: () => {
            window.location.href = `/vitals?type=${vital.id}`;
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
                navigator.clipboard.writeText(window.location.origin + `/vitals?type=${vital.id}`);
                showToast('success', 'Copied!', 'Link copied to clipboard');
                setContextMenu(null);
              }
            },
            {
              id: 'download',
              label: 'Download PDF',
              icon: '📄',
              action: () => {
                showToast('info', 'Downloading...', 'Generating PDF report');
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
          id: 'refresh',
          label: 'Refresh Data',
          icon: '🔄',
          action: () => {
            showToast('success', 'Refreshed', 'Vital data updated');
            setContextMenu(null);
          }
        },
        {
          id: 'delete',
          label: 'Delete Reading',
          icon: '🗑️',
          danger: true,
          action: () => {
            setDialogState({ isOpen: true, type: 'delete', data: vital });
            setContextMenu(null);
          }
        }
      ]
    });
  };

  // Handle vital card long-press for pie menu
  const handleVitalLongPress = (e: React.MouseEvent, vital: DashboardVital) => {
    setPieMenu({
      center: { x: e.clientX, y: e.clientY },
      items: [
        {
          id: 'view',
          label: 'View',
          icon: '👁️',
          color: '#1B4D4F',
          action: () => {
            setDetailsPopup({ isOpen: true, data: vital });
            setPieMenu(null);
          }
        },
        {
          id: 'edit',
          label: 'Edit',
          icon: '✏️',
          color: '#C79549',
          action: () => {
            setDialogState({ isOpen: true, type: 'edit', data: vital });
            setPieMenu(null);
          }
        },
        {
          id: 'share',
          label: 'Share',
          icon: '📤',
          color: '#2B3A67',
          action: () => {
            showToast('info', 'Sharing', `Preparing ${vital.title} data`);
            setPieMenu(null);
          }
        },
        {
          id: 'delete',
          label: 'Delete',
          icon: '🗑️',
          color: '#EF4444',
          action: () => {
            setDialogState({ isOpen: true, type: 'delete', data: vital });
            setPieMenu(null);
          }
        }
      ]
    });
  };

  // Handle insight context menu
  const handleInsightContextMenu = (e: React.MouseEvent, insight: HealthInsight) => {
    e.preventDefault();
    setContextMenu({
      position: { x: e.clientX, y: e.clientY },
      items: [
        {
          id: 'details',
          label: 'View Details',
          icon: '📋',
          action: () => {
            setDetailsPopup({ isOpen: true, data: insight });
            setContextMenu(null);
          }
        },
        {
          id: 'dismiss',
          label: 'Dismiss',
          icon: '✖️',
          action: () => {
            showToast('success', 'Dismissed', 'Insight removed');
            setContextMenu(null);
          }
        },
        {
          id: 'share',
          label: 'Share Insight',
          icon: '📤',
          action: () => {
            showToast('info', 'Sharing', 'Preparing insight data');
            setContextMenu(null);
          }
        }
      ]
    });
  };

  // Handle dialog confirmation
  const handleDialogConfirm = () => {
    if (dialogState.type === 'delete' && dialogState.data) {
      showToast('success', 'Deleted', `${dialogState.data.title} reading deleted`);
      setDialogState({ isOpen: false, type: 'view' });
    } else if (dialogState.type === 'edit' && dialogState.data) {
      showToast('success', 'Saved', `${dialogState.data.title} reading updated`);
      setDialogState({ isOpen: false, type: 'view' });
    }
  };

  useEffect(() => {
    // Load latest vitals from localStorage
    const vitalReadings = storage.get<VitalReading[]>(STORAGE_KEYS.VITAL_READINGS, []);
    
    // Group by type and get the latest reading for each
    const vitalTypes = ['heart-rate', 'blood-pressure', 'temperature', 'glucose', 'sleep', 'stress'];
    const latestVitals = vitalTypes.map(type => {
      const readings = vitalReadings.filter(r => r.type === type);
      if (readings.length === 0) {
        // Return default mock data if no readings exist
        const defaults: Record<string, DashboardVital> = {
          'heart-rate': {
            id: 'heart-rate',
            title: 'Heart Rate',
            value: '72',
            unit: 'bpm',
            trend: 'stable',
            status: 'normal',
            lastUpdated: 'No data yet',
            icon: '❤️'
          },
          'blood-pressure': {
            id: 'blood-pressure',
            title: 'Blood Pressure',
            value: '120/80',
            unit: 'mmHg',
            trend: 'stable',
            status: 'normal',
            lastUpdated: 'No data yet',
            icon: '🩸'
          },
          'temperature': {
            id: 'temperature',
            title: 'Temperature',
            value: '98.6',
            unit: '°F',
            trend: 'stable',
            status: 'normal',
            lastUpdated: 'No data yet',
            icon: '🌡️'
          },
          'glucose': {
            id: 'glucose',
            title: 'Glucose',
            value: '95',
            unit: 'mg/dL',
            trend: 'stable',
            status: 'normal',
            lastUpdated: 'No data yet',
            icon: '🍯'
          },
          'sleep': {
            id: 'sleep',
            title: 'Sleep Quality',
            value: '85',
            unit: '%',
            trend: 'stable',
            status: 'normal',
            lastUpdated: 'No data yet',
            icon: '😴'
          },
          'stress': {
            id: 'stress',
            title: 'Stress Level',
            value: '32',
            unit: '%',
            trend: 'stable',
            status: 'normal',
            lastUpdated: 'No data yet',
            icon: '🧘'
          }
        };
        return defaults[type];
      }

      const latest = readings[readings.length - 1];
      const timeDiff = Date.now() - new Date(latest.timestamp).getTime();
      const minutes = Math.floor(timeDiff / 60000);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);
      
      let timeAgo = 'Just now';
      if (days > 0) timeAgo = `${days} day${days > 1 ? 's' : ''} ago`;
      else if (hours > 0) timeAgo = `${hours} hour${hours > 1 ? 's' : ''} ago`;
      else if (minutes > 0) timeAgo = `${minutes} minute${minutes > 1 ? 's' : ''} ago`;

      return {
        id: type,
        title: type.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
        value: latest.value.toString(),
        unit: latest.unit,
        trend: latest.trend || 'stable',
        status: latest.status || 'normal',
        lastUpdated: timeAgo,
        icon: latest.icon || '📊'
      };
    });

    setVitals(latestVitals);

    // Calculate wellness score based on vitals
    const normalCount = latestVitals.filter(v => v.status === 'normal').length;
    const score = Math.round((normalCount / latestVitals.length) * 100);
    setWellnessScore(score);
  }, []);

  // Initialize default insights if none exist
  useEffect(() => {
    if (insights.length === 0) {
      const defaultInsights: HealthInsight[] = [
        {
          id: Date.now().toString(),
          category: 'cardiovascular',
          priority: 'low',
          title: 'Welcome to MediTrack',
          message: 'Start tracking your vitals to receive personalized AI health insights and recommendations.',
          timestamp: new Date().toISOString(),
          confidence: 100
        }
      ];
      storage.set(STORAGE_KEYS.HEALTH_INSIGHTS, defaultInsights);
    }
  }, [insights.length]);

  // Show loading spinner during authentication check
  if (isChecking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-ivory-50 via-white to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gold-200 border-t-gold-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-navy-600 font-body">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated
  if (!isAuthenticated) {
    return null;
  }
  
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
              <h1 className={`text-4xl font-heading font-bold mb-2 transition-colors duration-300 ${
                isDarkMode ? 'text-white' : 'text-navy-900'
              }`}>
                Health Dashboard
              </h1>
              <p className={`text-lg font-body transition-colors duration-300 ${
                isDarkMode ? 'text-gray-300' : 'text-navy-600'
              }`}>
                Welcome back! Here's your health overview for today.
              </p>
            </div>
            <div className="text-right">
              <p className={`text-sm font-body transition-colors duration-300 ${
                isDarkMode ? 'text-gray-400' : 'text-navy-500'
              }`}>Last updated</p>
              <p className={`text-lg font-semibold font-body transition-colors duration-300 ${
                isDarkMode ? 'text-gray-200' : 'text-navy-700'
              }`}>
                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>

          {/* Quick Stats Bar */}
          <div className={`backdrop-blur-sm border rounded-2xl p-6 shadow-luxury transition-colors duration-300 ${
            isDarkMode 
              ? 'stats-card' 
              : 'bg-white/80 border-gold-200/30'
          }`}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className={`text-3xl font-heading font-bold mb-1 ${
                  wellnessScore >= 80 ? 'text-green-600' :
                  wellnessScore >= 60 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {wellnessScore}
                </div>
                <div className={`text-sm font-body transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-300' : 'text-navy-600'
                }`}>Wellness Score</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-heading font-bold text-teal-600 mb-1">{vitals.length}</div>
                <div className={`text-sm font-body transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-300' : 'text-navy-600'
                }`}>Metrics Tracked</div>
              </div>
              <div className="text-center">
                <div className={`text-3xl font-heading font-bold mb-1 transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-200' : 'text-navy-700'
                }`}>{insights.length}</div>
                <div className={`text-sm font-body transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-300' : 'text-navy-600'
                }`}>AI Insights</div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Vital Signs Grid */}
        <motion.section variants={containerVariants} className="mb-8">
          <motion.div variants={itemVariants} className="flex items-center justify-between mb-6">
            <h2 className={`text-2xl font-heading font-semibold transition-colors duration-300 ${
              isDarkMode ? 'text-white' : 'text-navy-900'
            }`}>
              Vital Signs
            </h2>
            <motion.a
              href="/vitals"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-teal-600 hover:text-teal-700 font-body font-medium flex items-center space-x-1 transition-colors"
            >
              <span>View All</span>
              <span>→</span>
            </motion.a>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vitals.map((vital, index) => (
              <motion.div
                key={vital.id}
                variants={itemVariants}
                custom={index}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                onContextMenu={(e) => handleVitalContextMenu(e, vital)}
                onDoubleClick={(e) => handleVitalLongPress(e, vital)}
              >
                <VitalCard {...vital} />
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* AI Insights Section */}
        <motion.section variants={containerVariants} className="mb-8">
          <motion.div variants={itemVariants} className="flex items-center justify-between mb-6">
            <h2 className={`text-2xl font-heading font-semibold transition-colors duration-300 ${
              isDarkMode ? 'text-white' : 'text-navy-900'
            }`}>
              AI Health Insights
            </h2>
            <motion.a
              href="/insights"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-teal-600 hover:text-teal-700 font-body font-medium flex items-center space-x-1 transition-colors"
            >
              <span>View All</span>
              <span>→</span>
            </motion.a>
          </motion.div>
          <div className="space-y-4">
            {insights.slice(0, 3).map((insight, index) => (
              <motion.div
                key={insight.id}
                variants={itemVariants}
                custom={index}
                whileHover={{ x: 5, transition: { duration: 0.2 } }}
                onContextMenu={(e) => handleInsightContextMenu(e, insight)}
                className={`backdrop-blur-sm border rounded-xl p-6 shadow-clinical hover:shadow-clinical-hover transition-all duration-300 cursor-pointer ${
                  isDarkMode 
                    ? 'insight-card' 
                    : 'bg-white/80 border-teal-200/30'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      insight.priority === 'high' ? 'bg-red-500' :
                      insight.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                    }`} />
                    <h3 className={`text-lg font-heading font-semibold transition-colors duration-300 ${
                      isDarkMode ? 'text-white' : 'text-navy-900'
                    }`}>
                      {insight.title}
                    </h3>
                  </div>
                  <div className="text-right">
                    <div className={`text-xs font-body mb-1 transition-colors duration-300 ${
                      isDarkMode ? 'text-gray-400' : 'text-navy-500'
                    }`}>Confidence</div>
                    <div className="text-sm font-semibold text-teal-600 font-body">
                      {insight.confidence}%
                    </div>
                  </div>
                </div>
                <p className={`font-body mb-3 leading-relaxed transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-300' : 'text-navy-700'
                }`}>
                  {insight.message}
                </p>
                <div className={`flex items-center justify-between text-sm font-body transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-400' : 'text-navy-500'
                }`}>
                  <span className="capitalize">{insight.category}</span>
                  <span>{new Date(insight.timestamp).toLocaleString()}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Quick Actions */}
        <motion.section variants={containerVariants}>
          <motion.h2 
            variants={itemVariants}
            className="text-2xl font-heading font-semibold text-navy-900 mb-6"
          >
            Quick Actions
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: 'Log Vitals', icon: '📝', href: '/vitals', color: 'gold' },
              { title: 'View Trends', icon: '📊', href: '/insights', color: 'teal' },
              { title: 'Schedule Checkup', icon: '📅', href: '/appointments', color: 'navy' },
              { title: 'Emergency Contact', icon: '🚨', href: '/emergency', color: 'red' }
            ].map((action, index) => (
              <motion.a
                key={action.title}
                href={action.href}
                variants={itemVariants}
                custom={index}
                whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                whileTap={{ scale: 0.95 }}
                className={`
                  block p-6 rounded-xl text-center transition-all duration-300 transform
                  ${action.color === 'gold' ? 'bg-gradient-to-br from-gold-50 to-gold-100 hover:from-gold-100 hover:to-gold-200 text-gold-800' :
                    action.color === 'teal' ? 'bg-gradient-to-br from-teal-50 to-teal-100 hover:from-teal-100 hover:to-teal-200 text-teal-800' :
                    action.color === 'navy' ? 'bg-gradient-to-br from-navy-50 to-navy-100 hover:from-navy-100 hover:to-navy-200 text-navy-800' :
                    'bg-gradient-to-br from-red-50 to-red-100 hover:from-red-100 hover:to-red-200 text-red-800'
                  }
                  shadow-luxury hover:shadow-luxury-hover
                `}
              >
                <div className="text-3xl mb-3">{action.icon}</div>
                <div className="font-heading font-semibold">{action.title}</div>
              </motion.a>
            ))}
          </div>
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

      {/* Delete Confirmation Dialog */}
      <Dialog
        isOpen={dialogState.isOpen && dialogState.type === 'delete'}
        onClose={() => setDialogState({ isOpen: false, type: 'view' })}
        title="Delete Vital Reading"
        type="error"
        size="md"
        actions={
          <>
            <button
              onClick={() => setDialogState({ isOpen: false, type: 'view' })}
              className={`px-4 py-2 rounded-lg font-body font-medium transition-colors ${
                isDarkMode 
                  ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' 
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
              }`}
            >
              Cancel
            </button>
            <button
              onClick={handleDialogConfirm}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-body font-medium transition-colors"
            >
              Delete
            </button>
          </>
        }
      >
        <p className={`font-body transition-colors duration-300 ${
          isDarkMode ? 'text-gray-300' : 'text-navy-700'
        }`}>
          Are you sure you want to delete this vital reading? This action cannot be undone.
        </p>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog
        isOpen={dialogState.isOpen && dialogState.type === 'edit'}
        onClose={() => setDialogState({ isOpen: false, type: 'view' })}
        title="Edit Vital Reading"
        type="default"
        size="lg"
        actions={
          <>
            <button
              onClick={() => setDialogState({ isOpen: false, type: 'view' })}
              className={`px-4 py-2 rounded-lg font-body font-medium transition-colors ${
                isDarkMode 
                  ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' 
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
              }`}
            >
              Cancel
            </button>
            <button
              onClick={handleDialogConfirm}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-body font-medium transition-colors"
            >
              Save Changes
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className={`block text-sm font-body font-medium mb-1 transition-colors duration-300 ${
              isDarkMode ? 'text-gray-300' : 'text-navy-700'
            }`}>
              Value
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent font-body"
              placeholder="Enter value"
              defaultValue={dialogState.data?.value || ''}
            />
          </div>
          <div>
            <label className="block text-sm font-body font-medium text-navy-700 mb-1">
              Notes
            </label>
            <textarea
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent font-body"
              rows={3}
              placeholder="Add notes..."
            />
          </div>
        </div>
      </Dialog>

      {/* Details Popup */}
      <PopupWindow
        isOpen={detailsPopup.isOpen}
        onClose={() => setDetailsPopup({ isOpen: false })}
        title={detailsPopup.data?.title || 'Details'}
        width={600}
        height={400}
      >
        {detailsPopup.data && (
          <div className="space-y-4">
            <div className={`flex items-center justify-between p-4 rounded-lg transition-colors duration-300 ${
              isDarkMode 
                ? 'detail-header' 
                : 'bg-gradient-to-r from-teal-50 to-gold-50'
            }`}>
              <div>
                <div className={`text-sm font-body mb-1 transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-300' : 'text-navy-600'
                }`}>Current Value</div>
                <div className={`text-3xl font-heading font-bold transition-colors duration-300 ${
                  isDarkMode ? 'text-white' : 'text-navy-900'
                }`}>
                  {detailsPopup.data.value} <span className={`text-lg transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-300' : 'text-navy-600'
                  }`}>{detailsPopup.data.unit}</span>
                </div>
              </div>
              <div className="text-5xl">{detailsPopup.data.icon}</div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className={`p-4 rounded-lg transition-colors duration-300 ${
                isDarkMode ? 'detail-box' : 'bg-gray-50'
              }`}>
                <div className={`text-sm font-body mb-1 transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-300' : 'text-navy-600'
                }`}>Status</div>
                <div className={`text-lg font-heading font-semibold capitalize ${
                  detailsPopup.data.status === 'normal' ? 'text-green-600' :
                  detailsPopup.data.status === 'warning' ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {detailsPopup.data.status}
                </div>
              </div>
              <div className={`p-4 rounded-lg transition-colors duration-300 ${
                isDarkMode ? 'detail-box' : 'bg-gray-50'
              }`}>
                <div className={`text-sm font-body mb-1 transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-300' : 'text-navy-600'
                }`}>Trend</div>
                <div className={`text-lg font-heading font-semibold capitalize transition-colors duration-300 ${
                  isDarkMode ? 'text-white' : 'text-navy-900'
                }`}>
                  {detailsPopup.data.trend === 'increasing' ? '📈 Rising' :
                   detailsPopup.data.trend === 'decreasing' ? '📉 Falling' : '➡️ Stable'}
                </div>
              </div>
            </div>
            <div className={`p-4 rounded-lg transition-colors duration-300 ${
              isDarkMode ? 'detail-box' : 'bg-gray-50'
            }`}>
              <div className={`text-sm font-body mb-1 transition-colors duration-300 ${
                isDarkMode ? 'text-gray-300' : 'text-navy-600'
              }`}>Last Updated</div>
              <div className={`text-base font-body transition-colors duration-300 ${
                isDarkMode ? 'text-white' : 'text-navy-900'
              }`}>{detailsPopup.data.lastUpdated}</div>
            </div>
          </div>
        )}
      </PopupWindow>

      {/* Toast Notifications */}
      <MessageWindow
        messages={toasts}
        onDismiss={dismissToast}
        position="top-right"
      />
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-ivory-50 via-white to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gold-200 border-t-gold-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-navy-600 font-body">Loading your health dashboard...</p>
        </div>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}