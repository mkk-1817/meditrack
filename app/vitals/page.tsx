'use client';

/**
 * Vitals Page - Enhanced with HCI Components
 * Tabbed Windows, Split Views, Context Menus, Dialogs
 */

import { Suspense, useState } from 'react';
import { motion } from 'framer-motion';
import { pageVariants, containerVariants, itemVariants } from '@/animations/motionVariants';
// import { useLocalStorage } from '@/hooks/useLocalStorage';
// import { STORAGE_KEYS, VitalReading } from '@/lib/localStorage';
import { ContextMenu, ContextMenuItem, PieMenu, PieMenuItem } from '@/components/HCIMenus';
import { Dialog, TabbedWindow, Tab, MessageWindow, ToastMessage, SplitWindow } from '@/components/HCIWindows';

interface VitalData {
  id: string;
  title: string;
  value: string;
  unit: string;
  trend: 'increasing' | 'decreasing' | 'stable';
  status: 'normal' | 'warning' | 'critical';
  lastUpdated: string;
  icon: string;
  range: { min: number; max: number; optimal: [number, number] };
  history: number[];
  timeLabels: string[];
}

function VitalsContent() {
  // const [vitalReadings] = useLocalStorage<VitalReading[]>(STORAGE_KEYS.VITAL_READINGS, []);
  // const [activeTab, setActiveTab] = useState('today');
  const [contextMenu, setContextMenu] = useState<{ items: ContextMenuItem[]; position: { x: number; y: number } } | null>(null);
  const [pieMenu, setPieMenu] = useState<{ items: PieMenuItem[]; center: { x: number; y: number } } | null>(null);
  const [dialogState, setDialogState] = useState<{ isOpen: boolean; type: 'add' | 'edit' | 'delete'; data?: any }>({ isOpen: false, type: 'add' });
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [selectedVital, setSelectedVital] = useState<VitalData | null>(null);
  const [splitView, setSplitView] = useState(true);

  const showToast = (type: ToastMessage['type'], title: string, message: string) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, type, title, message, duration: 3000 }]);
  };

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Sample vitals data
  const vitalsData: VitalData[] = [
    {
      id: 'heart-rate',
      title: 'Heart Rate',
      value: '72',
      unit: 'bpm',
      trend: 'stable',
      status: 'normal',
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
      trend: 'stable',
      status: 'normal',
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
      trend: 'stable',
      status: 'normal',
      lastUpdated: '10 minutes ago',
      icon: '🌡️',
      range: { min: 97, max: 100, optimal: [98, 99] },
      history: [98.4, 98.6, 98.5, 98.7, 98.6, 98.5, 98.6],
      timeLabels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    {
      id: 'oxygen',
      title: 'Oxygen Saturation',
      value: '98',
      unit: '%',
      trend: 'stable',
      status: 'normal',
      lastUpdated: '3 minutes ago',
      icon: '🫁',
      range: { min: 95, max: 100, optimal: [95, 100] },
      history: [97, 98, 98, 99, 98, 97, 98],
      timeLabels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    }
  ];

  // Context menu for vital cards
  const handleVitalContextMenu = (e: React.MouseEvent, vital: VitalData) => {
    e.preventDefault();
    setContextMenu({
      position: { x: e.clientX, y: e.clientY },
      items: [
        {
          id: 'view',
          label: 'View Details',
          icon: '👁️',
          action: () => {
            setSelectedVital(vital);
            setContextMenu(null);
            showToast('info', 'Details', `Viewing ${vital.title}`);
          }
        },
        {
          id: 'edit',
          label: 'Edit Reading',
          icon: '✏️',
          action: () => {
            setDialogState({ isOpen: true, type: 'edit', data: vital });
            setContextMenu(null);
          }
        },
        {
          id: 'export',
          label: 'Export Data',
          icon: '📤',
          action: () => {},
          submenu: [
            {
              id: 'csv',
              label: 'Export as CSV',
              icon: '📊',
              action: () => {
                showToast('success', 'Exported', 'Data exported as CSV');
                setContextMenu(null);
              }
            },
            {
              id: 'pdf',
              label: 'Export as PDF',
              icon: '📄',
              action: () => {
                showToast('success', 'Exported', 'Data exported as PDF');
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

  // Pie menu for quick actions
  const handleVitalPieMenu = (e: React.MouseEvent, vital: VitalData) => {
    setPieMenu({
      center: { x: e.clientX, y: e.clientY },
      items: [
        {
          id: 'add',
          label: 'Add',
          icon: '➕',
          color: '#1B4D4F',
          action: () => {
            setDialogState({ isOpen: true, type: 'add', data: vital });
            setPieMenu(null);
          }
        },
        {
          id: 'chart',
          label: 'Chart',
          icon: '📊',
          color: '#C79549',
          action: () => {
            setSplitView(true);
            setSelectedVital(vital);
            setPieMenu(null);
          }
        },
        {
          id: 'history',
          label: 'History',
          icon: '📅',
          color: '#2B3A67',
          action: () => {
            showToast('info', 'History', `Loading ${vital.title} history`);
            setPieMenu(null);
          }
        },
        {
          id: 'share',
          label: 'Share',
          icon: '📤',
          color: '#10B981',
          action: () => {
            showToast('info', 'Sharing', 'Preparing data');
            setPieMenu(null);
          }
        }
      ]
    });
  };

  // Handle dialog actions
  const handleDialogConfirm = () => {
    if (dialogState.type === 'add') {
      showToast('success', 'Added', 'New reading added successfully');
    } else if (dialogState.type === 'edit') {
      showToast('success', 'Updated', 'Reading updated successfully');
    } else if (dialogState.type === 'delete') {
      showToast('success', 'Deleted', 'Reading deleted successfully');
    }
    setDialogState({ isOpen: false, type: 'add' });
  };

  // Tabs content components
  const TodayView = () => (
    <div className="space-y-4">
      <h3 className="text-xl font-heading font-semibold text-navy-900 mb-4">Today's Vitals</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {vitalsData.map((vital) => (
          <motion.div
            key={vital.id}
            whileHover={{ scale: 1.02 }}
            onContextMenu={(e) => handleVitalContextMenu(e, vital)}
            onDoubleClick={(e) => handleVitalPieMenu(e, vital)}
            className="bg-white/80 backdrop-blur-sm border border-teal-200/30 rounded-xl p-6 shadow-clinical hover:shadow-clinical-hover transition-all duration-300 cursor-pointer"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="text-4xl">{vital.icon}</div>
                <div>
                  <h4 className="text-lg font-heading font-semibold text-navy-900">{vital.title}</h4>
                  <p className="text-sm text-navy-600 font-body">{vital.lastUpdated}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-heading font-bold text-navy-900">
                  {vital.value}
                </div>
                <div className="text-sm text-navy-600 font-body">{vital.unit}</div>
              </div>
            </div>
            <div className={`inline-block px-3 py-1 rounded-full text-sm font-body font-medium ${
              vital.status === 'normal' ? 'bg-green-100 text-green-800' :
              vital.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {vital.status.toUpperCase()}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const WeekView = () => (
    <div className="space-y-4">
      <h3 className="text-xl font-heading font-semibold text-navy-900 mb-4">This Week's Trends</h3>
      
      {/* Week Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-xl p-4 border-2 border-teal-200"
        >
          <div className="text-2xl mb-2">❤️</div>
          <div className="text-sm text-teal-700 font-body mb-1">Avg Heart Rate</div>
          <div className="text-2xl font-heading font-bold text-teal-900">71 bpm</div>
          <div className="text-xs text-teal-600 font-body mt-1">↓ 2% vs last week</div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-4 border-2 border-red-200"
        >
          <div className="text-2xl mb-2">🩸</div>
          <div className="text-sm text-red-700 font-body mb-1">Avg BP</div>
          <div className="text-2xl font-heading font-bold text-red-900">120/80</div>
          <div className="text-xs text-red-600 font-body mt-1">→ Stable</div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 border-2 border-orange-200"
        >
          <div className="text-2xl mb-2">🌡️</div>
          <div className="text-sm text-orange-700 font-body mb-1">Avg Temp</div>
          <div className="text-2xl font-heading font-bold text-orange-900">98.6°F</div>
          <div className="text-xs text-orange-600 font-body mt-1">→ Normal</div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border-2 border-blue-200"
        >
          <div className="text-2xl mb-2">🫁</div>
          <div className="text-sm text-blue-700 font-body mb-1">Avg SpO2</div>
          <div className="text-2xl font-heading font-bold text-blue-900">98%</div>
          <div className="text-xs text-blue-600 font-body mt-1">↑ Excellent</div>
        </motion.div>
      </div>

      {/* Weekly Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {vitalsData.map((vital) => (
          <motion.div
            key={vital.id}
            whileHover={{ scale: 1.01 }}
            className="bg-white/80 backdrop-blur-sm border border-teal-200/30 rounded-xl p-6 shadow-clinical"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">{vital.icon}</span>
                <h4 className="text-lg font-heading font-semibold text-navy-900">{vital.title}</h4>
              </div>
              <div className={`px-2 py-1 rounded-full text-xs font-body font-medium ${
                vital.status === 'normal' ? 'bg-green-100 text-green-800' :
                vital.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {vital.status.toUpperCase()}
              </div>
            </div>

            {/* Line Chart */}
            <div className="relative h-40 mb-4">
              <div className="absolute inset-0 flex items-end justify-between space-x-1">
                {vital.history.map((value, index) => {
                  const maxValue = Math.max(...vital.history);
                  const minValue = Math.min(...vital.history);
                  const range = maxValue - minValue || 1;
                  const height = ((value - minValue) / range) * 100;
                  
                  return (
                    <div key={index} className="flex-1 flex flex-col items-center group">
                      <div className="relative w-full h-full flex items-end">
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${height}%` }}
                          transition={{ delay: index * 0.1 }}
                          className="w-full bg-gradient-to-t from-teal-500 to-teal-300 rounded-t-lg group-hover:from-teal-600 group-hover:to-teal-400 transition-colors"
                        >
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 left-1/2 transform -translate-x-1/2 bg-navy-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                            {value} {vital.unit}
                          </div>
                        </motion.div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* X-axis labels */}
            <div className="flex justify-between text-xs text-navy-600 font-body">
              {vital.timeLabels.map((label, index) => (
                <span key={index}>{label}</span>
              ))}
            </div>

            {/* Statistics */}
            <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-3 gap-2">
              <div className="text-center">
                <div className="text-xs text-navy-600 font-body">Min</div>
                <div className="text-sm font-heading font-semibold text-navy-900">
                  {Math.min(...vital.history)}
                </div>
              </div>
              <div className="text-center">
                <div className="text-xs text-navy-600 font-body">Avg</div>
                <div className="text-sm font-heading font-semibold text-navy-900">
                  {(vital.history.reduce((a, b) => a + b, 0) / vital.history.length).toFixed(1)}
                </div>
              </div>
              <div className="text-center">
                <div className="text-xs text-navy-600 font-body">Max</div>
                <div className="text-sm font-heading font-semibold text-navy-900">
                  {Math.max(...vital.history)}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const MonthView = () => {
    // Generate 30 days of data
    const monthData = Array.from({ length: 30 }, (_, i) => ({
      day: i + 1,
      heartRate: 68 + Math.floor(Math.random() * 12),
      bp: 118 + Math.floor(Math.random() * 8),
      temp: 98.4 + Math.random() * 0.4,
      oxygen: 96 + Math.floor(Math.random() * 4)
    }));

    return (
      <div className="space-y-6">
        <h3 className="text-xl font-heading font-semibold text-navy-900 mb-4">Monthly Overview - October 2025</h3>
        
        {/* Month Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="text-3xl">📊</div>
              <div className="bg-white/20 px-3 py-1 rounded-full text-sm font-body">30 days</div>
            </div>
            <div className="text-sm font-body opacity-90 mb-1">Total Readings</div>
            <div className="text-4xl font-heading font-bold">120</div>
            <div className="text-sm font-body opacity-75 mt-2">Avg 4 per day</div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="text-3xl">✅</div>
              <div className="bg-white/20 px-3 py-1 rounded-full text-sm font-body">100%</div>
            </div>
            <div className="text-sm font-body opacity-90 mb-1">Normal Days</div>
            <div className="text-4xl font-heading font-bold">30</div>
            <div className="text-sm font-body opacity-75 mt-2">All vitals in range</div>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="text-3xl">🎯</div>
              <div className="bg-white/20 px-3 py-1 rounded-full text-sm font-body">Great</div>
            </div>
            <div className="text-sm font-body opacity-90 mb-1">Health Score</div>
            <div className="text-4xl font-heading font-bold">95</div>
            <div className="text-sm font-body opacity-75 mt-2">Excellent health</div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="text-3xl">📈</div>
              <div className="bg-white/20 px-3 py-1 rounded-full text-sm font-body">↑ 5%</div>
            </div>
            <div className="text-sm font-body opacity-90 mb-1">Improvement</div>
            <div className="text-4xl font-heading font-bold">+5</div>
            <div className="text-sm font-body opacity-75 mt-2">vs last month</div>
          </div>
        </div>

        {/* Calendar Heatmap */}
        <div className="bg-white/80 backdrop-blur-sm border border-teal-200/30 rounded-xl p-6 shadow-clinical">
          <h4 className="text-lg font-heading font-semibold text-navy-900 mb-4">Daily Reading Activity</h4>
          <div className="grid grid-cols-7 gap-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, i) => (
              <div key={i} className="text-center text-xs font-body text-navy-600 py-2">{day}</div>
            ))}
            {Array.from({ length: 35 }, (_, i) => {
              const day = i - 2; // Start from previous month
              const hasData = day > 0 && day <= 30;
              const intensity = hasData ? Math.floor(Math.random() * 4) + 1 : 0;
              const colors = ['bg-gray-100', 'bg-teal-200', 'bg-teal-400', 'bg-teal-600', 'bg-teal-800'];
              
              return (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.2 }}
                  className={`aspect-square ${colors[intensity]} rounded-lg cursor-pointer transition-all`}
                  title={hasData ? `Day ${day}: ${intensity} readings` : ''}
                >
                  {hasData && (
                    <div className="w-full h-full flex items-center justify-center text-xs font-body text-navy-700">
                      {day}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
          <div className="flex items-center justify-end space-x-2 mt-4">
            <span className="text-xs text-navy-600 font-body">Less</span>
            <div className="w-4 h-4 bg-gray-100 rounded"></div>
            <div className="w-4 h-4 bg-teal-200 rounded"></div>
            <div className="w-4 h-4 bg-teal-400 rounded"></div>
            <div className="w-4 h-4 bg-teal-600 rounded"></div>
            <div className="w-4 h-4 bg-teal-800 rounded"></div>
            <span className="text-xs text-navy-600 font-body">More</span>
          </div>
        </div>

        {/* Monthly Trends by Vital */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {vitalsData.map((vital) => (
            <motion.div
              key={vital.id}
              whileHover={{ scale: 1.01 }}
              className="bg-white/80 backdrop-blur-sm border border-teal-200/30 rounded-xl p-6 shadow-clinical"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{vital.icon}</span>
                  <h4 className="text-lg font-heading font-semibold text-navy-900">{vital.title}</h4>
                </div>
              </div>

              {/* Sparkline Chart */}
              <div className="relative h-24 mb-4 bg-gray-50 rounded-lg p-2">
                <svg width="100%" height="100%" className="overflow-visible">
                  <polyline
                    points={monthData.map((d, i) => `${(i / 29) * 100}%,${100 - ((d.heartRate - 60) / 40) * 100}%`).join(' ')}
                    fill="none"
                    stroke="#0D9488"
                    strokeWidth="2"
                    className="drop-shadow-md"
                  />
                </svg>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-4 gap-2">
                <div className="text-center p-2 bg-teal-50 rounded-lg">
                  <div className="text-xs text-teal-700 font-body mb-1">Min</div>
                  <div className="text-sm font-heading font-semibold text-teal-900">
                    {vital.range.min}
                  </div>
                </div>
                <div className="text-center p-2 bg-green-50 rounded-lg">
                  <div className="text-xs text-green-700 font-body mb-1">Avg</div>
                  <div className="text-sm font-heading font-semibold text-green-900">
                    {vital.value}
                  </div>
                </div>
                <div className="text-center p-2 bg-blue-50 rounded-lg">
                  <div className="text-xs text-blue-700 font-body mb-1">Max</div>
                  <div className="text-sm font-heading font-semibold text-blue-900">
                    {vital.range.max}
                  </div>
                </div>
                <div className="text-center p-2 bg-purple-50 rounded-lg">
                  <div className="text-xs text-purple-700 font-body mb-1">Trend</div>
                  <div className="text-sm font-heading font-semibold text-purple-900">
                    {vital.trend === 'stable' ? '→' : vital.trend === 'increasing' ? '↑' : '↓'}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  };

  const YearView = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const yearData = months.map((month) => ({
      month,
      heartRate: 68 + Math.floor(Math.random() * 10),
      bp: 118 + Math.floor(Math.random() * 6),
      temp: 98.5 + Math.random() * 0.2,
      oxygen: 97 + Math.floor(Math.random() * 3),
      readings: 30 + Math.floor(Math.random() * 20)
    }));

    return (
      <div className="space-y-6">
        <h3 className="text-xl font-heading font-semibold text-navy-900 mb-4">Yearly Analysis - 2025</h3>
        
        {/* Year Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl p-8 text-white">
            <div className="text-4xl mb-4">🏆</div>
            <div className="text-sm font-body opacity-90 mb-2">Total Readings</div>
            <div className="text-5xl font-heading font-bold mb-2">1,460</div>
            <div className="text-sm font-body opacity-75">Avg 4 per day</div>
            <div className="mt-4 pt-4 border-t border-white/20">
              <div className="flex items-center justify-between text-sm">
                <span className="opacity-75">Consistency</span>
                <span className="font-semibold">99.7%</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 rounded-2xl p-8 text-white">
            <div className="text-4xl mb-4">💚</div>
            <div className="text-sm font-body opacity-90 mb-2">Health Score</div>
            <div className="text-5xl font-heading font-bold mb-2">94.5</div>
            <div className="text-sm font-body opacity-75">Above average</div>
            <div className="mt-4 pt-4 border-t border-white/20">
              <div className="flex items-center justify-between text-sm">
                <span className="opacity-75">Improvement</span>
                <span className="font-semibold">+12% YoY</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 rounded-2xl p-8 text-white">
            <div className="text-4xl mb-4">🎯</div>
            <div className="text-sm font-body opacity-90 mb-2">Goals Achieved</div>
            <div className="text-5xl font-heading font-bold mb-2">18/20</div>
            <div className="text-sm font-body opacity-75">90% completion</div>
            <div className="mt-4 pt-4 border-t border-white/20">
              <div className="flex items-center justify-between text-sm">
                <span className="opacity-75">Streak</span>
                <span className="font-semibold">365 days</span>
              </div>
            </div>
          </div>
        </div>

        {/* Annual Trends Chart */}
        <div className="bg-white/80 backdrop-blur-sm border border-teal-200/30 rounded-xl p-6 shadow-clinical">
          <h4 className="text-lg font-heading font-semibold text-navy-900 mb-6">Annual Trends - All Vitals</h4>
          
          <div className="relative h-64">
            <div className="absolute inset-0 flex items-end justify-between space-x-2">
              {yearData.map((data, index) => (
                <div key={index} className="flex-1 flex flex-col items-center group">
                  <div className="relative w-full h-full flex items-end space-x-1">
                    {/* Heart Rate Bar */}
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${(data.heartRate / 100) * 100}%` }}
                      transition={{ delay: index * 0.05 }}
                      className="flex-1 bg-gradient-to-t from-red-500 to-red-300 rounded-t"
                      title={`Heart Rate: ${data.heartRate}`}
                    />
                    {/* BP Bar */}
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${(data.bp / 140) * 100}%` }}
                      transition={{ delay: index * 0.05 + 0.1 }}
                      className="flex-1 bg-gradient-to-t from-blue-500 to-blue-300 rounded-t"
                      title={`BP: ${data.bp}`}
                    />
                    {/* Oxygen Bar */}
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${data.oxygen}%` }}
                      transition={{ delay: index * 0.05 + 0.2 }}
                      className="flex-1 bg-gradient-to-t from-green-500 to-green-300 rounded-t"
                      title={`SpO2: ${data.oxygen}%`}
                    />
                  </div>
                  <div className="text-xs text-navy-600 font-body mt-2">{data.month}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center space-x-6 mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-gradient-to-t from-red-500 to-red-300 rounded"></div>
              <span className="text-sm font-body text-navy-600">Heart Rate</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-gradient-to-t from-blue-500 to-blue-300 rounded"></div>
              <span className="text-sm font-body text-navy-600">Blood Pressure</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-gradient-to-t from-green-500 to-green-300 rounded"></div>
              <span className="text-sm font-body text-navy-600">Oxygen</span>
            </div>
          </div>
        </div>

        {/* Quarterly Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {['Q1', 'Q2', 'Q3', 'Q4'].map((quarter, qIndex) => (
            <motion.div
              key={quarter}
              whileHover={{ scale: 1.02 }}
              className="bg-white/80 backdrop-blur-sm border border-teal-200/30 rounded-xl p-6 shadow-clinical"
            >
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-heading font-semibold text-navy-900">{quarter} 2025</h4>
                <div className="text-2xl">
                  {qIndex === 0 ? '❄️' : qIndex === 1 ? '🌸' : qIndex === 2 ? '☀️' : '🍂'}
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-navy-600 font-body">Readings</span>
                  <span className="text-sm font-heading font-semibold text-navy-900">
                    {360 + Math.floor(Math.random() * 50)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-navy-600 font-body">Avg Score</span>
                  <span className="text-sm font-heading font-semibold text-navy-900">
                    {92 + Math.floor(Math.random() * 6)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-navy-600 font-body">Normal Days</span>
                  <span className="text-sm font-heading font-semibold text-green-600">
                    {85 + Math.floor(Math.random() * 10)}%
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className={`px-3 py-1 rounded-full text-xs font-body font-medium text-center ${
                  qIndex <= 2 ? 'bg-green-100 text-green-800' : 'bg-teal-100 text-teal-800'
                }`}>
                  {qIndex <= 2 ? 'Completed' : 'In Progress'}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Insights & Achievements */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/80 backdrop-blur-sm border border-teal-200/30 rounded-xl p-6 shadow-clinical">
            <h4 className="text-lg font-heading font-semibold text-navy-900 mb-4 flex items-center space-x-2">
              <span>💡</span>
              <span>Key Insights</span>
            </h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                <span className="text-xl">✅</span>
                <div>
                  <div className="text-sm font-body font-semibold text-green-900">Excellent Consistency</div>
                  <div className="text-xs text-green-700">You tracked vitals 99.7% of days this year</div>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                <span className="text-xl">📈</span>
                <div>
                  <div className="text-sm font-body font-semibold text-blue-900">Improved Heart Health</div>
                  <div className="text-xs text-blue-700">Resting heart rate decreased by 5 bpm</div>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 bg-purple-50 rounded-lg">
                <span className="text-xl">🎯</span>
                <div>
                  <div className="text-sm font-body font-semibold text-purple-900">Stable Blood Pressure</div>
                  <div className="text-xs text-purple-700">Maintained optimal range for 11 months</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm border border-teal-200/30 rounded-xl p-6 shadow-clinical">
            <h4 className="text-lg font-heading font-semibold text-navy-900 mb-4 flex items-center space-x-2">
              <span>🏅</span>
              <span>Achievements</span>
            </h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 bg-gold-50 rounded-lg">
                <span className="text-2xl">🥇</span>
                <div className="flex-1">
                  <div className="text-sm font-body font-semibold text-gold-900">365 Day Streak</div>
                  <div className="text-xs text-gold-700">Tracked every single day!</div>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-teal-50 rounded-lg">
                <span className="text-2xl">⭐</span>
                <div className="flex-1">
                  <div className="text-sm font-body font-semibold text-teal-900">Health Master</div>
                  <div className="text-xs text-teal-700">1,000+ readings logged</div>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-indigo-50 rounded-lg">
                <span className="text-2xl">💪</span>
                <div className="flex-1">
                  <div className="text-sm font-body font-semibold text-indigo-900">Goal Crusher</div>
                  <div className="text-xs text-indigo-700">18 out of 20 goals achieved</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const tabs: Tab[] = [
    {
      id: 'today',
      label: 'Today',
      icon: '📅',
      badge: vitalsData.length,
      content: <TodayView />
    },
    {
      id: 'week',
      label: 'This Week',
      icon: '📊',
      content: <WeekView />
    },
    {
      id: 'month',
      label: 'This Month',
      icon: '📈',
      content: <MonthView />
    },
    {
      id: 'year',
      label: 'This Year',
      icon: '📉',
      content: <YearView />
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
                Vital Signs
              </h1>
              <p className="text-lg text-navy-600 font-body">
                Track and monitor your health metrics over time
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setDialogState({ isOpen: true, type: 'add' })}
              className="px-6 py-3 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white rounded-xl font-body font-medium shadow-luxury hover:shadow-luxury-hover transition-all"
            >
              <span className="flex items-center space-x-2">
                <span>➕</span>
                <span>Add Reading</span>
              </span>
            </motion.button>
          </div>
        </motion.section>

        {/* Toggle Split View */}
        <motion.section variants={itemVariants} className="mb-6">
          <div className="flex items-center justify-end space-x-4">
            <button
              onClick={() => setSplitView(!splitView)}
              className="px-4 py-2 bg-white/80 border border-teal-200 rounded-lg text-navy-700 font-body font-medium hover:bg-teal-50 transition-colors"
            >
              {splitView ? '📊 Chart View' : '📋 List View'}
            </button>
          </div>
        </motion.section>

        {/* Main Content with Split View */}
        {splitView ? (
          <motion.section variants={containerVariants} className="mb-8">
            <SplitWindow
              orientation="horizontal"
              defaultSplit={60}
              minSize={30}
              leftPanel={
                <div className="h-full p-6 bg-white/50 backdrop-blur-sm rounded-l-2xl">
                  <TabbedWindow
                    defaultTab="today"
                    tabs={tabs}
                    onChange={(tabId) => {
                      // setActiveTab(tabId);
                      showToast('info', 'View Changed', `Switched to ${tabs.find(t => t.id === tabId)?.label}`);
                    }}
                  />
                </div>
              }
              rightPanel={
                <div className="h-full p-6 bg-white/50 backdrop-blur-sm rounded-r-2xl">
                  <h3 className="text-xl font-heading font-semibold text-navy-900 mb-4">
                    {selectedVital ? `${selectedVital.title} Chart` : 'Select a Vital'}
                  </h3>
                  {selectedVital ? (
                    <div className="space-y-4">
                      <div className="bg-gradient-to-r from-teal-50 to-gold-50 rounded-xl p-6">
                        <div className="text-center">
                          <div className="text-5xl mb-2">{selectedVital.icon}</div>
                          <div className="text-4xl font-heading font-bold text-navy-900">
                            {selectedVital.value} <span className="text-xl text-navy-600">{selectedVital.unit}</span>
                          </div>
                          <div className="text-sm text-navy-600 font-body mt-2">{selectedVital.title}</div>
                        </div>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-6">
                        <h4 className="text-sm font-body font-semibold text-navy-700 mb-3">7-Day Trend</h4>
                        <div className="flex items-end justify-between h-32 space-x-2">
                          {selectedVital.history.map((value, index) => {
                            const maxValue = Math.max(...selectedVital.history);
                            const height = (value / maxValue) * 100;
                            return (
                              <div key={index} className="flex-1 flex flex-col items-center">
                                <div
                                  className="w-full bg-gradient-to-t from-teal-500 to-teal-300 rounded-t"
                                  style={{ height: `${height}%` }}
                                />
                                <div className="text-xs text-navy-600 font-body mt-2">
                                  {selectedVital.timeLabels[index]}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-64 text-navy-400 font-body">
                      Right-click or double-click a vital card to view its chart
                    </div>
                  )}
                </div>
              }
            />
          </motion.section>
        ) : (
          <motion.section variants={containerVariants} className="mb-8">
            <TabbedWindow
              defaultTab="today"
              tabs={tabs}
              onChange={(tabId) => {
                // setActiveTab(tabId);
                showToast('info', 'View Changed', `Switched to ${tabs.find(t => t.id === tabId)?.label}`);
              }}
            />
          </motion.section>
        )}
      </motion.main>

      {/* HCI Components */}
      {contextMenu && (
        <ContextMenu
          items={contextMenu.items}
          position={contextMenu.position}
          onClose={() => setContextMenu(null)}
        />
      )}

      {pieMenu && (
        <PieMenu
          items={pieMenu.items}
          center={pieMenu.center}
          onClose={() => setPieMenu(null)}
        />
      )}

      {/* Add Reading Dialog */}
      <Dialog
        isOpen={dialogState.isOpen && dialogState.type === 'add'}
        onClose={() => setDialogState({ isOpen: false, type: 'add' })}
        title="Add New Reading"
        type="default"
        size="lg"
        actions={
          <>
            <button
              onClick={() => setDialogState({ isOpen: false, type: 'add' })}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-body font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDialogConfirm}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-body font-medium transition-colors"
            >
              Add Reading
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-body font-medium text-navy-700 mb-1">
              Vital Type
            </label>
            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent font-body">
              <option>Heart Rate</option>
              <option>Blood Pressure</option>
              <option>Temperature</option>
              <option>Oxygen Saturation</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-body font-medium text-navy-700 mb-1">
              Value
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent font-body"
              placeholder="Enter value"
            />
          </div>
          <div>
            <label className="block text-sm font-body font-medium text-navy-700 mb-1">
              Date & Time
            </label>
            <input
              type="datetime-local"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent font-body"
            />
          </div>
        </div>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog
        isOpen={dialogState.isOpen && dialogState.type === 'edit'}
        onClose={() => setDialogState({ isOpen: false, type: 'edit' })}
        title="Edit Reading"
        type="default"
        size="lg"
        actions={
          <>
            <button
              onClick={() => setDialogState({ isOpen: false, type: 'edit' })}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-body font-medium transition-colors"
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
            <label className="block text-sm font-body font-medium text-navy-700 mb-1">
              Value
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent font-body"
              placeholder="Enter value"
              defaultValue={dialogState.data?.value || ''}
            />
          </div>
        </div>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog
        isOpen={dialogState.isOpen && dialogState.type === 'delete'}
        onClose={() => setDialogState({ isOpen: false, type: 'delete' })}
        title="Delete Reading"
        type="error"
        size="md"
        actions={
          <>
            <button
              onClick={() => setDialogState({ isOpen: false, type: 'delete' })}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-body font-medium transition-colors"
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
        <p className="text-navy-700 font-body">
          Are you sure you want to delete this reading? This action cannot be undone.
        </p>
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

export default function VitalsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-ivory-50 via-white to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gold-200 border-t-gold-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-navy-600 font-body">Loading vitals...</p>
        </div>
      </div>
    }>
      <VitalsContent />
    </Suspense>
  );
}
