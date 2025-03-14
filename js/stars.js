/**
 * Stars Animation
 * Creates a canvas-based starry background
 */
export class Stars {
  constructor() {
    // Get canvas element
    this.canvas = document.getElementById('stars-canvas');
    
    // Check if canvas exists
    if (!this.canvas) {
      console.error('Stars canvas element not found!');
      return;
    }
    
    this.ctx = this.canvas.getContext('2d');
    
    // Set canvas dimensions
    this.resizeCanvas();
    
    // Stars array
    this.stars = [];
    
    // Status
    this.running = false;
    
    // Handle window resize
    window.addEventListener('resize', () => this.resizeCanvas());
  }
  
  // Update canvas dimensions
  resizeCanvas() {
    // Check if canvas exists
    if (!this.canvas) {
      console.error('Cannot resize stars canvas - element not found!');
      return;
    }
    
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    
    // Re-create stars when canvas size changes
    if (this.stars && this.stars.length > 0) {
      this.createStars();
    }
  }
  
  // Create stars
  createStars() {
    // Check if canvas exists
    if (!this.canvas || !this.ctx) {
      console.error('Cannot create stars - canvas or context not available');
      return;
    }
    
    const density = Math.min(this.canvas.width, this.canvas.height) / 2;
    const count = Math.floor(density * 0.2);  // Adjust for desired star density
    
    // Clear existing stars
    this.stars = [];
    
    // Create random stars
    for (let i = 0; i < count; i++) {
      this.stars.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        radius: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.8 + 0.2,
        scintillation: Math.random() * 0.1,
        scintillationSpeed: 0.01 + Math.random() * 0.01,
        scintillationDirection: Math.random() > 0.5 ? 1 : -1,
        hue: Math.random() > 0.97 ? Math.floor(Math.random() * 360) : null // Some colored stars
      });
    }
    
    // Add crescent moon
    this.addCrescentMoon();
  }
  
  // Draw stars
  drawStars() {
    // Check if canvas and context exist
    if (!this.canvas || !this.ctx || !this.stars) {
      console.error('Cannot draw stars - required components not available');
      return;
    }
    
    try {
      // Clear canvas
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      
      // Draw each star
      this.stars.forEach(star => {
        // Update star scintillation (twinkling)
        star.opacity += star.scintillation * star.scintillationDirection;
        
        // Reverse direction if opacity is too high or too low
        if (star.opacity >= 1 || star.opacity <= 0.1) {
          star.scintillationDirection *= -1;
        }
        
        // Draw star
        this.ctx.beginPath();
        this.ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        
        // Set color
        if (star.hue !== null) {
          this.ctx.fillStyle = `hsla(${star.hue}, 80%, 70%, ${star.opacity})`;
        } else {
          this.ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        }
        
        this.ctx.fill();
      });
    } catch (e) {
      console.error('Error drawing stars:', e);
    }
  }
  
  // Add crescent moon
  addCrescentMoon() {
    const moonX = this.canvas.width * 0.85;
    const moonY = this.canvas.height * 0.2;
    const moonRadius = Math.min(this.canvas.width, this.canvas.height) * 0.06;
    
    // Add moon to stars array with special properties
    this.stars.push({
      x: moonX,
      y: moonY,
      radius: moonRadius,
      opacity: 0.9,
      scintillation: 0.01,
      scintillationSpeed: 0.005,
      scintillationDirection: 1,
      isMoon: true,
      shadowX: moonX + moonRadius * 0.3,
      shadowY: moonY - moonRadius * 0.1,
      shadowRadius: moonRadius * 0.95
    });
  }
  
  // Animation loop
  animate() {
    if (!this.running) return;
    
    // Draw stars
    this.drawStars();
    
    // Request next frame
    requestAnimationFrame(() => this.animate());
  }
  
  // Start animation
  start() {
    if (!this.running) {
      this.running = true;
      
      // Create stars if they don't exist
      if (this.stars.length === 0) {
        this.createStars();
      }
      
      // Start animation loop
      this.animate();
    }
  }
  
  // Stop animation
  stop() {
    this.running = false;
  }
}