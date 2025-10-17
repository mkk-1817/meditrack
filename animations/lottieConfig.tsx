/**
 * Lottie Animation Configuration
 * Centralized management for Lottie animations with performance optimization
 */

import React from 'react';

// Mock Lottie player for now (will be replaced with actual Lottie when installed)
interface LottiePlayerProps {
  src: string;
  loop?: boolean;
  autoplay?: boolean;
  speed?: number;
  style?: React.CSSProperties;
  onComplete?: () => void;
  onLoad?: () => void;
}

const LottiePlayerMock: React.FC<LottiePlayerProps> = ({ 
  style = {}, 
  onLoad,
  onComplete 
}) => {
  React.useEffect(() => {
    onLoad?.();
    // Mock completion after 2 seconds
    const timer = setTimeout(() => {
      onComplete?.();
    }, 2000);
    return () => clearTimeout(timer);
  }, [onLoad, onComplete]);

  return (
    <div 
      style={{ 
        width: 100, 
        height: 100, 
        backgroundColor: '#f0f0f0', 
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...style 
      }}
    >
      🎭
    </div>
  );
};

/**
 * Lottie animation configurations for different use cases
 */
export const lottieConfigs = {
  // Loading animations
  heartbeat: {
    src: '/animations/heartbeat-loader.json',
    loop: true,
    autoplay: true,
    speed: 1,
    style: { width: 60, height: 60 },
  },
  
  pulse: {
    src: '/animations/pulse-loader.json',
    loop: true,
    autoplay: true,
    speed: 0.8,
    style: { width: 40, height: 40 },
  },
  
  spinner: {
    src: '/animations/medical-spinner.json',
    loop: true,
    autoplay: true,
    speed: 1.2,
    style: { width: 50, height: 50 },
  },

  // Success animations
  checkmark: {
    src: '/animations/success-checkmark.json',
    loop: false,
    autoplay: true,
    speed: 1,
    style: { width: 80, height: 80 },
  },
  
  celebration: {
    src: '/animations/celebration.json',
    loop: false,
    autoplay: true,
    speed: 1,
    style: { width: 120, height: 120 },
  },

  // Sync animations
  cloudSync: {
    src: '/animations/cloud-sync.json',
    loop: true,
    autoplay: true,
    speed: 0.9,
    style: { width: 100, height: 60 },
  },
  
  dataUpload: {
    src: '/animations/data-upload.json',
    loop: false,
    autoplay: true,
    speed: 1,
    style: { width: 80, height: 80 },
  },

  // Medical icons
  heartRate: {
    src: '/animations/heart-rate.json',
    loop: true,
    autoplay: true,
    speed: 1,
    style: { width: 60, height: 60 },
  },
  
  bloodPressure: {
    src: '/animations/blood-pressure.json',
    loop: false,
    autoplay: false,
    speed: 1,
    style: { width: 70, height: 70 },
  },
  
  temperature: {
    src: '/animations/thermometer.json',
    loop: false,
    autoplay: false,
    speed: 1,
    style: { width: 50, height: 80 },
  },

  // Wellness animations
  meditation: {
    src: '/animations/meditation.json',
    loop: true,
    autoplay: true,
    speed: 0.6,
    style: { width: 100, height: 100 },
  },
  
  exercise: {
    src: '/animations/exercise.json',
    loop: true,
    autoplay: true,
    speed: 1.2,
    style: { width: 90, height: 90 },
  },
  
  sleep: {
    src: '/animations/sleep.json',
    loop: true,
    autoplay: true,
    speed: 0.5,
    style: { width: 80, height: 80 },
  },
};

/**
 * Reusable Lottie Animation Component
 */
interface LottieAnimationProps {
  name: keyof typeof lottieConfigs;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  onComplete?: () => void;
  onLoad?: () => void;
  autoplay?: boolean;
  loop?: boolean;
}

const sizeMap = {
  sm: { width: 30, height: 30 },
  md: { width: 50, height: 50 },
  lg: { width: 80, height: 80 },
  xl: { width: 120, height: 120 },
};

export const LottieAnimation: React.FC<LottieAnimationProps> = ({
  name,
  size = 'md',
  className = '',
  onComplete,
  onLoad,
  autoplay,
  loop,
}) => {
  const config = lottieConfigs[name];
  const sizeStyle = sizeMap[size];
  
  const finalConfig = {
    ...config,
    style: { ...config.style, ...sizeStyle },
    autoplay: autoplay !== undefined ? autoplay : config.autoplay,
    loop: loop !== undefined ? loop : config.loop,
    onComplete,
    onLoad,
  };

  return (
    <div className={className}>
      <LottiePlayerMock {...finalConfig} />
    </div>
  );
};

