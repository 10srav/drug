# Simple Commands for Running the Application

## Step 1: Open Terminal/Command Prompt

**Windows:** Press `Windows Key + R`, type `cmd`, and press Enter

**Mac/Linux:** Open Terminal application

---

## Step 2: Navigate to Project Folder

Copy and paste this command:

```bash
cd "drug - Copy"
```

Press Enter

---

## Step 3: Start the Application

Copy and paste this command:

```bash
node server.js
```

Press Enter

**You should see:**
```
Server running on http://localhost:3000
Connected to SQLite database
Connected to verification database
Connected to tracking database
```

✅ **Success! Keep this window open**

---

## Step 4: Open in Web Browser

Open your web browser (Chrome, Firefox, Edge) and go to:

```
http://localhost:3000
```

**Login Details:**
- Email: `test@example.com`
- Password: `password123`

---

## Step 5: Test Barcode Verification

1. Click **"Verification"** in the menu
2. Copy and paste these codes one by one:

**Valid Codes (Should show green/success):**
```
CERT001
```
```
QR12345
```
```
SCAN001
```

**Expired Code (Should show red/error):**
```
CERT003
```

---

## Step 6: Test Order Tracking

1. Click **"Tracking"** in the menu
2. Copy and paste these order IDs one by one:

**Delivered Order:**
```
ORD001
```

**Out for Delivery:**
```
ORD002
```

**Shipped:**
```
ORD003
```

**Test Tracking:**
```
TRACK001
```

---

## Step 7: Run Automated Tests (Optional)

**IMPORTANT:** First, open a **NEW** terminal/command prompt window (keep the first one running)

In the NEW window, type:

```bash
cd "drug - Copy"
```

Then run:

```bash
node run_all_tests.js
```

**Expected Result:**
```
✓ ALL TESTS PASSED!
Total Test Suites: 2
Passed: 2
Failed: 0
Success Rate: 100.00%
```

---

## How to Stop the Server

In the terminal window where the server is running:

**Windows:** Press `Ctrl + C`

**Mac/Linux:** Press `Ctrl + C`

---

## If You See Errors

### Error: "npm packages missing"

Run this command:
```bash
npm install
```

Then try starting the server again.

### Error: "Port 3000 already in use"

Something else is using port 3000. Either:
1. Close other applications
2. Or find and stop the other server

### Error: "Cannot find database"

Run these commands:
```bash
node setup_verification_database.js
node setup_tracking_database.js
```

Then start the server again.

---

## Quick Reference - All Commands in Order

```bash
# 1. Navigate to folder
cd "drug - Copy"

# 2. Start server
node server.js

# 3. (In NEW window) Run tests
cd "drug - Copy"
node run_all_tests.js
```

**Browser URL:** http://localhost:3000

**Login:** test@example.com / password123

---

## Test Codes Reference Card

### Barcode Verification Codes:
- `CERT001` ✓ Valid
- `CERT002` ✓ Valid
- `QR12345` ✓ Valid
- `SCAN001` ✓ Valid
- `CERT003` ✗ Expired

### Order Tracking IDs:
- `ORD001` - Delivered
- `ORD002` - Out for Delivery
- `ORD003` - Shipped
- `ORD004` - Order Placed
- `TRACK001` - Shipped

---

## That's It!

You now have:
- ✅ Barcode verification working
- ✅ Order tracking working
- ✅ All tests passing
- ✅ Complete documentation

Need help? Check `TESTING_GUIDE.md` for more details.
