/**
 * Jest Setup File for Medi Track Testing Environment
 * Configures testing utilities, mocks, and global test helpers
 */

import '@testing-library/jest-dom';
import 'jest-canvas-mock';
import React from 'react';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
    };
  },
  usePathname() {
    return '/';
  },
  useSearchParams() {
    return new URLSearchParams();
  },
}));

// Mock Framer Motion to prevent animation issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => React.createElement('div', props, children),
    span: ({ children, ...props }: any) => React.createElement('span', props, children),
    button: ({ children, ...props }: any) => React.createElement('button', props, children),
    section: ({ children, ...props }: any) => React.createElement('section', props, children),
    article: ({ children, ...props }: any) => React.createElement('article', props, children),
    header: ({ children, ...props }: any) => React.createElement('header', props, children),
    main: ({ children, ...props }: any) => React.createElement('main', props, children),
    nav: ({ children, ...props }: any) => React.createElement('nav', props, children),
    aside: ({ children, ...props }: any) => React.createElement('aside', props, children),
    footer: ({ children, ...props }: any) => React.createElement('footer', props, children),
    h1: ({ children, ...props }: any) => React.createElement('h1', props, children),
    h2: ({ children, ...props }: any) => React.createElement('h2', props, children),
    h3: ({ children, ...props }: any) => React.createElement('h3', props, children),
    p: ({ children, ...props }: any) => React.createElement('p', props, children),
    ul: ({ children, ...props }: any) => React.createElement('ul', props, children),
    li: ({ children, ...props }: any) => React.createElement('li', props, children),
    img: ({ children, ...props }: any) => React.createElement('img', { ...props, alt: props.alt || '' }),
  },
  AnimatePresence: ({ children }: any) => children,
  useAnimation: () => ({
    start: jest.fn(),
    stop: jest.fn(),
    set: jest.fn(),
  }),
  useInView: () => true,
  useMotionValue: (value: any) => ({
    set: jest.fn(),
    get: () => value,
    on: jest.fn(),
    destroy: jest.fn(),
  }),
  useSpring: (value: any) => value,
  useTransform: () => 0,
  useScroll: () => ({
    scrollY: { on: jest.fn() },
    scrollYProgress: { on: jest.fn() },
  }),
}));

// Mock GSAP to prevent animation issues
jest.mock('gsap', () => ({
  gsap: {
    timeline: () => ({
      to: jest.fn().mockReturnThis(),
      from: jest.fn().mockReturnThis(),
      fromTo: jest.fn().mockReturnThis(),
      set: jest.fn().mockReturnThis(),
      play: jest.fn(),
      pause: jest.fn(),
      reverse: jest.fn(),
      kill: jest.fn(),
    }),
    to: jest.fn(),
    from: jest.fn(),
    fromTo: jest.fn(),
    set: jest.fn(),
    registerPlugin: jest.fn(),
  },
  ScrollTrigger: {
    create: jest.fn(),
    refresh: jest.fn(),
    update: jest.fn(),
    kill: jest.fn(),
  },
  TextPlugin: {},
  ScrollToPlugin: {},
}));

// Mock Lottie animations
jest.mock('lottie-react', () => ({
  __esModule: true,
  default: ({ testId, ...props }: any) => 
    React.createElement('div', { 'data-testid': testId || 'lottie-animation', ...props }),
}));

// Mock Canvas API for chart components
Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
  value: jest.fn(() => ({
    fillRect: jest.fn(),
    clearRect: jest.fn(),
    getImageData: jest.fn(() => ({ data: new Array(4) })),
    putImageData: jest.fn(),
    createImageData: jest.fn(() => ({ data: new Array(4) })),
    setTransform: jest.fn(),
    drawImage: jest.fn(),
    save: jest.fn(),
    fillText: jest.fn(),
    restore: jest.fn(),
    beginPath: jest.fn(),
    moveTo: jest.fn(),
    lineTo: jest.fn(),
    closePath: jest.fn(),
    stroke: jest.fn(),
    translate: jest.fn(),
    scale: jest.fn(),
    rotate: jest.fn(),
    arc: jest.fn(),
    fill: jest.fn(),
    measureText: jest.fn(() => ({ width: 0 })),
    transform: jest.fn(),
    rect: jest.fn(),
    clip: jest.fn(),
  })),
});

// Mock IntersectionObserver for scroll-based animations
global.IntersectionObserver = jest.fn().mockImplementation((callback) => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
  takeRecords: jest.fn(() => []),
}));

// Mock ResizeObserver for responsive components
global.ResizeObserver = jest.fn().mockImplementation((callback) => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock matchMedia for responsive design tests
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock scrollTo for navigation tests
Object.defineProperty(window, 'scrollTo', {
  value: jest.fn(),
  writable: true,
});

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock sessionStorage
const sessionStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'sessionStorage', {
  value: sessionStorageMock,
});

// Mock fetch for API tests
global.fetch = jest.fn();

// Setup console.error to track React warnings in tests
const originalError = console.error;
beforeAll(() => {
  console.error = (...args: any[]) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ReactDOM.render is no longer supported')
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});

// Global test utilities
export const mockVitalData = {
  heartRate: 72,
  bloodPressure: { systolic: 120, diastolic: 80 },
  temperature: 98.6,
  oxygenSaturation: 98,
  glucose: 95,
  timestamp: new Date().toISOString(),
};

export const mockUserData = {
  id: 'test-user-123',
  name: 'Test User',
  email: 'test@example.com',
  age: 30,
  gender: 'other',
  medicalConditions: [],
  medications: [],
};

export const mockInsightData = {
  id: 'insight-123',
  type: 'cardiovascular',
  priority: 'medium' as const,
  title: 'Heart Rate Trending Higher',
  description: 'Your heart rate has been slightly elevated over the past week.',
  recommendation: 'Consider stress management techniques and regular exercise.',
  confidence: 85,
  category: 'heart_health',
  timestamp: new Date().toISOString(),
};

// Custom render function with providers (if needed in the future)
// import { render as rtlRender } from '@testing-library/react';
// export function render(ui: React.ReactElement, { ...renderOptions } = {}) {
//   function Wrapper({ children }: { children: React.ReactNode }) {
//     return children; // Add providers here when needed
//   }
//   return rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
// }