// Development Configuration
module.exports = {
    // Server Configuration
    server: {
        port: 3000,
        host: 'localhost',
        environment: 'development'
    },

    // API Configuration
    api: {
        version: '1.0',
        cors: {
            origin: '*',
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
            allowedHeaders: ['Content-Type', 'Authorization']
        }
    },

    // Feature Flags
    features: {
        bluetooth: true,
        serialPort: true,
        audio: true,
        fractalBackground: true,
        deviceEmulation: true // For testing without real hardware
    },

    // Debug Settings
    debug: {
        level: 'info',
        verboseLogging: true,
        showErrors: true
    },

    // External Services
    services: {
        gizmo: {
            url: 'http://localhost:3001',
            timeout: 5000
        },
        community: {
            url: 'http://localhost:3002',
            timeout: 5000
        }
    },

    // Cache Settings
    cache: {
        duration: 3600,
        enabled: true
    },

    // Content Settings
    content: {
        maxUploadSize: 5 * 1024 * 1024, // 5MB
        allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'audio/mp3']
    }
}; 