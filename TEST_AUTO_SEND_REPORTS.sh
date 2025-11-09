#!/bin/bash

# 🚀 AUTO-SEND REPORTS - QUICK START GUIDE

echo "=================================================="
echo "  ✅ AUTO-SEND LAB REPORTS FEATURE IS READY!  "
echo "=================================================="
echo ""
echo "📋 WHAT'S NEW:"
echo "  - Lab reports AUTOMATICALLY sent to doctors"
echo "  - No manual 'Send' button needed"
echo "  - Doctor gets instant notification"
echo "  - One-click upload & send process"
echo ""
echo "=================================================="
echo ""

# Start MongoDB
echo "🔧 Step 1: Starting MongoDB..."
brew services start mongodb-community 2>/dev/null || mongod --fork --logpath /tmp/mongodb.log

sleep 2

# Start backend server
echo ""
echo "🔧 Step 2: Starting Backend Server..."
cd "$(dirname "$0")"
node server/index.js &
BACKEND_PID=$!

sleep 3

# Start frontend
echo ""
echo "🔧 Step 3: Starting Frontend..."
npm start &
FRONTEND_PID=$!

sleep 5

echo ""
echo "=================================================="
echo "  🎉 SERVERS RUNNING!  "
echo "=================================================="
echo ""
echo "📱 FRONTEND: http://localhost:3000"
echo "🔌 BACKEND:  http://localhost:3001"
echo ""
echo "=================================================="
echo "  🧪 TEST THE AUTO-SEND FEATURE:  "
echo "=================================================="
echo ""
echo "STEP 1: Login as Lab Staff"
echo "  URL: http://localhost:3000"
echo "  Click: 'Reports & Investigation' portal"
echo "  Email: reports@hospital.com"
echo "  Password: reports123"
echo ""
echo "STEP 2: Upload Lab Report"
echo "  Tab: 'Upload Lab Report'"
echo "  Fill form:"
echo "    - Patient ID: PAT-001"
echo "    - Patient Name: John Doe"
echo "    - Report Type: Blood Test"
echo "    - Test Name: Complete Blood Count (CBC)"
echo "    - Department: Cardiology"
echo "    - Doctor: Dr. Sarah Johnson"
echo "    - File: Upload any PDF"
echo "  Click: 'Upload & Send to Doctor Automatically'"
echo ""
echo "  ✅ EXPECTED: Success alert shows report sent!"
echo ""
echo "STEP 3: Check Doctor Dashboard"
echo "  Logout from Reports Portal"
echo "  Click: 'Doctor' portal"
echo "  Email: doctor@hospital.com"
echo "  Password: doctor123"
echo ""
echo "  Click: 'Lab Reports' tab (should show badge '1')"
echo "  ✅ EXPECTED: Report shows with 🔴 NEW status"
echo ""
echo "STEP 4: View Report"
echo "  Click: 'View' button"
echo "  ✅ EXPECTED: Report details shown"
echo "  ✅ EXPECTED: Status changes to 👁️ Viewed"
echo ""
echo "STEP 5: Download Report"
echo "  Click: 'Download' button"
echo "  ✅ EXPECTED: File downloads"
echo "  ✅ EXPECTED: Status changes to ✅ Downloaded"
echo ""
echo "=================================================="
echo "  📖 DOCUMENTATION:  "
echo "=================================================="
echo ""
echo "Read: ✅_AUTO_SEND_REPORTS_COMPLETE.md"
echo "      (Complete guide and technical details)"
echo ""
echo "=================================================="
echo "  🛑 TO STOP SERVERS:  "
echo "=================================================="
echo ""
echo "Press Ctrl+C, then run:"
echo "  kill $BACKEND_PID $FRONTEND_PID"
echo ""
echo "=================================================="
echo ""

# Keep script running
wait
