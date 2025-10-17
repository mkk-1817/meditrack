'use client';

/**
 * Appointments Page - Enhanced with HCI Components
 * SplitWindow (Calendar | List), Context Menus, Dialogs, Dropdown Filters
 */

import { Suspense, useState } from 'react';
import { motion } from 'framer-motion';
import { pageVariants, containerVariants, itemVariants } from '@/animations/motionVariants';
import { ContextMenu, ContextMenuItem, PieMenu, PieMenuItem } from '@/components/HCIMenus';
import { Dialog, SplitWindow, MessageWindow, ToastMessage } from '@/components/HCIWindows';

interface Appointment {
  id: number;
  type: string;
  title: string;
  provider: {
    name: string;
    specialty: string;
    image?: string;
  };
  date: string;
  time: string;
  duration: number;
  location: {
    type: 'in-person' | 'telemedicine';
    address?: string;
    room?: string;
    platform?: string;
    link?: string;
  };
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled';
  notes: string;
  reminders?: string[];
  summary?: string;
  prescriptions?: string[];
  results?: string[];
  nextSteps?: string[];
}

function AppointmentsContent() {
  const [contextMenu, setContextMenu] = useState<{ items: ContextMenuItem[]; position: { x: number; y: number } } | null>(null);
  const [pieMenu, setPieMenu] = useState<{ items: PieMenuItem[]; center: { x: number; y: number } } | null>(null);
  const [dialogState, setDialogState] = useState<{ 
    isOpen: boolean; 
    type: 'book' | 'edit' | 'cancel' | 'reschedule' | 'view'; 
    data?: any 
  }>({ isOpen: false, type: 'book' });
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [showSplitView, setShowSplitView] = useState(true);
  const [filterDropdown, setFilterDropdown] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  const showToast = (type: ToastMessage['type'], title: string, message: string) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, type, title, message, duration: 3000 }]);
  };

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const upcomingAppointments: Appointment[] = [
    {
      id: 1,
      type: 'routine-checkup',
      title: 'Annual Physical Examination',
      provider: {
        name: 'Dr. Emily Rodriguez',
        specialty: 'Internal Medicine',
        image: '/api/placeholder/40/40'
      },
      date: '2025-10-18',
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
      date: '2025-10-22',
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
      date: '2025-11-01',
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

  const pastAppointments: Appointment[] = [
    {
      id: 4,
      type: 'routine-checkup',
      title: 'Quarterly Health Review',
      provider: {
        name: 'Dr. Emily Rodriguez',
        specialty: 'Internal Medicine'
      },
      date: '2025-09-15',
      time: '3:30 PM',
      duration: 45,
      status: 'completed',
      notes: '',
      location: { type: 'in-person' },
      summary: 'All vitals normal. Continue current medication regimen. Schedule follow-up in 3 months.',
      prescriptions: ['Lisinopril 10mg daily', 'Multivitamin'],
      nextSteps: ['Monitor BP daily', 'Lab work in 6 months']
    }
  ];

  const allAppointments = [...upcomingAppointments, ...pastAppointments];
  const filteredAppointments = selectedFilter === 'all' 
    ? allAppointments 
    : selectedFilter === 'upcoming'
    ? upcomingAppointments
    : selectedFilter === 'past'
    ? pastAppointments
    : allAppointments.filter(apt => apt.status === selectedFilter);

  // Context menu for appointments
  const handleAppointmentContextMenu = (e: React.MouseEvent, appointment: Appointment) => {
    e.preventDefault();
    setContextMenu({
      position: { x: e.clientX, y: e.clientY },
      items: [
        {
          id: 'view',
          label: 'View Full Details',
          icon: '👁️',
          action: () => {
            setDialogState({ isOpen: true, type: 'view', data: appointment });
            setContextMenu(null);
          }
        },
        {
          id: 'edit',
          label: 'Edit Appointment',
          icon: '✏️',
          action: () => {
            setDialogState({ isOpen: true, type: 'edit', data: appointment });
            setContextMenu(null);
          },
          disabled: appointment.status === 'completed' || appointment.status === 'cancelled'
        },
        {
          id: 'reschedule',
          label: 'Reschedule',
          icon: '📅',
          action: () => {
            setDialogState({ isOpen: true, type: 'reschedule', data: appointment });
            setContextMenu(null);
          },
          disabled: appointment.status === 'completed' || appointment.status === 'cancelled'
        },
        {
          id: 'divider-1',
          label: '',
          icon: '',
          action: () => {},
          divider: true
        },
        {
          id: 'add-notes',
          label: 'Add Notes',
          icon: '📝',
          action: () => {
            showToast('info', 'Add Notes', 'Opening notes editor');
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
              label: 'Copy Details',
              icon: '📋',
              action: () => {
                showToast('success', 'Copied!', 'Appointment details copied to clipboard');
                setContextMenu(null);
              }
            },
            {
              id: 'email',
              label: 'Email Confirmation',
              icon: '📧',
              action: () => {
                showToast('success', 'Sent!', 'Confirmation email sent');
                setContextMenu(null);
              }
            },
            {
              id: 'calendar',
              label: 'Add to Calendar',
              icon: '📆',
              action: () => {
                showToast('success', 'Added!', 'Added to your calendar');
                setContextMenu(null);
              }
            }
          ]
        },
        {
          id: 'divider-2',
          label: '',
          icon: '',
          action: () => {},
          divider: true
        },
        {
          id: 'cancel',
          label: 'Cancel Appointment',
          icon: '❌',
          danger: true,
          action: () => {
            setDialogState({ isOpen: true, type: 'cancel', data: appointment });
            setContextMenu(null);
          },
          disabled: appointment.status === 'completed' || appointment.status === 'cancelled'
        }
      ]
    });
  };

  // Pie menu for quick actions
  const handleAppointmentPieMenu = (e: React.MouseEvent, appointment: Appointment) => {
    setPieMenu({
      center: { x: e.clientX, y: e.clientY },
      items: [
        {
          id: 'view',
          label: 'View',
          icon: '👁️',
          color: '#1B4D4F',
          action: () => {
            setDialogState({ isOpen: true, type: 'view', data: appointment });
            setPieMenu(null);
          }
        },
        {
          id: 'edit',
          label: 'Edit',
          icon: '✏️',
          color: '#C79549',
          action: () => {
            setDialogState({ isOpen: true, type: 'edit', data: appointment });
            setPieMenu(null);
          }
        },
        {
          id: 'reschedule',
          label: 'Reschedule',
          icon: '📅',
          color: '#3B82F6',
          action: () => {
            setDialogState({ isOpen: true, type: 'reschedule', data: appointment });
            setPieMenu(null);
          }
        },
        {
          id: 'cancel',
          label: 'Cancel',
          icon: '❌',
          color: '#EF4444',
          action: () => {
            setDialogState({ isOpen: true, type: 'cancel', data: appointment });
            setPieMenu(null);
          }
        }
      ]
    });
  };

  // Handle dialog actions
  const handleDialogConfirm = () => {
    if (dialogState.type === 'book') {
      showToast('success', 'Booked!', 'Appointment scheduled successfully');
    } else if (dialogState.type === 'edit') {
      showToast('success', 'Updated!', 'Appointment details updated');
    } else if (dialogState.type === 'cancel') {
      showToast('success', 'Cancelled', 'Appointment has been cancelled');
    } else if (dialogState.type === 'reschedule') {
      showToast('success', 'Rescheduled', 'Appointment rescheduled successfully');
    }
    setDialogState({ isOpen: false, type: 'book' });
  };

  // Filter dropdown items
  const filterItems: ContextMenuItem[] = [
    {
      id: 'all',
      label: 'All Appointments',
      icon: '📋',
      action: () => {
        setSelectedFilter('all');
        setFilterDropdown(false);
        showToast('info', 'Filter', 'Showing all appointments');
      }
    },
    {
      id: 'upcoming',
      label: 'Upcoming Only',
      icon: '⏰',
      action: () => {
        setSelectedFilter('upcoming');
        setFilterDropdown(false);
        showToast('info', 'Filter', 'Showing upcoming appointments');
      }
    },
    {
      id: 'past',
      label: 'Past Only',
      icon: '📅',
      action: () => {
        setSelectedFilter('past');
        setFilterDropdown(false);
        showToast('info', 'Filter', 'Showing past appointments');
      }
    },
    {
      id: 'divider',
      label: '',
      icon: '',
      action: () => {},
      divider: true
    },
    {
      id: 'confirmed',
      label: 'Confirmed',
      icon: '✓',
      action: () => {
        setSelectedFilter('confirmed');
        setFilterDropdown(false);
        showToast('info', 'Filter', 'Showing confirmed appointments');
      }
    },
    {
      id: 'pending',
      label: 'Pending',
      icon: '⏳',
      action: () => {
        setSelectedFilter('pending');
        setFilterDropdown(false);
        showToast('info', 'Filter', 'Showing pending appointments');
      }
    },
    {
      id: 'completed',
      label: 'Completed',
      icon: '✅',
      action: () => {
        setSelectedFilter('completed');
        setFilterDropdown(false);
        showToast('info', 'Filter', 'Showing completed appointments');
      }
    }
  ];

  // Calendar view component
  const CalendarView = () => {
    // const today = new Date('2025-10-16');
    const daysInMonth = 31;
    const firstDay = 3; // October 1, 2025 is a Wednesday (3)
    const weeks = [];
    let days = [];

    // Add empty cells for days before the month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="aspect-square" />);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `2025-10-${day.toString().padStart(2, '0')}`;
      const hasAppointment = allAppointments.some(apt => apt.date === dateStr);
      const isToday = day === 16;
      const appointmentForDay = allAppointments.find(apt => apt.date === dateStr);

      days.push(
        <motion.div
          key={day}
          whileHover={{ scale: 1.05 }}
          className={`
            aspect-square p-2 rounded-lg cursor-pointer transition-all
            ${isToday ? 'bg-teal-600 text-white font-bold' :
              hasAppointment ? 'bg-gold-100 hover:bg-gold-200' :
              'bg-white hover:bg-gray-50'
            }
            ${hasAppointment ? 'border-2 border-gold-400' : 'border border-gray-200'}
          `}
          onClick={() => {
            if (appointmentForDay) {
              setSelectedAppointment(appointmentForDay);
              showToast('info', 'Appointment', appointmentForDay.title);
            }
          }}
        >
          <div className="text-sm font-body font-semibold">{day}</div>
          {hasAppointment && (
            <div className="text-xs mt-1">
              <div className="w-1 h-1 bg-gold-600 rounded-full mx-auto" />
            </div>
          )}
        </motion.div>
      );

      if (days.length === 7) {
        weeks.push(
          <div key={`week-${weeks.length}`} className="grid grid-cols-7 gap-2">
            {days}
          </div>
        );
        days = [];
      }
    }

    if (days.length > 0) {
      weeks.push(
        <div key={`week-${weeks.length}`} className="grid grid-cols-7 gap-2">
          {days}
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-heading font-bold text-navy-900">October 2025</h3>
          <div className="flex items-center space-x-2">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <span>◀</span>
            </button>
            <button className="px-4 py-2 bg-teal-600 text-white rounded-lg font-body text-sm">
              Today
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <span>▶</span>
            </button>
          </div>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center text-sm font-body font-semibold text-navy-600 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="space-y-2">{weeks}</div>

        {/* Legend */}
        <div className="flex items-center justify-center space-x-6 pt-4 border-t border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-teal-600 rounded" />
            <span className="text-sm font-body text-navy-600">Today</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gold-100 border-2 border-gold-400 rounded" />
            <span className="text-sm font-body text-navy-600">Has Appointment</span>
          </div>
        </div>

        {/* Selected appointment preview */}
        {selectedAppointment && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 bg-gradient-to-r from-teal-50 to-gold-50 rounded-xl border border-teal-200"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="text-sm text-navy-600 font-body mb-1">
                  {new Date(selectedAppointment.date).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </div>
                <h4 className="text-lg font-heading font-semibold text-navy-900 mb-1">
                  {selectedAppointment.title}
                </h4>
                <p className="text-sm text-navy-600 font-body">
                  {selectedAppointment.time} • {selectedAppointment.provider.name}
                </p>
              </div>
              <button
                onClick={() => setSelectedAppointment(null)}
                className="text-navy-400 hover:text-navy-600"
              >
                ✕
              </button>
            </div>
          </motion.div>
        )}
      </div>
    );
  };

  // List view component
  const ListView = () => (
    <div className="space-y-4 overflow-y-auto" style={{ maxHeight: '600px' }}>
      <div className="flex items-center justify-between mb-4 sticky top-0 bg-white/95 backdrop-blur-sm z-10 py-2">
        <h3 className="text-2xl font-heading font-bold text-navy-900">
          {selectedFilter === 'all' ? 'All Appointments' :
           selectedFilter === 'upcoming' ? 'Upcoming' :
           selectedFilter === 'past' ? 'Past Appointments' :
           `${selectedFilter.charAt(0).toUpperCase() + selectedFilter.slice(1)} Appointments`}
        </h3>
        <div className="relative">
          <button
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              if (filterDropdown) {
                setFilterDropdown(false);
              } else {
                setContextMenu({
                  position: { x: rect.left, y: rect.bottom + 5 },
                  items: filterItems
                });
              }
            }}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-body text-sm flex items-center space-x-2 transition-colors"
          >
            <span>🔍</span>
            <span>Filter</span>
          </button>
        </div>
      </div>

      {filteredAppointments.map((appointment, index) => (
        <motion.div
          key={appointment.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          onContextMenu={(e) => handleAppointmentContextMenu(e, appointment)}
          onDoubleClick={(e) => handleAppointmentPieMenu(e, appointment)}
          className={`
            p-5 rounded-xl border-2 shadow-md hover:shadow-lg transition-all cursor-pointer
            ${appointment.status === 'completed' ? 'bg-green-50/50 border-green-200' :
              appointment.status === 'cancelled' ? 'bg-gray-50 border-gray-200' :
              appointment.status === 'pending' ? 'bg-yellow-50/50 border-yellow-200' :
              'bg-white border-teal-200'
            }
          `}
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center text-white font-heading font-bold text-sm">
                {appointment.provider.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h4 className="text-lg font-heading font-semibold text-navy-900 mb-1">
                  {appointment.title}
                </h4>
                <p className="text-sm text-navy-600 font-body">
                  {appointment.provider.name} • {appointment.provider.specialty}
                </p>
              </div>
            </div>
            <div className={`
              px-3 py-1 rounded-full text-xs font-body font-semibold
              ${appointment.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                appointment.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                'bg-gray-100 text-gray-700'
              }
            `}>
              {appointment.status.toUpperCase()}
            </div>
          </div>

          <div className="flex items-center space-x-4 text-sm font-body text-navy-600 mb-3">
            <span>📅 {new Date(appointment.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            <span>🕒 {appointment.time}</span>
            <span>⏱️ {appointment.duration} min</span>
            <span>{appointment.location.type === 'in-person' ? '🏥 In-Person' : '💻 Virtual'}</span>
          </div>

          <p className="text-sm text-navy-700 font-body mb-3">{appointment.notes}</p>

          {appointment.reminders && appointment.reminders.length > 0 && (
            <div className="flex items-center space-x-2">
              <span className="text-xs text-navy-500 font-body">Reminders:</span>
              {appointment.reminders.map((reminder, idx) => (
                <span key={idx} className="px-2 py-1 bg-teal-100 text-teal-700 text-xs font-body rounded-full">
                  {reminder}
                </span>
              ))}
            </div>
          )}
        </motion.div>
      ))}

      {filteredAppointments.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📅</div>
          <h4 className="text-xl font-heading font-semibold text-navy-900 mb-2">No Appointments Found</h4>
          <p className="text-navy-600 font-body">Try adjusting your filter or schedule a new appointment</p>
        </div>
      )}
    </div>
  );

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
                Appointments
              </h1>
              <p className="text-lg text-navy-600 font-body">
                Manage your healthcare appointments and medical visits
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => {
                  setShowSplitView(!showSplitView);
                  showToast('info', 'View Changed', showSplitView ? 'List view only' : 'Split view enabled');
                }}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg font-body font-medium transition-colors"
              >
                {showSplitView ? '📋 List Only' : '📅 Show Calendar'}
              </button>
              <button
                onClick={() => setDialogState({ isOpen: true, type: 'book' })}
                className="px-6 py-3 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-white rounded-xl font-body font-medium shadow-clinical hover:shadow-clinical-hover transition-all"
              >
                📅 Schedule Appointment
              </button>
            </div>
          </div>
        </motion.section>

        {/* Split Window or List View */}
        <motion.section variants={containerVariants}>
          {showSplitView ? (
            <SplitWindow
              leftPanel={<CalendarView />}
              rightPanel={<ListView />}
              defaultSplit={40}
              minSize={30}
              orientation="vertical"
            />
          ) : (
            <div className="bg-white/80 backdrop-blur-sm border border-teal-200/30 rounded-2xl p-6 shadow-clinical">
              <ListView />
            </div>
          )}
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

      {/* Book Appointment Dialog */}
      <Dialog
        isOpen={dialogState.isOpen && dialogState.type === 'book'}
        onClose={() => setDialogState({ isOpen: false, type: 'book' })}
        title="Schedule New Appointment"
        type="default"
        size="lg"
        actions={
          <>
            <button
              onClick={() => setDialogState({ isOpen: false, type: 'book' })}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-body font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDialogConfirm}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-body font-medium transition-colors"
            >
              Schedule
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-body font-medium text-navy-700 mb-1">
                Appointment Type
              </label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent font-body">
                <option>Routine Checkup</option>
                <option>Follow-up Visit</option>
                <option>Specialist Consultation</option>
                <option>Urgent Care</option>
                <option>Telemedicine</option>
                <option>Lab Work</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-body font-medium text-navy-700 mb-1">
                Provider
              </label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent font-body">
                <option>Dr. Emily Rodriguez - Internal Medicine</option>
                <option>Dr. Michael Chen - Dermatology</option>
                <option>Dr. Sarah Johnson - Cardiology</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-body font-medium text-navy-700 mb-1">
                Date
              </label>
              <input
                type="date"
                min="2025-10-17"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent font-body"
              />
            </div>
            <div>
              <label className="block text-sm font-body font-medium text-navy-700 mb-1">
                Time
              </label>
              <input
                type="time"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent font-body"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-body font-medium text-navy-700 mb-1">
              Location Type
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center space-x-2">
                <input type="radio" name="location" value="in-person" defaultChecked />
                <span className="font-body text-sm">🏥 In-Person</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="radio" name="location" value="telemedicine" />
                <span className="font-body text-sm">💻 Telemedicine</span>
              </label>
            </div>
          </div>
          <div>
            <label className="block text-sm font-body font-medium text-navy-700 mb-1">
              Reason for Visit (Optional)
            </label>
            <textarea
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent font-body"
              rows={3}
              placeholder="Describe the reason for your appointment..."
            />
          </div>
        </div>
      </Dialog>

      {/* Edit Appointment Dialog */}
      <Dialog
        isOpen={dialogState.isOpen && dialogState.type === 'edit'}
        onClose={() => setDialogState({ isOpen: false, type: 'edit' })}
        title="Edit Appointment"
        type="default"
        size="md"
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
          <p className="text-navy-700 font-body mb-4">
            Editing: <strong>{dialogState.data?.title}</strong>
          </p>
          <div>
            <label className="block text-sm font-body font-medium text-navy-700 mb-1">
              Notes
            </label>
            <textarea
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent font-body"
              rows={4}
              defaultValue={dialogState.data?.notes}
            />
          </div>
          <div>
            <label className="block text-sm font-body font-medium text-navy-700 mb-1">
              Reminders
            </label>
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input type="checkbox" defaultChecked />
                <span className="font-body text-sm">24 hours before</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" defaultChecked />
                <span className="font-body text-sm">2 hours before</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" />
                <span className="font-body text-sm">15 minutes before</span>
              </label>
            </div>
          </div>
        </div>
      </Dialog>

      {/* Reschedule Dialog */}
      <Dialog
        isOpen={dialogState.isOpen && dialogState.type === 'reschedule'}
        onClose={() => setDialogState({ isOpen: false, type: 'reschedule' })}
        title="Reschedule Appointment"
        type="default"
        size="md"
        actions={
          <>
            <button
              onClick={() => setDialogState({ isOpen: false, type: 'reschedule' })}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-body font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDialogConfirm}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-body font-medium transition-colors"
            >
              Confirm Reschedule
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-navy-700 font-body mb-4">
            Rescheduling: <strong>{dialogState.data?.title}</strong>
          </p>
          <div>
            <label className="block text-sm font-body font-medium text-navy-700 mb-1">
              New Date
            </label>
            <input
              type="date"
              min="2025-10-17"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent font-body"
            />
          </div>
          <div>
            <label className="block text-sm font-body font-medium text-navy-700 mb-1">
              New Time
            </label>
            <input
              type="time"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent font-body"
            />
          </div>
          <div>
            <label className="block text-sm font-body font-medium text-navy-700 mb-1">
              Reason for Rescheduling (Optional)
            </label>
            <textarea
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent font-body"
              rows={3}
              placeholder="Let your provider know why you're rescheduling..."
            />
          </div>
        </div>
      </Dialog>

      {/* Cancel Dialog */}
      <Dialog
        isOpen={dialogState.isOpen && dialogState.type === 'cancel'}
        onClose={() => setDialogState({ isOpen: false, type: 'cancel' })}
        title="Cancel Appointment"
        type="error"
        size="md"
        actions={
          <>
            <button
              onClick={() => setDialogState({ isOpen: false, type: 'cancel' })}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-body font-medium transition-colors"
            >
              Keep Appointment
            </button>
            <button
              onClick={handleDialogConfirm}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-body font-medium transition-colors"
            >
              Cancel Appointment
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-navy-700 font-body">
            Are you sure you want to cancel this appointment?
          </p>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h4 className="font-heading font-semibold text-red-900 mb-2">
              {dialogState.data?.title}
            </h4>
            <p className="text-red-700 font-body text-sm mb-1">
              {dialogState.data?.provider.name} • {dialogState.data?.provider.specialty}
            </p>
            <p className="text-red-600 font-body text-sm">
              {dialogState.data?.date && new Date(dialogState.data.date).toLocaleDateString()} at {dialogState.data?.time}
            </p>
          </div>
          <div>
            <label className="block text-sm font-body font-medium text-navy-700 mb-1">
              Cancellation Reason (Optional)
            </label>
            <textarea
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent font-body"
              rows={3}
              placeholder="Help us improve by letting us know why you're cancelling..."
            />
          </div>
        </div>
      </Dialog>

      {/* View Details Dialog */}
      <Dialog
        isOpen={dialogState.isOpen && dialogState.type === 'view'}
        onClose={() => setDialogState({ isOpen: false, type: 'view' })}
        title="Appointment Details"
        type="default"
        size="lg"
        actions={
          <button
            onClick={() => setDialogState({ isOpen: false, type: 'view' })}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-body font-medium transition-colors"
          >
            Close
          </button>
        }
      >
        {dialogState.data && (
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-teal-50 to-gold-50 rounded-lg p-4">
              <h3 className="text-xl font-heading font-bold text-navy-900 mb-2">
                {dialogState.data.title}
              </h3>
              <div className="flex items-center space-x-4 text-sm font-body text-navy-600">
                <span>📅 {new Date(dialogState.data.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span>
                <span>🕒 {dialogState.data.time}</span>
                <span>⏱️ {dialogState.data.duration} minutes</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-heading font-semibold text-navy-700 mb-2">Provider</h4>
                <p className="font-body text-navy-900 font-semibold">{dialogState.data.provider.name}</p>
                <p className="font-body text-navy-600 text-sm">{dialogState.data.provider.specialty}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-heading font-semibold text-navy-700 mb-2">Status</h4>
                <div className={`
                  inline-block px-3 py-1 rounded-full text-sm font-body font-medium
                  ${dialogState.data.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                    dialogState.data.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                    dialogState.data.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                    'bg-gray-100 text-gray-700'
                  }
                `}>
                  {dialogState.data.status.toUpperCase()}
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-heading font-semibold text-navy-700 mb-2">Location</h4>
              {dialogState.data.location.type === 'in-person' ? (
                <>
                  <p className="font-body text-navy-900 mb-1">{dialogState.data.location.address}</p>
                  <p className="font-body text-navy-600 text-sm">{dialogState.data.location.room}</p>
                </>
              ) : (
                <>
                  <p className="font-body text-navy-900 mb-1">Virtual Appointment</p>
                  <p className="font-body text-teal-600 text-sm">Platform: {dialogState.data.location.platform}</p>
                </>
              )}
            </div>

            {dialogState.data.notes && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-heading font-semibold text-navy-700 mb-2">Notes</h4>
                <p className="font-body text-navy-700">{dialogState.data.notes}</p>
              </div>
            )}

            {dialogState.data.summary && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="text-sm font-heading font-semibold text-green-800 mb-2">Visit Summary</h4>
                <p className="font-body text-green-700">{dialogState.data.summary}</p>
              </div>
            )}
          </div>
        )}
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
