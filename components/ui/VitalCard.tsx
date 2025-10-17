'use client';

import React, { useState } from 'react';

/**
 * VitalCard Component
 * Displays vital sign metrics with shimmer loading and hover animations
 */

interface VitalCardProps {
  title: string;
  value: number | string;
  unit?: string;
  trend?: 'up' | 'down' | 'stable';
  trendValue?: number;
  severity?: 'normal' | 'warning' | 'critical';
  icon?: string;
  isLoading?: boolean;
  onClick?: () => void;
  className?: string;
}

const severityColors = {
  normal: 'text-green-600 bg-green-50 border-green-200',
  warning: 'text-yellow-600 bg-yellow-50 border-yellow-200',
  critical: 'text-red-600 bg-red-50 border-red-200',
};

const trendIcons = {
  up: '↗️',
  down: '↘️',
  stable: '➡️',
};

export const VitalCard: React.FC<VitalCardProps> = ({
  title,
  value,
  unit = '',
  trend,
  trendValue,
  severity = 'normal',
  icon = '📊',
  isLoading = false,
  onClick,
  className = '',
}) => {
  const [isHovered, setIsHovered] = useState(false);

  if (isLoading) {
    return (
      <div className={`card-luxury p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-4">
            <div className="w-8 h-8 bg-gray-200 rounded-full shimmer" />
            <div className="w-16 h-4 bg-gray-200 rounded shimmer" />
          </div>
          <div className="space-y-3">
            <div className="w-20 h-8 bg-gray-200 rounded shimmer" />
            <div className="w-full h-4 bg-gray-200 rounded shimmer" />
          </div>
        </div>
      </div>
    );
  }

  const cardContent = (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <span className="text-2xl" role="img" aria-label={title}>
            {icon}
          </span>
          <h3 className="font-medium text-gray-700">{title}</h3>
        </div>
        
        {severity !== 'normal' && (
          <div
            className={`px-2 py-1 rounded-full text-xs font-medium border ${severityColors[severity]}`}
            role="status"
            aria-label={`${severity} level`}
          >
            {severity}
          </div>
        )}
      </div>

      {/* Value */}
      <div className="mb-3">
        <div className="flex items-baseline space-x-1">
          <span className="text-3xl font-bold text-gray-900">
            {value}
          </span>
          {unit && (
            <span className="text-sm text-gray-500 font-medium">
              {unit}
            </span>
          )}
        </div>
      </div>

      {/* Trend */}
      {trend && (
        <div className="flex items-center space-x-2">
          <span className="text-lg" role="img" aria-label={`Trend ${trend}`}>
            {trendIcons[trend]}
          </span>
          <span
            className={`text-sm font-medium ${
              trend === 'up' 
                ? 'text-green-600' 
                : trend === 'down' 
                ? 'text-red-600' 
                : 'text-gray-600'
            }`}
          >
            {trendValue !== undefined && (
              <>
                {trend === 'up' ? '+' : trend === 'down' ? '-' : ''}
                {Math.abs(trendValue)}
                {unit && ` ${unit}`}
              </>
            )}
            <span className="text-gray-500 ml-1">
              vs last reading
            </span>
          </span>
        </div>
      )}

      {/* Hover Indicator */}
      {onClick && isHovered && (
        <div className="absolute top-2 right-2">
          <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse" />
        </div>
      )}
    </>
  );

  const baseClasses = `
    relative card-luxury transition-all duration-300 cursor-pointer
    ${isHovered ? 'transform scale-105 shadow-luxury-hover' : 'shadow-luxury'}
    ${onClick ? 'hover:scale-105 hover:shadow-luxury-hover' : ''}
    ${className}
  `;

  if (onClick) {
    return (
      <button
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={baseClasses}
        aria-label={`View details for ${title}: ${value} ${unit}`}
      >
        {cardContent}
      </button>
    );
  }

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={baseClasses}
    >
      {cardContent}
    </div>
  );
};

/**
 * VitalCardSkeleton for loading states
 */
export const VitalCardSkeleton: React.FC<{ className?: string }> = ({ 
  className = '' 
}) => (
  <div className={`card-luxury p-6 ${className}`}>
    <div className="animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gray-200 rounded-full shimmer" />
          <div className="w-24 h-4 bg-gray-200 rounded shimmer" />
        </div>
        <div className="w-16 h-6 bg-gray-200 rounded-full shimmer" />
      </div>
      <div className="space-y-3">
        <div className="w-20 h-8 bg-gray-200 rounded shimmer" />
        <div className="w-32 h-4 bg-gray-200 rounded shimmer" />
      </div>
    </div>
  </div>
);

/**
 * VitalCardGrid for displaying multiple vitals
 */
interface VitalCardGridProps {
  vitals: Array<Omit<VitalCardProps, 'className'>>;
  isLoading?: boolean;
  onVitalClick?: (index: number) => void;
  className?: string;
}

export const VitalCardGrid: React.FC<VitalCardGridProps> = ({
  vitals,
  isLoading = false,
  onVitalClick,
  className = '',
}) => {
  if (isLoading) {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${className}`}>
        {Array.from({ length: 8 }).map((_, index) => (
          <VitalCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${className}`}>
      {vitals.map((vital, index) => (
        <VitalCard
          key={`${vital.title}-${index}`}
          {...vital}
          onClick={onVitalClick ? () => onVitalClick(index) : undefined}
        />
      ))}
    </div>
  );
};

export default VitalCard;