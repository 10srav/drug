# CLIENT START GUIDE - PHARMACEUTICAL MANAGEMENT SYSTEM

## System Status: ✓ ALL SYSTEMS WORKING

Last verified: 2025-11-19

## Quick Start (3 Steps)

### Step 1: Start the Server
```bash
node server.js
```

**Expected output:**
```
Connected to SQLite database
Connected to verification database
Connected to tracking database
Server running on http://localhost:3000
```

### Step 2: Open Your Browser
Navigate to: **http://localhost:3000**

### Step 3: Login
- Email: `admin@example.com`
- Password: `admin123`

## System Features & Test Data

### 1. Verification System (verification.html)
Test with these codes:
- **CERT001** - Valid certificate
- **QR12345** - Valid QR code
- **SCAN001** - Valid scanner code
- **CERT002** - Valid certificate

**All codes are currently working!**

### 2. Tracking System (tracking.html)
Test with these order IDs:
- **ORD001** - Delivered order
- **ORD002** - Out for delivery
- **TRACK001** - Shipped order

### 3. Other Features
- Dashboard: Overview of system
- Inventory: Product management
- Sales: Sales tracking
- Training: Staff training schedules
- Feedback: Customer feedback
- Chatbot: AI assistant

## Important Notes

1. **Always access through the web server:**
   - ✓ Correct: `http://localhost:3000/verification.html`
   - ✗ Wrong: Opening HTML files directly

2. **Keep the server running:**
   - Don't close the terminal window where server is running
   - If you close it, restart with `node server.js`

3. **All test data is pre-loaded:**
   - Verification codes are already in the database
   - Order tracking data is ready
   - No setup needed

## Testing Verification (Most Important)

1. Go to: `http://localhost:3000/verification.html`
2. Enter code: **CERT001**
3. Click "Verify Code"
4. Should show: "Verification Successful"

**If it doesn't work:**
- Make sure server is running (check terminal)
- Make sure you're using http://localhost:3000, not opening file directly
- Check browser console for errors (Press F12)

## Run Automated Tests

To verify everything is working:

```bash
# Test verification system
node test_verification_endpoint.js

# Test tracking system
node test_tracking.js

# Run all tests
node run_all_tests.js
```

## Stopping the Server

Press `Ctrl+C` in the terminal where server is running

## Restarting

If you need to restart:
1. Press `Ctrl+C` to stop
2. Run `node server.js` to start again
3. Refresh browser page

## Files Included

- **server.js** - Main server file
- **verification.html** - Barcode verification page
- **tracking.html** - Order tracking page
- **verification.db** - Verification database (pre-loaded with test codes)
- **tracking.db** - Tracking database (pre-loaded with test orders)
- All other HTML files for the complete system

## Contact

If you have any issues, provide:
1. What you're trying to do
2. What error message you see
3. Screenshot if possible
