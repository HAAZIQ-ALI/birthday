/**
 * Fireworks Animation
 * Creates a canvas-based fireworks animation
 */
export class Fireworks {
  constructor() {
    this.canvas = document.getElementById('fireworks-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.fireworks = [];
    this.particles = [];
    this.hue = 120;
    this.limiterTotal = 5;
    this.limiterTick = 0;
    this.timerTotal = 80;
    this.timerTick = 0;
    this.mousedown = false;
    this.mx = 0;
    this.my = 0;
    
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());
    
    // Automatically launch fireworks periodically
    this.autoFireworks = true;
    
    // Callback for sound effects
    this.onFireworkExplode = null;
  }
  
  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }
  
  // Create firework
  createFirework(startX, startY, targetX, targetY) {
    const firework = {
      // Start coordinates
      x: startX,
      y: startY,
      // Starting coordinates
      startX: startX,
      startY: startY,
      // End coordinates
      targetX: targetX,
      targetY: targetY,
      // Distance to target
      distanceToTarget: this.calculateDistance(startX, startY, targetX, targetY),
      distanceTraveled: 0,
      // Track past coordinates to create trail effect
      coordinates: [],
      coordinateCount: 3,
      // Current angle
      angle: Math.atan2(targetY - startY, targetX - startX),
      // Speed and acceleration
      speed: 2,
      acceleration: 1.05,
      // Random brightness
      brightness: this.randomInRange(50, 70),
      // Random hue
      hue: this.randomInRange(0, 360),
      // Track lifespan
      alpha: 1,
      decay: 0.02
    };
    
    // Set coordinates to current location
    for (let i = 0; i < firework.coordinateCount; i++) {
      firework.coordinates.push([firework.x, firework.y]);
    }
    
    this.fireworks.push(firework);
  }
  
  // Create particle
  createParticles(x, y, count, hue) {
    for (let i = 0; i < count; i++) {
      const particle = {
        // Position
        x: x,
        y: y,
        // Track past coordinates to create trail effect
        coordinates: [],
        coordinateCount: 5,
        // Set random speed and direction
        angle: this.randomInRange(0, Math.PI * 2),
        speed: this.randomInRange(1, 10),
        // Decreasing speed for realistic effect
        friction: 0.95,
        // Gravity pull
        gravity: 1,
        // Random hue
        hue: this.randomInRange(hue - 50, hue + 50),
        // Random brightness
        brightness: this.randomInRange(50, 80),
        // Track lifespan
        alpha: 1,
        decay: this.randomInRange(0.015, 0.03)
      };
      
      // Set coordinates to current location
      for (let i = 0; i < particle.coordinateCount; i++) {
        particle.coordinates.push([particle.x, particle.y]);
      }
      
      this.particles.push(particle);
    }
    
    // Call the callback if provided
    if (this.onFireworkExplode) {
      this.onFireworkExplode();
    }
  }
  
  // Update firework
  updateFirework(firework, index) {
    // Remove last coordinate in array
    firework.coordinates.pop();
    // Add current coordinate to the beginning
    firework.coordinates.unshift([firework.x, firework.y]);
    
    // Speed up firework
    firework.speed *= firework.acceleration;
    
    // Get current velocities based on angle and speed
    const vx = Math.cos(firework.angle) * firework.speed;
    const vy = Math.sin(firework.angle) * firework.speed;
    
    // Update distance traveled with velocities
    firework.distanceTraveled = this.calculateDistance(
      firework.startX, firework.startY, firework.x + vx, firework.y + vy
    );
    
    // If distance traveled > the original distance, target has been reached
    if (firework.distanceTraveled >= firework.distanceToTarget) {
      // Create burst particles at target location
      this.createParticles(firework.targetX, firework.targetY, 100, firework.hue);
      // Remove firework from array
      this.fireworks.splice(index, 1);
    } else {
      // Keep going
      firework.x += vx;
      firework.y += vy;
    }
  }
  
  // Update particle
  updateParticle(particle, index) {
    // Remove last coordinate in array
    particle.coordinates.pop();
    // Add current coordinate to the beginning
    particle.coordinates.unshift([particle.x, particle.y]);
    
    // Slow down by applying friction
    particle.speed *= particle.friction;
    
    // Apply velocity to current position
    particle.x += Math.cos(particle.angle) * particle.speed;
    particle.y += Math.sin(particle.angle) * particle.speed + particle.gravity;
    
    // Fade out particle
    particle.alpha -= particle.decay;
    
    // If alpha is less than threshold, remove particle from array
    if (particle.alpha <= 0.1) {
      this.particles.splice(index, 1);
    }
  }
  
  // Draw firework
  drawFirework(firework) {
    // Movement tracking
    const lastCoordinate = firework.coordinates[firework.coordinates.length - 1];
    
    this.ctx.beginPath();
    // Move to last tracked coordinate
    this.ctx.moveTo(lastCoordinate[0], lastCoordinate[1]);
    // Draw line to current position
    this.ctx.lineTo(firework.x, firework.y);
    this.ctx.strokeStyle = `hsl(${firework.hue}, 100%, ${firework.brightness}%)`;
    this.ctx.stroke();
  }
  
  // Draw particle
  drawParticle(particle) {
    // Movement tracking
    const lastCoordinate = particle.coordinates[particle.coordinates.length - 1];
    
    this.ctx.beginPath();
    // Move to last tracked coordinate
    this.ctx.moveTo(lastCoordinate[0], lastCoordinate[1]);
    // Draw line to current position
    this.ctx.lineTo(particle.x, particle.y);
    this.ctx.strokeStyle = `hsla(${particle.hue}, 100%, ${particle.brightness}%, ${particle.alpha})`;
    this.ctx.stroke();
  }
  
  // Utility: Random range function
  randomInRange(min, max) {
    return Math.random() * (max - min) + min;
  }
  
  // Utility: Calculate distance between points
  calculateDistance(p1x, p1y, p2x, p2y) {
    const xDistance = p1x - p2x;
    const yDistance = p1y - p2y;
    return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
  }
  
  // Main animation loop
  animate() {
    // Request animation frame
    requestAnimationFrame(() => this.animate());
    
    // Clear canvas
    this.ctx.globalComposite = 'destination-out';
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.globalComposite = 'lighter';
    
    // Update and draw fireworks
    for (let i = 0; i < this.fireworks.length; i++) {
      this.updateFirework(this.fireworks[i], i);
      this.drawFirework(this.fireworks[i]);
    }
    
    // Update and draw particles
    for (let i = 0; i < this.particles.length; i++) {
      this.updateParticle(this.particles[i], i);
      this.drawParticle(this.particles[i]);
    }
    
    // Auto launch fireworks
    if (this.autoFireworks) {
      this.timerTick++;
      
      if (this.timerTick >= this.timerTotal) {
        if (!this.limiterTick || this.limiterTick >= this.limiterTotal) {
          this.createRandomFirework();
          this.limiterTick = 0;
        }
        
        this.timerTick = 0;
        this.limiterTick++;
      }
    }
    
    // Cycle through hue
    this.hue += 0.5;
  }
  
  // Create random firework
  createRandomFirework() {
    const startX = this.canvas.width / 2;
    const startY = this.canvas.height;
    const targetX = this.randomInRange(0, this.canvas.width);
    const targetY = this.randomInRange(0, this.canvas.height / 2);
    
    this.createFirework(startX, startY, targetX, targetY);
  }
  
  // Create a burst of multiple fireworks
  createFireworkBurst() {
    const count = Math.floor(Math.random() * 3) + 2; // 2 to 4 fireworks
    
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        this.createRandomFirework();
      }, i * 300); // Stagger the fireworks by 300ms
    }
  }
  
  // Initialize animation
  start() {
    // Create initial batch of fireworks
    for (let i = 0; i < 3; i++) {
      this.createRandomFirework();
    }
    
    // Start animation loop
    this.animate();
  }
}