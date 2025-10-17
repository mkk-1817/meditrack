'use client';

import React, { useEffect, useRef, useState } from 'react';

/**
 * Custom Cursor Component
 * Provides a luxury gold glow cursor effect for interactive elements
 */
interface CustomCursorProps {
  className?: string;
}

export const CustomCursor: React.FC<CustomCursorProps> = ({ className = '' }) => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Only show custom cursor on devices with mouse
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (hasTouch) return;

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnterInteractive = () => {
      setIsHovering(true);
    };

    const handleMouseLeaveInteractive = () => {
      setIsHovering(false);
    };

    // Track mouse movement
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    // Track interactive elements
    const interactiveElements = document.querySelectorAll(
      'button, a, input, textarea, select, [role="button"], [tabindex], .cursor-pointer'
    );

    interactiveElements.forEach(element => {
      element.addEventListener('mouseenter', handleMouseEnterInteractive);
      element.addEventListener('mouseleave', handleMouseLeaveInteractive);
    });

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      
      interactiveElements.forEach(element => {
        element.removeEventListener('mouseenter', handleMouseEnterInteractive);
        element.removeEventListener('mouseleave', handleMouseLeaveInteractive);
      });
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div
      ref={cursorRef}
      className={`fixed pointer-events-none z-50 transition-all duration-300 ease-out ${className}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: 'translate(-50%, -50%)',
      }}
    >
      {/* Main cursor dot */}
      <div
        className={`w-2 h-2 bg-primary-500 rounded-full transition-all duration-200 ${
          isHovering ? 'scale-150' : 'scale-100'
        }`}
      />
      
      {/* Glow effect */}
      <div
        className={`absolute inset-0 w-8 h-8 -translate-x-3 -translate-y-3 rounded-full transition-all duration-300 ${
          isHovering 
            ? 'bg-primary-400 opacity-30 scale-150' 
            : 'bg-primary-500 opacity-20 scale-100'
        }`}
        style={{
          background: isHovering 
            ? 'radial-gradient(circle, rgba(199, 149, 73, 0.4) 0%, rgba(199, 149, 73, 0.1) 50%, transparent 100%)'
            : 'radial-gradient(circle, rgba(199, 149, 73, 0.2) 0%, rgba(199, 149, 73, 0.05) 50%, transparent 100%)',
          filter: 'blur(4px)',
        }}
      />
      
      {/* Outer glow for interactive elements */}
      {isHovering && (
        <div
          className="absolute inset-0 w-12 h-12 -translate-x-6 -translate-y-6 rounded-full animate-pulse"
          style={{
            background: 'radial-gradient(circle, rgba(199, 149, 73, 0.2) 0%, transparent 70%)',
            filter: 'blur(8px)',
          }}
        />
      )}
    </div>
  );
};

export default CustomCursor;