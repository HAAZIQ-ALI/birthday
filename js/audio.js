/**
 * Audio Controller
 * Handles all audio playback including background music and fireworks sounds
 */
export class AudioController {
  constructor() {
    this.musicPlaying = false;
    this.muted = false;
    this.audioContext = null;
    this.musicGain = null;
    this.sfxGain = null;
    this.muteButton = document.getElementById('mute-btn');
    
    // Initialize audio context and setup events
    this.init();
  }
  
  init() {
    // Create audio context
    this.createAudioContext();
    
    // Setup mute button click handler
    if (this.muteButton) {
      this.muteButton.addEventListener('click', () => this.toggleMute());
    } else {
      console.warn('Mute button not found in the DOM');
    }
  }
  
  createAudioContext() {
    try {
      // Create audio context
      window.AudioContext = window.AudioContext || window.webkitAudioContext;
      this.audioContext = new AudioContext();
      
      // Create gain nodes for volume control
      this.musicGain = this.audioContext.createGain();
      this.sfxGain = this.audioContext.createGain();
      
      // Connect gain nodes to audio output
      this.musicGain.connect(this.audioContext.destination);
      this.sfxGain.connect(this.audioContext.destination);
      
      // Set initial volumes
      this.musicGain.gain.value = 0.4; // Background music at 40% volume
      this.sfxGain.gain.value = 0.3;   // Sound effects at 30% volume
    } catch (e) {
      console.error('Web Audio API is not supported in this browser:', e);
    }
  }
  
  // Create Night Dancer (sped up) melody using Web Audio API
  createNightDancerMusic() {
    if (!this.audioContext) return;
    
    // A simplified version of "Night Dancer" melody using Web Audio API
    // This is a representation of the melody pattern, not the exact song
    const bpm = 150; // Sped up tempo
    const noteDuration = 60 / bpm;
    
    // Night Dancer inspired pattern (simplified)
    const pattern = [
      { note: 'E4', duration: 0.25, time: 0 },
      { note: 'G4', duration: 0.25, time: 0.25 },
      { note: 'B4', duration: 0.5, time: 0.5 },
      { note: 'G4', duration: 0.25, time: 1 },
      { note: 'E4', duration: 0.25, time: 1.25 },
      { note: 'B3', duration: 0.5, time: 1.5 },
      
      { note: 'D4', duration: 0.25, time: 2 },
      { note: 'F4', duration: 0.25, time: 2.25 },
      { note: 'A4', duration: 0.5, time: 2.5 },
      { note: 'F4', duration: 0.25, time: 3 },
      { note: 'D4', duration: 0.25, time: 3.25 },
      { note: 'A3', duration: 0.5, time: 3.5 },
      
      { note: 'C4', duration: 0.25, time: 4 },
      { note: 'E4', duration: 0.25, time: 4.25 },
      { note: 'G4', duration: 0.5, time: 4.5 },
      { note: 'C5', duration: 0.5, time: 5 },
      { note: 'G4', duration: 0.5, time: 5.5 },
      
      { note: 'A4', duration: 0.25, time: 6 },
      { note: 'C5', duration: 0.25, time: 6.25 },
      { note: 'E5', duration: 0.5, time: 6.5 },
      { note: 'C5', duration: 0.25, time: 7 },
      { note: 'A4', duration: 0.25, time: 7.25 },
      { note: 'E4', duration: 0.5, time: 7.5 }
    ];
    
    // Frequency map for notes
    const noteToFrequency = {
      'A3': 220.00, 'A#3': 233.08, 'B3': 246.94,
      'C4': 261.63, 'C#4': 277.18, 'D4': 293.66, 'D#4': 311.13, 'E4': 329.63, 'F4': 349.23,
      'F#4': 369.99, 'G4': 392.00, 'G#4': 415.30, 'A4': 440.00, 'A#4': 466.16, 'B4': 493.88,
      'C5': 523.25, 'C#5': 554.37, 'D5': 587.33, 'D#5': 622.25, 'E5': 659.25, 'F5': 698.46,
      'F#5': 739.99, 'G5': 783.99, 'G#5': 830.61, 'A5': 880.00
    };
    
    const startTime = this.audioContext.currentTime;
    
    // Play each note at the specified time
    pattern.forEach(note => {
      const time = startTime + note.time * noteDuration;
      const duration = note.duration * noteDuration;
      
      // Create oscillator
      const oscillator = this.audioContext.createOscillator();
      oscillator.type = 'sine';
      oscillator.frequency.value = noteToFrequency[note.note];
      
      // Create envelope for smoother sound
      const envelope = this.audioContext.createGain();
      envelope.gain.setValueAtTime(0, time);
      envelope.gain.linearRampToValueAtTime(0.4, time + 0.05);
      envelope.gain.linearRampToValueAtTime(0.2, time + duration - 0.05);
      envelope.gain.linearRampToValueAtTime(0, time + duration);
      
      // Connect nodes
      oscillator.connect(envelope);
      envelope.connect(this.musicGain);
      
      // Schedule oscillator
      oscillator.start(time);
      oscillator.stop(time + duration);
    });
    
    // Loop the music by scheduling the next iteration
    const totalDuration = noteDuration * 8; // 8 beats in our pattern
    setTimeout(() => {
      if (!this.muted && this.musicPlaying) {
        this.createNightDancerMusic();
      }
    }, totalDuration * 1000);
  }
  
