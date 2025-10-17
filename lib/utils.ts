/**
 * Utility functions for class name merging and conditional styling
 * Essential for TailwindCSS component development
 */

// Define ClassValue type locally
type ClassValue = string | number | boolean | undefined | null | ClassValue[];

/**
 * Mock clsx and twMerge functions (will be replaced with actual imports when dependencies are installed)
 */
function clsxMock(...inputs: ClassValue[]): string {
  return inputs
    .flat()
    .filter((x) => typeof x === 'string')
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function twMergeMock(input: string): string {
  // Basic implementation - will be replaced with actual tailwind-merge
  return input;
}

/**
 * Combine class names with TailwindCSS merge functionality
 */
export function cn(...inputs: ClassValue[]): string {
  return twMergeMock(clsxMock(inputs));
}

/**
 * Format numbers with appropriate units and formatting
 */
export function formatNumber(value: number, options?: {
  decimals?: number;
  unit?: string;
  compact?: boolean;
}): string {
  const { decimals = 0, unit = '', compact = false } = options || {};
  
  if (compact && value >= 1000) {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M${unit}`;
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K${unit}`;
    }
  }
  
  return `${value.toFixed(decimals)}${unit}`;
}

/**
 * Format dates for medical records and appointments
 */
export function formatDate(date: Date | string, format?: 'short' | 'long' | 'time' | 'datetime'): string {
  const d = new Date(date);
  
  switch (format) {
    case 'short':
      return d.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      });
    case 'long':
      return d.toLocaleDateString('en-US', { 
        weekday: 'long',
        month: 'long', 
        day: 'numeric', 
        year: 'numeric' 
      });
    case 'time':
      return d.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });
    case 'datetime':
      return `${formatDate(d, 'short')} at ${formatDate(d, 'time')}`;
    default:
      return d.toLocaleDateString();
  }
}

/**
 * Generate accessibility-friendly IDs
 */
export function generateId(prefix = 'meditrack'): string {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Debounce function for performance optimization
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Throttle function for scroll and resize events
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * Validate vital sign values
 */
export function validateVitalSign(type: string, value: number): {
  isValid: boolean;
  severity: 'normal' | 'warning' | 'critical';
  message?: string;
} {
  const ranges: Record<string, { min: number; max: number; warning: { min: number; max: number } }> = {
    heartRate: { min: 40, max: 200, warning: { min: 60, max: 100 } },
    bloodPressureSystolic: { min: 70, max: 250, warning: { min: 90, max: 140 } },
    bloodPressureDiastolic: { min: 40, max: 150, warning: { min: 60, max: 90 } },
    temperature: { min: 95, max: 110, warning: { min: 97, max: 99.5 } },
    oxygenSaturation: { min: 70, max: 100, warning: { min: 95, max: 100 } },
    glucose: { min: 50, max: 400, warning: { min: 70, max: 140 } },
  };

  const range = ranges[type];
  if (!range) {
    return { isValid: false, severity: 'critical', message: 'Unknown vital sign type' };
  }

  if (value < range.min || value > range.max) {
    return { isValid: false, severity: 'critical', message: 'Value outside safe range' };
  }

  if (value < range.warning.min || value > range.warning.max) {
    return { isValid: true, severity: 'warning', message: 'Value outside normal range' };
  }

  return { isValid: true, severity: 'normal' };
}

/**
 * Calculate health score based on multiple vitals
 */
export function calculateHealthScore(vitals: Record<string, number>): {
  score: number;
  level: 'excellent' | 'good' | 'fair' | 'poor';
  recommendations: string[];
} {
  let totalScore = 0;
  let validVitals = 0;
  const recommendations: string[] = [];

  Object.entries(vitals).forEach(([type, value]) => {
    const validation = validateVitalSign(type, value);
    if (validation.isValid) {
      switch (validation.severity) {
        case 'normal':
          totalScore += 100;
          break;
        case 'warning':
          totalScore += 70;
          recommendations.push(`Monitor your ${type.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
          break;
        case 'critical':
          totalScore += 30;
          recommendations.push(`Consult a healthcare professional about your ${type.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
          break;
      }
      validVitals++;
    }
  });

  const averageScore = validVitals > 0 ? totalScore / validVitals : 0;
  
  let level: 'excellent' | 'good' | 'fair' | 'poor';
  if (averageScore >= 90) level = 'excellent';
  else if (averageScore >= 75) level = 'good';
  else if (averageScore >= 60) level = 'fair';
  else level = 'poor';

  return { score: Math.round(averageScore), level, recommendations };
}

/**
 * Color utilities for health indicators
 */
export const healthColors = {
  excellent: 'text-green-600 bg-green-50 border-green-200',
  good: 'text-blue-600 bg-blue-50 border-blue-200',
  fair: 'text-yellow-600 bg-yellow-50 border-yellow-200',
  poor: 'text-red-600 bg-red-50 border-red-200',
  normal: 'text-green-600 bg-green-50',
  warning: 'text-yellow-600 bg-yellow-50',
  critical: 'text-red-600 bg-red-50',
};

/**
 * Focus trap utility for modals and overlays
 */
export function createFocusTrap(element: HTMLElement): {
  activate: () => void;
  deactivate: () => void;
} {
  const focusableElements = element.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  ) as NodeListOf<HTMLElement>;
  
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'Tab') {
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    }
    
    if (e.key === 'Escape') {
      deactivate();
    }
  }

  function activate() {
    element.addEventListener('keydown', handleKeyDown);
    firstElement?.focus();
  }

  function deactivate() {
    element.removeEventListener('keydown', handleKeyDown);
  }

  return { activate, deactivate };
}

/**
 * Screen reader announcement utility
 */
export function announceToScreenReader(message: string, priority: 'polite' | 'assertive' = 'polite') {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  
  document.body.appendChild(announcement);
  
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

/**
 * Local storage utilities with error handling
 */
export const storage = {
  get: <T>(key: string, defaultValue: T): T => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  },
  
  set: <T>(key: string, value: T): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn('Failed to save to localStorage:', error);
    }
  },
  
  remove: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.warn('Failed to remove from localStorage:', error);
    }
  },
};

export default {
  cn,
  formatNumber,
  formatDate,
  generateId,
  debounce,
  throttle,
  validateVitalSign,
  calculateHealthScore,
  healthColors,
  createFocusTrap,
  announceToScreenReader,
  storage,
};