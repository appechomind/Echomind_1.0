// EchoMind Core Utilities

// Fractal Background
class FractalBackground {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.time = 0;
    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.animate();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  draw() {
    const w = this.canvas.width;
    const h = this.canvas.height;
    this.ctx.clearRect(0, 0, w, h);
    
    for (let i = 0; i < 200; i++) {
      const x = w/2 + Math.sin(i * 0.1 + this.time) * i * 0.8;
      const y = h/2 + Math.cos(i * 0.1 + this.time) * i * 0.8;
      
      this.ctx.fillStyle = `hsla(${(this.time * 50 + i * 2) % 360}, 100%, ${30 + i % 50}%, 0.5)`;
      this.ctx.beginPath();
      this.ctx.arc(x, y, 2 + (i % 3), 0, Math.PI * 2);
      this.ctx.fill();
    }
    
    this.time += 0.01;
  }

  animate() {
    this.draw();
    requestAnimationFrame(() => this.animate());
  }
}

// Touch Feedback
function addTouchFeedback(elements) {
  elements.forEach(el => {
    el.addEventListener('touchstart', function() {
      this.style.transform = 'scale(0.95)';
    });
    
    el.addEventListener('touchend', function() {
      this.style.transform = '';
    });
  });
}

// Speech Recognition Utility
class SpeechHandler {
  constructor(options = {}) {
    this.options = {
      lang: 'en-US',
      continuous: true,
      interimResults: false,
      ...options
    };
    this.recognition = null;
    this.isListening = false;
    this.callbacks = {
      onStart: () => {},
      onResult: () => {},
      onEnd: () => {},
      onError: () => {}
    };
  }

  init() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      throw new Error('Speech recognition not supported');
    }

    this.recognition = new SpeechRecognition();
    Object.assign(this.recognition, this.options);

    this.recognition.onstart = () => {
      this.isListening = true;
      this.callbacks.onStart();
    };

    this.recognition.onresult = (event) => {
      const transcript = event.results[event.results.length - 1][0].transcript.trim();
      this.callbacks.onResult(transcript);
    };

    this.recognition.onend = () => {
      this.isListening = false;
      this.callbacks.onEnd();
    };

    this.recognition.onerror = (event) => {
      this.callbacks.onError(event);
    };
  }

  start() {
    if (!this.recognition) this.init();
    this.recognition.start();
  }

  stop() {
    if (this.recognition) this.recognition.stop();
  }

  on(event, callback) {
    if (this.callbacks.hasOwnProperty(event)) {
      this.callbacks[event] = callback;
    }
  }
}

// Export utilities
window.EchoMind = {
  FractalBackground,
  addTouchFeedback,
  SpeechHandler
}; 