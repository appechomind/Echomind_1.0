// Animation utilities
const animate = {
    fadeIn: (element, duration = 300) => {
        element.style.opacity = 0;
        element.style.display = 'block';
        element.style.transition = `opacity ${duration}ms ease`;
        setTimeout(() => element.style.opacity = 1, 10);
    },
    
    fadeOut: (element, duration = 300) => {
        element.style.opacity = 0;
        setTimeout(() => element.style.display = 'none', duration);
    },
    
    shake: (element) => {
        element.classList.add('shake');
        setTimeout(() => element.classList.remove('shake'), 500);
    },
    
    pulse: (element) => {
        element.classList.add('pulse');
        setTimeout(() => element.classList.remove('pulse'), 1000);
    }
};

// Sound effects
const sounds = {
    async success(frequency = 1000, duration = 0.2) {
        await window.audioManager.playTone(frequency, duration);
        setTimeout(() => window.audioManager.playTone(frequency * 1.5, duration), duration * 1000);
    },
    
    async error(frequency = 400, duration = 0.3) {
        await window.audioManager.playTone(frequency, duration);
        setTimeout(() => window.audioManager.playTone(frequency * 0.8, duration), duration * 500);
    },
    
    async click(frequency = 800, duration = 0.1) {
        await window.audioManager.playTone(frequency, duration);
    }
};

// Device sensors
const sensors = {
    async requestMotionPermission() {
        if (typeof DeviceMotionEvent.requestPermission === 'function') {
            try {
                const permission = await DeviceMotionEvent.requestPermission();
                return permission === 'granted';
            } catch (e) {
                console.error('Motion permission error:', e);
                return false;
            }
        }
        return true;
    },
    
    async requestOrientationPermission() {
        if (typeof DeviceOrientationEvent.requestPermission === 'function') {
            try {
                const permission = await DeviceOrientationEvent.requestPermission();
                return permission === 'granted';
            } catch (e) {
                console.error('Orientation permission error:', e);
                return false;
            }
        }
        return true;
    }
};

// Storage utilities
const storage = {
    save(key, value) {
        try {
            localStorage.setItem(`echomind_${key}`, JSON.stringify(value));
            return true;
        } catch (e) {
            console.error('Storage save error:', e);
            return false;
        }
    },
    
    load(key) {
        try {
            const value = localStorage.getItem(`echomind_${key}`);
            return value ? JSON.parse(value) : null;
        } catch (e) {
            console.error('Storage load error:', e);
            return null;
        }
    },
    
    clear(key) {
        localStorage.removeItem(`echomind_${key}`);
    }
};

// CSS Styles injection
const styles = {
    inject(css) {
        const style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);
        return style;
    },
    
    addKeyframes(name, frames) {
        return this.inject(`
            @keyframes ${name} {
                ${frames}
            }
        `);
    }
};

// Add common animations
styles.inject(`
    .shake {
        animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
    }
    
    .pulse {
        animation: pulse 1s ease-in-out;
    }
    
    @keyframes shake {
        10%, 90% { transform: translate3d(-1px, 0, 0); }
        20%, 80% { transform: translate3d(2px, 0, 0); }
        30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
        40%, 60% { transform: translate3d(4px, 0, 0); }
    }
    
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.1); }
        100% { transform: scale(1); }
    }
`);

// Export utilities
window.EchoMind = {
    animate,
    sounds,
    sensors,
    storage,
    styles
}; 