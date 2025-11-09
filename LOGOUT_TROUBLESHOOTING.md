# Logout Troubleshooting Guide

## Issue: Unable to Logout

### What Was Fixed:
1. ✅ Added error handling to logout function
2. ✅ Added console logging for debugging
3. ✅ Added force redirect to home page
4. ✅ Added timeout to ensure state updates complete
5. ✅ Added try-catch blocks for localStorage and API operations

### How to Test the Fix:

#### Method 1: Test Logout Button
1. **Login** to any dashboard (doctor/pharmacist/admin)
2. **Click** the "Logout" button in the sidebar
3. **Expected Result:** 
   - Console shows "=== LOGOUT INITIATED ===" 
   - Console shows "=== LOGOUT COMPLETE - Redirecting to home ==="
   - Page redirects to home page (http://localhost:3000)
   - You cannot access the dashboard without logging in again

#### Method 2: Manual Logout via Console
Open browser DevTools (F12) and run:
```javascript
// Check current auth state
console.log('Auth Token:', localStorage.getItem('authToken'));
console.log('User:', localStorage.getItem('user'));

// Manual logout
localStorage.clear();
window.location.href = '/';
```

#### Method 3: Check Console for Errors
1. **Open DevTools:** Press F12 or Cmd+Option+I (Mac)
2. **Go to Console tab**
3. **Click Logout button**
4. **Look for:**
   - "=== LOGOUT INITIATED ===" message
   - "=== LOGOUT COMPLETE - Redirecting to home ===" message
   - Any error messages in red

### Common Issues and Solutions:

#### Issue 1: Button Not Responding
**Symptoms:** Click logout button but nothing happens
**Solution:**
1. Check browser console for JavaScript errors
2. Try Method 2 (manual logout) above
3. Hard refresh page (Cmd+Shift+R on Mac, Ctrl+Shift+R on Windows)

#### Issue 2: Stays on Dashboard After Logout
**Symptoms:** Logout executes but stays on dashboard
**Fix Applied:** 
- Added `window.location.href = '/'` with timeout
- This forces a full page redirect

**If still not working:**
```javascript
// In console:
window.location.replace('/');
```

#### Issue 3: Can Still Access Dashboard After Logout
**Symptoms:** Logged out but can navigate back to dashboard
**Check:**
```javascript
// In console, check if data was cleared:
console.log('Token:', localStorage.getItem('authToken'));
console.log('User:', localStorage.getItem('user'));
// Should both return null
```

**Manual Fix:**
```javascript
localStorage.removeItem('authToken');
localStorage.removeItem('user');
localStorage.removeItem('userProfile');
location.reload();
```

#### Issue 4: Error in Console When Clicking Logout
**Symptoms:** Red error messages in console
**Solution:** 
- Copy the error message
- The updated logout function now has try-catch blocks to handle errors
- Even if there's an error, it will still redirect to home

### Test All Dashboards:

#### Doctor Dashboard
```bash
1. Go to http://localhost:3000/login/doctor
2. Login with: doctor@demo.com / doctor123
3. Click "Logout" button in sidebar
4. Verify: Redirected to home page
```

#### Pharmacist Dashboard
```bash
1. Go to http://localhost:3000/login/pharmacist
2. Login with: pharmacist@demo.com / pharma123
3. Click "Logout" button in sidebar
4. Verify: Redirected to home page
```

#### Admin Dashboard
```bash
1. Go to http://localhost:3000/login/admin
2. Login with: admin@demo.com / admin123
3. Click "Logout" button in sidebar
4. Verify: Redirected to home page
```

### Debug Commands:

#### Check if Logout Function Exists
```javascript
// In browser console on dashboard:
console.log(window.localStorage);
```

#### Force Logout and Clear Everything
```javascript
// Nuclear option - clears everything:
localStorage.clear();
sessionStorage.clear();
window.location.replace('/');
```

#### Check React State
```javascript
// In console, check React DevTools
// 1. Install React DevTools extension
// 2. Open Components tab
// 3. Find AuthProvider
// 4. Check state: user, isAuthenticated
```

### Updated Code Changes:

The logout function in `/src/contexts/AuthContext.tsx` now includes:

1. **Error Handling:**
```typescript
try {
  // Clear state
  // Clear storage
  // Redirect
} catch (error) {
  // Still redirect even on error
  window.location.href = '/';
}
```

2. **Console Logging:**
```typescript
console.log('=== LOGOUT INITIATED ===');
console.log('=== LOGOUT COMPLETE - Redirecting to home ===');
```

3. **Forced Redirect:**
```typescript
setTimeout(() => {
  window.location.href = '/';
}, 100);
```

### Verification Checklist:

After clicking Logout, verify:
- [ ] Console shows logout messages
- [ ] No error messages in console
- [ ] Page redirects to home (/)
- [ ] localStorage is cleared (check in DevTools → Application → Local Storage)
- [ ] Cannot access dashboard without logging in again
- [ ] Can login again successfully

### If Problem Persists:

1. **Hard Refresh:** Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
2. **Clear Browser Cache:**
   - Chrome: Settings → Privacy → Clear browsing data
   - Firefox: Settings → Privacy → Clear Data
3. **Try Incognito/Private Window**
4. **Check for Service Workers:**
   - DevTools → Application → Service Workers
   - Click "Unregister" if any exist
5. **Restart Browser**

### Expected Console Output:

When clicking logout, you should see:
```
=== LOGOUT INITIATED ===
=== LOGOUT COMPLETE - Redirecting to home ===
```

If you see errors, they will be caught and logged, but logout will still proceed.

---

## Quick Fix Commands:

**If logout button not working at all:**
```javascript
// Paste in console and press Enter:
localStorage.clear(); window.location.href = '/';
```

**To check what's in localStorage:**
```javascript
console.table({
  token: localStorage.getItem('authToken'),
  user: localStorage.getItem('user'),
  profile: localStorage.getItem('userProfile')
});
```

**To test logout function directly:**
```javascript
// This calls the logout function from React context:
// (Only works if you're on a dashboard page)
window.dispatchEvent(new Event('logout'));
```

---

## Success Criteria:

✅ Logout button visible in sidebar  
✅ Clicking logout shows console messages  
✅ Page redirects to home within 1 second  
✅ localStorage is empty after logout  
✅ Cannot access dashboard without re-login  

---

**Status:** ✅ FIXED - Logout now includes error handling and forced redirect  
**Last Updated:** October 14, 2025
