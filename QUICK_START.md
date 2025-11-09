# Quick Start Guide - Healthcare Prototype

## 🚀 Get Started in 60 Seconds

### 1. Open Application
Visit: **http://localhost:3000**

### 2. Choose Your Role

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  👨‍⚕️  Doctor          💊 Pharmacist                     │
│  Login → Dashboard   Login → Dashboard                 │
│                                                         │
│  🔧 Admin           😊 Patient                          │
│  Login → Dashboard   OTP → Dashboard                   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 3. Use Demo Credentials

Every login page has a **"Use Demo Credentials"** button - just click it and sign in!

---

## 📋 Quick Reference

### Doctor Login
```
URL:      http://localhost:3000/login/doctor
Email:    doctor@demo.com
Password: doctor123
```
**Features:** Create prescriptions, manage patients, track antibiotics, view analytics

### Pharmacist Login
```
URL:      http://localhost:3000/login/pharmacist
Email:    pharmacist@demo.com
Password: pharma123
```
**Features:** Process orders, manage inventory, track stock levels

### Admin Login
```
URL:      http://localhost:3000/login/admin
Email:    admin@demo.com
Password: admin123
```
**Features:** Manage users, view system analytics, generate reports

### Patient Login
```
URL:      http://localhost:3000/login/patient
Phone:    Any 10-digit number
OTP:      Any 6-digit code
```
**Features:** View prescriptions, manage health records, order medications

---

## ⚡ Common Tasks

### How to Test Doctor Features
1. Login as doctor
2. Click "Patients" tab
3. View patient cards with medical info
4. Click patient to see full profile
5. Test prescription creation (if available)

### How to Test Pharmacist Features
1. Login as pharmacist
2. View order list in Overview
3. Click "Orders" tab to see all orders
4. Update order status (pending → preparing → dispatched → delivered)
5. Check "Inventory" tab for stock levels

### How to Test Admin Features
1. Login as admin
2. View system statistics in Overview
3. Click "Users" tab to see all system users
4. Check user statuses and roles
5. View analytics and reports

### How to Test Patient Features
1. Login as patient (use OTP)
2. View personal health information
3. Check active prescriptions
4. View medical history
5. Access medication cart

---

## 🔍 Troubleshooting

### "Can't see dashboard after login"
→ Check browser console (F12), look for errors  
→ Clear localStorage: `localStorage.clear()` in console  
→ Login again

### "Demo credentials not working"
→ Click "Use Demo Credentials" button on login page  
→ Don't type manually - let the button fill the form

### "Page is blank"
→ Make sure you're at http://localhost:3000  
→ Check if React app is running: `npm start`  
→ Refresh the page (Cmd/Ctrl + R)

### "Protected route error"
→ You're not logged in or session expired  
→ Go to login page for your role  
→ Login again

---

## 🛠️ Developer Tools

### Check If Logged In
Open browser console (F12) and run:
```javascript
console.log('Logged in:', !!localStorage.getItem('authToken'));
console.log('User:', localStorage.getItem('user'));
```

### Logout Programmatically
```javascript
localStorage.clear();
window.location.href = '/';
```

### Switch Users Quickly
```javascript
// Just logout and login as different role
// OR clear and refresh:
localStorage.clear();
location.reload();
```

---

## 📊 What Data Can I See?

### Doctor Dashboard
- **2 mock patients** (John Doe, Jane Smith)
- **3 medications** available for prescription
- **Performance stats** (mock data)
- **Audit log** (empty until you create prescriptions)

### Pharmacist Dashboard
- **4 orders** in different states
- **5 medications** in inventory
- **Stock alerts** for low inventory items
- **Sales statistics**

### Admin Dashboard
- **15 system users** (doctors, pharmacists, admins)
- **System-wide statistics**
- **Antibiotic resistance trends**
- **Compliance metrics**

### Patient Dashboard
- **Personal health info**
- **Medical history**
- **Active prescriptions**
- **Medication cart**

---

## ✅ Testing Checklist

Use this to verify everything works:

### Authentication ✓
- [ ] Doctor login works
- [ ] Pharmacist login works
- [ ] Admin login works
- [ ] Patient OTP login works
- [ ] Logout button works
- [ ] Can't access dashboard without login

### Navigation ✓
- [ ] Sidebar navigation works
- [ ] Tabs switch correctly
- [ ] Back button works
- [ ] Home link works

### Data Display ✓
- [ ] User name displays correctly
- [ ] Role-specific data shows
- [ ] Mock data loads
- [ ] No console errors

---

## 🎯 Next Steps After Testing

1. **Report Issues:** Note any errors in browser console
2. **Test All Features:** Try every button and link
3. **Check Responsiveness:** Resize browser window
4. **Test on Mobile:** Open on phone/tablet
5. **Document Feedback:** What works? What doesn't?

---

## 📞 Need Help?

1. **Check browser console** (F12) for error messages
2. **Review main documentation:**
   - `IMPLEMENTATION_SUMMARY.md` - Complete technical details
   - `LOGIN_TEST_RESULTS.md` - Test procedures and results
   - `README.md` - Project overview

3. **Common solutions:**
   - Refresh page
   - Clear localStorage
   - Check if app is running
   - Try different browser

---

## 🎉 You're All Set!

The application is running at **http://localhost:3000**

Pick a role, click "Use Demo Credentials", and start exploring!

**Happy Testing! 🚀**

---

*Last Updated: October 14, 2025*