/**
 * Controlled Lottie Animation Hook
 */
export const useLottieAnimation = (name: keyof typeof lottieConfigs) => {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [isComplete, setIsComplete] = React.useState(false);

  const handleLoad = React.useCallback(() => {
    setIsLoaded(true);
  }, []);

  const handleComplete = React.useCallback(() => {
    setIsComplete(true);
    setIsPlaying(false);
  }, []);

  const play = React.useCallback(() => {
    if (isLoaded) {
      setIsPlaying(true);
      setIsComplete(false);
    }
  }, [isLoaded]);

  const pause = React.useCallback(() => {
    setIsPlaying(false);
  }, []);

  const reset = React.useCallback(() => {
    setIsComplete(false);
    setIsPlaying(false);
  }, []);

  return {
    isPlaying,
    isLoaded,
    isComplete,
    play,
    pause,
    reset,
    handleLoad,
    handleComplete,
  };
};

/**
 * Loading State Component with Lottie
 */
interface LoadingStateProps {
  type?: 'heartbeat' | 'pulse' | 'spinner';
  message?: string;
  className?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  type = 'heartbeat',
  message = 'Loading...',
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center space-y-4 ${className}`}>
      <LottieAnimation name={type} size="lg" />
      {message && (
        <p className="text-sm text-gray-600 font-medium animate-pulse">
          {message}
        </p>
      )}
    </div>
  );
};

/**
 * Success State Component with Lottie
 */
interface SuccessStateProps {
  type?: 'checkmark' | 'celebration';
  message?: string;
  onComplete?: () => void;
  className?: string;
}

export const SuccessState: React.FC<SuccessStateProps> = ({
  type = 'checkmark',
  message = 'Success!',
  onComplete,
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center space-y-4 ${className}`}>
      <LottieAnimation 
        name={type} 
        size="xl" 
        onComplete={onComplete}
      />
      {message && (
        <p className="text-lg text-primary-600 font-semibold">
          {message}
        </p>
      )}
    </div>
  );
};

/**
 * Interactive Vital Sign Icon
 */
interface VitalSignIconProps {
  type: 'heartRate' | 'bloodPressure' | 'temperature';
  isActive?: boolean;
  onClick?: () => void;
  className?: string;
}

export const VitalSignIcon: React.FC<VitalSignIconProps> = ({
  type,
  isActive = false,
  onClick,
  className = '',
}) => {
  const { play, pause, isPlaying } = useLottieAnimation(type);

  React.useEffect(() => {
    if (isActive && !isPlaying) {
      play();
    } else if (!isActive && isPlaying) {
      pause();
    }
  }, [isActive, isPlaying, play, pause]);

  return (
    <button
      onClick={onClick}
      className={`p-2 rounded-lg transition-all duration-300 hover:bg-gray-50 ${className}`}
      aria-label={`${type} vital sign`}
    >
      <LottieAnimation 
        name={type} 
        size="md"
        autoplay={isActive}
      />
    </button>
  );
};

/**
 * Wellness Activity Animation
 */
interface WellnessActivityProps {
  activity: 'meditation' | 'exercise' | 'sleep';
  isActive?: boolean;
  progress?: number;
  className?: string;
}

export const WellnessActivity: React.FC<WellnessActivityProps> = ({
  activity,
  isActive = true,
  progress = 0,
  className = '',
}) => {
  return (
    <div className={`relative ${className}`}>
      <LottieAnimation 
        name={activity} 
        size="lg"
        autoplay={isActive}
      />
      {progress > 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-xs font-bold text-primary-600">
            {Math.round(progress)}%
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Lottie Animation Preloader
 */
export const preloadLottieAnimations = async (animations: (keyof typeof lottieConfigs)[]) => {
  // In a real implementation, this would preload the Lottie JSON files
  const preloadPromises = animations.map(async (name) => {
    const config = lottieConfigs[name];
    try {
      // Mock preload - replace with actual fetch
      await new Promise(resolve => setTimeout(resolve, 100));
      console.log(`Preloaded ${name} animation from ${config.src}`);
    } catch (error) {
      console.warn(`Failed to preload ${name} animation:`, error);
    }
  });

  await Promise.all(preloadPromises);
};

/**
 * Performance optimization: Lazy load animations
 */
export const useLazyLottie = (name: keyof typeof lottieConfigs, threshold = 0.1) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const [shouldLoad, setShouldLoad] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          setShouldLoad(true);
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  return { ref, shouldLoad, isVisible };
};

export default LottieAnimation;