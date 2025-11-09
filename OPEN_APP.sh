#!/bin/bash

clear
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║         🏥 HEALTHCARE SYSTEM - OPENING BROWSER...          ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""
echo "✅ Backend:  http://localhost:3001  (API Server)"
echo "✅ Frontend: http://localhost:3000  (Web App)"
echo ""
echo "🔑 DEMO CREDENTIALS:"
echo "   👨‍⚕️  Doctor:     doctor@hospital.com / doctor123"
echo "   🔧 Admin:      admin@hospital.com / admin123"
echo "   💊 Pharmacist: pharmacist@hospital.com / pharmacy123"
echo "   📋 Reports:    reports@hospital.com / reports123"
echo "   😊 Patient:    patient@hospital.com / patient123"
echo ""
echo "📝 TIP: Click 'Use Demo Credentials' button for instant login!"
echo ""
echo "Opening browser in 3 seconds..."
sleep 3

# Open the main app
open http://localhost:3000

echo "✅ Browser opened!"
echo ""
echo "🎯 NEXT STEPS:"
echo "   1. Click on any role (Doctor, Admin, etc.)"
echo "   2. Click 'Use Demo Credentials'"
echo "   3. Click 'Sign in'"
echo "   4. You're in! 🎉"
echo ""
