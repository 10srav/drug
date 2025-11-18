/**
 * Test Script for Barcode Scanning Verification
 * This script tests the /api/verify_certification endpoint
 */

const BASE_URL = 'http://localhost:3000';

// Test cases for certification verification
const testCases = [
    {
        name: 'Valid Certification - CERT001',
        code: 'CERT001',
        expectedSuccess: true,
        description: 'Should successfully verify a valid certification'
    },
    {
        name: 'Valid Certification - QR12345',
        code: 'QR12345',
        expectedSuccess: true,
        description: 'Should successfully verify a QR code certification'
    },
    {
        name: 'Expired Certification - CERT003',
        code: 'CERT003',
        expectedSuccess: false,
        description: 'Should fail for expired certification'
    },
    {
        name: 'Invalid Certification Code',
        code: 'INVALID123',
        expectedSuccess: false,
        description: 'Should fail for non-existent certification code'
    },
    {
        name: 'Empty Code',
        code: '',
        expectedSuccess: false,
        description: 'Should fail for empty certification code'
    },
    {
        name: 'Valid Certification - SCAN001',
        code: 'SCAN001',
        expectedSuccess: true,
        description: 'Should successfully verify scanner test code'
    }
];

// Color codes for terminal output
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m'
};

// Test results tracking
let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

console.log(`${colors.cyan}╔════════════════════════════════════════════════════════════╗${colors.reset}`);
console.log(`${colors.cyan}║  Barcode Scanning Verification Test Suite                 ║${colors.reset}`);
console.log(`${colors.cyan}╚════════════════════════════════════════════════════════════╝${colors.reset}\n`);

/**
 * Function to test certification verification
 */
async function testVerification(testCase) {
    totalTests++;
    console.log(`${colors.blue}Test ${totalTests}: ${testCase.name}${colors.reset}`);
    console.log(`Description: ${testCase.description}`);
    console.log(`Testing code: "${testCase.code}"`);

    try {
        const response = await fetch(`${BASE_URL}/api/verify_certification`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ code: testCase.code })
        });

        const result = await response.json();
        const isSuccess = result.success === true;

        // Check if test passed
        const testPassed = isSuccess === testCase.expectedSuccess;

        if (testPassed) {
            passedTests++;
            console.log(`${colors.green}✓ PASSED${colors.reset}`);
        } else {
            failedTests++;
            console.log(`${colors.red}✗ FAILED${colors.reset}`);
            console.log(`Expected success: ${testCase.expectedSuccess}, Got: ${isSuccess}`);
        }

        // Display response details
        console.log(`Response Message: ${result.message}`);
        if (result.details) {
            console.log(`Details:
  - Product: ${result.details.productName}
  - Batch: ${result.details.batchNumber}
  - Manufacturer: ${result.details.manufacturer}
  - Issue Date: ${result.details.issueDate}
  - Expiry Date: ${result.details.expiryDate}
  - Status: ${result.details.status}`);
        }

    } catch (error) {
        failedTests++;
        console.log(`${colors.red}✗ FAILED - Error: ${error.message}${colors.reset}`);
    }

    console.log('─'.repeat(60) + '\n');
}

/**
 * Run all tests sequentially
 */
async function runAllTests() {
    console.log(`${colors.yellow}Starting verification tests...${colors.reset}\n`);

    // Wait for server to be ready
    console.log('Checking if server is running...');
    try {
        const response = await fetch(BASE_URL);
        console.log(`${colors.green}✓ Server is running${colors.reset}\n`);
    } catch (error) {
        console.log(`${colors.red}✗ Server is not running. Please start the server with 'node server.js'${colors.reset}`);
        process.exit(1);
    }

    // Run all test cases
    for (const testCase of testCases) {
        await testVerification(testCase);
        // Small delay between tests
        await new Promise(resolve => setTimeout(resolve, 100));
    }

    // Print summary
    console.log(`\n${colors.cyan}╔════════════════════════════════════════════════════════════╗${colors.reset}`);
    console.log(`${colors.cyan}║  Test Summary                                              ║${colors.reset}`);
    console.log(`${colors.cyan}╚════════════════════════════════════════════════════════════╝${colors.reset}`);
    console.log(`Total Tests: ${totalTests}`);
    console.log(`${colors.green}Passed: ${passedTests}${colors.reset}`);
    console.log(`${colors.red}Failed: ${failedTests}${colors.reset}`);
    console.log(`Success Rate: ${((passedTests / totalTests) * 100).toFixed(2)}%\n`);

    if (failedTests === 0) {
        console.log(`${colors.green}🎉 All tests passed! Barcode verification is working correctly.${colors.reset}\n`);
        process.exit(0);
    } else {
        console.log(`${colors.red}⚠ Some tests failed. Please review the failures above.${colors.reset}\n`);
        process.exit(1);
    }
}

// Run the tests
runAllTests();
