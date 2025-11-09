# 🚀 QUICK START: CLAUDE AI FOR ALT-X

## ⚡ 3-MINUTE SETUP

### 1️⃣ Get Your FREE API Key (2 minutes)

1. Go to: **https://console.anthropic.com/**
2. Click **Sign Up** (free!)
3. Verify your email
4. Go to **API Keys** → **Create Key**
5. Copy your key (starts with `sk-ant-`)

**You get $5 FREE credit = ~500 messages!**

---

### 2️⃣ Add API Key (30 seconds)

```bash
# Replace 'your-key-here' with your actual key
export CLAUDE_API_KEY='sk-ant-api03-your-key-here'
```

---

### 3️⃣ Restart Backend (30 seconds)

```bash
cd /Users/mrdevsharma/Downloads/EX/healthcare-prototype

# Kill old server
lsof -ti:3001 | xargs kill -9

# Start new server
cd server && node index.js
```

---

### 4️⃣ TEST IT! 🎉

1. Open: http://localhost:3000
2. Login as doctor: `doctor@hospital.com` / `doctor123`
3. Click **Alt-X** tab
4. Ask: "What is diabetes?"
5. Watch Claude AI respond in 1-2 seconds!

---

## ✅ VERIFICATION

After starting backend, you should see:

```
🚀 Server running on port 3001
📡 API available at http://localhost:3001/api
✅ MongoDB connected successfully
```

Then test:
```bash
curl http://localhost:3001/api/lumina-ai-local/status
```

Should return:
```json
{
  "success": true,
  "status": "online",
  "model": "claude-3-sonnet-20240229"
}
```

---

## 🆚 CLAUDE vs OLLAMA

| Feature | Claude | Ollama (Llama 2) |
|---------|--------|------------------|
| Quality | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| Speed | 1-2 sec | 5-10 sec |
| Cost | $0.01/msg | FREE |
| Setup | Easy | Medium |
| Internet | Required | Not required |

---

## 💡 TIPS

### Make API Key Permanent

Add to your `~/.zshrc` file:
```bash
echo 'export CLAUDE_API_KEY="your-key-here"' >> ~/.zshrc
source ~/.zshrc
```

Now it will work every time you open terminal!

### Monitor Usage

Check your usage at: https://console.anthropic.com/usage

---

## 🐛 TROUBLESHOOTING

### ❌ "API key not configured"
→ Did you run the `export CLAUDE_API_KEY=...` command?

### ❌ "Cannot connect to Claude API"
→ Check your internet connection

### ❌ "Invalid API key"
→ Make sure your key starts with `sk-ant-`

### ❌ Server won't start
→ Check if port 3001 is free: `lsof -ti:3001`

---

## 📚 FULL DOCUMENTATION

See: `🤖_CLAUDE_AI_SETUP.md` for complete guide

---

## 🎉 THAT'S IT!

**Your Alt-X is now powered by Claude AI!**

Ask it anything:
- Medical questions
- Drug dosages
- Treatment protocols
- General knowledge
- Patient cases
- Clinical guidelines

**Responses in 1-2 seconds! 🚀**
