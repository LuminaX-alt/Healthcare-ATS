# 🤖 ALT-X NOW USES CLAUDE AI!

## ✅ WHAT YOU HAVE NOW

**Alt-X is powered by CLAUDE** - One of the BEST AI models in the world!

### 🎯 Claude vs Llama 2:

| Feature | Claude | Llama 2 (Ollama) |
|---------|--------|------------------|
| **Quality** | ⭐⭐⭐⭐⭐ EXCELLENT | ⭐⭐⭐ Good |
| **Speed** | 1-2 seconds | 5-10 seconds |
| **Medical Knowledge** | VERY HIGH | Moderate |
| **Accuracy** | VERY HIGH | Good |
| **Cost** | $0.01 per message | FREE |
| **Internet** | Required | Not required |
| **Privacy** | Data sent to Anthropic | 100% local |

---

## 🚀 HOW TO GET STARTED

### Step 1: Get Your FREE Claude API Key

1. Go to: **https://console.anthropic.com/**
2. Sign up for a free account
3. You'll get **$5 FREE credit** (enough for ~500 messages!)
4. Go to **API Keys** section
5. Click **Create Key**
6. Copy your API key (starts with `sk-ant-`)

### Step 2: Add API Key to Your Project

**Option A: Using Environment Variable (Recommended)**

```bash
# On Mac/Linux
export CLAUDE_API_KEY="sk-ant-api03-your-key-here"

# Then restart backend
cd server
node index.js
```

**Option B: Hard-code it (Quick Test)**

Edit `/server/routes/lumina-ai-claude.js` line 9:
```javascript
const CLAUDE_API_KEY = 'sk-ant-api03-your-key-here'; // ← Paste your key here
```

Then restart backend!

### Step 3: Restart Backend Server

```bash
# Kill old server
lsof -ti:3001 | xargs kill -9

# Start new server
cd server
node index.js
```

### Step 4: Test Alt-X

1. Open your app: http://localhost:3000
2. Login as doctor
3. Click **Alt-X** tab
4. Ask any question!

---

## 🎯 TESTING THE SETUP

### Test 1: Check Status
```bash
curl http://localhost:3001/api/lumina-ai-local/status
```

**Expected Response (if configured):**
```json
{
  "success": true,
  "status": "online",
  "model": "claude-3-sonnet-20240229",
  "provider": "Anthropic Claude",
  "cost": "~$0.01 per message",
  "quality": "Very High",
  "speed": "Fast (1-2 seconds)"
}
```

### Test 2: Ask a Question
```bash
curl -X POST http://localhost:3001/api/lumina-ai-local/query \
  -H "Content-Type: application/json" \
  -d '{"query":"What is diabetes?"}'
```

---

## 💰 PRICING

### Free Tier:
- **$5 FREE** credit when you sign up
- Enough for **~500 messages**
- Perfect for testing!

### After Free Tier:
- **$0.003** per 1K input tokens (~750 words)
- **$0.015** per 1K output tokens (~750 words)
- **Average cost: $0.01 per message**

**Example:**
- 100 messages/day = $1/day = $30/month
- 500 messages/day = $5/day = $150/month

---

## 🔧 CONFIGURATION OPTIONS

Edit `/server/routes/lumina-ai-claude.js`:

### Change Model (Line 12):
```javascript
// Fast & Affordable
const CLAUDE_MODEL = 'claude-3-haiku-20240307';

// Balanced (CURRENT)
const CLAUDE_MODEL = 'claude-3-sonnet-20240229';

// Most Powerful
const CLAUDE_MODEL = 'claude-3-opus-20240229';
```

### Change Response Length (Line 108):
```javascript
max_tokens: 1024  // Current (medium length)
max_tokens: 2048  // Longer responses
max_tokens: 512   // Shorter responses
```

---

## 🆚 MODEL COMPARISON

### Claude 3 Haiku (Fastest & Cheapest)
- **Speed**: <1 second
- **Cost**: $0.001 per message
- **Quality**: ⭐⭐⭐⭐
- **Best for**: Quick answers

