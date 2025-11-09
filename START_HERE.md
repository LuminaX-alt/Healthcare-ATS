# 🚀 QUICK START - GET YOUR APP RUNNING NOW!

## Option 1: Automatic Start (Easiest)

Open Terminal and run:

```bash
cd /Users/mrdevsharma/Downloads/EX/healthcare-prototype
chmod +x START_APP.sh
./START_APP.sh
```

**That's it!** The app will open automatically at http://localhost:3000

---

## Option 2: Manual Start (If Option 1 doesn't work)

### Step 1: Start MongoDB
```bash
brew services start mongodb-community
# OR
mongod --dbpath /usr/local/var/mongodb
```

### Step 2: Start Backend (Terminal 1)
```bash
cd /Users/mrdevsharma/Downloads/EX/healthcare-prototype/server
npm start
```
**Backend runs on:** http://localhost:3001

### Step 3: Start Frontend (Terminal 2)
```bash
cd /Users/mrdevsharma/Downloads/EX/healthcare-prototype
npm start
```
**Frontend runs on:** http://localhost:3000

---

## 🌐 ACCESS THE APPLICATION

Once started, open your browser and go to:
### **http://localhost:3000**

---

## 🔐 LOGIN CREDENTIALS

### Admin (Manage Doctor Status)
- **Email:** admin@hospital.com
- **Password:** admin123
- **Access:** Doctor Status Management Tab

### Patient (View Available Doctors)
- **Phone:** +1234567890
- **OTP:** 123456
- **Access:** Available Doctors Tab

### Doctor
- **Email:** doctor@hospital.com
- **Password:** doctor123

---

## ✅ TEST THE NEW FEATURES

1. **Login as Admin** → Go to "Doctor Status" tab → Set doctors Online
2. **Login as Patient** → Go to "Available Doctors" tab → See online doctors
3. **Real-time updates:** Changes made by Admin reflect for Patients (refresh every 30s)

---

## 🛑 STOP THE APPLICATION

Press `Ctrl + C` in both terminal windows

---

## ⚠️ TROUBLESHOOTING

### MongoDB not running?
```bash
brew services start mongodb-community
```

### Port already in use?
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Kill process on port 3001
lsof -ti:3001 | xargs kill -9
```

### Dependencies missing?
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server && npm install
```

---

## 📝 WHAT'S WORKING

✅ **Frontend:** React app with all dashboards (Admin, Doctor, Patient, Pharmacist)
✅ **Backend:** Express API with MongoDB
✅ **Authentication:** Login/Logout for all roles
✅ **Doctor Availability:** Admin can manage, Patient can view
✅ **Prescription System:** Doctor can create, Patient can view
✅ **PDF Generation:** Download prescriptions
✅ **Payment Gateway:** Stripe integration for medication orders

**Everything is working as before!** Nothing has been removed or broken.
