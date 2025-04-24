// Global microphone handler
class MicrophoneHandler {
    constructor() {
        this.recognition = null;
        this.listening = false;
        this.onResultCallback = null;
        this.keepListening = true;
        this.hasPermission = false;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 3;
        
        // Initialize recognition if available
        if (typeof window.SpeechRecognition === 'undefined' && typeof window.webkitSpeechRecognition === 'undefined') {
            console.error('Speech recognition not supported');
            return;
        }
        
        this.initRecognition();
        
        // Check for existing permissions using the Permissions API
        this.checkExistingPermission().then(hasPermission => {
            if (hasPermission) {
                this.hasPermission = true;
                this.start(true);
            }
        });
    }

    async checkExistingPermission() {
        try {
            // Try Permissions API first
            if (navigator.permissions) {
                const result = await navigator.permissions.query({ name: 'microphone' });
                if (result.state === 'granted') {
                    return true;
                }
            }
            
            // Fallback to stored permission
            if (localStorage.getItem('micPermission') === 'granted') {
                // Verify the stored permission is still valid
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                stream.getTracks().forEach(track => track.stop());
                return true;
            }
        } catch (err) {
            console.log('Permission check failed:', err);
        }
        return false;
    }

    initRecognition() {
        if (this.recognition) {
            this.recognition.onend = null;
            this.recognition.onstart = null;
            this.recognition.onresult = null;
            this.recognition.onerror = null;
            this.recognition.abort();
        }

        this.recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        this.recognition.continuous = true;
        this.recognition.interimResults = false;
        this.recognition.maxAlternatives = 1;
        this.recognition.lang = localStorage.getItem("echomind_lang") || navigator.language;
        
        this.setupRecognitionHandlers();
    }

    setupRecognitionHandlers() {
        this.recognition.onstart = () => {
            this.listening = true;
            this.reconnectAttempts = 0; // Reset reconnect attempts on successful start
            if (this.onStartCallback) this.onStartCallback();
        };

        this.recognition.onend = () => {
            this.listening = false;
            
            // If we should keep listening and have permission, restart
            if (this.keepListening && this.hasPermission && !document.hidden) {
                if (this.reconnectAttempts < this.maxReconnectAttempts) {
                    this.reconnectAttempts++;
                    console.log(`Reconnecting attempt ${this.reconnectAttempts}`);
                    setTimeout(() => {
                        this.start(true);
                    }, 100);
                } else {
                    console.log('Max reconnect attempts reached, reinitializing recognition');
                    this.reconnectAttempts = 0;
                    this.initRecognition();
                    this.start(true);
                }
            }
            
            if (this.onEndCallback) this.onEndCallback();
        };

        this.recognition.onresult = (event) => {
            const latest = event.results[event.results.length - 1];
            if (latest.isFinal) {
                const transcript = latest[0].transcript;
                if (this.onResultCallback) this.onResultCallback(transcript);
            }
        };

        this.recognition.onerror = (event) => {
            console.log('Speech recognition error:', event.error);
            
            switch (event.error) {
                case 'not-allowed':
                case 'permission-denied':
                    this.hasPermission = false;
                    localStorage.removeItem('micPermission');
                    this.keepListening = false;
                    break;
                case 'network':
                    // Network errors might be temporary, just restart
                    if (this.keepListening && this.hasPermission) {
                        setTimeout(() => this.start(true), 1000);
                    }
                    break;
                case 'no-speech':
                case 'aborted':
                    // These are normal, just let the onend handler restart if needed
                    return;
                default:
                    // For unknown errors, reinitialize if we should keep listening
                    if (this.keepListening && this.hasPermission) {
                        this.initRecognition();
                        this.start(true);
                    }
            }
            
            if (this.onErrorCallback) this.onErrorCallback(event);
        };

        // Handle page visibility changes
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                if (this.listening) {
                    this.recognition.stop();
                }
            } else if (this.keepListening && this.hasPermission) {
                this.start(true);
            }
        });
    }

    async requestPermission() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            stream.getTracks().forEach(track => track.stop());
            this.hasPermission = true;
            localStorage.setItem('micPermission', 'granted');
            return true;
        } catch (err) {
            console.error('Microphone permission error:', err);
            this.hasPermission = false;
            localStorage.removeItem('micPermission');
            return false;
        }
    }

    async start(keepListening = true) {
        if (this.listening) return;
        
        if (!this.hasPermission) {
            const permitted = await this.requestPermission();
            if (!permitted) {
                if (this.onErrorCallback) {
                    this.onErrorCallback({ error: 'not-allowed' });
                }
                return;
            }
        }

        this.keepListening = keepListening;
        
        try {
            await this.recognition.start();
        } catch (err) {
            console.error('Failed to start recognition:', err);
            // If we get an error, try reinitializing the recognition
            this.initRecognition();
            try {
                await this.recognition.start();
            } catch (retryErr) {
                console.error('Failed to start recognition after retry:', retryErr);
                if (this.onErrorCallback) {
                    this.onErrorCallback({ error: 'start-failed', details: retryErr });
                }
            }
        }
    }

    stop() {
        this.keepListening = false;
        if (this.listening) {
            try {
                this.recognition.stop();
            } catch (err) {
                console.error('Failed to stop recognition:', err);
            }
        }
    }

    setCallbacks({ onStart, onEnd, onResult, onError }) {
        this.onStartCallback = onStart;
        this.onEndCallback = onEnd;
        this.onResultCallback = onResult;
        this.onErrorCallback = onError;
    }
}

// Create a single instance for the entire app
window.micHandler = window.micHandler || new MicrophoneHandler(); 