#!/bin/bash

# 🎯 Quick Test Script for All Portals
# This script opens all 5 portals in separate browser tabs for quick testing

echo "🚀 Opening all portals for testing..."
echo ""

# Open main app
open http://localhost:3000

# Wait a bit
sleep 2

# Open each portal login page
open http://localhost:3000/login/doctor
sleep 1
open http://localhost:3000/login/admin
sleep 1
open http://localhost:3000/login/pharmacist
sleep 1
open http://localhost:3000/login/reports
sleep 1
open http://localhost:3000/login/patient

echo ""
echo "✅ All portals opened in browser tabs!"
echo ""
echo "📋 Login Credentials:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "1. Doctor Portal"
echo "   Email: doctor@hospital.com"
echo "   Password: doctor123"
echo ""
echo "2. Admin Portal"
echo "   Email: admin@hospital.com"
echo "   Password: admin123"
echo ""
echo "3. Pharmacist Portal"
echo "   Email: pharmacist@hospital.com"
echo "   Password: pharmacy123"
echo ""
echo "4. Reports Staff Portal"
echo "   Email: reports@hospital.com"
echo "   Password: reports123"
echo ""
echo "5. Patient Portal"
echo "   Email: patient@hospital.com"
echo "   Password: patient123"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🎯 Test Alt-X AI in Doctor Portal!"
echo "   Navigate to Alt-X tab and ask questions"
echo ""
