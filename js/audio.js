export class AudioController {
  constructor() {
    this.musicPlaying = false;
    this.muted = false;
    this.audioContext = null;
    this.musicGain = null;
    this.sfxGain = null;
    this.muteButton = document.getElementById('mute-btn');
    this.musicElement = null;
    
    // Initialize audio context and setup events
    this.init();
  }

  init() {
    // Create audio context
    this.createAudioContext();
  
    // Setup mute button click handler
    if (this.muteButton) {
      this.muteButton.addEventListener("click", () => this.toggleMute());
    } else {
      console.warn("Mute button not found in the DOM");
    }
  
    // Fix autoplay issues by resuming AudioContext on first user interaction
    document.addEventListener("click", () => {
      if (this.audioContext && this.audioContext.state === "suspended") {
        this.audioContext.resume().then(() => {
          console.log("✅ AudioContext resumed after user interaction");
        });
      }
  
      if (!this.musicElement) {
        console.warn("🎵 Music element is not initialized. Initializing now...");
        this.startBackgroundMusic();
      }
    }, { once: true });
  }
  
  

  createAudioContext() {
    try {
      window.AudioContext = window.AudioContext || window.webkitAudioContext;
      this.audioContext = new AudioContext();

      this.musicGain = this.audioContext.createGain();
      this.sfxGain = this.audioContext.createGain();

      this.musicGain.connect(this.audioContext.destination);
      this.sfxGain.connect(this.audioContext.destination);

      this.musicGain.gain.value = 0.8;
      this.sfxGain.gain.value = 0.6;
    } catch (e) {
      console.error('Web Audio API is not supported in this browser:', e);
    }
  }

  createNightDancerMusic() {
    try {
      if (this.musicPlaying) return;

      if (!this.audioContext) {
        console.error('Audio context not available');
        return;
      }

      if (this.audioContext.state === 'suspended') {
        this.audioContext.resume().catch(err => {
          console.error('Failed to resume audio context:', err);
        });
      }

      console.log('Starting Night Dancer music...');

      this.musicElement = new Audio('/attached_assets/WhatsApp Audio 2025-03-14 at 6.26.55 PM.mpeg');
      this.musicElement.loop = true;

      this.musicElement.addEventListener('error', (e) => {
        console.error('Audio element error:', e);
        console.error('Error code:', this.musicElement.error ? this.musicElement.error.code : 'unknown');
        console.error('Error message:', this.musicElement.error ? this.musicElement.error.message : 'unknown');
      });

      this.musicElement.addEventListener('canplaythrough', () => {
        console.log('Audio can play through');
      });

      this.musicPlaying = true;
    } catch (e) {
      console.error('Error in createNightDancerMusic:', e);
      this.musicPlaying = false;
    }
  }

  startBackgroundMusic() {
    if (!this.musicElement) {
      console.warn("🎵 Music element is not initialized. Initializing now...");
      this.createNightDancerMusic();
      setTimeout(() => {
        if (this.musicElement) {
          this.musicElement.play().then(() => {
            console.log("🎵 Background music started.");
          }).catch(err => {
            console.error("🎵 Error playing background music:", err);
          });
        } else {
          console.error("❌ Music element is STILL not initialized after retry.");
        }
      }, 500);
      return;
    }

    this.musicElement.play().then(() => {
      console.log("🎵 Background music started.");
    }).catch(err => {
      console.error("🎵 Error playing background music:", err);
    });
  }
}