# 🧪 Test Guide: Audit Log Route Column

## Quick 5-Minute Test

### Prerequisites
✅ Backend server running on port 3001  
✅ Frontend running on port 3000  
✅ Logged in as: `doctor@hospital.com` / `password123`

---

## Test Steps

### 1️⃣ **Verify Column Exists** (30 seconds)
1. Click **"Audit Log"** tab in Doctor Dashboard
2. Look at the table header
3. **✅ Verify**: You see column headers in this order:
   ```
   Date | Time | Action | [ROUTE] | Patient | Doctor | Details
                          ^^^^^^^
                          NEW!
   ```

---

### 2️⃣ **Test Oral Route** (1 minute)
1. Go to **"Patients"** tab
2. Click any patient card
3. Click **"New Prescription"** button
4. Fill in:
   - Diagnosis: `"Common Cold"`
   - Symptoms: `"Cough, congestion"`
   - **Route: Select "Oral"** 🔵
   - Frequency: `"Twice daily"`
   - Duration: `"5 days"`
5. Search and add: **"Amoxicillin"**
6. Click **"Save Prescription"**
7. Go to **"Audit Log"** tab
8. **✅ Verify**: Latest entries show **blue "Oral" badge** in Route column

---

### 3️⃣ **Test IV Route** (1 minute)
1. Go to **"Patients"** tab
2. Select a different patient
3. Click **"New Prescription"**
4. Fill in:
   - Diagnosis: `"Severe Infection"`
   - Symptoms: `"High fever"`
   - **Route: Select "IV"** 🔴
   - Frequency: `"Every 6 hours"`
   - Duration: `"7 days"`
5. Add: **"Ceftriaxone"**
6. Click **"Save Prescription"**
7. Go to **"Audit Log"** tab
8. **✅ Verify**: Latest entries show **red "IV" badge** in Route column

---

### 4️⃣ **Test IM Route** (1 minute)
1. Select another patient
2. New Prescription
3. Fill in:
   - Diagnosis: `"Vaccination"`
   - **Route: Select "IM"** 🟠
   - Frequency: `"Single dose"`
   - Duration: `"1 day"`
4. Add a medication
5. Save
6. **✅ Verify**: Audit log shows **orange "IM" badge**

---

### 5️⃣ **Test Topical Route** (1 minute)
1. Select a patient
2. New Prescription
3. Fill in:
   - Diagnosis: `"Skin Rash"`
   - **Route: Select "Topical"** 🟢
   - Frequency: `"Apply twice daily"`
   - Duration: `"10 days"`
4. Add medication
5. Save
6. **✅ Verify**: Audit log shows **green "Topical" badge**

---

### 6️⃣ **Test N/A for Non-Medication Actions** (30 seconds)
1. Select a patient
2. Click **"Record Vitals"** button
3. Enter any vitals data
4. Save
5. Go to **"Audit Log"** tab
6. **✅ Verify**: Vitals entry shows **gray "N/A" badge**

---

## Expected Results

### Complete Audit Log Table Should Look Like:
```
┌────────────┬──────────┬────────────────────┬──────────┬─────────────┬─────────────┬──────────────┐
│ Date       │ Time     │ Action             │ Route    │ Patient     │ Doctor      │ Details      │
├────────────┼──────────┼────────────────────┼──────────┼─────────────┼─────────────┼──────────────┤
│ 11/07/2025 │ 11:45 AM │ PATIENT_VITALS_... │ [N/A]    │ Patient D   │ Dr. Johnson │ Vitals rec...│
│ 11/07/2025 │ 11:40 AM │ MEDICATION_ADDED   │ [Topical]│ Patient C   │ Dr. Johnson │ Added medi...│
│ 11/07/2025 │ 11:35 AM │ MEDICATION_ADDED   │ [IM]     │ Patient B   │ Dr. Johnson │ Added vacc...│
│ 11/07/2025 │ 11:30 AM │ MEDICATION_ADDED   │ [IV]     │ Patient A   │ Dr. Johnson │ Added Ceft...│
│ 11/07/2025 │ 11:25 AM │ MEDICATION_ADDED   │ [Oral]   │ Patient Z   │ Dr. Johnson │ Added Amox...│
└────────────┴──────────┴────────────────────┴──────────┴─────────────┴─────────────┴──────────────┘
```

### Color Verification:
- ✅ **Oral** = Blue badge (bg-blue-100)
- ✅ **IV** = Red badge (bg-red-100)
- ✅ **IM** = Orange badge (bg-orange-100)
- ✅ **Topical** = Green badge (bg-green-100)
- ✅ **N/A** = Gray badge (bg-gray-100)

