/**
 * Wellness Aura Particle System
 * Creates an animated gradient background with floating particles
 * Uses GSAP for smooth performance and Canvas for particle rendering
 */

import React from 'react';

// GSAP utility functions (will be replaced with actual GSAP when installed)
const gsapUtils = {
  random: (min: number, max?: number): number => {
    if (max === undefined) {
      max = min;
      min = 0;
    }
    return Math.random() * (max - min) + min;
  },
  clamp: (min: number, max: number, value: number): number => {
    return Math.min(Math.max(value, min), max);
  },
};

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  opacity: number;
  life: number;
  maxLife: number;
}

export class WellnessAura {
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private particles: Particle[] = [];
  private animationId: number | null = null;
  private isActive = false;

  // Luxury color palette for particles
  private colors = [
    'rgba(199, 149, 73, 0.6)',   // Gold
    'rgba(27, 77, 79, 0.4)',     // Teal
    'rgba(248, 250, 249, 0.8)',  // Ivory
    'rgba(199, 149, 73, 0.3)',   // Light Gold
    'rgba(27, 77, 79, 0.2)',     // Light Teal
  ];

  /**
   * Initialize the wellness aura system
   */
  public init(canvasElement: HTMLCanvasElement): void {
    this.canvas = canvasElement;
    this.ctx = this.canvas.getContext('2d');
    
    if (!this.ctx) {
      console.warn('Canvas context not available');
      return;
    }

    this.setupCanvas();
    this.createParticles();
    this.start();

    // Handle window resize
    window.addEventListener('resize', this.handleResize.bind(this));
  }

  /**
   * Setup canvas dimensions and properties
   */
  private setupCanvas(): void {
    if (!this.canvas) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = this.canvas.getBoundingClientRect();

    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;
    this.canvas.style.width = `${rect.width}px`;
    this.canvas.style.height = `${rect.height}px`;

    if (this.ctx) {
      this.ctx.scale(dpr, dpr);
    }
  }

  /**
   * Create initial particles with random properties
   */
  private createParticles(): void {
    if (!this.canvas) return;

    const particleCount = Math.min(50, Math.floor((this.canvas.width * this.canvas.height) / 10000));
    
    for (let i = 0; i < particleCount; i++) {
      this.particles.push(this.createParticle());
    }
  }

  /**
   * Create a single particle with random properties
   */
  private createParticle(): Particle {
    if (!this.canvas) {
      throw new Error('Canvas not initialized');
    }

    const maxLife = gsapUtils.random(3000, 8000);
    
    return {
      x: gsapUtils.random(0, this.canvas.width / (window.devicePixelRatio || 1)),
      y: gsapUtils.random(0, this.canvas.height / (window.devicePixelRatio || 1)),
      vx: gsapUtils.random(-0.5, 0.5),
      vy: gsapUtils.random(-0.3, 0.3),
      radius: gsapUtils.random(1, 4),
      color: this.colors[Math.floor(gsapUtils.random(0, this.colors.length))],
      opacity: gsapUtils.random(0.1, 0.6),
      life: 0,
      maxLife,
    };
  }

