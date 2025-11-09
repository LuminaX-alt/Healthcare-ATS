#!/bin/bash
cd /Users/mrdevsharma/Downloads/EX/healthcare-prototype && pkill -f "node" 2>/dev/null && lsof -ti:3001 | xargs kill -9 2>/dev/null && lsof -ti:3000 | xargs kill -9 2>/dev/null && sleep 2 && cd server && npm start > ../backend.log 2>&1 & sleep 5 && cd .. && npm start
