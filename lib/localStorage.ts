/**
 * LocalStorage Service
 * Centralized localStorage management with type safety and error handling
 */

// Storage keys
export const STORAGE_KEYS = {
  USER_PROFILE: 'meditrack_user_profile',
  VITALS_DATA: 'meditrack_vitals_data',
  VITAL_READINGS: 'meditrack_vital_readings',
  APPOINTMENTS: 'meditrack_appointments',
  HEALTH_INSIGHTS: 'meditrack_health_insights',
  SETTINGS: 'meditrack_settings',
  GOALS: 'meditrack_goals',
  ACHIEVEMENTS: 'meditrack_achievements',
  MEDICATIONS: 'meditrack_medications',
  ALLERGIES: 'meditrack_allergies',
  MEDICAL_CONDITIONS: 'meditrack_medical_conditions',
  EMERGENCY_CONTACT: 'meditrack_emergency_contact',
  PHYSICIAN: 'meditrack_physician',
  CONNECTED_DEVICES: 'meditrack_connected_devices',
  ACTIVITY_LOG: 'meditrack_activity_log',
} as const;

// Type definitions
export interface UserProfile {
  personal: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    gender: string;
  };
  medical: {
    bloodType: string;
    height: string;
    weight: string;
  };
}

export interface VitalReading {
  id: string;
  type: string;
  value: string | number;
  unit: string;
  timestamp: string;
  status: 'normal' | 'warning' | 'critical';
  trend?: 'increasing' | 'decreasing' | 'stable';
  icon?: string;
}

export interface Appointment {
  id: string;
  title: string;
  provider: {
    name: string;
    specialty: string;
  };
  date: string;
  time: string;
  duration: number;
  type: string;
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
  location: {
    type: 'in-person' | 'telemedicine';
    address?: string;
    platform?: string;
  };
  notes?: string;
}

export interface HealthInsight {
  id: string;
  category: string;
  priority: 'high' | 'medium' | 'low';
  title: string;
  message: string;
  timestamp: string;
  confidence: number;
}

export interface Settings {
  notifications: {
    medication: boolean;
    appointments: boolean;
    insights: boolean;
    vitals: boolean;
    dailySummary: boolean;
    reminderTiming: string;
  };
  privacy: {
    dataSharing: boolean;
    analytics: boolean;
    marketing: boolean;
    biometricLock: boolean;
    autoBackup: boolean;
    dataRetention: string;
  };
  display: {
    theme: 'light' | 'dark' | 'system';
    fontSize: 'small' | 'medium' | 'large' | 'extra_large';
    highContrast: boolean;
    reduceAnimations: boolean;
    colorBlindSupport: boolean;
  };
  units: {
    weight: 'lbs' | 'kg';
    height: 'ft_in' | 'cm' | 'm';
    temperature: 'fahrenheit' | 'celsius';
    bloodPressure: 'mmhg' | 'kpa';
  };
  sync: {
    autoSync: boolean;
    wifiOnly: boolean;
    frequency: 'real_time' | 'hourly' | 'daily' | 'manual';
  };
}

export interface Goal {
  id: string;
  category: string;
  title: string;
  target: number;
  current: number;
  unit: string;
  progress: number;
}

