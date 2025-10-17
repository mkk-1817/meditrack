'use client';

/**
 * VitalCard Component - Reusable vital sign display card
 * Displays vital signs with trend indicators and status
 */

import { motion } from 'framer-motion';
import { itemVariants } from '@/animations/motionVariants';
import { useState, useEffect } from 'react';

export interface VitalCardProps {
  title: string;
  value: string | number;
  unit?: string;
  trend?: 'increasing' | 'decreasing' | 'stable';
  status?: 'normal' | 'warning' | 'critical';
  icon?: string;
  lastUpdated?: string;
  target?: string;
  index?: number;
  onClick?: () => void;
}

const VitalCard: React.FC<VitalCardProps> = ({
  title,
  value,
  unit,
  trend = 'stable',
  status = 'normal',
  icon,
  lastUpdated,
  target,
  index = 0,
  onClick
}) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check for dark mode
    const checkDarkMode = () => {
      const isDark = document.body.classList.contains('dark');
      setIsDarkMode(isDark);
    };

    checkDarkMode();

    // Watch for dark mode changes
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.body, { 
      attributes: true, 
      attributeFilter: ['class'] 
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  const getStatusColor = () => {
    if (isDarkMode) {
      switch (status) {
        case 'critical':
          return 'dark-card-critical';
        case 'warning':
          return 'dark-card-warning';
        default:
          return 'dark-card-normal';
      }
    } else {
      switch (status) {
        case 'critical':
          return 'border-red-300 bg-red-50/50';
        case 'warning':
          return 'border-yellow-300 bg-yellow-50/50';
        default:
          return 'border-teal-200/30 bg-white/80';
      }
    }
  };

  const getTrendIcon = () => {
    switch (trend) {
      case 'increasing':
        return '📈';
      case 'decreasing':
        return '📉';
      default:
        return '➡️';
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case 'increasing':
        return status === 'critical' ? 'text-red-600' : 'text-green-600';
      case 'decreasing':
        return status === 'critical' ? 'text-green-600' : 'text-red-600';
      default:
        return isDarkMode ? 'text-gray-400' : 'text-navy-600';
    }
  };

  return (
    <motion.div
      variants={itemVariants}
      custom={index}
      whileHover={{ 
        scale: 1.02, 
        y: -2,
        transition: { duration: 0.2 } 
      }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`
        backdrop-blur-sm border rounded-xl p-6 shadow-clinical hover:shadow-clinical-hover 
        transition-all duration-300 cursor-pointer
        ${getStatusColor()}
      `}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          {icon && (
            <div className="text-2xl">{icon}</div>
          )}
          <h3 className={`text-lg font-heading font-semibold transition-colors duration-300 ${
            isDarkMode ? 'text-white' : 'text-navy-900'
          }`}>
            {title}
          </h3>
        </div>
        <div className={`text-lg ${getTrendColor()}`}>
          {getTrendIcon()}
        </div>
      </div>

      <div className="mb-3">
        <div className="flex items-baseline space-x-2">
          <span className={`text-3xl font-heading font-bold transition-colors duration-300 ${
            isDarkMode ? 'text-white' : 'text-navy-900'
          }`}>
            {value}
          </span>
          {unit && (
            <span className={`text-lg font-body transition-colors duration-300 ${
              isDarkMode ? 'text-gray-300' : 'text-navy-600'
            }`}>
              {unit}
            </span>
          )}
        </div>
        {target && (
          <div className={`text-sm font-body mt-1 transition-colors duration-300 ${
            isDarkMode ? 'text-gray-400' : 'text-navy-500'
          }`}>
            Target: {target}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className={`
          px-3 py-1 rounded-full text-xs font-body font-medium transition-colors duration-300
          ${status === 'critical' 
            ? isDarkMode ? 'bg-red-900/50 text-red-300' : 'bg-red-100 text-red-700'
            : status === 'warning' 
            ? isDarkMode ? 'bg-yellow-900/50 text-yellow-300' : 'bg-yellow-100 text-yellow-700'
            : isDarkMode ? 'bg-green-900/50 text-green-300' : 'bg-green-100 text-green-700'
          }
        `}>
          {status === 'critical' ? 'Critical' :
           status === 'warning' ? 'Warning' : 'Normal'}
        </div>
        {lastUpdated && (
          <div className={`text-xs font-body transition-colors duration-300 ${
            isDarkMode ? 'text-gray-400' : 'text-navy-500'
          }`}>
            {lastUpdated}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default VitalCard;