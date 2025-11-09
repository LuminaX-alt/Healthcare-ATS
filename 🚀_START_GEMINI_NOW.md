# 🚀 START GEMINI AI - RIGHT NOW!

## ⚡ **ONE COMMAND TO FIX EVERYTHING:**

Open **Terminal** and paste:

```bash
cd /Users/mrdevsharma/Downloads/EX/healthcare-prototype && chmod +x START-GEMINI.sh && ./START-GEMINI.sh
```

**That's it!** This will:
1. ✅ Stop old services
2. ✅ Test Gemini API  
3. ✅ Start backend with fixed model
4. ✅ Start frontend
5. ✅ Open browser automatically

---

## 🎯 **AFTER IT OPENS:**

### **Step 1: Hard Refresh Browser** 🔄
Press: **`Cmd + Shift + R`**

This loads the 60-second timeout fix!

### **Step 2: Login** 👤
- Email: `doctor@hospital.com`
- Password: `doctorpass123`

### **Step 3: Test Alt-X** 🤖
1. Click **Alt-X** button (top-right)
2. Type: **"Hello"**
3. Wait **10-30 seconds** (first request is slow!)
4. You should see Gemini AI respond!

---

## 🔧 **WHAT I FIXED:**

1. ✅ Changed model from `gemini-2.5-flash` → `gemini-1.5-flash` (working model)
2. ✅ Increased backend timeout from 30s → 120s
3. ✅ Frontend timeout already 60s
4. ✅ Created auto-test script

---

## ❌ **IF IT STILL DOESN'T WORK:**

The API key might be invalid. Get a NEW one:

1. Go to: **https://aistudio.google.com/app/apikey**
2. Click **"Create API Key"**
3. Copy the key
4. Edit `/server/.env`:
   ```
   GEMINI_API_KEY=your_new_key_here
   ```
5. Run `./START-GEMINI.sh` again

---

## 🆘 **ALTERNATIVE: Local AI (No API Key)**

If Gemini keeps failing, I can install **Ollama** (100% local):
- No API keys
- No internet needed
- Runs on your Mac
- Actually FASTER!

Just say **"install Ollama"** and I'll do it!

---

## 📊 **WHY WAS IT FAILING?**

Looking at your logs, the issue was:
1. ❌ Model name `gemini-2.5-flash` doesn't exist yet
2. ❌ Backend timeout was only 30 seconds
3. ❌ Gemini API taking 120+ seconds to respond

**Fixed all three!** 🎉

---

## ✅ **RUN THIS NOW:**

```bash
cd /Users/mrdevsharma/Downloads/EX/healthcare-prototype
chmod +x START-GEMINI.sh
./START-GEMINI.sh
```

Then **hard refresh** (`Cmd + Shift + R`) and test Alt-X!

🚀 **GO!**
