# Testing Guide - Drug Management System

## Overview
This guide explains how to test the **Barcode Scanning Verification** and **Order Tracking** features of the Drug Management System.

## Prerequisites

All dependencies have been installed and databases have been set up. The system is ready to run.

## Quick Start

### 1. Start the Server

Open a terminal and run:

```bash
cd "drug - Copy"
node server.js
```

You should see:
```
Connected to SQLite database
Connected to verification database
Connected to tracking database
Server running on http://localhost:3000
```

**Keep this terminal open** - the server must be running for tests to work.

### 2. Run All Tests

Open a **NEW terminal** (keep the server running in the first one) and run:

```bash
cd "drug - Copy"
node run_all_tests.js
```

This will run all test suites and show you the results.

## Individual Test Suites

### Test Barcode Verification Only

```bash
cd "drug - Copy"
node test_verification.js
```

This tests:
- Valid certification codes
- Expired certifications
- Invalid/non-existent codes
- QR code scanning simulation

### Test Order Tracking Only

```bash
cd "drug - Copy"
node test_tracking.js
```

This tests:
- Tracking delivered orders
- Tracking in-transit orders
- Tracking newly placed orders
- Invalid order IDs

## Manual Testing via Web Browser

### 1. Access the Application

Open your browser and go to:
```
http://localhost:3000
```

Login credentials:
- Email: `test@example.com`
- Password: `password123`

### 2. Test Barcode Verification

1. Navigate to **Verification** page from the sidebar
2. Try these test codes:

**Valid Codes:**
- `CERT001` - Paracetamol certification (Valid)
- `CERT002` - Amoxicillin certification (Valid)
- `QR12345` - Aspirin certification (Valid)
- `SCAN001` - Vitamin C certification (Valid)

**Expired Code:**
- `CERT003` - Ibuprofen certification (Expired)

**Invalid Code:**
- `INVALID123` - Should show "not found" message

### 3. Test QR Code Scanner (Requires Camera)

1. On the Verification page, click **"Start Camera"**
2. Allow camera access when prompted
3. Point your camera at a QR code containing one of the test codes above
4. The system will automatically scan and verify the code

### 4. Test Order Tracking

1. Navigate to **Tracking** page from the sidebar
2. Try these test order IDs:

**Different Order Statuses:**
- `ORD001` - Delivered order (shows full tracking history)
- `ORD002` - Out for Delivery
- `ORD003` - Shipped
- `ORD004` - Order Placed
- `TRACK001` - Shipped order

**Invalid Order:**
- `INVALID999` - Should show "Order not found"

## Test Data Summary

### Certification Codes in Database

| Code | Product | Status | Batch Number | Expiry Date |
|------|---------|--------|--------------|-------------|
| CERT001 | Paracetamol 500mg | Valid | BATCH2025001 | 2026-01-15 |
| CERT002 | Amoxicillin 250mg | Valid | BATCH2025002 | 2026-02-20 |
| CERT003 | Ibuprofen 200mg | Expired | BATCH2024003 | 2025-03-10 |
| QR12345 | Aspirin 100mg | Valid | BATCH2025004 | 2026-06-01 |
| SCAN001 | Vitamin C 1000mg | Valid | BATCH2025005 | 2026-07-15 |

### Order IDs in Database

| Order ID | Product | Status | Customer |
|----------|---------|--------|----------|
| ORD001 | Paracetamol 500mg | Delivered | John Doe |
| ORD002 | Amoxicillin 250mg | Out for Delivery | Jane Smith |
| ORD003 | Ibuprofen 200mg | Shipped | Bob Johnson |
| ORD004 | Aspirin 100mg | Order Placed | Alice Williams |
| TRACK001 | Vitamin C 1000mg | Shipped | Test Customer |

## Expected Test Results

### Verification Tests
- **Total Tests:** 6
- **Expected Pass:** 6
- **Success Rate:** 100%

### Tracking Tests
- **Total Tests:** 7
- **Expected Pass:** 7
- **Success Rate:** 100%

## Troubleshooting

### Server Won't Start

**Problem:** `Error: Cannot find module 'express'`

**Solution:** Dependencies not installed. Run:
```bash
cd "drug - Copy"
npm install
```

### Database Errors

**Problem:** `Error: SQLITE_ERROR: no such table: certifications`

**Solution:** Databases not set up. Run:
```bash
cd "drug - Copy"
node setup_verification_database.js
node setup_tracking_database.js
```

### Tests Fail with "Server not running"

**Solution:** Make sure the server is running in a separate terminal:
```bash
cd "drug - Copy"
node server.js
```

### Camera Not Working (Verification Page)

**Possible causes:**
1. Browser doesn't have camera permission - Check browser settings
2. Camera is being used by another application - Close other apps
3. Using HTTP instead of HTTPS on mobile - Camera requires HTTPS on mobile devices
4. Browser doesn't support camera API - Use Chrome, Firefox, or Edge

## API Endpoints Reference

### Verify Certification
```
POST /api/verify_certification
Content-Type: application/json

{
  "code": "CERT001"
}
```

### Track Order
```
GET /api/track_order?orderId=ORD001
```

## File Structure

```
drug - Copy/
├── server.js                           # Main server file (UPDATED)
├── verification.html                   # Barcode verification page
├── tracking.html                       # Order tracking page
├── setup_verification_database.js      # Setup verification DB (NEW)
├── setup_tracking_database.js          # Setup tracking DB (NEW)
├── test_verification.js                # Verification tests (NEW)
├── test_tracking.js                    # Tracking tests (NEW)
├── run_all_tests.js                    # Master test runner (NEW)
├── verification.db                     # Verification database
├── tracking.db                         # Tracking database
└── TESTING_GUIDE.md                    # This file (NEW)
```

## What Was Fixed

1. **Installed missing dependencies** - express, body-parser, sqlite3
2. **Created verification database** with test certification codes
3. **Created tracking database** with test orders and tracking details
4. **Added missing API endpoints** to server.js:
   - `/api/verify_certification` - For barcode verification
   - `/api/track_order` - For order tracking
   - `/logout` - For logout functionality
5. **Created comprehensive test scripts** for automated testing

## Next Steps

1. Run the automated tests to verify everything works
2. Test manually through the web interface
3. Add more test data if needed
4. Customize the features based on requirements

## Support

If you encounter any issues not covered in this guide, check:
1. Server console output for error messages
2. Browser console (F12) for JavaScript errors
3. Database files exist in the correct directory
4. Port 3000 is not being used by another application
