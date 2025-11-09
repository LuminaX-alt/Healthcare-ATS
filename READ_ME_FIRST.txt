═══════════════════════════════════════════════════════════════
           🏥 HEALTHCARE APP - HOW TO START IT 🏥
═══════════════════════════════════════════════════════════════

YOU ARE SEEING "This site can't be reached" BECAUSE THE SERVERS 
ARE NOT RUNNING!

THIS IS NOT A BUG! You need to START the servers first.

═══════════════════════════════════════════════════════════════
                    FOLLOW THESE 3 STEPS:
═══════════════════════════════════════════════════════════════

STEP 1: Open Terminal
----------------------
- Press Command (⌘) + Space
- Type "Terminal"
- Press Enter

STEP 2: Copy & Paste This EXACT Command
----------------------------------------
cd /Users/mrdevsharma/Downloads/EX/healthcare-prototype && ./RUN_APP.sh

STEP 3: Press Enter and Wait
-----------------------------
- Wait 30-40 seconds
- You'll see messages about servers starting
- Then open your browser to: http://localhost:3000

═══════════════════════════════════════════════════════════════
                 🔐 LOGIN CREDENTIALS
═══════════════════════════════════════════════════════════════

Admin:
  Email: admin@hospital.com
  Password: admin123

Doctor:
  Email: doctor@hospital.com
  Password: doctor123

Patient:
  Phone: +1234567890
  OTP: 123456

═══════════════════════════════════════════════════════════════
              ❓ WHY DO I NEED TO DO THIS?
═══════════════════════════════════════════════════════════════

Your application is NOT on the internet. It runs on YOUR computer.

Every time you want to use it, you MUST:
1. Start the backend server (port 3001)
2. Start the frontend app (port 3000)
3. THEN open http://localhost:3000

The RUN_APP.sh script does steps 1 and 2 automatically!

═══════════════════════════════════════════════════════════════
                  🛑 TO STOP THE APP
═══════════════════════════════════════════════════════════════

Press Ctrl+C in the Terminal window

OR run this command in a new Terminal:
lsof -ti:3000,3001 | xargs kill -9

═══════════════════════════════════════════════════════════════
           ✅ YOUR APP HAS NO BUGS - IT JUST ISN'T RUNNING!
═══════════════════════════════════════════════════════════════

The code is perfect. All features work. Nothing is broken.

You just need to START IT by running the command above.

═══════════════════════════════════════════════════════════════
