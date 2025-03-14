/**
 * Main Application
 * Coordinates all modules and handles initialization
 */
import { Fireworks } from './fireworks.js';
import { Stars } from './stars.js';
import { AudioController } from './audio.js';

// Initialize components when DOM is ready
document.addEventListener('DOMContentLoaded', init);

// Global objects
let fireworks;
let stars;
let audioController;

// Main initialization function
function init() {
  // Elements
  const preloader = document.querySelector('.preloader');
  const firstMessage = document.getElementById('first-message');
  const secondMessage = document.getElementById('second-message');
  const nameContainer = document.getElementById('name-container');
  const nameLetters = document.querySelectorAll('.name-letter');
  const islamicBlessing = document.getElementById('islamic-blessing');
  const photoFrame = document.getElementById('photo-frame');
  
  // Initialize background stars
  stars = new Stars();
  stars.start();
  
  // Initialize fireworks
  fireworks = new Fireworks();
  
  // Initialize audio controller
  audioController = new AudioController();
  
  // Connect fireworks explosions to sound
  connectFireworksToSound();
  
  // Wait for assets to load before starting animations
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
      setTimeout(() => fireworks.createFireworkBurst(), 1000);
      
      // Animate the text sequence
      animateTextSequence(firstMessage, secondMessage, nameContainer, nameLetters, islamicBlessing, photoFrame);
    }, 1500);
  });
  
  // Add periodic firework bursts
  setInterval(() => fireworks.createFireworkBurst(), 8000);
  
  // Handle visibility change to pause/resume animations and audio
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      // Page is hidden, pause animations
      fireworks.autoFireworks = false;
      stars.stop();
    } else {
      // Page is visible again, resume animations
      fireworks.autoFireworks = true;
      stars.start();
      
      // Resume audio context if it was suspended
      if (audioController.audioContext && audioController.audioContext.state === 'suspended') {
        audioController.audioContext.resume();
      }
    }
  });
  
  // Handle user interaction for browsers that require it to play audio
  document.addEventListener('click', () => {
    if (audioController.audioContext && audioController.audioContext.state === 'suspended') {
      audioController.audioContext.resume().then(() => {
        // Start music if it hasn't started yet
        if (!audioController.musicPlaying && !audioController.muted) {
          audioController.startBackgroundMusic();
        }
      });
    }
  });
}

// Connect fireworks to sound effects
function connectFireworksToSound() {
  // Set the callback for when a firework explodes
  fireworks.onFireworkExplode = () => {
    audioController.playFireworkSound();
  };
}

// Animate text sequence according to the flow
function animateTextSequence(firstMessage, secondMessage, nameContainer, nameLetters, islamicBlessing, photoFrame) {
  // First message already visible
  
  // After 3 seconds, fade out first message and show second message
  setTimeout(() => {
    firstMessage.style.opacity = '0';
    
    setTimeout(() => {
      firstMessage.style.display = 'none';
      secondMessage.classList.remove('hidden');
      secondMessage.style.opacity = '1';
      
      // Show and animate the name letters one by one
      setTimeout(() => {
        nameContainer.classList.remove('hidden');
        nameContainer.style.opacity = '1';
        
        // Animate each letter with delay
        nameLetters.forEach((letter, index) => {
          setTimeout(() => {
            letter.style.opacity = '1';
            letter.style.transform = 'translateY(0)';
          }, 150 * index);
        });
        
        // Show Islamic blessing
        setTimeout(() => {
          islamicBlessing.classList.remove('hidden');
          islamicBlessing.style.opacity = '1';
          
          // Show photo frame last
          setTimeout(() => {
            photoFrame.classList.remove('hidden');
            photoFrame.style.opacity = '1';
            
            // Create a big firework burst for finale
            fireworks.createFireworkBurst();
            setTimeout(() => fireworks.createFireworkBurst(), 500);
          }, 2000);
        }, 2000);
      }, 1000);
    }, 500);
  }, 3000);
}