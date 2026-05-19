/**
 * SkillMatch Premium Production Server
 * --------------------------------------------------
 * This server is responsible for serving the Vite-built React frontend,
 * automatically detecting and running/proxying the correct backend service,
 * and maintaining high performance and reliability on Render and local environments.
 */

const express = require('express');
const path = require('path');
const fs = require('fs');
const { spawn, fork } = require('child_process');

const app = express();
const PORT = process.env.PORT || 5000;

console.log('\n==================================================');
console.log('🚀 Starting SkillMatch Production Service Engine...');
console.log('==================================================\n');

// 1. Automatic Backend Detection System
const findBackendEntryFile = () => {
    const commonNodeLocations = [
        path.join(__dirname, 'backend', 'server.js'),
        path.join(__dirname, 'backend', 'index.js'),
        path.join(__dirname, 'backend', 'app.js'),
        path.join(__dirname, 'backend', 'src', 'server.js'),
        path.join(__dirname, 'backend', 'src', 'index.js'),
        path.join(__dirname, 'backend', 'src', 'app.js'),
        path.join(__dirname, 'index.js'),
        path.join(__dirname, 'app.js')
    ];

    for (const file of commonNodeLocations) {
        // Skip this server file itself to avoid infinite recursion
        if (file === __filename) continue;
        if (fs.existsSync(file)) {
            return { type: 'Node', path: file };
        }
    }

    // Check if Java Maven Spring Boot backend is present
    const pomPath = path.join(__dirname, 'backend', 'pom.xml');
    if (fs.existsSync(pomPath)) {
        return { type: 'Java', path: pomPath };
    }

    return null;
};

const backendInfo = findBackendEntryFile();

if (backendInfo) {
    console.log(`📡 [SYSTEM] Backend detected: ${backendInfo.type} (${path.relative(__dirname, backendInfo.path)})`);
    
    if (backendInfo.type === 'Node') {
        // Spawn Node.js backend
        console.log('⚡ [SYSTEM] Spawning Node.js backend process...');
        const backendProcess = fork(backendInfo.path, [], {
            env: { ...process.env, PORT: process.env.BACKEND_PORT || 5001 }
        });
        
        backendProcess.on('error', (err) => {
            console.error('❌ [BACKEND ERROR] failed to start Node backend process:', err);
        });

        // Set up proxying for the Node backend
        const BACKEND_URL = process.env.BACKEND_URL || `http://localhost:${process.env.BACKEND_PORT || 5001}`;
        app.use('/api', (req, res) => {
            // Forward API requests to the Node backend
            res.redirect(307, `${BACKEND_URL}${req.originalUrl}`);
        });
    } else if (backendInfo.type === 'Java') {
        console.log('☕ [SYSTEM] Java Spring Boot detected.');
        
        // Check if we should run the Spring Boot backend concurrently (ideal for local or custom Java container deployments)
        const runJava = process.env.RUN_JAVA_BACKEND === 'true' || process.env.NODE_ENV !== 'production';
        
        if (runJava) {
            console.log('⚡ [SYSTEM] Spawning Spring Boot backend process...');
            const isWin = process.platform === 'win32';
            const mvnCmd = isWin ? 'mvnw.cmd' : './mvnw';
            const backendDir = path.join(__dirname, 'backend');
            
            // Run spring-boot:run via Maven wrapper
            const javaProcess = spawn(mvnCmd, ['spring-boot:run'], {
                cwd: backendDir,
                stdio: 'inherit',
                shell: true
            });

            javaProcess.on('error', (err) => {
                console.warn('⚠️ [BACKEND WARNING] Failed to automatically start Spring Boot. Make sure Java and mvnw are configured.', err);
            });
        }

        // Set up API proxying to Spring Boot backend (default port is 8080 as configured in application.properties)
        const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8080';
        console.log(`🔗 [PROXY] Mapping /api requests to backend URL: ${BACKEND_URL}`);

        // Simple built-in HTTP proxy to redirect /api calls to the backend
        const http = require('http');
        app.use('/api', (req, res) => {
            const url = new URL(req.originalUrl, BACKEND_URL);
            
            const options = {
                method: req.method,
                headers: { ...req.headers },
                host: url.hostname,
                port: url.port || 80,
                path: url.pathname + url.search
            };

            // Remove host header to avoid CORS/Host mismatches on proxy target
            delete options.headers.host;

            const proxyReq = http.request(options, (proxyRes) => {
                res.writeHead(proxyRes.statusCode, proxyRes.headers);
                proxyRes.pipe(res, { end: true });
            });

            req.pipe(proxyReq, { end: true });

            proxyReq.on('error', (err) => {
                console.error(`❌ [PROXY ERROR] Failed to connect to backend at ${BACKEND_URL}:`, err.message);
                res.status(502).json({
                    error: 'Bad Gateway',
                    message: `Failed to connect to backend service. Ensure backend is running at ${BACKEND_URL}.`
                });
            });
        });
    }
} else {
    console.log('⚠️ [SYSTEM] No backend service entry point detected. Running in Frontend-Only mode.');
}

// 2. Static Content Serving
const frontendDistPath = path.join(__dirname, 'frontend', 'dist');

if (fs.existsSync(frontendDistPath)) {
    console.log(`📂 [STATIC] Serving built frontend from: ${frontendDistPath}`);
    app.use(express.static(frontendDistPath));

    // Client-side routing fallback (for React Router)
    app.get('*', (req, res, next) => {
        // Skip API routes so they don't get served index.html by mistake
        if (req.path.startsWith('/api')) {
            return next();
        }
        res.sendFile(path.join(frontendDistPath, 'index.html'));
    });
} else {
    console.warn('⚠️ [STATIC WARNING] frontend/dist directory not found. Please build the frontend first (`npm run build`).');
    app.get('*', (req, res) => {
        res.status(404).send('Frontend build files not found. Please run "npm run build" to compile your React application.');
    });
}

// 3. Start Listening
app.listen(PORT, () => {
    console.log('\n==================================================');
    console.log(`✅ Server successfully listening on port: ${PORT}`);
    console.log(`👉 App is accessible at: http://localhost:${PORT}`);
    console.log('==================================================\n');
});
