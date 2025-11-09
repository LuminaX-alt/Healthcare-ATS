# 🚨 CLAUDE NOT WORKING? READ THIS!

## The Problem:

Alt-X is still showing the OLD welcome message because the backend server is still using **Ollama (Llama 2)** instead of **Claude AI**.

---

## ✅ QUICK FIX (3 Steps):

### Step 1: Get Your Claude API Key (2 minutes)

1. Go to: **https://console.anthropic.com/**
2. Click **Sign Up** (it's FREE!)
3. Verify your email
4. Go to **Settings** → **API Keys**
5. Click **Create Key**
6. Copy your key (looks like: `sk-ant-api03-...`)

**You get $5 FREE credit = ~500 messages!**

---

### Step 2: Add API Key to .env File (30 seconds)

Open this file:
```
/Users/mrdevsharma/Downloads/EX/healthcare-prototype/server/.env
```

Find this line:
```
CLAUDE_API_KEY=YOUR_API_KEY_HERE
```

Replace with your actual key:
```
CLAUDE_API_KEY=sk-ant-api03-your-actual-key-here
```

Save the file!

---

### Step 3: Restart Backend (30 seconds)

```bash
# Go to project folder
cd /Users/mrdevsharma/Downloads/EX/healthcare-prototype

# Kill old server
lsof -ti:3001 | xargs kill -9

# Start new server with Claude
cd server && node index.js
```

---

## ✅ Verification:

After starting the server, test if Claude is active:

```bash
curl http://localhost:3001/api/lumina-ai-local/status
```

**If Claude is working**, you'll see:
```json
{
  "success": true,
  "status": "online",
  "model": "claude-3-sonnet-20240229",
  "provider": "Anthropic Claude"
}
```

**If Claude is NOT configured**, you'll see:
```json
{
  "success": false,
  "status": "not-configured",
  "message": "Claude API key not set"
}
```

---

## 🧪 Test Alt-X:

1. Open: http://localhost:3000
2. Login as doctor: `doctor@hospital.com` / `doctor123`
3. Click **Alt-X** tab
4. Ask: "What is diabetes?"
5. Should get response in **1-2 seconds** from Claude!

---

## 🐛 Still Not Working?

### Error: "API key not configured"
→ Check if you saved the .env file
→ Make sure there are no spaces around the = sign
→ Restart the server

### Error: "Invalid API key"
→ Go back to console.anthropic.com
→ Make sure you copied the FULL key
→ Keys start with `sk-ant-`

### Error: "Cannot connect to Claude API"
→ Check your internet connection
→ Make sure you're not behind a firewall

---

## 🔄 Want to Switch Back to Ollama?

If you don't want to use Claude (paid) and prefer Ollama (free):

Edit `/Users/mrdevsharma/Downloads/EX/healthcare-prototype/server/index.js` line 31:

**Current (Claude):**
```javascript
app.use('/api/lumina-ai-local', require('./routes/lumina-ai-claude'));
```

**Change to (Ollama):**
```javascript
app.use('/api/lumina-ai-local', require('./routes/lumina-ai-local'));
```

Then restart server!

---

## 📚 Need More Help?

- **Setup Guide**: `🤖_CLAUDE_AI_SETUP.md`
- **Quick Start**: `👉_START_HERE_CLAUDE.md`
- **Technical Details**: `✅_CLAUDE_AI_COMPLETE.md`

---

**TL;DR**: Get API key from console.anthropic.com, add it to server/.env file, restart backend!