### Claude 3 Sonnet (RECOMMENDED) ✅
- **Speed**: 1-2 seconds
- **Cost**: $0.01 per message
- **Quality**: ⭐⭐⭐⭐⭐
- **Best for**: Balanced quality & speed

### Claude 3 Opus (Most Powerful)
- **Speed**: 2-3 seconds
- **Cost**: $0.05 per message
- **Quality**: ⭐⭐⭐⭐⭐⭐
- **Best for**: Complex medical cases

---

## 🐛 TROUBLESHOOTING

### Error: "Claude API key not configured"
**Solution**: Add your API key (see Step 2 above)

### Error: "Cannot connect to Claude API"
**Solution**: Check your internet connection

### Error: "Invalid API key"
**Solution**: 
1. Go to https://console.anthropic.com/
2. Check if your key is correct
3. Make sure it starts with `sk-ant-`

### Error: "Rate limit exceeded"
**Solution**: Wait a few seconds between requests

### Error: "Insufficient credits"
**Solution**: Add payment method at https://console.anthropic.com/

---

## 📊 HOW IT WORKS

```
Doctor types question in Alt-X
        ↓
Frontend sends to Backend (port 3001)
        ↓
Backend sends to Claude API (via internet)
        ↓
Claude AI generates answer (1-2 seconds)
        ↓
Answer sent back to doctor
```

---

## 🎓 EXAMPLE QUESTIONS

Claude can answer:

### Medical:
- "What is the dosage of Amoxicillin for adults?"
- "Explain hypertension and treatment options"
- "What are the side effects of Metformin?"
- "How do I diagnose pneumonia?"

### Clinical:
- "Should I prescribe antibiotics for this case?"
- "What are the differential diagnoses for chest pain?"
- "Explain the WHO antibiotic guidelines"

### General:
- "What is machine learning?"
- "Explain how vaccines work"
- "What causes cancer?"

---

## ✅ ADVANTAGES OF CLAUDE

1. **Much Smarter** - Better than GPT-3.5, close to GPT-4
2. **Faster** - 1-2 seconds vs 5-10 seconds (Llama 2)
3. **More Accurate** - Better medical knowledge
4. **Better Conversation** - More natural responses
5. **Up-to-date** - Trained on recent data (2023)
6. **Reliable** - 99.9% uptime

---

## ❌ DISADVANTAGES

1. **Not Free** - $0.01 per message (after $5 credit)
2. **Needs Internet** - Won't work offline
3. **Privacy** - Data sent to Anthropic servers
4. **API Key Required** - Extra setup step

---

## 🔄 SWITCH BACK TO OLLAMA (LOCAL AI)

If you want to switch back to free local AI:

Edit `/server/index.js` line 31:
```javascript
// Use Claude (Current)
app.use('/api/lumina-ai-local', require('./routes/lumina-ai-claude'));

// Use Ollama (Free Local AI)
app.use('/api/lumina-ai-local', require('./routes/lumina-ai-local'));
```

Then restart backend!

---

## 📚 RESOURCES

- **Claude Console**: https://console.anthropic.com/
- **API Documentation**: https://docs.anthropic.com/
- **Pricing**: https://www.anthropic.com/pricing
- **Models**: https://docs.anthropic.com/claude/docs/models-overview

---

## ✅ CURRENT STATUS

🟢 **Claude Integration**: Complete  
🟡 **API Key**: Not configured (you need to add it)  
🟢 **Backend Route**: Updated  
🟢 **Frontend**: Already compatible  

---

## 🎉 READY TO USE!

Once you add your API key, Alt-X will be powered by **Claude AI** - one of the best AI models in the world!

**What to do next:**
1. Get API key from https://console.anthropic.com/
2. Add it to environment variable or code
3. Restart backend
4. Test Alt-X!

---

**Need Help?** Check the console logs when you start the server - it will tell you if Claude is configured correctly!
