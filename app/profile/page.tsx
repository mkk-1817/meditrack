'use client';

/**
 * Profile Page - Enhanced with HCI Components
 * TabbedWindow (Personal/Medical/Goals), Context Menus, FloatingWindow for Achievements
 */

import { Suspense, useState } from 'react';
import { motion } from 'framer-motion';
import { pageVariants, containerVariants, itemVariants } from '@/animations/motionVariants';
import { ContextMenu, ContextMenuItem, PieMenu, PieMenuItem } from '@/components/HCIMenus';
import { Dialog, TabbedWindow, Tab, MessageWindow, ToastMessage, FloatingWindow } from '@/components/HCIWindows';

interface Goal {
  id: number;
  category: 'fitness' | 'nutrition' | 'sleep' | 'wellness';
  title: string;
  target: number;
  current: number;
  unit: string;
  progress: number;
}

interface Achievement {
  id: number;
  title: string;
  description: string;
  icon: string;
  date: string;
  category: string;
}

function ProfileContent() {
  const [contextMenu, setContextMenu] = useState<{ items: ContextMenuItem[]; position: { x: number; y: number } } | null>(null);
  const [pieMenu, setPieMenu] = useState<{ items: PieMenuItem[]; center: { x: number; y: number } } | null>(null);
  const [dialogState, setDialogState] = useState<{ 
    isOpen: boolean; 
    type: 'edit-personal' | 'edit-medical' | 'edit-goal' | 'add-goal' | 'delete-goal'; 
    data?: any 
  }>({ isOpen: false, type: 'edit-personal' });
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [achievementWindow, setAchievementWindow] = useState<{ isOpen: boolean; data?: Achievement }>({ isOpen: false });

  const showToast = (type: ToastMessage['type'], title: string, message: string) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, type, title, message, duration: 3000 }]);
  };

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

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
    goals: [
      {
        id: 1,
        category: 'fitness' as const,
        title: 'Daily Steps',
        target: 8000,
        current: 7500,
        unit: 'steps',
        progress: 94
      },
      {
        id: 2,
        category: 'nutrition' as const,
        title: 'Water Intake',
        target: 2.5,
        current: 2.1,
        unit: 'liters',
        progress: 84
      },
      {
        id: 3,
        category: 'sleep' as const,
        title: 'Sleep Duration',
        target: 8,
        current: 7.5,
        unit: 'hours',
        progress: 94
      },
      {
        id: 4,
        category: 'wellness' as const,
        title: 'Meditation',
        target: 15,
        current: 12,
        unit: 'minutes',
        progress: 80
      }
    ]
  };

  const achievements: Achievement[] = [
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

  // Context menu for goals
  const handleGoalContextMenu = (e: React.MouseEvent, goal: Goal) => {
    e.preventDefault();
    setContextMenu({
      position: { x: e.clientX, y: e.clientY },
      items: [
        {
          id: 'edit',
          label: 'Edit Goal',
          icon: '✏️',
          action: () => {
            setDialogState({ isOpen: true, type: 'edit-goal', data: goal });
            setContextMenu(null);
          }
        },
        {
          id: 'update',
          label: 'Update Progress',
          icon: '📊',
          action: () => {
            showToast('info', 'Update Progress', 'Opening progress editor');
            setContextMenu(null);
          }
        },
        {
          id: 'complete',
          label: 'Mark as Complete',
          icon: '✓',
          action: () => {
            showToast('success', 'Completed!', `${goal.title} marked as complete`);
            setContextMenu(null);
          }
        },
        {
          id: 'divider-1',
          label: '',
          icon: '',
          action: () => {},
          divider: true
        },
        {
          id: 'share',
          label: 'Share Progress',
          icon: '📤',
          action: () => {
            showToast('success', 'Shared!', 'Progress shared with your doctor');
            setContextMenu(null);
          }
        },
        {
          id: 'history',
          label: 'View History',
          icon: '📈',
          action: () => {
            showToast('info', 'History', 'Loading goal history');
            setContextMenu(null);
          }
        },
        {
          id: 'divider-2',
          label: '',
          icon: '',
          action: () => {},
          divider: true
        },
        {
          id: 'delete',
          label: 'Delete Goal',
          icon: '🗑️',
          danger: true,
          action: () => {
            setDialogState({ isOpen: true, type: 'delete-goal', data: goal });
            setContextMenu(null);
          }
        }
      ]
    });
  };

  // Pie menu for goals
  const handleGoalPieMenu = (e: React.MouseEvent, goal: Goal) => {
    setPieMenu({
      center: { x: e.clientX, y: e.clientY },
      items: [
        {
          id: 'edit',
          label: 'Edit',
          icon: '✏️',
          color: '#C79549',
          action: () => {
            setDialogState({ isOpen: true, type: 'edit-goal', data: goal });
            setPieMenu(null);
          }
        },
        {
          id: 'update',
          label: 'Update',
          icon: '📊',
          color: '#1B4D4F',
          action: () => {
            showToast('info', 'Update', 'Opening progress editor');
            setPieMenu(null);
          }
        },
        {
          id: 'complete',
          label: 'Complete',
          icon: '✓',
          color: '#10B981',
          action: () => {
            showToast('success', 'Completed!', `${goal.title} marked as complete`);
            setPieMenu(null);
          }
        },
        {
          id: 'delete',
          label: 'Delete',
          icon: '🗑️',
          color: '#EF4444',
          action: () => {
            setDialogState({ isOpen: true, type: 'delete-goal', data: goal });
            setPieMenu(null);
          }
        }
      ]
    });
  };

  // Handle dialog actions
  const handleDialogConfirm = () => {
    if (dialogState.type === 'edit-personal') {
      showToast('success', 'Updated!', 'Personal information updated successfully');
    } else if (dialogState.type === 'edit-medical') {
      showToast('success', 'Updated!', 'Medical information updated successfully');
    } else if (dialogState.type === 'edit-goal') {
      showToast('success', 'Updated!', 'Goal updated successfully');
    } else if (dialogState.type === 'add-goal') {
      showToast('success', 'Added!', 'New goal created');
    } else if (dialogState.type === 'delete-goal') {
      showToast('success', 'Deleted', 'Goal removed');
    }
    setDialogState({ isOpen: false, type: 'edit-personal' });
  };

  // Personal Info Tab Content
  const PersonalInfoTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-heading font-bold text-navy-900">Personal Information</h3>
        <button
          onClick={() => setDialogState({ isOpen: true, type: 'edit-personal' })}
          className="px-4 py-2 bg-gold-600 hover:bg-gold-700 text-white rounded-lg font-body font-medium transition-colors"
        >
          ✏️ Edit
        </button>
      </div>

      <div className="bg-white/80 backdrop-blur-sm border border-gold-200/30 rounded-xl p-6 shadow-luxury">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-body font-medium text-navy-600 mb-2 block">First Name</label>
            <div className="text-lg font-body text-navy-900">{userProfile.personal.firstName}</div>
          </div>
          <div>
            <label className="text-sm font-body font-medium text-navy-600 mb-2 block">Last Name</label>
            <div className="text-lg font-body text-navy-900">{userProfile.personal.lastName}</div>
          </div>
          <div>
            <label className="text-sm font-body font-medium text-navy-600 mb-2 block">Email</label>
            <div className="text-lg font-body text-navy-900">{userProfile.personal.email}</div>
          </div>
          <div>
            <label className="text-sm font-body font-medium text-navy-600 mb-2 block">Phone</label>
            <div className="text-lg font-body text-navy-900">{userProfile.personal.phone}</div>
          </div>
          <div>
            <label className="text-sm font-body font-medium text-navy-600 mb-2 block">Date of Birth</label>
            <div className="text-lg font-body text-navy-900">
              {new Date(userProfile.personal.dateOfBirth).toLocaleDateString()}
            </div>
          </div>
          <div>
            <label className="text-sm font-body font-medium text-navy-600 mb-2 block">Gender</label>
            <div className="text-lg font-body text-navy-900">{userProfile.personal.gender}</div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200/50">
          <h4 className="text-lg font-heading font-semibold text-navy-900 mb-4">Emergency Contact</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-body font-medium text-navy-600 mb-2 block">Name</label>
              <div className="text-lg font-body text-navy-900">{userProfile.personal.emergencyContact.name}</div>
            </div>
            <div>
              <label className="text-sm font-body font-medium text-navy-600 mb-2 block">Relationship</label>
              <div className="text-lg font-body text-navy-900">{userProfile.personal.emergencyContact.relationship}</div>
            </div>
            <div>
              <label className="text-sm font-body font-medium text-navy-600 mb-2 block">Phone</label>
              <div className="text-lg font-body text-navy-900">{userProfile.personal.emergencyContact.phone}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Medical History Tab Content
  const MedicalHistoryTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-heading font-bold text-navy-900">Medical Information</h3>
        <button
          onClick={() => setDialogState({ isOpen: true, type: 'edit-medical' })}
          className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-body font-medium transition-colors"
        >
          ✏️ Edit
        </button>
      </div>

      <div className="bg-white/80 backdrop-blur-sm border border-teal-200/30 rounded-xl p-6 shadow-clinical">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <label className="text-sm font-body font-medium text-navy-600 mb-2 block">Blood Type</label>
            <div className="text-lg font-body text-navy-900">{userProfile.medical.bloodType}</div>
          </div>
          <div>
            <label className="text-sm font-body font-medium text-navy-600 mb-2 block">Height</label>
            <div className="text-lg font-body text-navy-900">{userProfile.medical.height}</div>
          </div>
          <div>
            <label className="text-sm font-body font-medium text-navy-600 mb-2 block">Weight</label>
            <div className="text-lg font-body text-navy-900">{userProfile.medical.weight}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="text-sm font-body font-medium text-navy-600 mb-2 block">Allergies</label>
            <div className="space-y-1">
              {userProfile.medical.allergies.map((allergy, index) => (
                <span key={index} className="inline-block bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-body mr-2 mb-1">
                  {allergy}
                </span>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm font-body font-medium text-navy-600 mb-2 block">Current Medications</label>
            <div className="space-y-1">
              {userProfile.medical.medications.map((medication, index) => (
                <span key={index} className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-body mr-2 mb-1">
                  {medication}
                </span>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm font-body font-medium text-navy-600 mb-2 block">Medical Conditions</label>
            <div className="space-y-1">
              {userProfile.medical.conditions.map((condition, index) => (
                <span key={index} className="inline-block bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-body mr-2 mb-1">
                  {condition}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200/50">
          <h4 className="text-lg font-heading font-semibold text-navy-900 mb-4">Primary Physician</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-body font-medium text-navy-600 mb-2 block">Name & Specialty</label>
              <div className="text-lg font-body text-navy-900">{userProfile.medical.physician.name}</div>
              <div className="text-sm font-body text-navy-500">{userProfile.medical.physician.specialty}</div>
            </div>
            <div>
              <label className="text-sm font-body font-medium text-navy-600 mb-2 block">Contact Information</label>
              <div className="text-lg font-body text-navy-900">{userProfile.medical.physician.phone}</div>
              <div className="text-sm font-body text-navy-500">{userProfile.medical.physician.email}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Goals & Achievements Tab Content
  const GoalsAchievementsTab = () => (
    <div className="space-y-6">
      {/* Health Goals Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-heading font-bold text-navy-900">Health Goals</h3>
          <button
            onClick={() => setDialogState({ isOpen: true, type: 'add-goal' })}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-body font-medium transition-colors"
          >
            ➕ Add Goal
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {userProfile.goals.map((goal, index) => (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onContextMenu={(e) => handleGoalContextMenu(e, goal)}
              onDoubleClick={(e) => handleGoalPieMenu(e, goal)}
              className="bg-white/80 backdrop-blur-sm border border-gold-200/30 rounded-xl p-4 shadow-luxury hover:shadow-luxury-hover transition-all cursor-pointer"
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-lg font-heading font-semibold text-navy-900">{goal.title}</h4>
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
      </div>

      {/* Achievements Section */}
      <div>
        <h3 className="text-2xl font-heading font-bold text-navy-900 mb-4">Recent Achievements</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {achievements.map((achievement, index) => (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => setAchievementWindow({ isOpen: true, data: achievement })}
              className="bg-white/80 backdrop-blur-sm border border-teal-200/30 rounded-xl p-4 shadow-clinical hover:shadow-clinical-hover transition-all cursor-pointer"
            >
              <div className="flex items-start space-x-3">
                <div className="text-3xl">{achievement.icon}</div>
                <div className="flex-1">
                  <h4 className="text-lg font-heading font-semibold text-navy-900 mb-1">
                    {achievement.title}
                  </h4>
                  <p className="text-navy-600 font-body text-sm mb-2">{achievement.description}</p>
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
      </div>
    </div>
  );

  const tabs: Tab[] = [
    {
      id: 'personal',
      label: 'Personal Info',
      icon: '👤',
      content: <PersonalInfoTab />
    },
    {
      id: 'medical',
      label: 'Medical History',
      icon: '🏥',
      content: <MedicalHistoryTab />
    },
    {
      id: 'goals',
      label: 'Goals & Achievements',
      icon: '🎯',
      badge: userProfile.goals.length,
      content: <GoalsAchievementsTab />
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
              <h1 className="text-4xl font-heading font-bold text-navy-900 mb-2">My Profile</h1>
              <p className="text-lg text-navy-600 font-body">
                Manage your personal information and health preferences
              </p>
            </div>
          </div>
        </motion.section>

        {/* Tabbed Content */}
        <motion.section variants={containerVariants}>
          <TabbedWindow
            defaultTab="personal"
            tabs={tabs}
            onChange={(tabId) => {
              showToast('info', 'Tab Changed', `Viewing ${tabs.find(t => t.id === tabId)?.label}`);
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

      {/* Achievement Floating Window */}
      <FloatingWindow
        isOpen={achievementWindow.isOpen}
        onClose={() => setAchievementWindow({ isOpen: false })}
        title={achievementWindow.data?.title || 'Achievement Details'}
        initialPosition={{ x: window.innerWidth / 2 - 200, y: window.innerHeight / 2 - 200 }}
        width={400}
        height={350}
      >
        {achievementWindow.data && (
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-7xl mb-4">{achievementWindow.data.icon}</div>
              <h3 className="text-2xl font-heading font-bold text-navy-900 mb-2">
                {achievementWindow.data.title}
              </h3>
              <p className="text-navy-600 font-body leading-relaxed mb-4">
                {achievementWindow.data.description}
              </p>
            </div>

            <div className="bg-gradient-to-r from-teal-50 to-gold-50 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-navy-600 font-body mb-1">Category</div>
                  <div className="text-base font-body font-semibold text-navy-900 capitalize">
                    {achievementWindow.data.category}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-navy-600 font-body mb-1">Earned On</div>
                  <div className="text-base font-body font-semibold text-navy-900">
                    {new Date(achievementWindow.data.date).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => {
                  showToast('success', 'Shared!', 'Achievement shared on social media');
                  setAchievementWindow({ isOpen: false });
                }}
                className="flex-1 px-4 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-body font-medium transition-colors"
              >
                📤 Share
              </button>
              <button
                onClick={() => {
                  showToast('success', 'Downloaded!', 'Certificate saved');
                  setAchievementWindow({ isOpen: false });
                }}
                className="flex-1 px-4 py-3 bg-gold-600 hover:bg-gold-700 text-white rounded-lg font-body font-medium transition-colors"
              >
                📥 Download
              </button>
            </div>
          </div>
        )}
      </FloatingWindow>

      {/* Edit Personal Info Dialog */}
      <Dialog
        isOpen={dialogState.isOpen && dialogState.type === 'edit-personal'}
        onClose={() => setDialogState({ isOpen: false, type: 'edit-personal' })}
        title="Edit Personal Information"
        type="default"
        size="lg"
        actions={
          <>
            <button
              onClick={() => setDialogState({ isOpen: false, type: 'edit-personal' })}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-body font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDialogConfirm}
              className="px-4 py-2 bg-gold-600 hover:bg-gold-700 text-white rounded-lg font-body font-medium transition-colors"
            >
              Save Changes
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-body font-medium text-navy-700 mb-1">First Name</label>
              <input
                type="text"
                defaultValue={userProfile.personal.firstName}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent font-body"
              />
            </div>
            <div>
              <label className="block text-sm font-body font-medium text-navy-700 mb-1">Last Name</label>
              <input
                type="text"
                defaultValue={userProfile.personal.lastName}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent font-body"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-body font-medium text-navy-700 mb-1">Email</label>
              <input
                type="email"
                defaultValue={userProfile.personal.email}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent font-body"
              />
            </div>
            <div>
              <label className="block text-sm font-body font-medium text-navy-700 mb-1">Phone</label>
              <input
                type="tel"
                defaultValue={userProfile.personal.phone}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent font-body"
              />
            </div>
          </div>
        </div>
      </Dialog>

      {/* Edit Medical Info Dialog */}
      <Dialog
        isOpen={dialogState.isOpen && dialogState.type === 'edit-medical'}
        onClose={() => setDialogState({ isOpen: false, type: 'edit-medical' })}
        title="Edit Medical Information"
        type="default"
        size="lg"
        actions={
          <>
            <button
              onClick={() => setDialogState({ isOpen: false, type: 'edit-medical' })}
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
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-body font-medium text-navy-700 mb-1">Blood Type</label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent font-body">
                <option>A+</option>
                <option>A-</option>
                <option>B+</option>
                <option>B-</option>
                <option>O+</option>
                <option>O-</option>
                <option>AB+</option>
                <option>AB-</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-body font-medium text-navy-700 mb-1">Height</label>
              <input
                type="text"
                defaultValue={userProfile.medical.height}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent font-body"
              />
            </div>
            <div>
              <label className="block text-sm font-body font-medium text-navy-700 mb-1">Weight</label>
              <input
                type="text"
                defaultValue={userProfile.medical.weight}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent font-body"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-body font-medium text-navy-700 mb-1">Allergies (comma-separated)</label>
            <input
              type="text"
              defaultValue={userProfile.medical.allergies.join(', ')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent font-body"
            />
          </div>
          <div>
            <label className="block text-sm font-body font-medium text-navy-700 mb-1">Medications (comma-separated)</label>
            <input
              type="text"
              defaultValue={userProfile.medical.medications.join(', ')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent font-body"
            />
          </div>
        </div>
      </Dialog>

      {/* Add/Edit Goal Dialog */}
      <Dialog
        isOpen={dialogState.isOpen && (dialogState.type === 'add-goal' || dialogState.type === 'edit-goal')}
        onClose={() => setDialogState({ isOpen: false, type: 'add-goal' })}
        title={dialogState.type === 'add-goal' ? 'Add New Goal' : 'Edit Goal'}
        type="default"
        size="md"
        actions={
          <>
            <button
              onClick={() => setDialogState({ isOpen: false, type: 'add-goal' })}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-body font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDialogConfirm}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-body font-medium transition-colors"
            >
              {dialogState.type === 'add-goal' ? 'Create Goal' : 'Save Changes'}
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-body font-medium text-navy-700 mb-1">Goal Title</label>
            <input
              type="text"
              defaultValue={dialogState.data?.title}
              placeholder="e.g., Daily Steps"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-body"
            />
          </div>
          <div>
            <label className="block text-sm font-body font-medium text-navy-700 mb-1">Category</label>
            <select
              defaultValue={dialogState.data?.category}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-body"
            >
              <option value="fitness">Fitness</option>
              <option value="nutrition">Nutrition</option>
              <option value="sleep">Sleep</option>
              <option value="wellness">Wellness</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-body font-medium text-navy-700 mb-1">Target Value</label>
              <input
                type="number"
                defaultValue={dialogState.data?.target}
                placeholder="8000"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-body"
              />
            </div>
            <div>
              <label className="block text-sm font-body font-medium text-navy-700 mb-1">Unit</label>
              <input
                type="text"
                defaultValue={dialogState.data?.unit}
                placeholder="steps"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-body"
              />
            </div>
          </div>
          {dialogState.type === 'edit-goal' && (
            <div>
              <label className="block text-sm font-body font-medium text-navy-700 mb-1">Current Progress</label>
              <input
                type="number"
                defaultValue={dialogState.data?.current}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-body"
              />
            </div>
          )}
        </div>
      </Dialog>

      {/* Delete Goal Dialog */}
      <Dialog
        isOpen={dialogState.isOpen && dialogState.type === 'delete-goal'}
        onClose={() => setDialogState({ isOpen: false, type: 'delete-goal' })}
        title="Delete Goal"
        type="error"
        size="sm"
        actions={
          <>
            <button
              onClick={() => setDialogState({ isOpen: false, type: 'delete-goal' })}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-body font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDialogConfirm}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-body font-medium transition-colors"
            >
              Delete Goal
            </button>
          </>
        }
      >
        <p className="text-navy-700 font-body">
          Are you sure you want to delete <strong>{dialogState.data?.title}</strong>? This action cannot be undone.
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
