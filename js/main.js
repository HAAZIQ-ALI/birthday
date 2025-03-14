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
  console.log('Initializing birthday celebration...');
  
  // Get DOM elements
  const preloader = document.querySelector('.preloader');
  const firstMessage = document.getElementById('first-message');
  const secondMessage = document.getElementById('second-message');
  const nameContainer = document.getElementById('name-container');
  const nameLetters = document.querySelectorAll('.name-letter');
  const islamicBlessing = document.getElementById('islamic-blessing');
  const photoFrame = document.getElementById('photo-frame');
  
  try {
    // Initialize background stars
    stars = new Stars();
    if (stars) {
      stars.start();
    }
    
    // Initialize fireworks
    fireworks = new Fireworks();
    
    // Initialize audio controller
    audioController = new AudioController();
    
    // Disable firework sounds
    // connectFireworksToSound();
    
    // Set up periodic firework bursts
    if (fireworks) {
      setInterval(() => {
        if (fireworks && typeof fireworks.createFireworkBurst === 'function') {
          fireworks.createFireworkBurst();
        }
      }, 8000);
    }
    
    // Handle visibility change to pause/resume animations and audio
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        // Page is hidden, pause animations
        if (fireworks) fireworks.autoFireworks = false;
        if (stars) stars.stop();
      } else {
        // Page is visible again, resume animations
        if (fireworks) fireworks.autoFireworks = true;
        if (stars) stars.start();
        
        // Resume audio context if it was suspended
        if (audioController && audioController.audioContext && 
            audioController.audioContext.state === 'suspended') {
          audioController.audioContext.resume();
        }
      }
    });
    
    // Handle user interaction for browsers that require it to play audio
    document.addEventListener('click', () => {
      if (audioController && audioController.audioContext && 
          audioController.audioContext.state === 'suspended') {
        audioController.audioContext.resume().then(() => {
          // Start music if it hasn't started yet
          if (audioController && !audioController.musicPlaying && !audioController.muted) {
            audioController.startBackgroundMusic();
          }
        });
      }
    });
    
    // Wait for assets to load before starting animations
    window.addEventListener('load', () => {
      console.log('Window loaded, starting animations...');
      
      // Start celebrations after a short delay
      setTimeout(() => {
        // Hide preloader
        if (preloader) {
          preloader.style.opacity = 0;
          setTimeout(() => {
            preloader.style.display = 'none';
          }, 500);
        }
        
        // Start fireworks
        if (fireworks && typeof fireworks.start === 'function') {
          fireworks.start();
        }
        
        // Start background music
        if (audioController && typeof audioController.startBackgroundMusic === 'function') {
          audioController.startBackgroundMusic();
        }
        
        // Add some initial fireworks
        if (fireworks && typeof fireworks.createFireworkBurst === 'function') {
          setTimeout(() => fireworks.createFireworkBurst(), 1000);
        }
        
        // Animate the text sequence
        animateTextSequence(firstMessage, secondMessage, nameContainer, nameLetters, islamicBlessing, photoFrame);
      }, 1500);
    });
  } catch (error) {
    console.error('Error initializing components:', error);
  }
}

// Connect fireworks to sound effects
function connectFireworksToSound() {
  if (fireworks && audioController) {
    // Set the callback for when a firework explodes
    fireworks.onFireworkExplode = () => {
      if (audioController && typeof audioController.playFireworkSound === 'function') {
        audioController.playFireworkSound();
      }
    };
  }
}

// Animate text sequence according to the flow
function animateTextSequence(firstMessage, secondMessage, nameContainer, nameLetters, islamicBlessing, photoFrame) {
  // Check if all elements exist
  if (!firstMessage || !secondMessage) {
    console.error('Required message elements not found');
    return;
  }
  
  // First message already visible
  
  // After 3 seconds, fade out first message and show second message
  setTimeout(() => {
    firstMessage.style.opacity = '0';
    
    setTimeout(() => {
      firstMessage.style.display = 'none';
      
      if (secondMessage) {
        secondMessage.classList.remove('hidden');
        secondMessage.style.opacity = '1';
      }
      
      // Show and animate the name letters one by one
      setTimeout(() => {
        if (nameContainer) {
          nameContainer.classList.remove('hidden');
          nameContainer.style.opacity = '1';
        }
        
        // Animate each letter with delay if nameLetters exists and is an array-like object
        if (nameLetters && nameLetters.forEach) {
          nameLetters.forEach((letter, index) => {
            setTimeout(() => {
              letter.style.opacity = '1';
              letter.style.transform = 'translateY(0)';
            }, 150 * index);
          });
        }
        
        // Show Islamic blessing
        setTimeout(() => {
          if (islamicBlessing) {
            islamicBlessing.classList.remove('hidden');
            islamicBlessing.style.opacity = '1';
          }
          
          // Show photo frame last
          setTimeout(() => {
            if (photoFrame) {
              photoFrame.classList.remove('hidden');
              photoFrame.style.opacity = '1';
            }
            
            // Create a big firework burst for finale
            if (fireworks && typeof fireworks.createFireworkBurst === 'function') {
              fireworks.createFireworkBurst();
              setTimeout(() => fireworks.createFireworkBurst(), 500);
            }
          }, 2000);
        }, 2000);
      }, 1000);
    }, 500);
  }, 3000);
}