// Storage service class
class LocalStorageService {
  /**
   * Generic get method with type safety
   */
  get<T>(key: string, defaultValue: T): T {
    if (typeof window === 'undefined') return defaultValue;
    
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error reading from localStorage (${key}):`, error);
      return defaultValue;
    }
  }

  /**
   * Generic set method
   */
  set<T>(key: string, value: T): boolean {
    if (typeof window === 'undefined') return false;
    
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Error writing to localStorage (${key}):`, error);
      return false;
    }
  }

  /**
   * Remove item from storage
   */
  remove(key: string): boolean {
    if (typeof window === 'undefined') return false;
    
    try {
      window.localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing from localStorage (${key}):`, error);
      return false;
    }
  }

  /**
   * Clear all app data
   */
  clearAll(): boolean {
    if (typeof window === 'undefined') return false;
    
    try {
      Object.values(STORAGE_KEYS).forEach(key => {
        window.localStorage.removeItem(key);
      });
      return true;
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      return false;
    }
  }

  /**
   * Get storage size in bytes
   */
  getStorageSize(): number {
    if (typeof window === 'undefined') return 0;
    
    let total = 0;
    try {
      Object.values(STORAGE_KEYS).forEach(key => {
        const item = window.localStorage.getItem(key);
        if (item) {
          total += item.length + key.length;
        }
      });
    } catch (error) {
      console.error('Error calculating storage size:', error);
    }
    return total;
  }

  /**
   * Initialize default data if not exists
   */
  initializeDefaults(): void {
    // Initialize default settings
    if (!this.get(STORAGE_KEYS.SETTINGS, null)) {
      const defaultSettings: Settings = {
        notifications: {
          medication: true,
          appointments: true,
          insights: true,
          vitals: true,
          dailySummary: false,
          reminderTiming: '24_hours',
        },
        privacy: {
          dataSharing: false,
          analytics: true,
          marketing: false,
          biometricLock: true,
          autoBackup: true,
          dataRetention: '5_years',
        },
        display: {
          theme: 'light',
          fontSize: 'medium',
          highContrast: false,
          reduceAnimations: false,
          colorBlindSupport: false,
        },
        units: {
          weight: 'lbs',
          height: 'ft_in',
          temperature: 'fahrenheit',
          bloodPressure: 'mmhg',
        },
        sync: {
          autoSync: true,
          wifiOnly: false,
          frequency: 'hourly',
        },
      };
      this.set(STORAGE_KEYS.SETTINGS, defaultSettings);
    }

    // Initialize default user profile
    if (!this.get(STORAGE_KEYS.USER_PROFILE, null)) {
      const defaultProfile: UserProfile = {
        personal: {
          firstName: 'Sarah',
          lastName: 'Johnson',
          email: 'sarah.johnson@email.com',
          phone: '+1 (555) 123-4567',
          dateOfBirth: '1985-03-15',
          gender: 'Female',
        },
        medical: {
          bloodType: 'A+',
          height: '5\'6"',
          weight: '135 lbs',
        },
      };
      this.set(STORAGE_KEYS.USER_PROFILE, defaultProfile);
    }

    // Initialize default goals
    if (!this.get(STORAGE_KEYS.GOALS, null)) {
      const defaultGoals: Goal[] = [
        {
          id: '1',
          category: 'fitness',
          title: 'Daily Steps',
          target: 8000,
          current: 7500,
          unit: 'steps',
          progress: 94,
        },
        {
          id: '2',
          category: 'nutrition',
          title: 'Water Intake',
          target: 2.5,
          current: 2.1,
          unit: 'liters',
          progress: 84,
        },
        {
          id: '3',
          category: 'sleep',
          title: 'Sleep Duration',
          target: 8,
          current: 7.5,
          unit: 'hours',
          progress: 94,
        },
        {
          id: '4',
          category: 'wellness',
          title: 'Meditation',
          target: 15,
          current: 12,
          unit: 'minutes',
          progress: 80,
        },
      ];
      this.set(STORAGE_KEYS.GOALS, defaultGoals);
    }
  }

  /**
   * Add vital reading
   */
  addVitalReading(reading: VitalReading): boolean {
    const vitals = this.get<VitalReading[]>(STORAGE_KEYS.VITALS_DATA, []);
    vitals.unshift(reading); // Add to beginning
    
    // Keep only last 100 readings per type
    const vitalsByType = vitals.reduce((acc, v) => {
      if (!acc[v.type]) acc[v.type] = [];
      acc[v.type].push(v);
      return acc;
    }, {} as Record<string, VitalReading[]>);

    const trimmedVitals = Object.values(vitalsByType).flatMap(typeVitals => 
      typeVitals.slice(0, 100)
    );

    return this.set(STORAGE_KEYS.VITALS_DATA, trimmedVitals);
  }

  /**
   * Get vitals by type
   */
  getVitalsByType(type: string, limit: number = 10): VitalReading[] {
    const vitals = this.get<VitalReading[]>(STORAGE_KEYS.VITALS_DATA, []);
    return vitals
      .filter(v => v.type === type)
      .slice(0, limit);
  }

  /**
   * Update goal progress
   */
  updateGoalProgress(goalId: string, current: number): boolean {
    const goals = this.get<Goal[]>(STORAGE_KEYS.GOALS, []);
    const goalIndex = goals.findIndex(g => g.id === goalId);
    
    if (goalIndex === -1) return false;
    
    const goal = goals[goalIndex];
    goal.current = current;
    goal.progress = Math.round((current / goal.target) * 100);
    
    return this.set(STORAGE_KEYS.GOALS, goals);
  }

  /**
   * Add appointment
   */
  addAppointment(appointment: Appointment): boolean {
    const appointments = this.get<Appointment[]>(STORAGE_KEYS.APPOINTMENTS, []);
    appointments.push(appointment);
    return this.set(STORAGE_KEYS.APPOINTMENTS, appointments);
  }

  /**
   * Update appointment status
   */
  updateAppointmentStatus(appointmentId: string, status: Appointment['status']): boolean {
    const appointments = this.get<Appointment[]>(STORAGE_KEYS.APPOINTMENTS, []);
    const index = appointments.findIndex(a => a.id === appointmentId);
    
    if (index === -1) return false;
    
    appointments[index].status = status;
    return this.set(STORAGE_KEYS.APPOINTMENTS, appointments);
  }

  /**
   * Export all data
   */
  exportData(): string {
    const data: Record<string, any> = {};
    
    Object.entries(STORAGE_KEYS).forEach(([key, value]) => {
      const item = this.get(value, null);
      if (item) {
        data[key] = item;
      }
    });

    return JSON.stringify(data, null, 2);
  }

  /**
   * Import data
   */
  importData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);
      
      Object.entries(data).forEach(([key, value]) => {
        const storageKey = STORAGE_KEYS[key as keyof typeof STORAGE_KEYS];
        if (storageKey) {
          this.set(storageKey, value);
        }
      });
      
      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  }
}

// Export singleton instance
export const storage = new LocalStorageService();

// Initialize defaults on import
if (typeof window !== 'undefined') {
  storage.initializeDefaults();
}