  /**
   * Update particle positions and properties
   */
  private updateParticles(): void {
    if (!this.canvas || !this.ctx) return;

    const canvasWidth = this.canvas.width / (window.devicePixelRatio || 1);
    const canvasHeight = this.canvas.height / (window.devicePixelRatio || 1);

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const particle = this.particles[i];
      
      // Update position
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.life += 16; // Assuming 60fps

      // Apply gentle drift
      particle.vx += gsapUtils.random(-0.01, 0.01);
      particle.vy += gsapUtils.random(-0.01, 0.01);

      // Limit velocity
      particle.vx = gsapUtils.clamp(-1, 1, particle.vx);
      particle.vy = gsapUtils.clamp(-1, 1, particle.vy);

      // Update opacity based on life cycle
      const lifeRatio = particle.life / particle.maxLife;
      if (lifeRatio < 0.2) {
        particle.opacity = (lifeRatio / 0.2) * 0.6;
      } else if (lifeRatio > 0.8) {
        particle.opacity = ((1 - lifeRatio) / 0.2) * 0.6;
      }

      // Wrap around screen edges
      if (particle.x < -particle.radius) particle.x = canvasWidth + particle.radius;
      if (particle.x > canvasWidth + particle.radius) particle.x = -particle.radius;
      if (particle.y < -particle.radius) particle.y = canvasHeight + particle.radius;
      if (particle.y > canvasHeight + particle.radius) particle.y = -particle.radius;

      // Remove old particles
      if (particle.life >= particle.maxLife) {
        this.particles.splice(i, 1);
        // Replace with new particle
        this.particles.push(this.createParticle());
      }
    }
  }

  /**
   * Render particles to canvas
   */
  private renderParticles(): void {
    if (!this.ctx || !this.canvas) return;

    // Clear canvas with subtle gradient
    const gradient = this.ctx.createLinearGradient(0, 0, this.canvas.width, this.canvas.height);
    gradient.addColorStop(0, 'rgba(248, 250, 249, 0.02)');
    gradient.addColorStop(0.5, 'rgba(199, 149, 73, 0.01)');
    gradient.addColorStop(1, 'rgba(27, 77, 79, 0.01)');
    
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Render particles
    for (const particle of this.particles) {
      this.ctx.save();
      this.ctx.globalAlpha = particle.opacity;
      this.ctx.fillStyle = particle.color;
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      this.ctx.fill();
      
      // Add subtle glow effect
      this.ctx.shadowBlur = particle.radius * 2;
      this.ctx.shadowColor = particle.color;
      this.ctx.fill();
      
      this.ctx.restore();
    }
  }

  /**
   * Animation loop
   */
  private animate(): void {
    if (!this.isActive) return;

    this.updateParticles();
    this.renderParticles();
    
    this.animationId = requestAnimationFrame(() => this.animate());
  }

  /**
   * Start the animation
   */
  public start(): void {
    if (this.isActive) return;
    
    this.isActive = true;
    this.animate();
  }

  /**
   * Stop the animation
   */
  public stop(): void {
    this.isActive = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  /**
   * Handle window resize
   */
  private handleResize(): void {
    this.setupCanvas();
    // Regenerate particles for new canvas size
    this.particles = [];
    this.createParticles();
  }

  /**
   * Clean up resources
   */
  public destroy(): void {
    this.stop();
    window.removeEventListener('resize', this.handleResize.bind(this));
    this.particles = [];
    this.canvas = null;
    this.ctx = null;
  }

  /**
   * Add interaction effect at coordinates
   */
  public addInteractionEffect(x: number, y: number): void {
    const count = 5;
    for (let i = 0; i < count; i++) {
      const particle = this.createParticle();
      particle.x = x + gsapUtils.random(-20, 20);
      particle.y = y + gsapUtils.random(-20, 20);
      particle.vx = gsapUtils.random(-2, 2);
      particle.vy = gsapUtils.random(-2, 2);
      particle.opacity = 0.8;
      particle.color = this.colors[0]; // Use primary gold color
      this.particles.push(particle);
    }
  }
}

/**
 * React hook for wellness aura
 */
export const useWellnessAura = () => {
  const auraRef = React.useRef<WellnessAura | null>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    if (canvasRef.current && !auraRef.current) {
      auraRef.current = new WellnessAura();
      auraRef.current.init(canvasRef.current);
    }

    return () => {
      if (auraRef.current) {
        auraRef.current.destroy();
        auraRef.current = null;
      }
    };
  }, []);

  const addInteraction = React.useCallback((x: number, y: number) => {
    if (auraRef.current) {
      auraRef.current.addInteractionEffect(x, y);
    }
  }, []);

  return { canvasRef, addInteraction };
};

// Export for use in non-React contexts
export default WellnessAura;