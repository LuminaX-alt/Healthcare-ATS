# 🚀 QUICK TEST - Doctor Availability Feature

## ⚡ 5-MINUTE TEST

Your app is running! Test the new doctor availability feature now.

---

## 🔐 STEP 1: ADMIN - SET DOCTOR STATUS (2 minutes)

### Login as Admin:
```
URL: http://localhost:3000/login/admin
Email: admin@hospital.com
Password: admin123
```

### Set Doctor Online:
1. Click **"Doctor Status"** in left sidebar
2. You'll see a page with statistics:
   ```
   [Total Doctors: X] [Online: X] [Busy: X] [Offline: X]
   ```
3. Find any doctor card (e.g., Dr. Smith)
4. Click the **"Online"** button (green)
5. ✅ **Expected**: 
   - Button turns green
   - Doctor card gets green badge
   - "Online" count increases

### Optional: Edit Doctor Info:
1. Click the **pencil icon** (edit) on any doctor
2. Enter:
   - Experience: `15 years`
   - Consultation Fee: `200`
   - Rating: `4.8`
3. Click **checkmark icon** (save)
4. ✅ **Expected**: Profile updates shown on card

---

## 👤 STEP 2: PATIENT - SEE AVAILABLE DOCTORS (2 minutes)

### Login as Patient:
```
URL: http://localhost:3000/patient/otp-login
Phone: +1234567890
OTP: 123456
```

### View Available Doctors:
1. Click **"Available Doctors"** in left sidebar
2. ✅ **Expected**: See banner showing "Currently Available: X Doctors"
3. ✅ **Expected**: See doctor cards with:
   - Green "Available Now" badge
   - Doctor name and specialty
   - Experience, fee, rating
   - **"Contact Now"** button

### Test Contact:
1. Find a doctor with green "Available" badge
2. Click **"Contact Now"** button
3. ✅ **Expected**: Modal opens with options:
   - Start Chat Consultation
   - Video Call Consultation
   - Voice Call Consultation
   - Shows consultation fee

---

## 🔄 STEP 3: TEST REAL-TIME UPDATES (1 minute)

### Setup:
- Keep **two browser tabs** open:
  - Tab 1: Admin dashboard (Doctor Status)
  - Tab 2: Patient dashboard (Available Doctors)

### Test:
1. **In Admin tab**: Set Dr. Smith to **"Busy"** (yellow button)
2. **In Patient tab**: Click **"Refresh"** button
3. ✅ **Expected**: 
   - Dr. Smith badge changes to yellow "Busy"
   - "Contact Now" button becomes "Currently Busy"

4. **In Admin tab**: Set Dr. Smith to **"Offline"** (gray button)
5. **In Patient tab**: Click **"Refresh"** button
6. ✅ **Expected**: 
   - Dr. Smith **disappears** from patient view
   - (Offline doctors are hidden from patients)

---

## ✅ SUCCESS INDICATORS

You'll know it's working when:

### Admin Side:
- ✅ See "Doctor Status" tab in sidebar
- ✅ See statistics cards (Total/Online/Busy/Offline)
- ✅ Can click Online/Busy/Offline buttons
- ✅ Doctor card changes color based on status
- ✅ Can edit doctor profile with pencil icon
- ✅ Search and filters work

### Patient Side:
- ✅ See "Available Doctors" tab in sidebar
- ✅ See statistics banner showing count
- ✅ See only Online and Busy doctors (no Offline)
- ✅ Green badge = Available
- ✅ Yellow badge = Busy
- ✅ Can click "Contact Now" on green-badged doctors
- ✅ Modal opens with contact options
- ✅ Search and filters work

---

## 🎯 WHAT EACH BUTTON DOES

### Admin Buttons:
| Button | Action | Patient Sees |
|--------|--------|--------------|
| 🟢 Online | Doctor available | Green "Available Now" badge |
| 🟡 Busy | Doctor busy | Yellow "Busy" badge |
| ⚪ Offline | Doctor not working | Doctor hidden from list |

### Patient Buttons:
| Button | Status | Action |
|--------|--------|--------|
| Contact Now | Online | Opens contact modal |
| Currently Busy | Busy | Disabled (can't contact) |
| Video Call | Online | Opens video call |
| Voice Call | Online | Opens voice call |

---

## 🐛 TROUBLESHOOTING

### Doctor Status tab not showing?
- Make sure you're logged in as **Admin**
- Check left sidebar for "Doctor Status" menu item
- If not visible, refresh the page

### Available Doctors tab not showing?
- Make sure you're logged in as **Patient**
- Check left sidebar for "Available Doctors" menu item
- If not visible, refresh the page

### No doctors showing on patient side?
- Admin needs to set at least one doctor to "Online" or "Busy"
- Offline doctors are intentionally hidden from patients
- Try clicking "All Active" filter button

### Status not updating?
- Click the "Refresh" button manually
- Auto-refresh happens every 30 seconds
- Make sure both windows are on the correct tabs

---

## 📱 VISUAL GUIDE

### Admin View:
```
┌─────────────────────────────────┐
│ Doctor Status Management        │
├─────────────────────────────────┤
│ [45 Total][12 Online][3 Busy]  │
│                                 │
│ ┌─────────────┐                │
│ │ Dr. Smith   │  🟢 Available  │
│ │ Cardiology  │                │
│ │ $150 • ⭐4.8│                │
│ │ [Online][Busy][Offline]     │
│ └─────────────┘                │
└─────────────────────────────────┘
```

### Patient View:
```
┌─────────────────────────────────┐
│ Available Doctors               │
├─────────────────────────────────┤
│ Currently Available: 12 Doctors │
│                                 │
│ ┌─────────────┐                │
│ │ 👨‍⚕️ Dr. Smith │  🟢 Available│
│ │ Cardiology  │                │
│ │ 15 years • $150 • ⭐4.8     │
│ │ [Contact Now]               │
│ │ [Video] [Voice]             │
│ └─────────────┘                │
└─────────────────────────────────┘
```

---

## 💡 TIP: Test Scenarios

### Scenario 1: Find a Specialist
1. Patient needs a cardiologist
2. Opens "Available Doctors"
3. Selects "Cardiology" from specialty dropdown
4. Sees only cardiologists who are online
5. Contacts the one with highest rating

### Scenario 2: Doctor Break Time
1. Admin sets Dr. Johnson to "Busy"
2. Patients see yellow "Busy" badge
3. Cannot contact during break
4. After 30 min, Admin sets back to "Online"
5. Patients can contact again

### Scenario 3: End of Shift
1. Admin sets all evening doctors to "Offline"
2. They disappear from patient view
3. Sets night shift doctors to "Online"
4. Only night shift visible to patients

---

## 🎉 YOU'RE DONE!

If all the above works, your doctor availability system is **fully operational**!

**Admin**: Can control which doctors are visible  
**Patients**: Can only see and contact available doctors  
**Real-time**: Changes sync between admin and patient views  

---

## 📖 FULL DOCUMENTATION

For complete details, see: `DOCTOR_AVAILABILITY_SYSTEM.md`

---

**Test completed?** ✅  
**Everything working?** 🎉  
**Ready for users!** 🚀