---

## Troubleshooting

### ❌ Problem: Route column not showing
**Solution**: 
1. Refresh page (Ctrl+R / Cmd+R)
2. Clear browser cache
3. Restart frontend server

### ❌ Problem: Route shows "undefined"
**Solution**:
1. Check that prescription form has route selected
2. Verify `prescriptionForm.route` is being passed to `logAuditEvent()`
3. Check browser console for errors

### ❌ Problem: All routes show "N/A"
**Solution**:
1. Ensure you're selecting route in prescription form
2. Verify route is being saved in `additionalData`
3. Check backend API is receiving route data

### ❌ Problem: Colors not showing
**Solution**:
1. Check Tailwind CSS is loaded
2. Verify className includes correct color classes
3. Inspect element in browser DevTools

---

## Advanced Tests

### Test 7: Multiple Medications, Same Route
1. Create prescription with 3 medications
2. Use same route (e.g., "Oral") for all
3. Save
4. **✅ Verify**: All 3 audit entries show same route badge

### Test 8: Export CSV with Route
1. Go to Audit Log tab
2. Click "Export CSV" button
3. Open CSV file
4. **✅ Verify**: Route column is included in export

### Test 9: Database Verification
1. Open MongoDB Compass or shell
2. Query `auditlogs` collection
3. **✅ Verify**: Route field exists in documents
4. **✅ Verify**: Route values match what you selected

---

## Performance Test

### Load Test: 100+ Audit Entries
1. Create 20+ prescriptions with various routes
2. Go to Audit Log tab
3. **✅ Verify**: Table loads smoothly
4. **✅ Verify**: Scroll is responsive
5. **✅ Verify**: Color coding remains consistent

---

## Browser Compatibility

Test in multiple browsers:
- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari
- [ ] Mobile browsers

**Expected**: Route column displays correctly in all browsers

---

## Checklist: Feature Complete

- [ ] Route column visible in table header
- [ ] Route column positioned between Action and Patient
- [ ] Oral route shows blue badge
- [ ] IV route shows red badge
- [ ] IM route shows orange badge
- [ ] Topical route shows green badge
- [ ] Subcutaneous route shows purple badge (if tested)
- [ ] Inhalation route shows teal badge (if tested)
- [ ] Non-medication actions show N/A in gray
- [ ] Badge text is readable
- [ ] Colors are distinct and clear
- [ ] Hover effects work properly
- [ ] Table is responsive
- [ ] Export includes route data
- [ ] No console errors
- [ ] No TypeScript errors
- [ ] Backend saves route data
- [ ] MongoDB stores route field

---

## Test Report Template

```
AUDIT LOG ROUTE COLUMN - TEST REPORT
Date: _______________
Tester: _____________
Browser: ____________

Test Results:
✅/❌ Route column visible
✅/❌ Oral (blue) works
✅/❌ IV (red) works
✅/❌ IM (orange) works
✅/❌ Topical (green) works
✅/❌ N/A (gray) works
✅/❌ Colors distinct
✅/❌ No errors

Issues Found:
_____________________
_____________________

Overall Status: PASS / FAIL

Notes:
_____________________
_____________________
```

---

## Success Criteria

### ✅ Feature is COMPLETE when:
1. Route column appears in Audit Log table
2. All 6 route types display with correct colors
3. Non-medication actions show "N/A"
4. No console or TypeScript errors
5. Data persists in MongoDB
6. Export includes route data
7. Table remains responsive with route column

---

## Quick Command Reference

### Start Servers
```bash
# Backend
cd server && npm start

# Frontend
npm start
```

### Check MongoDB
```bash
# Connect to MongoDB
mongosh

# Switch to database
use healthcare_db

# Query audit logs
db.auditlogs.find().sort({eventTime: -1}).limit(10)
```

### Clear Cache
```bash
# Chrome: Ctrl+Shift+Del (Windows/Linux) or Cmd+Shift+Del (Mac)
# Firefox: Ctrl+Shift+Del (Windows/Linux) or Cmd+Shift+Del (Mac)
```

---

## Test Duration
- **Quick Test (Steps 1-6)**: ~5 minutes
- **Complete Test (All features)**: ~15 minutes
- **Performance Test**: +5 minutes
- **Total**: ~20 minutes for comprehensive testing

---

**Happy Testing! 🎉**

If all tests pass, the Route Column feature is **production-ready**!

---

**Test Guide Version**: 1.0  
**Created**: November 7, 2025  
**Last Updated**: November 7, 2025
