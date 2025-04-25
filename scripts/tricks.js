// Trick-specific utilities for EchoMind
class TrickManager {
    constructor() {
        this.currentTrick = null;
        this.tricks = new Map();
        this.initializeTricks();
    }

    initializeTricks() {
        // Phone Effects
        this.tricks.set('phone_effects', {
            startEffect: async () => {
                window.echoMind.showMessage('Starting phone effect...');
                await window.echoMind.audioManager.playTone(440, 0.2);
                // Add phone-specific effect implementation
            },
            calibrate: async () => {
                window.echoMind.showMessage('Calibrating device sensors...');
                // Add calibration implementation
            }
        });

        // Gizmo
        this.tricks.set('gizmo', {
            connect: async () => {
                window.echoMind.showMessage('Connecting to Gizmo device...');
                const success = await window.echoMind.deviceManager.connectDevice();
                if (success) {
                    window.echoMind.showMessage('Device connected!', 'success');
                } else {
                    window.echoMind.showMessage('Connection failed', 'error');
                }
            },
            test: async () => {
                window.echoMind.showMessage('Testing connection...');
                const success = await window.echoMind.deviceManager.testConnection();
                if (success) {
                    window.echoMind.showMessage('Connection test passed!', 'success');
                } else {
                    window.echoMind.showMessage('Connection test failed', 'error');
                }
            }
        });

        // Dual Device
        this.tricks.set('dual_device', {
            createRoom: async () => {
                window.echoMind.showMessage('Creating new room...');
                const roomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
                window.echoMind.showMessage(`Room Code: ${roomCode}`, 'success');
                return roomCode;
            },
            joinRoom: async (code) => {
                window.echoMind.showMessage('Joining room...');
                if (code && code.length === 6) {
                    window.echoMind.showMessage('Connected to room!', 'success');
                    return true;
                }
                window.echoMind.showMessage('Invalid room code', 'error');
                return false;
            }
        });

        // Community
        this.tricks.set('community', {
            createPost: async (content) => {
                window.echoMind.showMessage('Creating new post...');
                // Add post creation implementation
            },
            loadPosts: async () => {
                window.echoMind.showMessage('Loading community posts...');
                // Add posts loading implementation
            }
        });
    }

    async executeTrick(trickName, action, ...params) {
        const trick = this.tricks.get(trickName);
        if (!trick) {
            window.echoMind.showMessage(`Trick "${trickName}" not found`, 'error');
            return false;
        }

        const trickAction = trick[action];
        if (!trickAction) {
            window.echoMind.showMessage(`Action "${action}" not found for trick "${trickName}"`, 'error');
            return false;
        }

        try {
            return await trickAction(...params);
        } catch (error) {
            console.error(`Error executing trick "${trickName}.${action}":`, error);
            window.echoMind.showMessage('An error occurred', 'error');
            return false;
        }
    }
}

// Initialize trick manager
window.trickManager = new TrickManager();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { TrickManager };
} 