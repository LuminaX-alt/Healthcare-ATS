# 🚀 COPY-PASTE COMMANDS FOR CLIENT DEMO

## ⚡ OPTION 1: ONE-COMMAND SETUP (RECOMMENDED!)

```bash
cd /Users/mrdevsharma/Downloads/EX/healthcare-prototype && ./start-client-demo.sh
```

This single command will:
- ✅ Start MongoDB
- ✅ Start Backend (port 3001)
- ✅ Start Frontend (port 3000)
- ✅ Install ngrok (if needed)
- ✅ Show you all demo options

---

## 🌐 OPTION 2: CREATE PUBLIC URL (NGROK)

After running the setup script above, run:

```bash
ngrok http 3000
```

**Copy the `https://` URL and share with your client!**

Example output:
```
Forwarding  https://abc123.ngrok.io → http://localhost:3000
```

Share: `https://abc123.ngrok.io` with your client ✅

---

## 🎥 OPTION 3: MANUAL SETUP (If script fails)

### Terminal 1: Start MongoDB
```bash
docker run -d --name healthcare-mongo -p 27017:27017 mongo:6
```

### Terminal 2: Start Backend
```bash
cd /Users/mrdevsharma/Downloads/EX/healthcare-prototype/server
npm run dev
```

### Terminal 3: Start Frontend
```bash
cd /Users/mrdevsharma/Downloads/EX/healthcare-prototype
PORT=3000 npm start
```

### Terminal 4: Create Public URL (Optional)
```bash
brew install ngrok
ngrok http 3000
```

---

## 📋 DEMO CREDENTIALS (Share with client)

```
Frontend URL: http://localhost:3000 (or your ngrok URL)

Login Credentials:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
👤 PATIENT PORTAL
   Email:    patient@hospital.com
   Password: patient123

👨‍⚕️ DOCTOR PORTAL
   Email:    doctor@hospital.com
   Password: doctor123

👨‍💼 ADMIN PORTAL
   Email:    admin@hospital.com
   Password: admin123

💊 PHARMACIST PORTAL
   Email:    pharmacist@hospital.com
   Password: pharmacist123
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## 🎬 DEMO SCRIPT (Share with client or use yourself)

### 1. Landing Page (30 seconds)
- Show main page with video
- Explain multi-portal system
- Point out key features

### 2. Patient Portal (2 minutes)
- Login as patient
- View medical records
- Check prescriptions
- See medication tracking
- Try chat feature
- Show video call option

### 3. Doctor Portal (3 minutes)
- Login as doctor
- View patient list
- Check available doctors
- Create new prescription
- View antibiotic tracking analytics
- Check alerts and reminders
- Show AI chatbot (Google Gemini)

### 4. Admin Portal (1 minute)
- Login as admin
- View system-wide analytics
- Show resistance trends
- Check reports dashboard

### 5. Pharmacist Portal (1 minute)
- Login as pharmacist
- View pending prescriptions
- Show dispensing workflow
- Check inventory

---

## 🔍 TROUBLESHOOTING

### If MongoDB won't start:
```bash
docker stop healthcare-mongo
docker rm healthcare-mongo
docker run -d --name healthcare-mongo -p 27017:27017 mongo:6
```

### If Backend won't start:
```bash
lsof -ti:3001 | xargs kill -9
cd server
npm install
npm run dev
```

### If Frontend won't start:
```bash
lsof -ti:3000 | xargs kill -9
npm install
PORT=3000 npm start
```

### View logs:
```bash
# Backend logs
tail -f /tmp/backend-demo.log

# Frontend logs
tail -f /tmp/frontend-demo.log
```

---

## 🚀 DEPLOY TO VERCEL (30 MIN - For permanent URL)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy frontend
cd /Users/mrdevsharma/Downloads/EX/healthcare-prototype
vercel --prod

# You'll get a permanent URL like:
# https://luminax-alt.vercel.app
```

Then deploy backend to Railway:
```bash
# Install Railway CLI
npm i -g @railway/cli

# Deploy backend
cd server
railway login
railway init
railway up

# Get backend URL and update frontend API endpoint
```

---

## 📊 WHAT TO SHOW CLIENT

### Key Features to Highlight:
✅ Real-time antibiotic tracking
✅ Multi-user platform (4 portals)
✅ Medication adherence monitoring
✅ Side effects reporting
✅ Drug interaction alerts
✅ Telemedicine (chat/video calls)
✅ Analytics & resistance surveillance
✅ AI-powered insights (Google Gemini)
✅ WHO guideline integration
✅ Real-time notifications

### Unique Selling Points:
🎯 All-in-one antibiotic safety platform
🎯 Reduces antibiotic resistance
🎯 Improves patient outcomes
🎯 Real-time collaboration
🎯 Compliance with healthcare standards
🎯 Free AI integration (Google Gemini)
🎯 Scalable for hospitals/clinics

---

## ⚡ FASTEST START (Copy-paste this entire block):

```bash
cd /Users/mrdevsharma/Downloads/EX/healthcare-prototype && \
docker run -d --name healthcare-mongo -p 27017:27017 mongo:6 && \
cd server && npm run dev > /tmp/backend.log 2>&1 & \
cd .. && PORT=3000 npm start > /tmp/frontend.log 2>&1 & \
sleep 30 && \
echo "✅ System starting... Opening browser in 30 seconds..." && \
sleep 30 && \
open http://localhost:3000
```

---

## 📞 NEED HELP?

If anything doesn't work:
1. Check logs: `tail -f /tmp/backend-demo.log` or `tail -f /tmp/frontend-demo.log`
2. Restart everything:
   ```bash
   docker restart healthcare-mongo
   lsof -ti:3000,3001 | xargs kill -9
   ```
3. Run the setup script again:
   ```bash
   ./start-client-demo.sh
   ```

---

## 🎉 READY TO DEMO!

**Run this ONE command:**
```bash
cd /Users/mrdevsharma/Downloads/EX/healthcare-prototype && ./start-client-demo.sh
```

Then choose your demo method:
- 🖥️  Screen share (Zoom/Meet)
- 🌐 Public URL (ngrok)
- 📹 Record video (Loom/QuickTime)

**Good luck with your client demo!** 🚀
