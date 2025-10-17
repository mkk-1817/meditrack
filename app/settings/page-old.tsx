'use client';

/**
 * Settings Page - Application Settings and Preferences with LocalStorage
 * Configure app behavior, notifications, privacy, and account settings
 */

import { Suspense, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { pageVariants, containerVariants, itemVariants } from '@/animations/motionVariants';
import { storage, STORAGE_KEYS, Settings as SettingsType } from '@/lib/localStorage';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface ConnectedDevice {
  id: number;
  name: string;
  type: string;
  status: 'connected' | 'disconnected';
  lastSync: string;
  batteryLevel: number;
  dataTypes: string[];
}

function SettingsContent() {
  const [settings, setSettings] = useLocalStorage<SettingsType>(STORAGE_KEYS.SETTINGS, {} as SettingsType);
  const [devices, setDevices] = useLocalStorage<ConnectedDevice[]>(STORAGE_KEYS.CONNECTED_DEVICES, []);
  const [showSaveNotification, setShowSaveNotification] = useState(false);
  const [storageSize, setStorageSize] = useState(0);

  // Initialize default devices if none exist
  useEffect(() => {
    if (devices.length === 0) {
      setDevices([
        {
          id: 1,
          name: 'Apple Watch Series 9',
          type: 'Smartwatch',
          status: 'connected',
          lastSync: new Date().toISOString(),
          batteryLevel: 85,
          dataTypes: ['Heart Rate', 'Steps', 'Sleep', 'Workouts']
        },
        {
          id: 2,
          name: 'Withings Body+ Scale',
          type: 'Smart Scale',
          status: 'connected',
          lastSync: new Date(Date.now() - 3600000).toISOString(),
          batteryLevel: 92,
          dataTypes: ['Weight', 'Body Fat', 'Muscle Mass', 'BMI']
        },
        {
          id: 3,
          name: 'Omron Blood Pressure Monitor',
          type: 'Blood Pressure Monitor',
          status: 'disconnected',
          lastSync: new Date(Date.now() - 86400000 * 2).toISOString(),
          batteryLevel: 45,
          dataTypes: ['Blood Pressure', 'Heart Rate']
        }
      ]);
    }

    // Calculate storage size
    setStorageSize(storage.getStorageSize());
  }, [devices.length, setDevices]);

  const handleToggleSetting = (category: keyof SettingsType, key: string) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: !prev[category][key as keyof typeof prev[typeof category]]
      }
    }));
    showSaveToast();
  };

  const handleSelectChange = (category: keyof SettingsType, key: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
    showSaveToast();
  };

  const showSaveToast = () => {
    setShowSaveNotification(true);
    setTimeout(() => setShowSaveNotification(false), 2000);
  };

  const handleSyncDevice = (deviceId: number) => {
    setDevices(prev => prev.map(device => 
      device.id === deviceId 
        ? { ...device, lastSync: new Date().toISOString(), status: 'connected' }
        : device
    ));
    showSaveToast();
  };

  const handleExportData = () => {
    const data = storage.exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `meditrack-export-${new Date().toISOString()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showSaveToast();
  };

  const handleClearData = () => {
    if (window.confirm('Are you sure you want to delete all your data? This action cannot be undone.')) {
      storage.clearAll();
      storage.initializeDefaults();
      window.location.reload();
    }
  };

  const formatStorageSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  if (!settings.notifications) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-ivory-50 via-white to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gold-200 border-t-gold-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-navy-600 font-body">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-ivory-50 via-white to-teal-50">
      {/* Wellness Aura Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-radial from-gold-200/20 via-gold-100/10 to-transparent rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-radial from-teal-200/20 via-teal-100/10 to-transparent rounded-full blur-3xl animate-pulse-slow" />
      </div>

      {/* Save Notification Toast */}
      <AnimatePresence>
        {showSaveNotification && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-luxury flex items-center space-x-2"
          >
            <span className="text-xl">✓</span>
            <span className="font-body font-medium">Settings saved successfully!</span>
          </motion.div>
        )}
      </AnimatePresence>

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
                Settings
              </h1>
              <p className="text-lg text-navy-600 font-body">
                Customize your app experience and manage your preferences.
              </p>
              <p className="text-sm text-navy-500 font-body mt-1">
                Storage used: {formatStorageSize(storageSize)}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleExportData}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-body font-medium shadow-clinical hover:shadow-clinical-hover transition-all duration-300"
              >
                📥 Export Data
              </motion.button>
            </div>
          </div>
        </motion.section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Settings Categories */}
          <div className="lg:col-span-2 space-y-8">
            {/* Notifications */}
            <motion.section variants={containerVariants}>
              <motion.div
                variants={itemVariants}
                className="bg-white/80 backdrop-blur-sm border border-gold-200/30 rounded-2xl p-6 shadow-luxury"
              >
                <div className="flex items-center space-x-3 mb-6">
                  <div className="text-2xl">🔔</div>
                  <div>
                    <h2 className="text-2xl font-heading font-semibold text-navy-900">
                      Notifications
                    </h2>
                    <p className="text-navy-600 font-body text-sm">
                      Manage your notification preferences
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {Object.entries(settings.notifications).map(([key, value]) => {
                    if (key === 'reminderTiming') {
                      return (
                        <div key={key} className="flex items-center justify-between p-4 bg-navy-50/30 rounded-xl border border-navy-100/50">
                          <div>
                            <h3 className="text-lg font-heading font-semibold text-navy-900 mb-1">
                              Reminder Timing
                            </h3>
                            <p className="text-navy-600 font-body text-sm">
                              When to send appointment reminders
                            </p>
                          </div>
                          <select
                            value={value as string}
                            onChange={(e) => handleSelectChange('notifications', key, e.target.value)}
                            className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm font-body text-navy-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                          >
                            <option value="1_week">1 week before</option>
                            <option value="24_hours">24 hours before</option>
                            <option value="2_hours">2 hours before</option>
                            <option value="30_minutes">30 minutes before</option>
                          </select>
                        </div>
                      );
                    }

                    return (
                      <div key={key} className="flex items-center justify-between p-4 bg-navy-50/30 rounded-xl border border-navy-100/50 hover:bg-navy-50/50 transition-colors duration-200">
                        <div>
                          <h3 className="text-lg font-heading font-semibold text-navy-900 mb-1 capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </h3>
                          <p className="text-navy-600 font-body text-sm">
                            {key === 'medication' && 'Get reminded when it\'s time to take your medications'}
                            {key === 'appointments' && 'Receive notifications about upcoming appointments'}
                            {key === 'insights' && 'Get AI-powered health insights and recommendations'}
                            {key === 'vitals' && 'Receive alerts when vital signs are outside normal ranges'}
                            {key === 'dailySummary' && 'Get a daily summary of your health metrics'}
                          </p>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleToggleSetting('notifications', key)}
                          className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                            value ? 'bg-teal-500' : 'bg-gray-300'
                          }`}
                        >
                          <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200 ${
                            value ? 'translate-x-7' : 'translate-x-1'
                          }`} />
                        </motion.button>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            </motion.section>

            {/* Privacy & Security */}
            <motion.section variants={containerVariants}>
              <motion.div
                variants={itemVariants}
                className="bg-white/80 backdrop-blur-sm border border-gold-200/30 rounded-2xl p-6 shadow-luxury"
              >
                <div className="flex items-center space-x-3 mb-6">
                  <div className="text-2xl">🔒</div>
                  <div>
                    <h2 className="text-2xl font-heading font-semibold text-navy-900">
                      Privacy & Security
                    </h2>
                    <p className="text-navy-600 font-body text-sm">
                      Control your data privacy and security settings
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {Object.entries(settings.privacy).map(([key, value]) => {
                    if (key === 'dataRetention') {
                      return (
                        <div key={key} className="flex items-center justify-between p-4 bg-navy-50/30 rounded-xl border border-navy-100/50">
                          <div>
                            <h3 className="text-lg font-heading font-semibold text-navy-900 mb-1">
                              Data Retention Period
                            </h3>
                            <p className="text-navy-600 font-body text-sm">
                              How long to keep your health data
                            </p>
                          </div>
                          <select
                            value={value as string}
                            onChange={(e) => handleSelectChange('privacy', key, e.target.value)}
                            className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm font-body text-navy-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                          >
                            <option value="1_year">1 year</option>
                            <option value="3_years">3 years</option>
                            <option value="5_years">5 years</option>
                            <option value="indefinite">Keep indefinitely</option>
                          </select>
                        </div>
                      );
                    }

                    return (
                      <div key={key} className="flex items-center justify-between p-4 bg-navy-50/30 rounded-xl border border-navy-100/50 hover:bg-navy-50/50 transition-colors duration-200">
                        <div>
                          <h3 className="text-lg font-heading font-semibold text-navy-900 mb-1 capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </h3>
                          <p className="text-navy-600 font-body text-sm">
                            {key === 'dataSharing' && 'Allow sharing anonymized data for medical research'}
                            {key === 'analytics' && 'Help improve the app by sharing anonymous usage data'}
                            {key === 'marketing' && 'Receive emails about new features and health tips'}
                            {key === 'biometricLock' && 'Use fingerprint or face recognition to secure your data'}
                            {key === 'autoBackup' && 'Automatically backup your health data to secure cloud storage'}
                          </p>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleToggleSetting('privacy', key)}
                          className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                            value ? 'bg-teal-500' : 'bg-gray-300'
                          }`}
                        >
                          <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200 ${
                            value ? 'translate-x-7' : 'translate-x-1'
                          }`} />
                        </motion.button>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            </motion.section>

            {/* Display & Accessibility */}
            <motion.section variants={containerVariants}>
              <motion.div
                variants={itemVariants}
                className="bg-white/80 backdrop-blur-sm border border-gold-200/30 rounded-2xl p-6 shadow-luxury"
              >
                <div className="flex items-center space-x-3 mb-6">
                  <div className="text-2xl">🎨</div>
                  <div>
                    <h2 className="text-2xl font-heading font-semibold text-navy-900">
                      Display & Accessibility
                    </h2>
                    <p className="text-navy-600 font-body text-sm">
                      Customize the app appearance and accessibility features
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {Object.entries(settings.display).map(([key, value]) => {
                    if (key === 'theme' || key === 'fontSize') {
                      return (
                        <div key={key} className="flex items-center justify-between p-4 bg-navy-50/30 rounded-xl border border-navy-100/50">
                          <div>
                            <h3 className="text-lg font-heading font-semibold text-navy-900 mb-1 capitalize">
                              {key === 'fontSize' ? 'Font Size' : 'App Theme'}
                            </h3>
                            <p className="text-navy-600 font-body text-sm">
                              {key === 'theme' && 'Choose your preferred app theme'}
                              {key === 'fontSize' && 'Adjust text size for better readability'}
                            </p>
                          </div>
                          <select
                            value={value as string}
                            onChange={(e) => handleSelectChange('display', key, e.target.value)}
                            className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm font-body text-navy-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                          >
                            {key === 'theme' && (
                              <>
                                <option value="light">Light</option>
                                <option value="dark">Dark</option>
                                <option value="system">System</option>
                              </>
                            )}
                            {key === 'fontSize' && (
                              <>
                                <option value="small">Small</option>
                                <option value="medium">Medium</option>
                                <option value="large">Large</option>
                                <option value="extra_large">Extra Large</option>
                              </>
                            )}
                          </select>
                        </div>
                      );
                    }

                    return (
                      <div key={key} className="flex items-center justify-between p-4 bg-navy-50/30 rounded-xl border border-navy-100/50 hover:bg-navy-50/50 transition-colors duration-200">
                        <div>
                          <h3 className="text-lg font-heading font-semibold text-navy-900 mb-1 capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </h3>
                          <p className="text-navy-600 font-body text-sm">
                            {key === 'highContrast' && 'Increase contrast for better visibility'}
                            {key === 'reduceAnimations' && 'Minimize motion effects for better accessibility'}
                            {key === 'colorBlindSupport' && 'Enable patterns and symbols for color identification'}
                          </p>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleToggleSetting('display', key)}
                          className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                            value ? 'bg-teal-500' : 'bg-gray-300'
                          }`}
                        >
                          <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200 ${
                            value ? 'translate-x-7' : 'translate-x-1'
                          }`} />
                        </motion.button>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            </motion.section>
          </div>

          {/* Right Column - Connected Devices & Account */}
          <div className="space-y-8">
            {/* Connected Devices */}
            <motion.section variants={containerVariants}>
              <motion.h2 
                variants={itemVariants}
                className="text-2xl font-heading font-semibold text-navy-900 mb-6"
              >
                Connected Devices
              </motion.h2>
              <div className="space-y-4">
                {devices.map((device, index) => (
                  <motion.div
                    key={device.id}
                    variants={itemVariants}
                    custom={index}
                    whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                    className="bg-white/80 backdrop-blur-sm border border-teal-200/30 rounded-xl p-4 shadow-clinical hover:shadow-clinical-hover transition-all duration-300"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-heading font-semibold text-navy-900 mb-1">
                          {device.name}
                        </h3>
                        <p className="text-navy-600 font-body text-sm mb-2">
                          {device.type}
                        </p>
                        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-body font-medium ${
                          device.status === 'connected' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          <div className={`w-2 h-2 rounded-full mr-2 ${
                            device.status === 'connected' ? 'bg-green-500 animate-pulse' : 'bg-red-500'
                          }`} />
                          {device.status}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-body text-navy-500 mb-1">
                          Battery: {device.batteryLevel}%
                        </div>
                        <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-300 ${
                              device.batteryLevel > 50 ? 'bg-green-500' :
                              device.batteryLevel > 20 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${device.batteryLevel}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mb-3">
                      <p className="text-xs font-body text-navy-500 mb-1">Data Types:</p>
                      <div className="flex flex-wrap gap-1">
                        {device.dataTypes.map((dataType, idx) => (
                          <span 
                            key={idx}
                            className="px-2 py-1 bg-teal-100 text-teal-700 text-xs font-body rounded-full"
                          >
                            {dataType}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs font-body text-navy-500 mb-3">
                      <span>Last sync: {new Date(device.lastSync).toLocaleString()}</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleSyncDevice(device.id)}
                        className="flex-1 py-2 bg-teal-100 hover:bg-teal-200 text-teal-700 rounded-lg font-body font-medium text-sm transition-colors duration-200"
                      >
                        {device.status === 'connected' ? 'Sync Now' : 'Reconnect'}
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>

            {/* Account Actions */}
            <motion.section variants={containerVariants}>
              <motion.h2 
                variants={itemVariants}
                className="text-2xl font-heading font-semibold text-navy-900 mb-6"
              >
                Account
              </motion.h2>
              <motion.div
                variants={itemVariants}
                className="bg-white/80 backdrop-blur-sm border border-gold-200/30 rounded-xl p-6 shadow-luxury"
              >
                <div className="space-y-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleExportData}
                    className="w-full p-4 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg text-blue-700 font-body font-medium text-left transition-colors duration-200 flex items-center justify-between"
                  >
                    <span>📥 Export Health Data</span>
                    <span className="text-xs">JSON</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => showSaveToast()}
                    className="w-full p-4 bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg text-green-700 font-body font-medium text-left transition-colors duration-200"
                  >
                    ☁️ Backup to Cloud
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => showSaveToast()}
                    className="w-full p-4 bg-yellow-50 hover:bg-yellow-100 border border-yellow-200 rounded-lg text-yellow-700 font-body font-medium text-left transition-colors duration-200"
                  >
                    🔑 Change Password
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleClearData}
                    className="w-full p-4 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg text-red-700 font-body font-medium text-left transition-colors duration-200"
                  >
                    🗑️ Delete All Data
                  </motion.button>
                </div>
              </motion.div>
            </motion.section>
          </div>
        </div>
      </motion.main>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-ivory-50 via-white to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gold-200 border-t-gold-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-navy-600 font-body">Loading settings...</p>
        </div>
      </div>
    }>
      <SettingsContent />
    </Suspense>
  );
}