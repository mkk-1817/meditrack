/**
 * GSAP ScrollTrigger Animations
 * Advanced scroll-based animations for charts, KPIs, and hero elements
 * Optimized for performance with proper cleanup
 */

// GSAP utilities (will be replaced with actual GSAP when installed)
const gsapMock = {
  timeline: () => ({
    from: () => gsapMock.timeline(),
    to: () => gsapMock.timeline(),
    set: () => gsapMock.timeline(),
    fromTo: () => gsapMock.timeline(),
  }),
  from: () => {},
  to: () => {},
  set: () => {},
  fromTo: () => {},
  registerPlugin: () => {},
};

// Mock ScrollTrigger for SSR compatibility
// const createScrollTriggerMock = () => ({
//   create: () => {},
//   refresh: () => {},
//   getAll: () => [],
//   killAll: () => {}
// });

/**
 * Hero pulse animation with GSAP
 */
export const createHeroPulseAnimation = (element: HTMLElement) => {
  // This will be replaced with actual GSAP implementation
  const tl = gsapMock.timeline();
  
  // Mock implementation - replace with real GSAP
  if (element) {
    element.style.animation = 'pulse 3s ease-in-out infinite';
  }
  
  return {
    play: () => tl,
    pause: () => tl,
    kill: () => {
      if (element) {
        element.style.animation = '';
      }
    },
  };
  
  // Real GSAP implementation (commented for now):
  /*
  gsap.registerPlugin(ScrollTrigger);
  
  const tl = gsap.timeline({ repeat: -1, yoyo: true });
  
  tl.to(element, {
    scale: 1.05,
    duration: 2,
    ease: "power2.inOut"
  })
  .to(element, {
    boxShadow: "0 0 60px rgba(199, 149, 73, 0.4)",
    duration: 2,
    ease: "power2.inOut"
  }, 0);
  
  return tl;
  */
};

/**
 * KPI reveal animation on scroll
 */
export const createKPIRevealAnimation = (elements: HTMLElement[]) => {
  const animations: any[] = [];
  
  elements.forEach((element, index) => {
    // Mock implementation
    setTimeout(() => {
      if (element) {
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
        element.style.transition = 'all 0.5s ease-out';
      }
    }, index * 100);
    
    // Real GSAP implementation (commented for now):
    /*
    const animation = gsap.fromTo(element, 
      {
        y: 50,
        opacity: 0,
        scale: 0.8
      },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.6,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: element,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse"
        }
      }
    );
    
    animations.push(animation);
    */
  });
  
  return {
    kill: () => {
      animations.forEach(anim => anim?.kill?.());
    },
  };
};

/**
 * Chart entry animation with stagger
 */
export const createChartEntryAnimation = (chartContainer: HTMLElement, dataElements: HTMLElement[]) => {
  // Mock implementation
  setTimeout(() => {
    if (chartContainer) {
      chartContainer.style.opacity = '1';
      chartContainer.style.transform = 'scale(1)';
      chartContainer.style.transition = 'all 0.5s ease-out';
    }
    
    dataElements.forEach((element, index) => {
      setTimeout(() => {
        if (element) {
          element.style.opacity = '1';
          element.style.transform = 'translateY(0)';
          element.style.transition = 'all 0.3s ease-out';
        }
      }, index * 50);
    });
  }, 200);
  
  // Real GSAP implementation (commented for now):
  /*
  gsap.registerPlugin(ScrollTrigger);
  
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: chartContainer,
      start: "top 75%",
      end: "bottom 25%",
      toggleActions: "play none none reverse"
    }
  });
  
  // Animate container first
  tl.fromTo(chartContainer, 
    {
      scale: 0.8,
      opacity: 0
    },
    {
      scale: 1,
      opacity: 1,
      duration: 0.5,
      ease: "power2.out"
    }
  );
  
  // Then animate data elements with stagger
  tl.fromTo(dataElements,
    {
      y: 30,
      opacity: 0
    },
    {
      y: 0,
      opacity: 1,
      duration: 0.4,
      stagger: 0.1,
      ease: "power2.out"
    },
    "-=0.2"
  );
  
  return tl;
  */
  
  return {
    kill: () => {},
  };
};

/**
 * Vitals card reveal animation
 */
export const createVitalsCardAnimation = (cards: HTMLElement[]) => {
  const animations: any[] = [];
  
  cards.forEach((card, index) => {
    // Mock implementation
    setTimeout(() => {
      if (card) {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0) scale(1)';
        card.style.transition = 'all 0.4s ease-out';
      }
    }, index * 75);
    
    // Real GSAP implementation (commented for now):
    /*
    const animation = gsap.fromTo(card,
      {
        y: 40,
        scale: 0.9,
        opacity: 0
      },
      {
        y: 0,
        scale: 1,
        opacity: 1,
        duration: 0.5,
        ease: "back.out(1.4)",
        scrollTrigger: {
          trigger: card,
          start: "top 85%",
          toggleActions: "play none none reverse"
        }
      }
    );
    
    animations.push(animation);
    */
  });
  
  return {
    kill: () => {
      animations.forEach(anim => anim?.kill?.());
    },
  };
};

/**
 * Progress bar fill animation
 */
