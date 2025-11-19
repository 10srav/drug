# VERIFICATION SYSTEM - QUICK TEST GUIDE

## STATUS: ✓ VERIFICATION IS WORKING!

The verification system is fully functional. All test codes work correctly.

## IMPORTANT: How to Access the System

**CRITICAL:** You MUST access the system through the web server, NOT by opening HTML files directly.

### ✓ CORRECT WAY:
1. Start the server: `node server.js`
2. Open browser and go to: `http://localhost:3000/verification.html`

### ✗ WRONG WAY (Will NOT work):
- Double-clicking the HTML file
- Opening file:///.../verification.html in browser
- This will fail because the API calls need the server running

## Test Codes (ALL WORKING)

Use these codes to test the verification system:

### Valid Certifications:
1. **CERT001** - Paracetamol 500mg (Valid until 2026-01-15)
2. **CERT002** - Amoxicillin 250mg (Valid until 2026-02-20)
3. **QR12345** - Aspirin 100mg (Valid until 2026-06-01)
4. **SCAN001** - Vitamin C 1000mg (Valid until 2026-07-15)

### Expired Certification:
- **CERT003** - Ibuprofen 200mg (Expired on 2025-03-10)

### Invalid Code (for testing):
- **INVALID123** - Should show "not found" message

## Quick Start Instructions

1. **Start the server:**
   ```
   node server.js
   ```

   You should see:
   ```
   Connected to SQLite database
   Connected to verification database
   Connected to tracking database
   Server running on http://localhost:3000
   ```

2. **Open the verification page:**
   - Open your browser
   - Go to: `http://localhost:3000/verification.html`

3. **Test verification:**
   - Enter code: **CERT001**
   - Click "Verify Code"
   - You should see: "Verification Successful: Certification is valid"

4. **Test QR scanning:**
   - Click "Start Camera"
   - Allow camera access
   - Point camera at QR code with one of the test codes
   - It will automatically verify

## Verification Test Results

Tested on: 2025-11-19

All 4 valid test codes: ✓ PASSED
- CERT001: ✓ Working
- CERT002: ✓ Working
- QR12345: ✓ Working
- SCAN001: ✓ Working

Server status: ✓ Running
Database: ✓ Initialized with all test data
API endpoint: ✓ Responding correctly

## Troubleshooting

If verification is not working:

1. **Check server is running:**
   - You should see "Server running on http://localhost:3000" in the terminal
   - If not, run: `node server.js`

2. **Check you're using the correct URL:**
   - Should be: `http://localhost:3000/verification.html`
   - NOT: `file:///...verification.html`

3. **Check browser console:**
   - Press F12 to open developer tools
   - Look for any error messages in the Console tab

4. **Verify database:**
   - Run: `node check_verification_db.js`
   - Should show 5 certifications

5. **Test the API directly:**
   - Run: `node test_verification_endpoint.js`
   - All tests should pass

## Support

If you still have issues after following these steps:
1. Make sure Node.js is installed
2. Make sure all dependencies are installed: `npm install`
3. Restart the server
4. Clear browser cache and reload the page
