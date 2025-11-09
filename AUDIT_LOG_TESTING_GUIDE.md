# 📋 Audit Log Testing Guide

## Quick Start

1. **Open Dashboard**: Go to `http://localhost:3000/doctor/dashboard`
2. **Click "Audit Log"** in the left sidebar
3. **You should see 25 sample entries** displayed in a formatted table

## Table Format

```
DATE       | TIME         | ACTION              | PATIENT           | DOCTOR              | DETAILS
-----------|--------------|---------------------|-------------------|---------------------|----------
11/4/2025  | 10:07:00 AM  | MEDICATION ADDED    | John Doe          | Dr. John Smith      | Added Amoxicillin 500mg | Medication: Amoxicillin...
11/4/2025  | 10:05:30 AM  | PRESCRIPTION SAVED  | Jane Smith        | Dr. Sarah Johnson   | Prescription with 2 medication(s)...
11/4/2025  | 10:03:15 AM  | PATIENT VITALS      | Robert Johnson    | Dr. Michael Chen    | Patient vitals recorded | BP: 122/82...
```

## Sample Data Overview

### Total Records: 25

**Distributed by Action Type:**
- MEDICATION_ADDED: 8 entries
- PRESCRIPTION_SAVED: 8 entries
- PATIENT_VITALS_RECORDED: 6 entries
- PATIENT_NOTE_ADDED: 3 entries

**Doctors (3):**
1. Dr. John Smith
2. Dr. Sarah Johnson
3. Dr. Michael Chen

**Patients (8):**
1. John Doe
2. Jane Smith
3. Robert Johnson
4. Michael Brown
5. James Wilson
6. Patricia Clark
7. Barbara Young
8. Susan Phillips (and more)

## What Each Action Records

### 🟢 MEDICATION_ADDED
Captures when a doctor adds a medication to a prescription:

```
Added Amoxicillin 500mg
├─ Medication: Amoxicillin 500mg
├─ Dosage: 500mg
├─ Frequency: 3 times daily
├─ Duration: 7 days
├─ Diagnosis: Bacterial Infection
└─ Symptoms: Fever and cough
```

### 🟣 PRESCRIPTION_SAVED
Captures when a complete prescription is saved:

```
Prescription with 2 medication(s) saved
├─ Diagnosis: Mixed Infection
├─ Symptoms: Fever and cough
├─ Medications: 
│  ├─ Amoxicillin 500mg (500mg)
│  └─ Azithromycin 250mg (250mg)
└─ [All details logged]
```

### 🟡 PATIENT_VITALS_RECORDED
Captures patient vital signs:

```
Patient vitals recorded
├─ BP: 122/82
├─ HR: 75
├─ Temp: 99.0°C
├─ Weight: 71kg
└─ Height: 178cm
```

### 🔴 PATIENT_NOTE_ADDED
Captures clinical notes:

```
Doctor note added
└─ Content: "Continue antibiotic therapy. Monitor for side effects..."
```

## CSV Export

### How to Export:
1. Click **"Export CSV"** button (top right)
2. File downloads as `audit_log_2025-11-04.csv`

### CSV Headers:
```
Date, Time, Action, Patient, Doctor, Details
```

### Sample Row:
```
11/4/2025,10:07:00 AM,MEDICATION ADDED,John Doe,Dr. John Smith,"Added Amoxicillin 500mg | Medication: Amoxicillin 500mg | Dosage: 500mg | Frequency: 3 times daily | Duration: 7 days | Diagnosis: Bacterial Infection | Symptoms: Fever and cough"
```

## Testing Actions

### Test 1: View All Audit Logs ✅
1. Navigate to Audit Log tab
2. Should see 25 entries
3. Entries should be sorted by newest first

**Expected Result**: Table with 25 rows, all with data visible

### Test 2: Check Action Badges ✅
1. Look at the "Action" column
2. Different colors for different actions:
   - 🟢 Green: MEDICATION_ADDED
   - 🟣 Purple: PRESCRIPTION_SAVED
   - 🟡 Yellow: PATIENT_VITALS_RECORDED
   - 🔴 Pink: PATIENT_NOTE_ADDED

**Expected Result**: Color-coded badges for easy identification

### Test 3: Export CSV ✅
1. Click "Export CSV" button
2. Check downloads folder
3. Open with Excel or text editor
4. Verify all 6 columns present: Date, Time, Action, Patient, Doctor, Details

**Expected Result**: 
- File named `audit_log_2025-11-04.csv`
- 26 rows (1 header + 25 data rows)
- All columns properly formatted

### Test 4: Hover Over Details ✅
1. Hover over text in Details column (if truncated)
2. Tooltip should show full details

**Expected Result**: Full audit trail visible on hover

### Test 5: Patient Name Verification ✅
1. Check Patient column
2. Should show actual patient names (not doctor names)
3. Each entry should have unique patient

**Expected Result**:
- Patient column contains: John Doe, Jane Smith, Robert Johnson, etc.
- NOT showing doctor names in patient column

## Data Validation Checklist

- [ ] All 25 audit logs displaying in table
- [ ] Date column shows valid dates (11/4/2025 or similar)
- [ ] Time column shows valid times (AM/PM format)
- [ ] Action column shows one of 4 action types
- [ ] Patient column shows real patient names
- [ ] Doctor column shows real doctor names
- [ ] Details column contains medication/vitals information
- [ ] CSV export creates proper file
- [ ] CSV has 6 columns: Date, Time, Action, Patient, Doctor, Details
- [ ] All 25 records appear in CSV
- [ ] Color badges display correctly

## Common Issues & Solutions

### Issue: "No audit logs available yet"
**Solution**: 
- Run: `node server/scripts/seed-audit-logs.js`
- Verify MongoDB is running: `lsof -i :27017`
- Refresh page: `Ctrl+R` or `Cmd+R`

### Issue: Table shows but no data rows
**Solution**:
- Open browser DevTools (F12)
- Check Console for errors
- Check Network tab for `/api/audit-logs` response
- Verify seed script ran successfully

### Issue: CSV export creates empty file
**Solution**:
- Check if auditLogs array is populated
- Verify click event is firing
- Check browser console for errors

### Issue: Details column shows "No details"
**Solution**:
- Some sample entries have minimal details by design
- Details should contain medication/vitals info
- Hover to see full text if truncated

## Performance Notes

- **Initial Load**: Should be < 1 second
- **CSV Export**: Should be instant (all data in memory)
- **No Pagination**: Currently showing last 100 logs (25 sample)
- **No Search/Filter**: Features can be added in next iteration

## Next Steps (Optional Enhancements)

1. Add search/filter by patient name
2. Add date range filtering
3. Add action type filtering
4. Implement pagination for 100+ records
5. Add sorting by any column
6. Add real-time refresh
7. Add per-user audit logs

## Support

If audit logs still not showing:
1. Check backend is running: `lsof -i :3001`
2. Check MongoDB: `lsof -i :27017`
3. Check frontend: `lsof -i :3000`
4. Restart servers: `npm run dev`
5. Re-seed data: `node server/scripts/seed-audit-logs.js`

---

**Last Updated**: November 4, 2025
**Status**: ✅ Ready for Testing
**Sample Records**: 25 loaded and verified
