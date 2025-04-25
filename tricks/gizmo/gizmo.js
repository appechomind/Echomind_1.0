// Gizmo Core Functionality
class Gizmo {
    constructor() {
        this.isConnected = false;
        this.deviceHandle = null;
        this.eventListeners = new Map();
        this.audioContext = null;
        this.soundBuffers = new Map();
        this.writer = null;
        this.reader = null;
        this.readLoop = null;
        this.connectionTimeout = 10000; // 10 seconds
        this.retryAttempts = 3;
        this.batteryLevel = null;
        this.lastError = null;
        this.deviceInfo = null;
    }

    // Event handling with validation
    on(event, callback) {
        if (typeof callback !== 'function') {
            throw new Error('Event callback must be a function');
        }
        if (!this.eventListeners.has(event)) {
            this.eventListeners.set(event, new Set());
        }
        this.eventListeners.get(event).add(callback);
        return () => this.eventListeners.get(event).delete(callback); // Return unsubscribe function
    }

    emit(event, data) {
        if (this.eventListeners.has(event)) {
            for (const callback of this.eventListeners.get(event)) {
                try {
                    callback(data);
                } catch (error) {
                    console.error(`Error in ${event} event handler:`, error);
                    this.handleError(error);
                }
            }
        }
    }

    // Enhanced error handling
    handleError(error, context = '') {
        this.lastError = {
            timestamp: new Date(),
            message: error.message,
            context,
            stack: error.stack
        };
        this.emit('error', this.lastError);
        
        // Log to console with context
        console.error(`Gizmo Error [${context}]:`, error);
        
        // Attempt recovery based on error type
        if (error.name === 'NetworkError' || error.name === 'NotFoundError') {
            this.attemptReconnect();
        }
    }

    // Device connection with retry logic
    async connectDevice(options = {}) {
        const attempts = options.attempts || this.retryAttempts;
        const timeout = options.timeout || this.connectionTimeout;

        for (let i = 0; i < attempts; i++) {
            try {
                const connected = await Promise.race([
                    this.attemptConnection(),
                    new Promise((_, reject) => 
                        setTimeout(() => reject(new Error('Connection timeout')), timeout)
                    )
                ]);

                if (connected) {
                    await this.initializeDevice();
                    return true;
                }
            } catch (error) {
                this.handleError(error, `Connection attempt ${i + 1}/${attempts}`);
                if (i < attempts - 1) {
                    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1s between attempts
                }
            }
        }
        return false;
    }

    async attemptConnection() {
        try {
            // Try Bluetooth first
            const device = await navigator.bluetooth.requestDevice({
                filters: [
                    { namePrefix: 'Gizmo' },
                    { services: ['battery_service', 'device_information'] }
                ],
                optionalServices: ['generic_access', 'generic_attribute']
            });

            await device.gatt.connect();
            this.deviceHandle = device;
            this.isConnected = true;
            this.emit('connected');
            return true;
        } catch (btError) {
            console.log('Bluetooth failed, trying Serial:', btError);
            
            try {
                // Fall back to Serial
                const port = await navigator.serial.requestPort();
                await port.open({ 
                    baudRate: 115200,
                    dataBits: 8,
                    stopBits: 1,
                    parity: 'none',
                    bufferSize: 255
                });
                
                this.deviceHandle = port;
                this.writer = port.writable.getWriter();
                this.reader = port.readable.getReader();
                
                // Start reading loop
                this.readLoop = this.startReadLoop();
                
                this.isConnected = true;
                this.emit('connected');
                return true;
            } catch (serialError) {
                throw new Error(`Connection failed: ${serialError.message}`);
            }
        }
    }

    // Device initialization and info gathering
    async initializeDevice() {
        try {
            if (this.deviceHandle?.gatt) {
                // Get device information for Bluetooth
                const infoService = await this.deviceHandle.gatt.getPrimaryService('device_information');
                const characteristics = await infoService.getCharacteristics();
                
                this.deviceInfo = {};
                for (const char of characteristics) {
                    const value = await char.readValue();
                    this.deviceInfo[char.uuid] = new TextDecoder().decode(value);
                }

                // Get battery level
                const batteryService = await this.deviceHandle.gatt.getPrimaryService('battery_service');
                const batteryChar = await batteryService.getCharacteristic('battery_level');
                const batteryValue = await batteryChar.readValue();
                this.batteryLevel = batteryValue.getUint8(0);
                
                this.emit('deviceInfo', this.deviceInfo);
                this.emit('batteryLevel', this.batteryLevel);
            } else if (this.writer) {
                // Query device information for Serial
                await this.sendCommand('INFO');
                await this.sendCommand('BATTERY');
            }
        } catch (error) {
            this.handleError(error, 'Device initialization');
        }
    }

