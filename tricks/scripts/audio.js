class AudioManager {
  constructor() {
    this.context = new (window.AudioContext || window.webkitAudioContext)();
    this.initialized = false;
  }

  async init() {
    if (this.initialized) return;
    await this.context.resume();
    this.initialized = true;
  }

  async playTone(frequency, duration) {
    await this.init();
    const oscillator = this.context.createOscillator();
    const gainNode = this.context.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(this.context.destination);
    
    oscillator.frequency.value = frequency;
    oscillator.start();
    
    gainNode.gain.setValueAtTime(0.5, this.context.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + duration);
    
    setTimeout(() => {
      oscillator.stop();
      oscillator.disconnect();
    }, duration * 1000);
  }
}

window.audioManager = new AudioManager();
