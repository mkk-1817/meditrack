'use client';

/**
 * Emergency Page - Quick Access to Emergency Information and Contacts
 * Critical health information, emergency contacts, and quick actions
 */

import { Suspense, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { pageVariants, containerVariants, itemVariants } from '@/animations/motionVariants';
import { storage, STORAGE_KEYS, UserProfile } from '@/lib/localStorage';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  email?: string;
  isPrimary: boolean;
}

interface MedicalInfo {
  allergies: string[];
  medications: string[];
  conditions: string[];
  bloodType: string;
  organDonor: boolean;
  dnr: boolean;
}

interface Physician {
  name: string;
  specialty: string;
  phone: string;
  email?: string;
  hospital: string;
  address: string;
}

function EmergencyContent() {
  const [profile] = useLocalStorage<UserProfile>(STORAGE_KEYS.USER_PROFILE, {} as UserProfile);
  const [emergencyContacts, setEmergencyContacts] = useLocalStorage<EmergencyContact[]>(
    STORAGE_KEYS.EMERGENCY_CONTACT,
    []
  );
  const [physician, setPhysician] = useLocalStorage<Physician>(
    STORAGE_KEYS.PHYSICIAN,
    {} as Physician
  );
  const [medicalInfo, setMedicalInfo] = useLocalStorage<MedicalInfo>(
    'meditrack_medical_info',
    {
      allergies: [],
      medications: [],
      conditions: [],
      bloodType: '',
      organDonor: false,
      dnr: false
    }
  );

  const [showAddContact, setShowAddContact] = useState(false);
  const [showEditPhysician, setShowEditPhysician] = useState(false);
  const [showEditMedical, setShowEditMedical] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Initialize default data if empty
  useEffect(() => {
    if (emergencyContacts.length === 0) {
      setEmergencyContacts([
        {
          id: '1',
          name: 'Jane Doe',
          relationship: 'Spouse',
          phone: '+1 (555) 123-4567',
          email: 'jane.doe@email.com',
          isPrimary: true
        },
        {
          id: '2',
          name: 'Dr. Robert Smith',
          relationship: 'Family Physician',
          phone: '+1 (555) 987-6543',
          email: 'dr.smith@hospital.com',
          isPrimary: false
        }
      ]);
    }

    if (!physician.name) {
      setPhysician({
        name: 'Dr. Emily Johnson',
        specialty: 'Family Medicine',
        phone: '+1 (555) 246-8135',
        email: 'dr.johnson@cityhospital.com',
        hospital: 'City General Hospital',
        address: '123 Medical Center Dr, Suite 400'
      });
    }

    if (medicalInfo.allergies.length === 0) {
      setMedicalInfo({
        allergies: ['Penicillin', 'Peanuts'],
        medications: ['Lisinopril 10mg - Daily', 'Metformin 500mg - Twice daily'],
        conditions: ['Type 2 Diabetes', 'Hypertension'],
        bloodType: profile.medical?.bloodType || 'A+',
        organDonor: true,
        dnr: false
      });
    }
  }, [emergencyContacts.length, physician.name, medicalInfo.allergies.length, setEmergencyContacts, setPhysician, setMedicalInfo, profile.medical?.bloodType]);

  const showNotification = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleCall = (phone: string) => {
    window.location.href = `tel:${phone}`;
    showNotification(`Calling ${phone}...`);
  };

  const handleEmail = (email: string) => {
    window.location.href = `mailto:${email}`;
    showNotification(`Opening email to ${email}...`);
  };

  const handleCall911 = () => {
    if (window.confirm('This will dial emergency services (911). Continue?')) {
      window.location.href = 'tel:911';
    }
  };

  const handleShareMedicalID = () => {
    const medicalID = {
      name: profile.personal?.firstName + ' ' + profile.personal?.lastName,
      bloodType: medicalInfo.bloodType,
      allergies: medicalInfo.allergies,
      medications: medicalInfo.medications,
      conditions: medicalInfo.conditions,
      emergencyContact: emergencyContacts.find(c => c.isPrimary),
      physician: physician
    };

    const shareText = `MEDICAL ID\n\nName: ${medicalID.name}\nBlood Type: ${medicalID.bloodType}\n\nAllergies:\n${medicalID.allergies.join(', ')}\n\nMedications:\n${medicalID.medications.join('\n')}\n\nConditions:\n${medicalID.conditions.join(', ')}\n\nEmergency Contact:\n${medicalID.emergencyContact?.name} (${medicalID.emergencyContact?.relationship})\nPhone: ${medicalID.emergencyContact?.phone}`;

    if (navigator.share) {
      navigator.share({
        title: 'Medical ID',
        text: shareText
      }).then(() => {
        showNotification('Medical ID shared successfully!');
      }).catch(() => {
        // Fallback to copy
        navigator.clipboard.writeText(shareText);
        showNotification('Medical ID copied to clipboard!');
      });
    } else {
      navigator.clipboard.writeText(shareText);
      showNotification('Medical ID copied to clipboard!');
    }
  };

  const handleExportEmergencyData = () => {
    const emergencyData = {
      profile: profile,
      emergencyContacts: emergencyContacts,
      physician: physician,
      medicalInfo: medicalInfo,
      exportDate: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(emergencyData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `emergency-info-${new Date().toISOString()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showNotification('Emergency data exported successfully!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50">
      {/* Emergency Aura Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-radial from-red-200/20 via-red-100/10 to-transparent rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-radial from-orange-200/20 via-orange-100/10 to-transparent rounded-full blur-3xl animate-pulse-slow" />
      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-luxury flex items-center space-x-2"
          >
            <span className="text-xl">✓</span>
            <span className="font-body font-medium">{toastMessage}</span>
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
              <h1 className="text-4xl font-heading font-bold text-red-900 mb-2 flex items-center space-x-3">
                <span className="text-5xl">🚨</span>
                <span>Emergency</span>
              </h1>
              <p className="text-lg text-navy-600 font-body">
                Quick access to critical health information and emergency contacts.
              </p>
            </div>
          </div>

          {/* Emergency Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleCall911}
              className="bg-gradient-to-br from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white p-6 rounded-xl shadow-luxury hover:shadow-luxury-hover transition-all duration-300"
            >
              <div className="text-4xl mb-2">🚑</div>
              <div className="text-xl font-heading font-bold mb-1">Call 911</div>
              <div className="text-sm opacity-90">Emergency Services</div>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleShareMedicalID}
              className="bg-gradient-to-br from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white p-6 rounded-xl shadow-luxury hover:shadow-luxury-hover transition-all duration-300"
            >
              <div className="text-4xl mb-2">🆔</div>
              <div className="text-xl font-heading font-bold mb-1">Share Medical ID</div>
              <div className="text-sm opacity-90">Quick Share</div>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleExportEmergencyData}
              className="bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white p-6 rounded-xl shadow-luxury hover:shadow-luxury-hover transition-all duration-300"
            >
              <div className="text-4xl mb-2">📥</div>
              <div className="text-xl font-heading font-bold mb-1">Export Data</div>
              <div className="text-sm opacity-90">Download Info</div>
            </motion.button>
          </div>
        </motion.section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-8">
            {/* Medical Information */}
            <motion.section variants={containerVariants}>
              <motion.div
                variants={itemVariants}
                className="bg-white/90 backdrop-blur-sm border border-red-200/50 rounded-2xl p-6 shadow-luxury"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="text-3xl">🩺</div>
                    <h2 className="text-2xl font-heading font-semibold text-navy-900">
                      Medical Information
                    </h2>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowEditMedical(!showEditMedical)}
                    className="text-teal-600 hover:text-teal-700 font-body font-medium text-sm"
                  >
                    {showEditMedical ? 'Cancel' : 'Edit'}
                  </motion.button>
                </div>

                <div className="space-y-4">
                  {/* Blood Type */}
                  <div className="p-4 bg-red-50/50 rounded-xl border border-red-100">
                    <div className="text-sm font-body text-navy-600 mb-1">Blood Type</div>
                    <div className="text-2xl font-heading font-bold text-red-700">
                      {medicalInfo.bloodType || 'Not specified'}
                    </div>
                  </div>

                  {/* Allergies */}
                  <div className="p-4 bg-orange-50/50 rounded-xl border border-orange-100">
                    <div className="text-sm font-body font-semibold text-navy-700 mb-2 flex items-center space-x-2">
                      <span>⚠️</span>
                      <span>Allergies</span>
                    </div>
                    {medicalInfo.allergies.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {medicalInfo.allergies.map((allergy, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-orange-100 text-orange-800 text-sm font-body rounded-full"
                          >
                            {allergy}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-navy-500 font-body">No known allergies</p>
                    )}
                  </div>

                  {/* Current Medications */}
                  <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100">
                    <div className="text-sm font-body font-semibold text-navy-700 mb-2 flex items-center space-x-2">
                      <span>💊</span>
                      <span>Current Medications</span>
                    </div>
                    {medicalInfo.medications.length > 0 ? (
                      <ul className="space-y-1">
                        {medicalInfo.medications.map((med, idx) => (
                          <li key={idx} className="text-sm text-navy-700 font-body">
                            • {med}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-navy-500 font-body">No current medications</p>
                    )}
                  </div>

                  {/* Medical Conditions */}
                  <div className="p-4 bg-purple-50/50 rounded-xl border border-purple-100">
                    <div className="text-sm font-body font-semibold text-navy-700 mb-2 flex items-center space-x-2">
                      <span>🏥</span>
                      <span>Medical Conditions</span>
                    </div>
                    {medicalInfo.conditions.length > 0 ? (
                      <ul className="space-y-1">
                        {medicalInfo.conditions.map((condition, idx) => (
                          <li key={idx} className="text-sm text-navy-700 font-body">
                            • {condition}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-navy-500 font-body">No medical conditions</p>
                    )}
                  </div>

                  {/* Additional Info */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-green-50/50 rounded-xl border border-green-100 text-center">
                      <div className="text-2xl mb-1">{medicalInfo.organDonor ? '✓' : '✗'}</div>
                      <div className="text-xs font-body text-navy-600">Organ Donor</div>
                    </div>
                    <div className="p-3 bg-gray-50/50 rounded-xl border border-gray-100 text-center">
                      <div className="text-2xl mb-1">{medicalInfo.dnr ? '✓' : '✗'}</div>
                      <div className="text-xs font-body text-navy-600">DNR Order</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.section>

            {/* Primary Physician */}
            <motion.section variants={containerVariants}>
              <motion.div
                variants={itemVariants}
                className="bg-white/90 backdrop-blur-sm border border-blue-200/50 rounded-2xl p-6 shadow-luxury"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="text-3xl">👨‍⚕️</div>
                    <h2 className="text-2xl font-heading font-semibold text-navy-900">
                      Primary Physician
                    </h2>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowEditPhysician(!showEditPhysician)}
                    className="text-teal-600 hover:text-teal-700 font-body font-medium text-sm"
                  >
                    {showEditPhysician ? 'Cancel' : 'Edit'}
                  </motion.button>
                </div>

                {physician.name ? (
                  <div className="space-y-4">
                    <div>
                      <div className="text-xl font-heading font-bold text-navy-900 mb-1">
                        {physician.name}
                      </div>
                      <div className="text-sm font-body text-navy-600">
                        {physician.specialty}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 bg-blue-50/50 rounded-lg border border-blue-100">
                        <div className="flex items-center space-x-2">
                          <span>📞</span>
                          <span className="text-sm font-body text-navy-700">{physician.phone}</span>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleCall(physician.phone)}
                          className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-xs font-body rounded-lg transition-colors"
                        >
                          Call
                        </motion.button>
                      </div>

                      {physician.email && (
                        <div className="flex items-center justify-between p-3 bg-blue-50/50 rounded-lg border border-blue-100">
                          <div className="flex items-center space-x-2">
                            <span>📧</span>
                            <span className="text-sm font-body text-navy-700">{physician.email}</span>
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleEmail(physician.email!)}
                            className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-xs font-body rounded-lg transition-colors"
                          >
                            Email
                          </motion.button>
                        </div>
                      )}

                      <div className="p-3 bg-blue-50/50 rounded-lg border border-blue-100">
                        <div className="flex items-center space-x-2 mb-1">
                          <span>🏥</span>
                          <span className="text-sm font-body font-semibold text-navy-700">
                            {physician.hospital}
                          </span>
                        </div>
                        <div className="text-xs font-body text-navy-600 ml-6">
                          {physician.address}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-navy-500 font-body">No physician information available</p>
                )}
              </motion.div>
            </motion.section>
          </div>

          {/* Right Column - Emergency Contacts */}
          <div className="space-y-8">
            <motion.section variants={containerVariants}>
              <motion.div
                variants={itemVariants}
                className="bg-white/90 backdrop-blur-sm border border-orange-200/50 rounded-2xl p-6 shadow-luxury"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="text-3xl">📱</div>
                    <h2 className="text-2xl font-heading font-semibold text-navy-900">
                      Emergency Contacts
                    </h2>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowAddContact(!showAddContact)}
                    className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg font-body font-medium text-sm transition-colors"
                  >
                    {showAddContact ? 'Cancel' : '+ Add'}
                  </motion.button>
                </div>

                <div className="space-y-4">
                  {emergencyContacts.map((contact, index) => (
                    <motion.div
                      key={contact.id}
                      variants={itemVariants}
                      custom={index}
                      whileHover={{ scale: 1.02 }}
                      className={`p-4 rounded-xl border transition-all duration-300 ${
                        contact.isPrimary
                          ? 'bg-gradient-to-br from-orange-50 to-red-50 border-orange-200 shadow-md'
                          : 'bg-navy-50/30 border-navy-100 hover:bg-navy-50/50'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="text-lg font-heading font-semibold text-navy-900">
                              {contact.name}
                            </h3>
                            {contact.isPrimary && (
                              <span className="px-2 py-0.5 bg-orange-500 text-white text-xs font-body rounded-full">
                                Primary
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-navy-600 font-body">
                            {contact.relationship}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-2 bg-white/80 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm">📞</span>
                            <span className="text-sm font-body text-navy-700">
                              {contact.phone}
                            </span>
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleCall(contact.phone)}
                            className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white text-xs font-body rounded-lg transition-colors"
                          >
                            Call
                          </motion.button>
                        </div>

                        {contact.email && (
                          <div className="flex items-center justify-between p-2 bg-white/80 rounded-lg">
                            <div className="flex items-center space-x-2">
                              <span className="text-sm">📧</span>
                              <span className="text-sm font-body text-navy-700">
                                {contact.email}
                              </span>
                            </div>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleEmail(contact.email!)}
                              className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-xs font-body rounded-lg transition-colors"
                            >
                              Email
                            </motion.button>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}

                  {emergencyContacts.length === 0 && (
                    <div className="text-center py-8 text-navy-500 font-body">
                      No emergency contacts added yet.
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.section>

            {/* Important Numbers */}
            <motion.section variants={containerVariants}>
              <motion.div
                variants={itemVariants}
                className="bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6 shadow-luxury"
              >
                <div className="flex items-center space-x-3 mb-6">
                  <div className="text-3xl">☎️</div>
                  <h2 className="text-2xl font-heading font-semibold text-navy-900">
                    Important Numbers
                  </h2>
                </div>

                <div className="space-y-3">
                  {[
                    { name: 'Emergency Services', number: '911', icon: '🚨', color: 'red' },
                    { name: 'Poison Control', number: '1-800-222-1222', icon: '☠️', color: 'purple' },
                    { name: 'Mental Health Crisis', number: '988', icon: '🧠', color: 'blue' },
                    { name: 'Non-Emergency Police', number: '311', icon: '👮', color: 'navy' },
                    { name: 'Hospital Information', number: '1-800-555-0199', icon: '🏥', color: 'teal' }
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-xl">{item.icon}</span>
                        <div>
                          <div className="text-sm font-body font-semibold text-navy-900">
                            {item.name}
                          </div>
                          <div className="text-xs font-body text-navy-600">
                            {item.number}
                          </div>
                        </div>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleCall(item.number)}
                        className={`px-3 py-1 bg-${item.color}-500 hover:bg-${item.color}-600 text-white text-xs font-body rounded-lg transition-colors`}
                        style={{
                          backgroundColor: item.color === 'red' ? '#ef4444' :
                                         item.color === 'purple' ? '#a855f7' :
                                         item.color === 'blue' ? '#3b82f6' :
                                         item.color === 'navy' ? '#2B3A67' : '#14b8a6'
                        }}
                      >
                        Call
                      </motion.button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.section>
          </div>
        </div>

        {/* Safety Tips */}
        <motion.section variants={containerVariants} className="mt-8">
          <motion.div
            variants={itemVariants}
            className="bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200 rounded-2xl p-6 shadow-luxury"
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="text-3xl">💡</div>
              <h2 className="text-2xl font-heading font-semibold text-navy-900">
                Emergency Safety Tips
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-white/80 rounded-xl">
                <div className="text-lg font-heading font-semibold text-navy-900 mb-2">
                  🚨 When to Call 911
                </div>
                <ul className="text-sm font-body text-navy-700 space-y-1">
                  <li>• Severe bleeding or injuries</li>
                  <li>• Difficulty breathing</li>
                  <li>• Chest pain or heart attack</li>
                  <li>• Severe allergic reactions</li>
                  <li>• Loss of consciousness</li>
                </ul>
              </div>
              <div className="p-4 bg-white/80 rounded-xl">
                <div className="text-lg font-heading font-semibold text-navy-900 mb-2">
                  📋 Information to Provide
                </div>
                <ul className="text-sm font-body text-navy-700 space-y-1">
                  <li>• Your location and address</li>
                  <li>• Nature of emergency</li>
                  <li>• Number of people affected</li>
                  <li>• Current medical conditions</li>
                  <li>• Medications being taken</li>
                </ul>
              </div>
              <div className="p-4 bg-white/80 rounded-xl">
                <div className="text-lg font-heading font-semibold text-navy-900 mb-2">
                  ✅ Be Prepared
                </div>
                <ul className="text-sm font-body text-navy-700 space-y-1">
                  <li>• Keep medical ID updated</li>
                  <li>• Share location with contacts</li>
                  <li>• Know your allergies</li>
                  <li>• List current medications</li>
                  <li>• Keep phone charged</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </motion.section>
      </motion.main>
    </div>
  );
}

export default function EmergencyPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-200 border-t-red-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-navy-600 font-body">Loading emergency information...</p>
        </div>
      </div>
    }>
      <EmergencyContent />
    </Suspense>
  );
}
