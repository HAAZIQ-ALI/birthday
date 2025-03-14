/**
 * Main Application
 * Coordinates all modules and handles initialization
 */
(function() {
    // Initialize components when DOM is ready
    document.addEventListener('DOMContentLoaded', init);
    
    // Global objects
    let fireworks;
    let audioController;
    
    // Main initialization function
    function init() {
        // Show preloader until everything is loaded
        const preloader = document.querySelector('.preloader');
        
        // Initialize fireworks
        fireworks = new Fireworks();
        
        // Initialize audio controller
        audioController = new AudioController();
        
        // Connect fireworks explosions to sound
        connectFireworksToSound();
        
        // Wait for assets to load before hiding preloader
        window.addEventListener('load', () => {
            // Start celebrations
            setTimeout(() => {
                // Hide preloader
                preloader.style.opacity = 0;
                setTimeout(() => {
                    preloader.style.display = 'none';
                }, 500);
                
                // Start fireworks
                fireworks.start();
                
                // Start background music
                audioController.startBackgroundMusic();
                
                // Add some initial fireworks
                setTimeout(() => createFireworkBurst(), 1000);
            }, 1000);
        });
        
        // Add periodic firework bursts
        setInterval(createFireworkBurst, 8000);
    }
    
    // Connect fireworks to sound effects
    function connectFireworksToSound() {
        // Get reference to original createParticles method
        const originalCreateParticles = fireworks.createParticles;
        
        // Override the createParticles method to add sound
        fireworks.createParticles = function(x, y, count, hue) {
            // Call the original method
            originalCreateParticles.call(this, x, y, count, hue);
            
            // Play sound effect when particles are created
            audioController.playFireworksSound();
        };
    }
    
    // Create a burst of multiple fireworks
    function createFireworkBurst() {
        const count = Math.floor(Math.random() * 3) + 2; // 2 to 4 fireworks
        
        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                fireworks.createRandomFirework();
            }, i * 300); // Stagger the fireworks by 300ms
        }
    }
    
    // Handle visibility change to pause/resume animations and audio
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            // Page is hidden, pause animations
            fireworks.autoFireworks = false;
        } else {
            // Page is visible again, resume animations
            fireworks.autoFireworks = true;
            
            // Resume audio context if it was suspended
            if (audioController.audioContext.state === 'suspended') {
                audioController.audioContext.resume();
            }
        }
    });
    
    // Handle user interaction for browsers that require it to play audio
    document.addEventListener('click', () => {
        if (audioController.audioContext.state === 'suspended') {
            audioController.audioContext.resume().then(() => {
                // Start music if it hasn't started yet
                if (!audioController.musicPlaying && !audioController.muted) {
                    audioController.startBackgroundMusic();
                }
            });
        }
    });
})();
