#!/bin/bash

echo "================================"
echo "🧪 TESTING ALL LOGIN CREDENTIALS"
echo "================================"
echo ""

# Test Doctor Login
echo "1️⃣  Testing DOCTOR Login..."
echo "   📧 Email: doctor@hospital.com"
echo "   🔑 Password: doctor123"
DOCTOR_RESPONSE=$(curl -s -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"doctor@hospital.com","password":"doctor123","role":"doctor"}')

if echo "$DOCTOR_RESPONSE" | grep -q "token"; then
  echo "   ✅ Doctor login SUCCESSFUL"
else
  echo "   ❌ Doctor login FAILED"
  echo "   Response: $DOCTOR_RESPONSE"
fi
echo ""

# Test Admin Login
echo "2️⃣  Testing ADMIN Login..."
echo "   📧 Email: admin@hospital.com"
echo "   🔑 Password: admin123"
ADMIN_RESPONSE=$(curl -s -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@hospital.com","password":"admin123","role":"admin"}')

if echo "$ADMIN_RESPONSE" | grep -q "token"; then
  echo "   ✅ Admin login SUCCESSFUL"
else
  echo "   ❌ Admin login FAILED"
  echo "   Response: $ADMIN_RESPONSE"
fi
echo ""

# Test Pharmacist Login
echo "3️⃣  Testing PHARMACIST Login..."
echo "   📧 Email: pharmacist@hospital.com"
echo "   🔑 Password: pharmacy123"
PHARM_RESPONSE=$(curl -s -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"pharmacist@hospital.com","password":"pharmacy123","role":"pharmacist"}')

if echo "$PHARM_RESPONSE" | grep -q "token"; then
  echo "   ✅ Pharmacist login SUCCESSFUL"
else
  echo "   ❌ Pharmacist login FAILED"
  echo "   Response: $PHARM_RESPONSE"
fi
echo ""

# Test Reports Staff Login
echo "4️⃣  Testing REPORTS STAFF Login..."
echo "   📧 Email: reports@hospital.com"
echo "   🔑 Password: reports123"
REPORTS_RESPONSE=$(curl -s -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"reports@hospital.com","password":"reports123","role":"reports"}')

if echo "$REPORTS_RESPONSE" | grep -q "token"; then
  echo "   ✅ Reports Staff login SUCCESSFUL"
else
  echo "   ❌ Reports Staff login FAILED"
  echo "   Response: $REPORTS_RESPONSE"
fi
echo ""

# Test Patient Login
echo "5️⃣  Testing PATIENT Login..."
echo "   📧 Email: patient@hospital.com"
echo "   🔑 Password: patient123"
PATIENT_RESPONSE=$(curl -s -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"patient@hospital.com","password":"patient123","role":"patient"}')

if echo "$PATIENT_RESPONSE" | grep -q "token"; then
  echo "   ✅ Patient login SUCCESSFUL"
else
  echo "   ❌ Patient login FAILED"
  echo "   Response: $PATIENT_RESPONSE"
fi
echo ""

echo "================================"
echo "📊 ALL DEMO CREDENTIALS:"
echo "================================"
echo "👨‍⚕️  Doctor:      doctor@hospital.com / doctor123"
echo "🔧 Admin:       admin@hospital.com / admin123"
echo "💊 Pharmacist:  pharmacist@hospital.com / pharmacy123"
echo "📋 Reports:     reports@hospital.com / reports123"
echo "😊 Patient:     patient@hospital.com / patient123"
echo "================================"
echo ""
echo "🌐 Frontend: http://localhost:3000"
echo "🔌 Backend:  http://localhost:3001"
echo ""
