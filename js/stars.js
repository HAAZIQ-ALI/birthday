/**
 * Stars Animation
 * Creates a canvas-based starry background
 */
export class Stars {
  constructor() {
    this.canvas = document.getElementById('stars-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.stars = [];
    this.numStars = 100;
    this.fps = 60;
    this.isRunning = false;
    
    // Canvas dimensions
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());
  }
  
  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    
    // Recreate stars when canvas is resized
    if (this.isRunning) {
      this.createStars();
    }
  }
  
  createStars() {
    // Clear existing stars
    this.stars = [];
    
    // Create new stars
    for (let i = 0; i < this.numStars; i++) {
      this.stars.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        radius: Math.random() * 1.5 + 0.5,
        opacity: Math.random(),
        twinkleSpeed: Math.random() * 0.05 + 0.01,
        twinkleDirection: Math.random() > 0.5 ? 1 : -1
      });
    }
  }
  
  drawStars() {
    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Draw each star
    for (let i = 0; i < this.stars.length; i++) {
      const star = this.stars[i];
      
      // Update star twinkle
      star.opacity += star.twinkleSpeed * star.twinkleDirection;
      
      // Reverse direction if opacity is too high or too low
      if (star.opacity > 1) {
        star.opacity = 1;
        star.twinkleDirection *= -1;
      } else if (star.opacity < 0.2) {
        star.opacity = 0.2;
        star.twinkleDirection *= -1;
      }
      
      // Draw star
      this.ctx.beginPath();
      this.ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
      this.ctx.fill();
    }
  }
  
  addCrescentMoon() {
    // Create crescent moon
    const centerX = this.canvas.width * 0.85;
    const centerY = this.canvas.height * 0.15;
    const radius = 30;
    const moonColor = 'rgba(255, 255, 200, 0.9)';
    
    // Draw outer circle
    this.ctx.beginPath();
    this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    this.ctx.fillStyle = moonColor;
    this.ctx.fill();
    
    // Draw shadow to create crescent
    this.ctx.beginPath();
    this.ctx.arc(centerX + radius * 0.3, centerY, radius * 0.9, 0, Math.PI * 2);
    this.ctx.fillStyle = 'rgba(10, 10, 23, 1)';
    this.ctx.fill();
  }
  
  animate() {
    if (!this.isRunning) return;
    
    this.drawStars();
    this.addCrescentMoon();
    
    setTimeout(() => {
      requestAnimationFrame(() => this.animate());
    }, 1000 / this.fps);
  }
  
  start() {
    if (!this.isRunning) {
      this.isRunning = true;
      this.createStars();
      this.animate();
    }
  }
  
  stop() {
    this.isRunning = false;
  }
}