    // Enhanced read loop with data parsing
    async startReadLoop() {
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
            try {
                const { value, done } = await this.reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                
                // Process complete messages
                const messages = buffer.split('\n');
                buffer = messages.pop() || ''; // Keep incomplete message in buffer

                for (const message of messages) {
                    if (message.trim()) {
                        this.processMessage(message.trim());
                    }
                }
            } catch (error) {
                this.handleError(error, 'Read loop');
                break;
            }
        }
    }

    // Message processing
    processMessage(message) {
        try {
            const [command, ...args] = message.split(':');
            switch (command.toUpperCase()) {
                case 'INFO':
                    this.deviceInfo = JSON.parse(args.join(':'));
                    this.emit('deviceInfo', this.deviceInfo);
                    break;
                case 'BATTERY':
                    this.batteryLevel = parseInt(args[0]);
                    this.emit('batteryLevel', this.batteryLevel);
                    break;
                case 'ERROR':
                    this.handleError(new Error(args.join(':')), 'Device error');
                    break;
                default:
                    this.emit('data', message);
            }
        } catch (error) {
            this.handleError(error, 'Message processing');
        }
    }

    // Enhanced command sending with validation and timeout
    async sendCommand(command, timeout = 5000) {
        if (!this.isConnected) {
            throw new Error('Device not connected');
        }

        try {
            const response = new Promise((resolve, reject) => {
                const timer = setTimeout(() => {
                    reject(new Error('Command timeout'));
                }, timeout);

                const handler = (data) => {
                    if (data.startsWith(command)) {
                        clearTimeout(timer);
                        this.off('data', handler);
                        resolve(data);
                    }
                };

                this.on('data', handler);
            });

            if (this.writer) {
                const encoder = new TextEncoder();
                await this.writer.write(encoder.encode(command + '\n'));
            } else if (this.deviceHandle?.gatt) {
                const service = await this.deviceHandle.gatt.getPrimaryService('generic_access');
                const characteristic = await service.getCharacteristic('gap.device_name');
                await characteristic.writeValue(new TextEncoder().encode(command));
            }

            return await response;
        } catch (error) {
            this.handleError(error, `Command: ${command}`);
            throw error;
        }
    }

    // Enhanced random number generation
    async getSecureRandom() {
        try {
            const array = new Uint32Array(1);
            crypto.getRandomValues(array);
            return array[0] / (0xffffffff + 1);
        } catch (error) {
            this.handleError(error, 'Random generation');
            // Fallback to Math.random if crypto fails
            return Math.random();
        }
    }

    async getRandomNumber(min, max) {
        if (typeof min !== 'number' || typeof max !== 'number') {
            throw new Error('Min and max must be numbers');
        }
        if (min > max) {
            throw new Error('Min must be less than or equal to max');
        }
        const random = await this.getSecureRandom();
        return Math.floor(random * (max - min + 1)) + min;
    }

    // Enhanced coin flip with animation support
    async flipCoin(animate = false) {
        const result = (await this.getRandomNumber(0, 1)) === 1 ? 'heads' : 'tails';
        if (animate) {
            this.emit('coinFlipStart');
            await this.playSound('coin');
            // Allow animation to play
            await new Promise(resolve => setTimeout(resolve, 1000));
            this.emit('coinFlipEnd', result);
        }
        return result;
    }

    // Enhanced shuffle with validation
    shuffle(array) {
        if (!Array.isArray(array)) {
            throw new Error('Shuffle input must be an array');
        }
        const copy = [...array];
        for (let i = copy.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [copy[i], copy[j]] = [copy[j], copy[i]];
        }
        return copy;
    }

    // Enhanced audio system
    async initAudio() {
        if (!this.audioContext) {
            try {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
                await Promise.all([
                    this.loadSound('coin', '../assets/sounds/coin.mp3'),
                    this.loadSound('success', '../assets/sounds/success.mp3'),
                    this.loadSound('error', '../assets/sounds/error.mp3')
                ]);
            } catch (error) {
                this.handleError(error, 'Audio initialization');
            }
        }
    }

    async loadSound(name, url) {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const arrayBuffer = await response.arrayBuffer();
            const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
            this.soundBuffers.set(name, audioBuffer);
        } catch (error) {
            this.handleError(error, `Sound loading: ${name}`);
        }
    }

    async playSound(name) {
        try {
            await this.initAudio();
            if (this.soundBuffers.has(name)) {
                const source = this.audioContext.createBufferSource();
                source.buffer = this.soundBuffers.get(name);
                source.connect(this.audioContext.destination);
                source.start(0);
                return new Promise(resolve => {
                    source.onended = resolve;
                });
            }
        } catch (error) {
            this.handleError(error, `Sound playback: ${name}`);
        }
    }

    // Connection status and device info
    getConnectionStatus() {
        return {
            connected: this.isConnected,
            deviceInfo: this.deviceInfo,
            batteryLevel: this.batteryLevel,
            lastError: this.lastError,
            connectionType: this.deviceHandle?.gatt ? 'bluetooth' : (this.writer ? 'serial' : 'none')
        };
    }

    // Automatic reconnection
    async attemptReconnect() {
        if (!this.isConnected) {
            this.emit('reconnecting');
            const connected = await this.connectDevice();
            if (connected) {
                this.emit('reconnected');
            } else {
                this.emit('reconnectFailed');
            }
        }
    }

    // Event unsubscription
    off(event, callback) {
        if (this.eventListeners.has(event)) {
            this.eventListeners.get(event).delete(callback);
        }
    }

    // Enhanced cleanup
    async destroy() {
        try {
            if (this.reader) {
                await this.reader.cancel();
                this.reader.releaseLock();
            }
            if (this.writer) {
                await this.writer.close();
                this.writer.releaseLock();
            }
            if (this.deviceHandle?.gatt?.connected) {
                await this.deviceHandle.gatt.disconnect();
            }
            if (this.deviceHandle?.close) {
                await this.deviceHandle.close();
            }
            if (this.audioContext?.state !== 'closed') {
                await this.audioContext.close();
            }
            
            this.isConnected = false;
            this.deviceHandle = null;
            this.batteryLevel = null;
            this.deviceInfo = null;
            this.eventListeners.clear();
            this.emit('disconnected');
        } catch (error) {
            this.handleError(error, 'Cleanup');
        }
    }
}

// Export for both module and global contexts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Gizmo;
} else if (typeof window !== 'undefined') {
    window.Gizmo = Gizmo;
} 