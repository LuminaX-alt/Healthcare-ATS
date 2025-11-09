#!/bin/zsh

echo "\n🛑 Stopping Healthcare Application...\n"

# Kill processes by port
lsof -ti:3000 | xargs kill -9 2>/dev/null && echo "✅ Frontend stopped (port 3000)" || echo "⚠️  No process on port 3000"
lsof -ti:3001 | xargs kill -9 2>/dev/null && echo "✅ Backend stopped (port 3001)" || echo "⚠️  No process on port 3001"

# Kill by PID if available
if [ -f "logs/pids.txt" ]; then
    read BACKEND_PID FRONTEND_PID < logs/pids.txt
    kill -9 $BACKEND_PID $FRONTEND_PID 2>/dev/null
    rm logs/pids.txt
fi

echo "\n✅ Application stopped!\n"
