/**
 * Particle Effects System for Flora Fight Frenzy
 * Creates various visual effects for game interactions
 */

export interface Particle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  type: string;
  rotation?: number;
  rotationSpeed?: number;
}

class ParticleSystem {
  private static instance: ParticleSystem;
  private particles: Particle[] = [];
  private animationFrame: number | null = null;

  private constructor() {}

  static getInstance(): ParticleSystem {
    if (!ParticleSystem.instance) {
      ParticleSystem.instance = new ParticleSystem();
    }
    return ParticleSystem.instance;
  }

  // Create explosion particles
  createExplosion(x: number, y: number, color: string = '#ff4444', count: number = 15) {
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count;
      const speed = Math.random() * 200 + 100;
      
      this.particles.push({
        id: `explosion_${Date.now()}_${i}`,
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1.0,
        maxLife: 1.0,
        size: Math.random() * 8 + 4,
        color,
        type: 'explosion'
      });
    }
  }

  // Create collection sparkles
  createSparkles(x: number, y: number, color: string = '#ffd700', count: number = 8) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 150 + 50;
      
      this.particles.push({
        id: `sparkle_${Date.now()}_${i}`,
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 100, // Slight upward bias
        life: 1.0,
        maxLife: 1.0,
        size: Math.random() * 4 + 2,
        color,
        type: 'sparkle',
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 10
      });
    }
  }

  // Create floating text effect
  createFloatingText(x: number, y: number, text: string, color: string = '#fff') {
    const particle: Particle = {
      id: `text_${Date.now()}`,
      x,
      y,
      vx: 0,
      vy: -80, // Float upward
      life: 1.0,
      maxLife: 1.0,
      size: 16,
      color,
      type: 'text'
    };

    // Store text in a separate property (extending the interface for this specific case)
    (particle as any).text = text;
    this.particles.push(particle);
  }

  // Create smoke trail effect
  createSmoke(x: number, y: number, color: string = '#888888', count: number = 5) {
    for (let i = 0; i < count; i++) {
      this.particles.push({
        id: `smoke_${Date.now()}_${i}`,
        x: x + (Math.random() - 0.5) * 20,
        y: y + (Math.random() - 0.5) * 20,
        vx: (Math.random() - 0.5) * 30,
        vy: -Math.random() * 50 - 20,
        life: 1.0,
        maxLife: 1.0,
        size: Math.random() * 15 + 10,
        color,
        type: 'smoke'
      });
    }
  }

  // Create plant growing effect
  createPlantGrowth(x: number, y: number) {
    const colors = ['#4ade80', '#22c55e', '#16a34a', '#15803d'];
    for (let i = 0; i < 12; i++) {
      const angle = (Math.PI * 2 * i) / 12;
      const speed = Math.random() * 80 + 40;
      
      this.particles.push({
        id: `growth_${Date.now()}_${i}`,
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 50,
        life: 1.0,
        maxLife: 1.0,
        size: Math.random() * 6 + 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        type: 'growth'
      });
    }
  }

  // Update particle positions and remove dead particles
  update(deltaTime: number) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const particle = this.particles[i];
      
      // Update position
      particle.x += particle.vx * deltaTime;
      particle.y += particle.vy * deltaTime;
      
      // Update rotation if applicable
      if (particle.rotation !== undefined && particle.rotationSpeed !== undefined) {
        particle.rotation += particle.rotationSpeed * deltaTime;
      }
      
      // Apply gravity for certain types
      if (particle.type === 'explosion' || particle.type === 'sparkle' || particle.type === 'smoke') {
        particle.vy += 300 * deltaTime; // Gravity
      }
      
      // Fade out
      particle.life -= deltaTime / (particle.type === 'text' ? 1.5 : 1.0);
      
      // Remove dead particles
      if (particle.life <= 0) {
        this.particles.splice(i, 1);
      }
    }
  }

  // Render particles to canvas
  render(ctx: CanvasRenderingContext2D) {
    this.particles.forEach(particle => {
      const alpha = Math.max(0, particle.life);
      
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.translate(particle.x, particle.y);
      
      if (particle.rotation !== undefined) {
        ctx.rotate(particle.rotation);
      }
      
      switch (particle.type) {
        case 'explosion':
        case 'sparkle':
        case 'growth':
          ctx.fillStyle = particle.color;
          ctx.beginPath();
          ctx.arc(0, 0, particle.size, 0, Math.PI * 2);
          ctx.fill();
          break;
          
        case 'smoke':
          const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, particle.size);
          gradient.addColorStop(0, particle.color);
          gradient.addColorStop(1, 'transparent');
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(0, 0, particle.size, 0, Math.PI * 2);
          ctx.fill();
          break;
          
        case 'text':
          ctx.fillStyle = particle.color;
          ctx.font = `bold ${particle.size}px Arial`;
          ctx.textAlign = 'center';
          ctx.fillText((particle as any).text || '', 0, 0);
          break;
      }
      
      ctx.restore();
    });
  }

  // Get particles for React component rendering
  getParticlesForReact(): Particle[] {
    return [...this.particles];
  }

  // Clear all particles
  clear() {
    this.particles = [];
  }

  // Get particle count for performance monitoring
  getParticleCount(): number {
    return this.particles.length;
  }
}

export default ParticleSystem;