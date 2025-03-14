/**
 * Fireworks Animation
 * Creates a canvas-based fireworks animation
 */
export class Fireworks {
  constructor() {
    // Get canvas element
    this.canvas = document.getElementById('fireworks-canvas');
    this.ctx = this.canvas.getContext('2d');
    
    // Set canvas dimensions
    this.resizeCanvas();
    
    // Arrays to store fireworks and particles
    this.fireworks = [];
    this.particles = [];
    
    // Status
    this.running = false;
    this.autoFireworks = true;
    
    // Callback for sound
    this.onFireworkExplode = null;
    
    // Handle window resize
    window.addEventListener('resize', () => this.resizeCanvas());
    
    // Add click listener for manual fireworks
    this.canvas.addEventListener('click', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      this.createFirework(
        this.canvas.width / 2, 
        this.canvas.height, 
        x, 
        y
      );
    });
  }
  
  // Update canvas dimensions
  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }
  
  // Create a new firework
  createFirework(startX, startY, targetX, targetY) {
    // Calculate angle and distance
    const angle = Math.atan2(targetY - startY, targetX - startX);
    const velocity = 2 + Math.random() * 3;
    
    // Random hue for this firework
    const hue = Math.floor(Math.random() * 360);
    
    // Add to fireworks array
    this.fireworks.push({
      x: startX,
      y: startY,
      startX: startX,
      startY: startY,
      targetX: targetX,
      targetY: targetY,
      speed: velocity,
      angle: angle,
      hue: hue,
      brightness: 50 + Math.floor(Math.random() * 50),
      alpha: 1,
      trail: []
    });
  }
  
  // Create explosion particles
  createParticles(x, y, count, hue) {
    // Call the sound callback if it exists
    if (typeof this.onFireworkExplode === 'function') {
      this.onFireworkExplode();
    }
    
    // Create particles
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 5 + 1;
      
      this.particles.push({
        x: x,
        y: y,
        speed: speed,
        angle: angle,
        hue: hue + Math.random() * 30 - 15,
        brightness: 50 + Math.floor(Math.random() * 50),
        alpha: 1,
        decay: 0.015 + Math.random() * 0.03
      });
    }
  }
  
  // Update firework position
  updateFirework(firework, index) {
    // Add current position to trail
    firework.trail.push({x: firework.x, y: firework.y, alpha: firework.alpha});
    
    // Limit trail length
    if (firework.trail.length > 5) {
      firework.trail.shift();
    }
    
    // Update position
    firework.x += Math.cos(firework.angle) * firework.speed;
    firework.y += Math.sin(firework.angle) * firework.speed;
    
    // Reduce alpha near target
    const distanceToTarget = this.calculateDistance(firework.x, firework.y, firework.targetX, firework.targetY);
    if (distanceToTarget < 15) {
      // Create explosion
      this.createParticles(firework.x, firework.y, 80, firework.hue);
      
      // Remove firework
      this.fireworks.splice(index, 1);
    }
  }
  
  // Update particle position
  updateParticle(particle, index) {
    // Update position
    particle.x += Math.cos(particle.angle) * particle.speed;
    particle.y += Math.sin(particle.angle) * particle.speed;
    
    // Apply gravity
    particle.speed *= 0.96;
    
    // Reduce alpha (fade out)
    particle.alpha -= particle.decay;
    
    // Remove when alpha is too low
    if (particle.alpha <= 0.05) {
      this.particles.splice(index, 1);
    }
  }
  
  // Draw firework
  drawFirework(firework) {
    // Draw trail
    this.ctx.beginPath();
    
    // Trail gradient
    const trailGradient = this.ctx.createLinearGradient(
      firework.trail[0]?.x || firework.x,
      firework.trail[0]?.y || firework.y,
      firework.x,
      firework.y
    );
    
    trailGradient.addColorStop(0, `hsla(${firework.hue}, 100%, ${firework.brightness}%, 0)`);
    trailGradient.addColorStop(1, `hsla(${firework.hue}, 100%, ${firework.brightness}%, ${firework.alpha})`);
    
    this.ctx.strokeStyle = trailGradient;
    this.ctx.lineWidth = 3;
    
    // Draw the trail path
    if (firework.trail.length > 1) {
      this.ctx.moveTo(firework.trail[0].x, firework.trail[0].y);
      for (let i = 1; i < firework.trail.length; i++) {
        this.ctx.lineTo(firework.trail[i].x, firework.trail[i].y);
      }
      this.ctx.lineTo(firework.x, firework.y);
      this.ctx.stroke();
    }
    
    // Draw the firework point
    this.ctx.beginPath();
    this.ctx.arc(firework.x, firework.y, 3, 0, Math.PI * 2);
    this.ctx.fillStyle = `hsla(${firework.hue}, 100%, ${firework.brightness}%, ${firework.alpha})`;
    this.ctx.fill();
  }
  
  // Draw particle
  drawParticle(particle) {
    this.ctx.beginPath();
    this.ctx.arc(particle.x, particle.y, 2, 0, Math.PI * 2);
    this.ctx.fillStyle = `hsla(${particle.hue}, 100%, ${particle.brightness}%, ${particle.alpha})`;
    this.ctx.fill();
  }
  
  // Helper: Random number within range
  randomInRange(min, max) {
    return Math.random() * (max - min) + min;
  }
  
  // Helper: Calculate distance between points
  calculateDistance(p1x, p1y, p2x, p2y) {
    const xDistance = p1x - p2x;
    const yDistance = p1y - p2y;
    return Math.sqrt(xDistance * xDistance + yDistance * yDistance);
  }
  
  // Animation loop
  animate() {
    if (!this.running) return;
    
    // Clear canvas with transparent overlay for trail effect
    this.ctx.fillStyle = 'rgba(10, 10, 23, 0.2)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Create random fireworks
    if (this.autoFireworks && Math.random() < 0.03) {
      this.createRandomFirework();
    }
    
    // Update and draw fireworks
    for (let i = this.fireworks.length - 1; i >= 0; i--) {
      this.updateFirework(this.fireworks[i], i);
      this.drawFirework(this.fireworks[i]);
    }
    
    // Update and draw particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      this.updateParticle(this.particles[i], i);
      this.drawParticle(this.particles[i]);
    }
    
    // Request next frame
    requestAnimationFrame(() => this.animate());
  }
  
  // Create a random firework
  createRandomFirework() {
    const startX = this.randomInRange(this.canvas.width * 0.2, this.canvas.width * 0.8);
    const startY = this.canvas.height;
    const targetX = this.randomInRange(50, this.canvas.width - 50);
    const targetY = this.randomInRange(50, this.canvas.height * 0.5);
    
    this.createFirework(startX, startY, targetX, targetY);
  }
  
  // Create multiple fireworks at once
  createFireworkBurst() {
    const burstCount = Math.floor(Math.random() * 3) + 3;
    for (let i = 0; i < burstCount; i++) {
      setTimeout(() => {
        this.createRandomFirework();
      }, i * 200);
    }
  }
  
  // Start animation
  start() {
    if (!this.running) {
      this.running = true;
      this.animate();
    }
  }
}