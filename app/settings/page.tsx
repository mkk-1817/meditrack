'use client';

/**
 * Settings Page - Enhanced with HCI Components
 * Context Menus: Settings right-click options, device management
 * MegaMenu: Advanced settings navigation
 * Dialogs: Delete confirmation, export data
 * FloatingWindow: Theme customizer palette
 * Toasts: All setting change notifications
 */

import { Suspense, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { pageVariants, containerVariants, itemVariants } from '@/animations/motionVariants';
import { storage, STORAGE_KEYS, Settings as SettingsType } from '@/lib/localStorage';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { ContextMenu } from '@/components/HCIMenus';
import { Dialog, FloatingWindow, MessageWindow, ToastMessage } from '@/components/HCIWindows';

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
  const [storageSize, setStorageSize] = useState(0);

  // HCI States
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; type: 'setting' | 'device'; data: any } | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [themeWindowOpen, setThemeWindowOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

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

  // Apply theme settings to document
  useEffect(() => {
    if (!settings.display) return;

    const root = document.documentElement;

    // Apply theme
    if (settings.display.theme === 'dark') {
      root.classList.add('dark');
    } else if (settings.display.theme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) root.classList.add('dark');
      else root.classList.remove('dark');
    } else {
      root.classList.remove('dark');
    }

    // Apply font size
    const fontSizeMap = {
      small: '14px',
      medium: '16px',
      large: '18px',
      extra_large: '20px'
    };
    root.style.fontSize = fontSizeMap[settings.display.fontSize as keyof typeof fontSizeMap] || '16px';

    // Apply high contrast
    if (settings.display.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    // Apply reduce animations
    if (settings.display.reduceAnimations) {
      root.classList.add('reduce-animations');
      root.style.setProperty('--animation-duration', '0.01s');
    } else {
      root.classList.remove('reduce-animations');
      root.style.removeProperty('--animation-duration');
    }

    // Apply color blind support
    if (settings.display.colorBlindSupport) {
      root.classList.add('color-blind-support');
    } else {
      root.classList.remove('color-blind-support');
    }
  }, [settings.display]);

  // Handle notification settings
  useEffect(() => {
    if (!settings.notifications) return;

    // Request notification permission if any notification is enabled
    const anyNotificationEnabled = Object.values(settings.notifications).some(val => val === true);
    if (anyNotificationEnabled && 'Notification' in window) {
      if (Notification.permission === 'default') {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            showToast('Notifications Enabled', 'You will now receive health reminders', 'success');
          }
        });
      }
    }
  }, [settings.notifications]);

  // Handle auto backup
  useEffect(() => {
    if (!settings.privacy?.autoBackup) return;

    let backupInterval: NodeJS.Timeout;

    if (settings.privacy.autoBackup) {
      // Auto backup every 24 hours
      backupInterval = setInterval(() => {
        const data = storage.exportData();
        localStorage.setItem('meditrack-auto-backup', data);
        console.log('Auto backup completed at', new Date().toISOString());
      }, 24 * 60 * 60 * 1000); // 24 hours
    }

    return () => {
      if (backupInterval) clearInterval(backupInterval);
    };
  }, [settings.privacy?.autoBackup]);

  // Handle auto sync
  useEffect(() => {
    if (!settings.sync?.autoSync) return;

    let syncInterval: NodeJS.Timeout;

    if (settings.sync.autoSync) {
      const frequencyMap = {
        real_time: 1000, // 1 second
        hourly: 60 * 60 * 1000, // 1 hour
        daily: 24 * 60 * 60 * 1000, // 24 hours
        manual: 0 // no auto sync
      };

      const interval = frequencyMap[settings.sync.frequency as keyof typeof frequencyMap] || 0;

      if (interval > 0 && (!settings.sync.wifiOnly || navigator.onLine)) {
        syncInterval = setInterval(() => {
          // Sync all connected devices
          const connectedDevices = devices.filter(d => d.status === 'connected');
          connectedDevices.forEach(device => {
            handleSyncDevice(device.id);
          });
          console.log('Auto sync completed at', new Date().toISOString());
        }, interval);
      }
    }

    return () => {
      if (syncInterval) clearInterval(syncInterval);
    };
  }, [settings.sync, devices]);

  const handleToggleSetting = (category: keyof SettingsType, key: string) => {
    const newValue = !settings[category][key as keyof typeof settings[typeof category]];
    
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: newValue
      }
    }));
    
    showToast('Setting Updated', `${key} has been ${newValue ? 'enabled' : 'disabled'}`, 'success');

    // Special handling for specific settings
    if (category === 'notifications' && key === 'medicationReminders' && newValue) {
      // Request notification permission
      if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            new Notification('Medication Reminders Enabled', {
              body: 'You will now receive reminders for your medications',
              icon: '/favicon.ico'
            });
          }
        });
      }
    }

    if (category === 'privacy' && key === 'biometricLock' && newValue) {
      showToast('Biometric Lock', 'Biometric authentication will be required on next login', 'info');
    }

    if (category === 'sync' && key === 'autoSync' && newValue) {
      showToast('Auto Sync Enabled', `Syncing every ${settings.sync?.frequency || 'hour'}`, 'success');
    }
  };

  const handleSelectChange = (category: keyof SettingsType, key: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
    showToast('Setting Changed', `${key} updated to ${value}`, 'success');
  };

  const showToast = (title: string, message: string, type: 'success' | 'error' | 'warning' | 'info' = 'success') => {
    const newToast: ToastMessage = {
      id: Date.now().toString(),
      type,
      title,
      message,
      duration: 3000
    };
    setToasts(prev => [...prev, newToast]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const handleSyncDevice = (deviceId: number) => {
    setDevices(prev => prev.map(device => 
      device.id === deviceId 
        ? { ...device, lastSync: new Date().toISOString(), status: 'connected' }
        : device
    ));
    showToast('Device Synced', 'Device data synchronized successfully', 'success');
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
    setExportDialogOpen(false);
    showToast('Export Complete', 'Your health data has been exported', 'success');
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const jsonData = e.target?.result as string;
        // Validate JSON format
        JSON.parse(jsonData);
        
        // Import the data
        storage.importData(jsonData);
        
        setImportDialogOpen(false);
        showToast('Import Complete', 'Your health data has been imported successfully', 'success');
        setTimeout(() => window.location.reload(), 1500);
      } catch (error) {
        showToast('Import Failed', 'Invalid data format. Please check your file.', 'error');
      }
    };
    reader.readAsText(file);
  };

  const handleClearData = () => {
    storage.clearAll();
    storage.initializeDefaults();
    setDeleteDialogOpen(false);
    showToast('Data Deleted', 'All data cleared. Reloading...', 'info');
    setTimeout(() => window.location.reload(), 1500);
  };

  const handleCloudBackup = () => {
    showToast('Backup Started', 'Backing up your data to cloud...', 'info');
    
    // Simulate cloud backup
    setTimeout(() => {
      const data = storage.exportData();
      // In real app, this would upload to cloud service
      localStorage.setItem('meditrack-cloud-backup', data);
      localStorage.setItem('meditrack-last-backup', new Date().toISOString());
      
      showToast('Backup Complete', 'Your data has been backed up successfully', 'success');
    }, 2000);
  };

  const handleChangePassword = () => {
    showToast('Change Password', 'Opening password change dialog...', 'info');
    
    // Simulate password change
    setTimeout(() => {
      const newPassword = prompt('Enter new password (demo only):');
      if (newPassword && newPassword.length >= 8) {
        localStorage.setItem('meditrack-password-changed', new Date().toISOString());
        showToast('Password Updated', 'Your password has been changed successfully', 'success');
      } else if (newPassword) {
        showToast('Password Too Short', 'Password must be at least 8 characters', 'error');
      }
    }, 500);
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

      {/* Toast Notifications */}
      <MessageWindow
        messages={toasts}
        onDismiss={removeToast}
        position="top-right"
      />

      {/* Context Menu - Settings Options */}
      {contextMenu && contextMenu.type === 'setting' && (
        <ContextMenu
          items={[
            {
              id: 'toggle',
              label: contextMenu.data.value ? "Disable" : "Enable",
              icon: contextMenu.data.value ? "🔕" : "🔔",
              action: () => {
                handleToggleSetting(contextMenu.data.category, contextMenu.data.key);
                setContextMenu(null);
              }
            },
            {
              id: 'reset',
              label: "Reset to Default",
              icon: "🔄",
              action: () => {
                handleToggleSetting(contextMenu.data.category, contextMenu.data.key);
                showToast('Reset', `${contextMenu.data.key} reset to default`, 'info');
                setContextMenu(null);
              }
            },
            {
              id: 'info',
              label: "Learn More",
              icon: "ℹ️",
              action: () => {
                showToast('Info', `Configure ${contextMenu.data.key} settings`, 'info');
                setContextMenu(null);
              }
            }
          ]}
          position={{ x: contextMenu.x, y: contextMenu.y }}
          onClose={() => setContextMenu(null)}
        />
      )}

      {/* Context Menu - Device Actions */}
      {contextMenu && contextMenu.type === 'device' && (
        <ContextMenu
          items={[
            {
              id: 'sync',
              label: contextMenu.data.status === 'connected' ? "Sync Now" : "Reconnect",
              icon: "🔄",
              action: () => {
                handleSyncDevice(contextMenu.data.id);
                setContextMenu(null);
              }
            },
            {
              id: 'details',
              label: "View Details",
              icon: "ℹ️",
              action: () => {
                showToast('Device Info', `${contextMenu.data.name} - Battery: ${contextMenu.data.batteryLevel}%`, 'info');
                setContextMenu(null);
              }
            },
            {
              id: 'sync-settings',
              label: "Sync Settings",
              icon: "⚙️",
              action: () => {},
              submenu: [
                {
                  id: 'realtime',
                  label: "Real-time Sync",
                  icon: "⚡",
                  action: () => {
                    showToast('Sync Updated', 'Real-time sync enabled', 'success');
                    setContextMenu(null);
                  }
                },
                {
                  id: 'hourly',
                  label: "Hourly Sync",
                  icon: "⏰",
                  action: () => {
                    showToast('Sync Updated', 'Hourly sync enabled', 'success');
                    setContextMenu(null);
                  }
                },
                {
                  id: 'daily',
                  label: "Daily Sync",
                  icon: "📅",
                  action: () => {
                    showToast('Sync Updated', 'Daily sync enabled', 'success');
                    setContextMenu(null);
                  }
                }
              ]
            },
            {
              id: 'remove',
              label: "Remove Device",
              icon: "🗑️",
              danger: true,
              action: () => {
                setDevices(prev => prev.filter(d => d.id !== contextMenu.data.id));
                showToast('Device Removed', `${contextMenu.data.name} has been removed`, 'success');
                setContextMenu(null);
              }
            }
          ]}
          position={{ x: contextMenu.x, y: contextMenu.y }}
          onClose={() => setContextMenu(null)}
        />
      )}

      {/* Dialog - Delete Confirmation */}
      <Dialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        title="Delete All Data"
        type="error"
        size="md"
      >
        <div className="space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <h3 className="text-lg font-heading font-semibold text-red-900 mb-2">
                  Warning: Permanent Action
                </h3>
                <p className="text-red-700 font-body text-sm mb-2">
                  This will permanently delete all your health data, including:
                </p>
                <ul className="mt-2 space-y-1 text-red-700 font-body text-sm">
                  <li>• All vital signs and measurements</li>
                  <li>• Medical history and records</li>
                  <li>• Appointments and schedules</li>
                  <li>• AI insights and analytics</li>
                  <li>• Connected device settings</li>
                </ul>
              </div>
            </div>
          </div>
          <p className="text-navy-700 font-body">
            This action cannot be undone. Consider exporting your data first.
          </p>
          <div className="flex items-center space-x-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleClearData}
              className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-body font-medium"
            >
              Delete All Data
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setDeleteDialogOpen(false)}
              className="flex-1 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-body font-medium"
            >
              Cancel
            </motion.button>
          </div>
        </div>
      </Dialog>

      {/* Dialog - Export Data */}
      <Dialog
        isOpen={exportDialogOpen}
        onClose={() => setExportDialogOpen(false)}
        title="Export Health Data"
        type="default"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-navy-700 font-body">
            Your health data will be exported as a JSON file.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-lg font-heading font-semibold text-blue-900 mb-2">
              What's included:
            </h3>
            <ul className="space-y-1 text-blue-700 font-body text-sm">
              <li>✓ All vital signs and measurements</li>
              <li>✓ Medical history and profile</li>
              <li>✓ Appointments and schedules</li>
              <li>✓ AI insights and recommendations</li>
              <li>✓ App settings and preferences</li>
            </ul>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <p className="text-gray-600 font-body text-sm">
              <strong>File size:</strong> ~{formatStorageSize(storageSize)}
            </p>
            <p className="text-gray-600 font-body text-sm mt-1">
              <strong>Format:</strong> JSON
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleExportData}
              className="flex-1 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-body font-medium"
            >
              📥 Export Now
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setExportDialogOpen(false)}
              className="flex-1 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-body font-medium"
            >
              Cancel
            </motion.button>
          </div>
        </div>
      </Dialog>

      {/* Dialog - Import Data */}
      <Dialog
        isOpen={importDialogOpen}
        onClose={() => setImportDialogOpen(false)}
        title="Import Health Data"
        type="default"
        size="md"
      >
        <div className="space-y-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <h3 className="text-lg font-heading font-semibold text-yellow-900 mb-2">
                  Import Warning
                </h3>
                <p className="text-yellow-700 font-body text-sm">
                  Importing data will merge with or replace your current data. Make sure you have a backup before proceeding.
                </p>
              </div>
            </div>
          </div>
          <p className="text-navy-700 font-body">
            Select a JSON file exported from MediTrack to import your health data.
          </p>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <input
              type="file"
              accept=".json"
              onChange={handleImportData}
              className="hidden"
              id="import-file"
            />
            <label
              htmlFor="import-file"
              className="cursor-pointer"
            >
              <div className="text-4xl mb-2">📁</div>
              <p className="text-navy-900 font-body font-medium mb-1">
                Choose a file
              </p>
              <p className="text-navy-600 font-body text-sm">
                Click to browse for a JSON file
              </p>
            </label>
          </div>
          <div className="flex items-center space-x-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setImportDialogOpen(false)}
              className="flex-1 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-body font-medium"
            >
              Cancel
            </motion.button>
          </div>
        </div>
      </Dialog>

      {/* Floating Window - Theme Customizer */}
      {themeWindowOpen && (
        <FloatingWindow
          title="🎨 Theme Customizer"
          onClose={() => setThemeWindowOpen(false)}
          initialPosition={{ x: window.innerWidth / 2 - 200, y: 100 }}
          isOpen={themeWindowOpen}
        >
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-heading font-semibold text-navy-900 mb-3">
                Color Palette
              </h3>
              <div className="grid grid-cols-4 gap-3">
                {[
                  { name: 'Gold', color: '#C79549' },
                  { name: 'Teal', color: '#1B4D4F' },
                  { name: 'Navy', color: '#2B3A67' },
                  { name: 'Ivory', color: '#F8F5F0' },
                  { name: 'Blue', color: '#3B82F6' },
                  { name: 'Green', color: '#10B981' },
                  { name: 'Purple', color: '#8B5CF6' },
                  { name: 'Pink', color: '#EC4899' }
                ].map(({ name, color }) => (
                  <motion.button
                    key={name}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => showToast('Theme Applied', `${name} theme activated`, 'success')}
                    className="aspect-square rounded-lg border-2 border-gray-200 hover:border-gray-400"
                    style={{ backgroundColor: color }}
                    title={name}
                  >
                    <span className="text-xs font-body font-semibold text-white drop-shadow-md">
                      {name}
                    </span>
                  </motion.button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-heading font-semibold text-navy-900 mb-3">
                Font Size
              </h3>
              <div className="space-y-2">
                {['small', 'medium', 'large', 'extra_large'].map(size => (
                  <motion.button
                    key={size}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      handleSelectChange('display', 'fontSize', size);
                    }}
                    className={`w-full py-2 px-4 rounded-lg border-2 transition-colors text-left ${
                      settings.display.fontSize === size
                        ? 'border-teal-500 bg-teal-50 text-teal-900'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    <span className={`font-body font-medium ${
                      size === 'small' ? 'text-sm' :
                      size === 'medium' ? 'text-base' :
                      size === 'large' ? 'text-lg' : 'text-xl'
                    }`}>
                      {size.replace('_', ' ').toUpperCase()}
                    </span>
                  </motion.button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-heading font-semibold text-navy-900 mb-3">
                Accessibility
              </h3>
              <div className="space-y-2">
                <label className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                  <input
                    type="checkbox"
                    checked={settings.display.highContrast}
                    onChange={() => handleToggleSetting('display', 'highContrast')}
                    className="w-5 h-5 text-teal-500 rounded"
                  />
                  <span className="font-body text-navy-700">High Contrast</span>
                </label>
                <label className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                  <input
                    type="checkbox"
                    checked={settings.display.reduceAnimations}
                    onChange={() => handleToggleSetting('display', 'reduceAnimations')}
                    className="w-5 h-5 text-teal-500 rounded"
                  />
                  <span className="font-body text-navy-700">Reduce Animations</span>
                </label>
                <label className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                  <input
                    type="checkbox"
                    checked={settings.display.colorBlindSupport}
                    onChange={() => handleToggleSetting('display', 'colorBlindSupport')}
                    className="w-5 h-5 text-teal-500 rounded"
                  />
                  <span className="font-body text-navy-700">Color Blind Support</span>
                </label>
              </div>
            </div>
          </div>
        </FloatingWindow>
      )}

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
                onClick={() => setThemeWindowOpen(true)}
                className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-body font-medium shadow-clinical hover:shadow-clinical-hover transition-all duration-300"
              >
                🎨 Customize Theme
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setExportDialogOpen(true)}
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
                      <div 
                        key={key} 
                        className="flex items-center justify-between p-4 bg-navy-50/30 rounded-xl border border-navy-100/50 hover:bg-navy-50/50 transition-colors duration-200 cursor-context-menu"
                        onContextMenu={(e) => {
                          e.preventDefault();
                          setContextMenu({
                            x: e.clientX,
                            y: e.clientY,
                            type: 'setting',
                            data: { key, value, category: 'notifications' }
                          });
                        }}
                      >
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

            {/* Units & Measurements */}
            <motion.section variants={containerVariants}>
              <motion.div
                variants={itemVariants}
                className="bg-white/80 backdrop-blur-sm border border-gold-200/30 rounded-2xl p-6 shadow-luxury"
              >
                <div className="flex items-center space-x-3 mb-6">
                  <div className="text-2xl">📏</div>
                  <div>
                    <h2 className="text-2xl font-heading font-semibold text-navy-900">
                      Units & Measurements
                    </h2>
                    <p className="text-navy-600 font-body text-sm">
                      Choose your preferred units for health metrics
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {Object.entries(settings.units).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between p-4 bg-navy-50/30 rounded-xl border border-navy-100/50">
                      <div>
                        <h3 className="text-lg font-heading font-semibold text-navy-900 mb-1 capitalize">
                          {key === 'bloodPressure' ? 'Blood Pressure' : key}
                        </h3>
                        <p className="text-navy-600 font-body text-sm">
                          {key === 'weight' && 'Select your preferred weight unit'}
                          {key === 'height' && 'Select your preferred height unit'}
                          {key === 'temperature' && 'Select your preferred temperature unit'}
                          {key === 'bloodPressure' && 'Select your preferred blood pressure unit'}
                        </p>
                      </div>
                      <select
                        value={value as string}
                        onChange={(e) => handleSelectChange('units', key, e.target.value)}
                        className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm font-body text-navy-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      >
                        {key === 'weight' && (
                          <>
                            <option value="lbs">Pounds (lbs)</option>
                            <option value="kg">Kilograms (kg)</option>
                          </>
                        )}
                        {key === 'height' && (
                          <>
                            <option value="ft_in">Feet & Inches</option>
                            <option value="cm">Centimeters (cm)</option>
                            <option value="m">Meters (m)</option>
                          </>
                        )}
                        {key === 'temperature' && (
                          <>
                            <option value="fahrenheit">Fahrenheit (°F)</option>
                            <option value="celsius">Celsius (°C)</option>
                          </>
                        )}
                        {key === 'bloodPressure' && (
                          <>
                            <option value="mmhg">mmHg</option>
                            <option value="kpa">kPa</option>
                          </>
                        )}
                      </select>
                    </div>
                  ))}
                </div>
              </motion.div>
            </motion.section>

            {/* Sync & Backup */}
            <motion.section variants={containerVariants}>
              <motion.div
                variants={itemVariants}
                className="bg-white/80 backdrop-blur-sm border border-gold-200/30 rounded-2xl p-6 shadow-luxury"
              >
                <div className="flex items-center space-x-3 mb-6">
                  <div className="text-2xl">🔄</div>
                  <div>
                    <h2 className="text-2xl font-heading font-semibold text-navy-900">
                      Sync & Backup
                    </h2>
                    <p className="text-navy-600 font-body text-sm">
                      Manage data synchronization and backup preferences
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {Object.entries(settings.sync).map(([key, value]) => {
                    if (key === 'frequency') {
                      return (
                        <div key={key} className="flex items-center justify-between p-4 bg-navy-50/30 rounded-xl border border-navy-100/50">
                          <div>
                            <h3 className="text-lg font-heading font-semibold text-navy-900 mb-1">
                              Sync Frequency
                            </h3>
                            <p className="text-navy-600 font-body text-sm">
                              How often to sync your health data
                            </p>
                          </div>
                          <select
                            value={value as string}
                            onChange={(e) => handleSelectChange('sync', key, e.target.value)}
                            className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm font-body text-navy-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                          >
                            <option value="real_time">Real-time</option>
                            <option value="hourly">Hourly</option>
                            <option value="daily">Daily</option>
                            <option value="manual">Manual only</option>
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
                            {key === 'autoSync' && 'Automatically sync data when changes are made'}
                            {key === 'wifiOnly' && 'Only sync when connected to WiFi to save data'}
                          </p>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleToggleSetting('sync', key)}
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
                    onContextMenu={(e) => {
                      e.preventDefault();
                      setContextMenu({
                        x: e.clientX,
                        y: e.clientY,
                        type: 'device',
                        data: device
                      });
                    }}
                    className="bg-white/80 backdrop-blur-sm border border-teal-200/30 rounded-xl p-4 shadow-clinical hover:shadow-clinical-hover transition-all duration-300 cursor-context-menu"
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
                    onClick={() => setImportDialogOpen(true)}
                    className="w-full p-4 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg text-purple-700 font-body font-medium text-left transition-colors duration-200 flex items-center justify-between"
                  >
                    <span>📤 Import Health Data</span>
                    <span className="text-xs">JSON</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setExportDialogOpen(true)}
                    className="w-full p-4 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg text-blue-700 font-body font-medium text-left transition-colors duration-200 flex items-center justify-between"
                  >
                    <span>📥 Export Health Data</span>
                    <span className="text-xs">JSON</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCloudBackup}
                    className="w-full p-4 bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg text-green-700 font-body font-medium text-left transition-colors duration-200"
                  >
                    ☁️ Backup to Cloud
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleChangePassword}
                    className="w-full p-4 bg-yellow-50 hover:bg-yellow-100 border border-yellow-200 rounded-lg text-yellow-700 font-body font-medium text-left transition-colors duration-200"
                  >
                    🔑 Change Password
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setDeleteDialogOpen(true)}
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