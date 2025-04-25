// Core Utilities for EchoMind
class EchoMindCore {
    constructor() {
        this.audioManager = new AudioManager();
        this.deviceManager = new DeviceManager();
        this.initialized = false;
    }

    async init() {
        if (this.initialized) return;
        await this.audioManager.init();
        await this.deviceManager.init();
        this.initializeUI();
        this.initialized = true;
    }

    initializeUI() {
        // Add touch feedback to all interactive elements
        const interactiveElements = document.querySelectorAll('button, .menu-item, .interactive');
        this.addTouchFeedback(interactiveElements);
        
        // Initialize fractal background if canvas exists
        const fractalCanvas = document.getElementById('fractalBg');
        if (fractalCanvas) {
            this.initFractal(fractalCanvas);
        }
    }

    addTouchFeedback(elements) {
        elements.forEach(el => {
            el.addEventListener('touchstart', () => {
                el.style.transform = 'scale(0.95)';
                this.audioManager.playTone(440, 0.1); // Feedback tone
            });
            
            el.addEventListener('touchend', () => {
                el.style.transform = '';
            });
        });
    }

    initFractal(canvas) {
        const ctx = canvas.getContext('2d');
        
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        let t = 0;
        const drawFractal = () => {
            let w = canvas.width, h = canvas.height;
            ctx.clearRect(0, 0, w, h);
            
            for (let i = 0; i < 200; i++) {
                let x = w/2 + Math.sin(i * 0.1 + t) * i * 0.8;
                let y = h/2 + Math.cos(i * 0.1 + t) * i * 0.8;
                
                ctx.fillStyle = `hsla(${(t * 50 + i * 2) % 360}, 100%, ${30 + i % 50}%, 0.5)`;
                ctx.beginPath();
                ctx.arc(x, y, 2 + (i % 3), 0, Math.PI * 2);
                ctx.fill();
            }
            
            t += 0.01;
            requestAnimationFrame(drawFractal);
        };
        
        drawFractal();
    }

    showMessage(message, type = 'info') {
        const messageEl = document.createElement('div');
        messageEl.className = `message ${type}`;
        messageEl.textContent = message;
        document.body.appendChild(messageEl);
        
        setTimeout(() => {
            messageEl.remove();
        }, 3000);
    }
}

// Audio System
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

// Device Connection Manager
class DeviceManager {
    constructor() {
        this.device = null;
        this.initialized = false;
    }

    async init() {
        if (this.initialized) return;
        // Initialize Web Bluetooth API if available
        if ('bluetooth' in navigator) {
            this.initialized = true;
        }
    }

    async connectDevice() {
        try {
            this.device = await navigator.bluetooth.requestDevice({
                filters: [{ namePrefix: 'EchoMind' }],
                optionalServices: ['battery_service']
            });
            return true;
        } catch (error) {
            console.error('Connection failed:', error);
            return false;
        }
    }

    async testConnection() {
        if (!this.device) return false;
        try {
            await this.device.gatt.connect();
            return true;
        } catch (error) {
            console.error('Test failed:', error);
            return false;
        }
    }
}

// Initialize core system
window.echoMind = new EchoMindCore();
document.addEventListener('DOMContentLoaded', () => {
    window.echoMind.init();
}); 