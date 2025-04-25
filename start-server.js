const http = require('http');
const httpServer = require('http-server');
const path = require('path');

function findAvailablePort(startPort) {
    return new Promise((resolve, reject) => {
        const server = http.createServer();
        
        server.listen(startPort, () => {
            const port = server.address().port;
            server.close(() => resolve(port));
        });

        server.on('error', () => {
            // Port is in use, try the next one
            resolve(findAvailablePort(startPort + 1));
        });
    });
}

async function startServer() {
    try {
        const port = await findAvailablePort(3000);
        const server = httpServer.createServer({
            root: path.resolve(__dirname),
            cache: -1, // Disable caching
            cors: true, // Enable CORS
            corsHeaders: '*', // Allow all headers
            showDir: true,
            autoIndex: true,
            gzip: true,
            brotli: true,
            robots: true,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Range',
            }
        });

        server.listen(port, '127.0.0.1', () => {
            console.log(`
╔════════════════════════════════════════════╗
║           EchoMind Server Started          ║
╠════════════════════════════════════════════╣
║                                            ║
║  Local:   http://localhost:${port}${' '.repeat(Math.max(0, 12 - port.toString().length))}║
║  Network: http://127.0.0.1:${port}${' '.repeat(Math.max(0, 12 - port.toString().length))}║
║                                            ║
║  Press CTRL+C to stop the server          ║
║                                            ║
╚════════════════════════════════════════════╝
            `);
        });

        // Handle server errors
        server.server.on('error', (err) => {
            console.error('Server error:', err);
            process.exit(1);
        });

        // Handle process termination
        process.on('SIGINT', () => {
            console.log('\nShutting down server...');
            server.close(() => {
                console.log('Server stopped.');
                process.exit(0);
            });
        });

    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer(); 