export const createProgressAnimation = (progressBar: HTMLElement, targetWidth: number) => {
  // Mock implementation
  if (progressBar) {
    progressBar.style.width = '0%';
    progressBar.style.transition = 'width 1s ease-out';
    setTimeout(() => {
      progressBar.style.width = `${targetWidth}%`;
    }, 100);
  }
  
  // Real GSAP implementation (commented for now):
  /*
  return gsap.fromTo(progressBar,
    { width: "0%" },
    {
      width: `${targetWidth}%`,
      duration: 1,
      ease: "power2.out",
      scrollTrigger: {
        trigger: progressBar,
        start: "top 90%",
        toggleActions: "play none none reverse"
      }
    }
  );
  */
  
  return {
    kill: () => {},
  };
};

/**
 * Text reveal animation with typewriter effect
 */
export const createTextRevealAnimation = (textElement: HTMLElement, text: string) => {
  // Mock implementation
  if (textElement) {
    let currentText = '';
    const chars = text.split('');
    let index = 0;
    
    const typeInterval = setInterval(() => {
      if (index < chars.length) {
        currentText += chars[index];
        textElement.textContent = currentText;
        index++;
      } else {
        clearInterval(typeInterval);
      }
    }, 50);
    
    return {
      kill: () => clearInterval(typeInterval),
    };
  }
  
  // Real GSAP implementation (commented for now):
  /*
  const chars = text.split('');
  const spans = chars.map(char => `<span>${char}</span>`).join('');
  textElement.innerHTML = spans;
  
  const spanElements = textElement.querySelectorAll('span');
  
  return gsap.fromTo(spanElements,
    { opacity: 0, y: 20 },
    {
      opacity: 1,
      y: 0,
      duration: 0.05,
      stagger: 0.03,
      ease: "power2.out",
      scrollTrigger: {
        trigger: textElement,
        start: "top 80%",
        toggleActions: "play none none reverse"
      }
    }
  );
  */
  
  return { kill: () => {} };
};

/**
 * Parallax scroll effect
 */
export const createParallaxAnimation = (element: HTMLElement, speed = 0.5) => {
  // Mock implementation
  const handleScroll = () => {
    const scrolled = window.pageYOffset;
    if (element) {
      element.style.transform = `translateY(${scrolled * speed}px)`;
    }
  };
  
  window.addEventListener('scroll', handleScroll);
  
  return {
    kill: () => {
      window.removeEventListener('scroll', handleScroll);
    },
  };
  
  // Real GSAP implementation (commented for now):
  /*
  return gsap.to(element, {
    yPercent: -50,
    ease: "none",
    scrollTrigger: {
      trigger: element,
      start: "top bottom",
      end: "bottom top",
      scrub: true
    }
  });
  */
};

/**
 * Counter animation for numeric values
 */
export const createCounterAnimation = (element: HTMLElement, endValue: number, duration = 1) => {
  // Mock implementation
  let startValue = 0;
  const increment = endValue / (duration * 60); // 60fps
  
  const animate = () => {
    startValue += increment;
    if (startValue < endValue) {
      element.textContent = Math.floor(startValue).toString();
      requestAnimationFrame(animate);
    } else {
      element.textContent = endValue.toString();
    }
  };
  
  animate();
  
  // Real GSAP implementation (commented for now):
  /*
  const obj = { value: 0 };
  return gsap.to(obj, {
    value: endValue,
    duration: duration,
    ease: "power2.out",
    onUpdate: () => {
      element.textContent = Math.floor(obj.value).toString();
    },
    scrollTrigger: {
      trigger: element,
      start: "top 80%",
      toggleActions: "play none none reverse"
    }
  });
  */
  
  return { kill: () => {} };
};

/**
 * Cleanup all ScrollTrigger animations
 */
export const cleanupScrollTriggers = () => {
  // Real GSAP implementation (commented for now):
  // ScrollTrigger.getAll().forEach(trigger => trigger.kill());
  // ScrollTrigger.refresh();
};

/**
 * Refresh ScrollTrigger after layout changes
 */
export const refreshScrollTriggers = () => {
  // Real GSAP implementation (commented for now):
  // ScrollTrigger.refresh();
};

/**
 * GSAP and Framer Motion interop utilities
 */
export const gsapFramerInterop = {
  /**
   * Pause GSAP animations when Framer Motion takes over
   */
  pauseGSAP: (_timeline: any) => {
    // timeline?.pause();
  },
  
  /**
   * Resume GSAP animations after Framer Motion completes
   */
  resumeGSAP: (_timeline: any) => {
    // timeline?.resume();
  },
  
  /**
   * Sync GSAP timeline with Framer Motion progress
   */
  syncWithFramerMotion: (_timeline: any, _progress: number) => {
    // timeline?.progress(progress);
  },
};

// Export animation registry for cleanup
export const animationRegistry = new Set<any>();

/**
 * Register animation for cleanup
 */
export const registerAnimation = (animation: any) => {
  animationRegistry.add(animation);
  return animation;
};

/**
 * Cleanup all registered animations
 */
export const cleanupAllAnimations = () => {
  animationRegistry.forEach(animation => {
    if (animation?.kill) {
      animation.kill();
    }
  });
  animationRegistry.clear();
};