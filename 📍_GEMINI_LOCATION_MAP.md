# 📍 WHERE IS GEMINI AI? - VISUAL MAP

## 🎯 EXACT LOCATION

```
healthcare-prototype/
│
├── server/                                    ← BACKEND
│   ├── routes/
│   │   ├── lumina-ai-gemini.js              ← 🤖 GEMINI AI HERE! (272 lines)
│   │   ├── lumina-ai-local.js               (old Ollama)
│   │   ├── lumina-ai-enhanced.js            (old knowledge base)
│   │   └── doctors.js                        (doctor dropdown fix)
│   │
│   ├── .env                                  ← 🔑 API KEY HERE (line 11)
│   │   Line 11: GEMINI_API_KEY=AIzaSyA...
│   │
│   └── index.js                              ← ROUTE SETUP (line 31)
│       Line 31: app.use('/api/lumina-ai-local', 
│                        require('./routes/lumina-ai-gemini'));
│
└── src/                                      ← FRONTEND
    └── components/
        └── LuminaAssistant.tsx               ← UI calls Gemini API
```

---

## 🔍 FILE BREAKDOWN

### 1. **Main AI File** (THE IMPORTANT ONE)

**Path**: `/Users/mrdevsharma/Downloads/EX/healthcare-prototype/server/routes/lumina-ai-gemini.js`

**Contains**:
```javascript
Line 1-10:   Imports & setup
Line 11:     GEMINI_API_URL = 'https://generativelanguage.googleapis.com/...'
Line 14:     MEDICAL_SYSTEM_PROMPT (what makes Alt-X smart)
Line 34:     POST /query endpoint (main API)
Line 79:     queryGeminiAI() function (calls Google)
Line 124:    Response parsing
Line 200:    Status & test endpoints
```

---

### 2. **API Key File**

**Path**: `/Users/mrdevsharma/Downloads/EX/healthcare-prototype/server/.env`

```env
Line 11: GEMINI_API_KEY=AIzaSyAPnzRyWyD9sYomxUvjGPaGfeK7xSilNCI
```

**This is your FREE Google API key** - no cost, unlimited personal use!

---

### 3. **Route Registration**

**Path**: `/Users/mrdevsharma/Downloads/EX/healthcare-prototype/server/index.js`

```javascript
Line 31: app.use('/api/lumina-ai-local', require('./routes/lumina-ai-gemini'));
```

**This connects** the Gemini file to the API endpoint `/api/lumina-ai-local/query`

---

### 4. **Frontend UI**

**Path**: `/Users/mrdevsharma/Downloads/EX/healthcare-prototype/src/components/LuminaAssistant.tsx`

```typescript
// Calls the Gemini API when user types a message
const response = await api.post('/api/lumina-ai-local/query', {
  query: userMessage,
  patientInfo: selectedPatient
});
```

---

## 🌐 HOW IT WORKS (DATA FLOW)

```
┌─────────────────────────────────────────────────────────────┐
│ USER TYPES: "What are symptoms of diabetes?"               │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ↓
┌─────────────────────────────────────────────────────────────┐
│ FRONTEND: LuminaAssistant.tsx                              │
│ Sends POST to: /api/lumina-ai-local/query                  │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ↓
┌─────────────────────────────────────────────────────────────┐
│ BACKEND: server/index.js (Line 31)                         │
│ Routes to: ./routes/lumina-ai-gemini.js                    │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ↓
┌─────────────────────────────────────────────────────────────┐
│ GEMINI FILE: lumina-ai-gemini.js                           │
│ 1. Receives query                                           │
│ 2. Adds medical system prompt                              │
│ 3. Calls Google Gemini API                                 │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ↓
┌─────────────────────────────────────────────────────────────┐
│ GOOGLE GEMINI 2.5 FLASH                                    │
│ https://generativelanguage.googleapis.com/v1beta/...       │
│ Processes query and generates response                     │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ↓
┌─────────────────────────────────────────────────────────────┐
│ RESPONSE BACK TO USER                                       │
│ "Symptoms of diabetes include increased thirst..."         │
└─────────────────────────────────────────────────────────────┘
```

---

## 📂 QUICK ACCESS COMMANDS

### View the Gemini File:
```bash
cd /Users/mrdevsharma/Downloads/EX/healthcare-prototype
cat server/routes/lumina-ai-gemini.js
```

### View API Key:
```bash
cat server/.env | grep GEMINI
```

### View Route Setup:
```bash
cat server/index.js | grep -A 2 "lumina-ai-local"
```

### Test Gemini API:
```bash
curl -X POST http://localhost:3001/api/lumina-ai-local/query \
  -H "Content-Type: application/json" \
  -d '{"query": "What is diabetes?"}'
```

---

## 🎯 KEY FILES SUMMARY

| File | Path | Purpose |
|------|------|---------|
| **Gemini AI** | `/server/routes/lumina-ai-gemini.js` | Main AI logic (272 lines) |
| **API Key** | `/server/.env` | Line 11: Your Google API key |
| **Route** | `/server/index.js` | Line 31: Connects API endpoint |
| **Frontend** | `/src/components/LuminaAssistant.tsx` | UI for Alt-X chat |

---

## 🚀 TO START THE APP:

```bash
cd /Users/mrdevsharma/Downloads/EX/healthcare-prototype
chmod +x QUICK-START.sh
./QUICK-START.sh
```

Then open: http://localhost:3000/login/doctor → Click Alt-X tab → Ask anything!

---

**Created**: November 8, 2025  
**Gemini Model**: gemini-2.5-flash  
**Cost**: 100% FREE ✅
