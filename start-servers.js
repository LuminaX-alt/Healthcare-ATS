#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

console.log('\n🚀 Starting Healthcare Application...\n');

// Kill any existing processes
console.log('🧹 Cleaning up...');
const cleanup = spawn('sh', ['-c', 'lsof -ti:3000 | xargs kill -9 2>/dev/null; lsof -ti:3001 | xargs kill -9 2>/dev/null; true']);

cleanup.on('close', () => {
  console.log('✅ Ports cleared\n');
  
  // Start MongoDB
  console.log('🔧 Ensuring MongoDB is running...');
  spawn('brew', ['services', 'start', 'mongodb-community'], { stdio: 'ignore' });
  
  setTimeout(() => {
    // Start Backend
    console.log('🔵 Starting Backend Server (Port 3001)...');
    const backend = spawn('node', ['index.js'], {
      cwd: path.join(__dirname, 'server'),
      stdio: 'inherit'
    });

    backend.on('error', (err) => {
      console.error('❌ Backend error:', err);
    });

    // Wait for backend
    setTimeout(() => {
      // Start Frontend
      console.log('\n🟢 Starting Frontend Server (Port 3000)...');
      console.log('⏳ This will take 30-60 seconds to compile...\n');
      
      const frontend = spawn('npm', ['start'], {
        cwd: __dirname,
        stdio: 'inherit',
        env: { ...process.env, BROWSER: 'none' }
      });

      frontend.on('error', (err) => {
        console.error('❌ Frontend error:', err);
      });

      // Handle Ctrl+C
      process.on('SIGINT', () => {
        console.log('\n\n🛑 Stopping servers...');
        backend.kill();
        frontend.kill();
        setTimeout(() => {
          process.exit(0);
        }, 1000);
      });

    }, 3000);
  }, 2000);
});
