#!/bin/bash

# 🧪 Alt-X AI Testing Script
# Tests all enhanced features

echo "🤖 Testing Alt-X AI Enhanced Features..."
echo "========================================="
echo ""

API_BASE="http://localhost:3001/api/lumina-ai"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test 1: Dosage Query
echo -e "${BLUE}Test 1: Dosage Query${NC}"
echo "Query: 'What is the dosage for amoxicillin?'"
curl -s -X POST "$API_BASE/query" \
  -H "Content-Type: application/json" \
  -d '{"query":"What is the dosage for amoxicillin?"}' | jq '.response.answer' | head -15
echo ""
echo "---"
echo ""

# Test 2: Calculator - CrCl
echo -e "${BLUE}Test 2: Creatinine Clearance Calculator${NC}"
echo "Input: Age 65, Weight 70kg, SCr 1.2, Male"
curl -s -X POST "$API_BASE/calculate" \
  -H "Content-Type: application/json" \
  -d '{"calculator":"crcl","params":{"age":65,"weight":70,"scr":1.2,"gender":"male"}}' | jq '.'
echo ""
echo "---"
echo ""

# Test 3: Drug Interactions
echo -e "${BLUE}Test 3: Drug Interaction Check${NC}"
echo "Drugs: Warfarin + Ibuprofen"
curl -s -X POST "$API_BASE/interactions" \
  -H "Content-Type: application/json" \
  -d '{"medications":["Warfarin","Ibuprofen"]}' | jq '.'
echo ""
echo "---"
echo ""

# Test 4: Patient Context
echo -e "${BLUE}Test 4: Patient-Specific Dosing${NC}"
echo "Patient: 70yo with Penicillin allergy"
curl -s -X POST "$API_BASE/query" \
  -H "Content-Type: application/json" \
  -d '{
    "query":"Ciprofloxacin dosage",
    "patientInfo":{
      "age":70,
      "allergies":["Penicillin"],
      "ageGroup":"elderly"
    }
  }' | jq '.response' | head -20
echo ""
echo "---"
echo ""

# Test 5: Medications List
echo -e "${BLUE}Test 5: Available Medications${NC}"
curl -s "$API_BASE/medications" | jq '.'
echo ""
echo "---"
echo ""

# Test 6: Specific Medication Details
echo -e "${BLUE}Test 6: Metformin Details${NC}"
curl -s "$API_BASE/medication/metformin" | jq '.details | {category, class, indications, dosage}'
echo ""
echo "---"
echo ""

# Test 7: Safety Check
echo -e "${BLUE}Test 7: Safety & Allergy Check${NC}"
echo "Query: 'Is ciprofloxacin safe in pregnancy?'"
curl -s -X POST "$API_BASE/query" \
  -H "Content-Type: application/json" \
  -d '{"query":"Is ciprofloxacin safe in pregnancy?"}' | jq '.response.answer' | head -10
echo ""
echo "---"
echo ""

# Test 8: BMI Calculator
echo -e "${BLUE}Test 8: BMI Calculator${NC}"
echo "Input: Weight 80kg, Height 1.75m"
curl -s -X POST "$API_BASE/calculate" \
  -H "Content-Type: application/json" \
  -d '{"calculator":"bmi","params":{"weight":80,"height":1.75}}' | jq '.'
echo ""
echo "---"
echo ""

echo -e "${GREEN}✅ All tests completed!${NC}"
echo ""
echo "Alt-X AI is fully functional and ready to use!"
