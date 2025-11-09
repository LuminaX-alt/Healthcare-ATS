const { exec, spawn } = require('child_process');

console.log('🚀 Healthcare App Starting...\n');

// Cleanup
exec('lsof -ti:3000,3001 | xargs kill -9 2>/dev/null', () => {
  
  // Start backend
  console.log('🔵 Starting Backend...');
  const backend = spawn('node', ['server/index.js'], {
    stdio: 'inherit',
    shell: true
  });
  
  setTimeout(() => {
    // Start frontend
    console.log('🟢 Starting Frontend...');
    const frontend = spawn('npm', ['start'], {
      stdio: 'inherit',
      shell: true,
      env: { ...process.env, BROWSER: 'default', PORT: '3000' }
    });
    
    // Cleanup on exit
    process.on('SIGINT', () => {
      backend.kill();
      frontend.kill();
      process.exit();
    });
  }, 3000);
});