  createFireworkSound() {
    if (!this.audioContext || this.muted) return;
    
    // Create noise buffer for firework sound
    const bufferSize = this.audioContext.sampleRate * 1; // 1 second
    const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
    const data = buffer.getChannelData(0);
    
    // Fill buffer with noise with exponential decay
    for (let i = 0; i < bufferSize; i++) {
      // Generate noise
      const noise = Math.random() * 2 - 1;
      
      // Apply exponential decay
      const decay = 1 - i / bufferSize;
      const envelope = Math.pow(decay, 3);
      
      data[i] = noise * envelope;
    }
    
    // Create buffer source
    const source = this.audioContext.createBufferSource();
    source.buffer = buffer;
    
    // Create bandpass filter for more realistic sound
    const filter = this.audioContext.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 1000;
    filter.Q.value = 0.7;
    
    // Connect nodes
    source.connect(filter);
    filter.connect(this.sfxGain);
    
    // Play sound
    source.start();
    return source;
  }
  
  playFireworkSound() {
    if (this.audioContext && !this.muted) {
      this.createFireworkSound();
    }
  }
  
  startBackgroundMusic() {
    try {
      if (!this.audioContext) {
        console.error('Audio context not available');
        return;
      }
      
      if (this.audioContext.state === 'suspended') {
        this.audioContext.resume().catch(err => {
          console.error('Failed to resume audio context:', err);
        });
      }
      
      if (!this.musicPlaying && !this.muted) {
        console.log('Starting background music...');
        
        // Create an audio element for the music
        const audioElement = new Audio('./attached_assets/WhatsApp Audio 2025-03-14 at 6.26.55 PM.mpeg');
        audioElement.loop = true;
        
        // Add error and loading event handlers
        audioElement.addEventListener('error', (e) => {
          console.error('Audio element error:', e);
          console.error('Error code:', audioElement.error ? audioElement.error.code : 'unknown');
          console.error('Error message:', audioElement.error ? audioElement.error.message : 'unknown');
        });
        
        audioElement.addEventListener('canplaythrough', () => {
          console.log('Audio can play through');
        });
        
        // Connect to the Web Audio API for volume control
        try {
          const source = this.audioContext.createMediaElementSource(audioElement);
          source.connect(this.musicGain);
          
          // Start playback
          const playPromise = audioElement.play();
          
          if (playPromise !== undefined) {
            playPromise.then(() => {
              console.log('Audio playback started successfully');
              // Store the audio element for later reference
              this.musicElement = audioElement;
              this.musicPlaying = true;
            }).catch(err => {
              console.error('Error playing audio:', err);
              // Fallback to synthetic audio if needed
              if (!this.musicPlaying) {
                console.log('Falling back to synthetic audio');
                this.createNightDancerMusic();
                this.musicPlaying = true;
              }
            });
          }
        } catch (err) {
          console.error('Error setting up audio:', err);
          // Fallback to synthetic audio
          this.createNightDancerMusic();
          this.musicPlaying = true;
        }
      }
    } catch (e) {
      console.error('Error in startBackgroundMusic:', e);
    }
  }
  
  toggleMute() {
    this.muted = !this.muted;
    
    if (this.muted) {
      // Update button icon to muted state
      this.muteButton.classList.add('muted');
      this.muteButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-volume-x">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
          <line x1="23" y1="9" x2="17" y2="15"></line>
          <line x1="17" y1="9" x2="23" y2="15"></line>
        </svg>
      `;
      
      // Mute all sounds
      if (this.musicGain) this.musicGain.gain.value = 0;
      if (this.sfxGain) this.sfxGain.gain.value = 0;
      
      // Pause the audio element if it exists
      if (this.musicElement && !this.musicElement.paused) {
        this.musicElement.pause();
      }
    } else {
      // Update button icon to unmuted state
      this.muteButton.classList.remove('muted');
      this.muteButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-volume-2">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
        </svg>
      `;
      
      // Unmute all sounds
      if (this.musicGain) this.musicGain.gain.value = 0.4;
      if (this.sfxGain) this.sfxGain.gain.value = 0.3;
      
      // Resume the audio element if it exists
      if (this.musicElement) {
        this.musicElement.play().catch(e => {
          console.error('Error playing audio:', e);
        });
      } else if (!this.musicPlaying) {
        // Start music if it wasn't playing before
        this.startBackgroundMusic();
      }
    }
  }
}