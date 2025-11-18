/**
 * Test Script for Order Tracking
 * This script tests the /api/track_order endpoint
 */

const BASE_URL = 'http://localhost:3000';

// Test cases for order tracking
const testCases = [
    {
        name: 'Delivered Order - ORD001',
        orderId: 'ORD001',
        expectedStatus: 'delivered',
        expectedFound: true,
        description: 'Should successfully track a delivered order'
    },
    {
        name: 'Out for Delivery - ORD002',
        orderId: 'ORD002',
        expectedStatus: 'out_for_delivery',
        expectedFound: true,
        description: 'Should successfully track an order out for delivery'
    },
    {
        name: 'Shipped Order - ORD003',
        orderId: 'ORD003',
        expectedStatus: 'shipped',
        expectedFound: true,
        description: 'Should successfully track a shipped order'
    },
    {
        name: 'Placed Order - ORD004',
        orderId: 'ORD004',
        expectedStatus: 'placed',
        expectedFound: true,
        description: 'Should successfully track a newly placed order'
    },
    {
        name: 'Test Tracking Code - TRACK001',
        orderId: 'TRACK001',
        expectedStatus: 'shipped',
        expectedFound: true,
        description: 'Should successfully track using test tracking code'
    },
    {
        name: 'Invalid Order ID',
        orderId: 'INVALID999',
        expectedFound: false,
        description: 'Should return error for non-existent order'
    },
    {
        name: 'Empty Order ID',
        orderId: '',
        expectedFound: false,
        description: 'Should return error for empty order ID'
    }
];

// Color codes for terminal output
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m',
    magenta: '\x1b[35m'
};

// Test results tracking
let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

console.log(`${colors.cyan}╔════════════════════════════════════════════════════════════╗${colors.reset}`);
console.log(`${colors.cyan}║  Order Tracking Test Suite                                 ║${colors.reset}`);
console.log(`${colors.cyan}╚════════════════════════════════════════════════════════════╝${colors.reset}\n`);

/**
 * Function to display tracking progress bar
 */
function displayProgressBar(statusCode) {
    const steps = ['placed', 'shipped', 'out_for_delivery', 'delivered'];
    const currentIndex = steps.indexOf(statusCode);

    const symbols = steps.map((step, index) => {
        if (index <= currentIndex) {
            return `${colors.green}●${colors.reset}`;
        } else {
            return `${colors.yellow}○${colors.reset}`;
        }
    });

    const labels = ['Placed', 'Shipped', 'Out for Delivery', 'Delivered'];

    console.log('  Progress:');
    console.log(`  ${symbols.join('───')}}`);
    console.log(`  ${labels.map((label, index) => {
        if (index <= currentIndex) {
            return `${colors.green}${label}${colors.reset}`;
        }
        return label;
    }).join(' → ')}`);
}

/**
 * Function to test order tracking
 */
async function testTracking(testCase) {
    totalTests++;
    console.log(`${colors.blue}Test ${totalTests}: ${testCase.name}${colors.reset}`);
    console.log(`Description: ${testCase.description}`);
    console.log(`Testing Order ID: "${testCase.orderId}"`);

    try {
        const response = await fetch(`${BASE_URL}/api/track_order?orderId=${encodeURIComponent(testCase.orderId)}`);
        const result = await response.json();

        const orderFound = response.ok && !result.error;

        // Check if test passed
        let testPassed = orderFound === testCase.expectedFound;

        if (orderFound && testCase.expectedStatus) {
            testPassed = testPassed && result.status_code === testCase.expectedStatus;
        }

        if (testPassed) {
            passedTests++;
            console.log(`${colors.green}✓ PASSED${colors.reset}`);
        } else {
            failedTests++;
            console.log(`${colors.red}✗ FAILED${colors.reset}`);
            console.log(`Expected found: ${testCase.expectedFound}, Got: ${orderFound}`);
            if (testCase.expectedStatus) {
                console.log(`Expected status: ${testCase.expectedStatus}, Got: ${result.status_code || 'N/A'}`);
            }
        }

        // Display response details
        if (orderFound) {
            console.log(`\n  Order Information:`);
            console.log(`  - Order ID: ${result.orderId}`);
            console.log(`  - Status: ${result.status}`);
            console.log(`  - Customer: ${result.customerName}`);
            console.log(`  - Product: ${result.productName}`);
            console.log(`  - Quantity: ${result.quantity}`);
            console.log(`  - Order Date: ${result.orderDate}`);

            displayProgressBar(result.status_code);

            if (result.details && result.details.length > 0) {
                console.log(`\n  Tracking History:`);
                result.details.forEach((detail, index) => {
                    console.log(`  ${index + 1}. [${detail.timestamp}] ${detail.location} - ${detail.status}`);
                });
            }
        } else {
            console.log(`Error: ${result.error || 'Order not found'}`);
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
    console.log(`${colors.yellow}Starting order tracking tests...${colors.reset}\n`);

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
        await testTracking(testCase);
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
        console.log(`${colors.green}🎉 All tests passed! Order tracking is working correctly.${colors.reset}\n`);
        process.exit(0);
    } else {
        console.log(`${colors.red}⚠ Some tests failed. Please review the failures above.${colors.reset}\n`);
        process.exit(1);
    }
}

// Run the tests
runAllTests();
