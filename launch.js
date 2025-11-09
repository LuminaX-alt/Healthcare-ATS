#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('\n🚀 HEALTHCARE APPLICATION LAUNCHER');
console.log('===================================\n');

// Check if MongoDB is running
console.log('🔍 Checking MongoDB...');
const checkMongo = spawn('pgrep', ['-x', 'mongod']);
checkMongo.on('close', (code) => {
  if (code !== 0) {
    console.log('⚠️  MongoDB not running. Starting MongoDB...');
    spawn('brew', ['services', 'start', 'mongodb-community'], { stdio: 'inherit' });
  } else {
    console.log('✅ MongoDB is running\n');
  }
});

// Kill existing processes on ports
console.log('🧹 Cleaning up existing processes...');
const cleanup = spawn('sh', ['-c', 'lsof -ti:3000 | xargs kill -9 2>/dev/null; lsof -ti:3001 | xargs kill -9 2>/dev/null; true']);

cleanup.on('close', () => {
  console.log('✅ Ports cleared\n');
  
  setTimeout(() => {
    // Start Backend
    console.log('🔵 Starting Backend Server (Port 3001)...');
    const backend = spawn('node', ['index.js'], {
      cwd: path.join(__dirname, 'server'),
      stdio: ['ignore', 'pipe', 'pipe'],
      detached: false
    });

    backend.stdout.on('data', (data) => {
      const output = data.toString();
      if (output.includes('MongoDB connected') || output.includes('Server running')) {
        console.log('   ✅ ' + output.trim());
      }
    });

    backend.stderr.on('data', (data) => {
      console.error('   ❌ Backend Error:', data.toString().trim());
    });

    // Wait for backend to start
    setTimeout(() => {
      console.log('\n🟢 Starting Frontend Server (Port 3000)...');
      const frontend = spawn('npm', ['start'], {
        cwd: __dirname,
        stdio: ['ignore', 'pipe', 'pipe'],
        detached: false,
        env: { ...process.env, BROWSER: 'none' }
      });

      frontend.stdout.on('data', (data) => {
        const output = data.toString();
        if (output.includes('compiled') || output.includes('webpack compiled')) {
          console.log('   ✅ Frontend compiled successfully!');
          console.log('\n🎉 APPLICATION IS READY!\n');
          console.log('🌐 Open your browser and go to: \x1b[36mhttp://localhost:3000\x1b[0m\n');
          console.log('📋 LOGIN CREDENTIALS:');
          console.log('   👨‍⚕️ Doctor:  doctor@hospital.com / doctor123');
          console.log('   👨‍💼 Admin:   admin@hospital.com / admin123');
          console.log('   👤 Patient: +1234567890 / OTP: 123456\n');
          console.log('💡 Press Ctrl+C to stop all servers\n');
          
          // Open browser after 2 seconds
          setTimeout(() => {
            const openCmd = process.platform === 'darwin' ? 'open' : 
                           process.platform === 'win32' ? 'start' : 'xdg-open';
            spawn(openCmd, ['http://localhost:3000'], { stdio: 'ignore' });
          }, 2000);
        }
      });

      frontend.stderr.on('data', (data) => {
        const output = data.toString();
        if (!output.includes('WARNING') && !output.includes('DeprecationWarning')) {
          console.error('   ⚠️  Frontend:', output.trim());
        }
      });

      // Handle process termination
      process.on('SIGINT', () => {
        console.log('\n\n🛑 Stopping servers...');
        backend.kill();
        frontend.kill();
        setTimeout(() => {
          console.log('✅ All servers stopped. Goodbye!\n');
          process.exit(0);
        }, 1000);
      });

    }, 5000); // Wait 5 seconds for backend to be ready

  }, 2000); // Wait 2 seconds after cleanup
});
