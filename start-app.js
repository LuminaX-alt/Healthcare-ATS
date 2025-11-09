const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting Healthcare Application...\n');

// Start backend
console.log('🔵 Starting Backend Server...');
const backend = spawn('node', ['index.js'], {
  cwd: path.join(__dirname, 'server'),
  stdio: 'inherit',
  detached: false
});

// Wait 3 seconds then start frontend
setTimeout(() => {
  console.log('\n🟢 Starting Frontend Server...');
  const frontend = spawn('npm', ['start'], {
    cwd: __dirname,
    stdio: 'inherit',
    detached: false,
    env: { ...process.env, BROWSER: 'none' }
  });

  frontend.on('error', (err) => {
    console.error('Frontend error:', err);
  });
}, 3000);

backend.on('error', (err) => {
  console.error('Backend error:', err);
});

process.on('SIGINT', () => {
  console.log('\n🛑 Stopping servers...');
  process.exit();
});

console.log('\n✅ Servers starting...');
console.log('📋 Frontend: http://localhost:3000');
console.log('📋 Backend: http://localhost:3001');
console.log('\n💡 Press Ctrl+C to stop\n');
