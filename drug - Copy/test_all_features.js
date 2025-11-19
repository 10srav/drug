/**
 * Comprehensive Test Suite for All Features
 */

const BASE_URL = 'http://localhost:3000';

const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m',
    magenta: '\x1b[35m'
};

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

console.log(`${colors.magenta}╔════════════════════════════════════════════════════════════╗${colors.reset}`);
console.log(`${colors.magenta}║  COMPLETE SYSTEM TEST - ALL FEATURES                      ║${colors.reset}`);
console.log(`${colors.magenta}╚════════════════════════════════════════════════════════════╝${colors.reset}\n`);

async function testSalesDemand() {
    totalTests++;
    console.log(`${colors.blue}Test ${totalTests}: Sales Demand Data${colors.reset}`);

    try {
        const response = await fetch(`${BASE_URL}/api/sales_demand`);
        const data = await response.json();

        if (response.ok && data.months && data.months.length > 0) {
            passedTests++;
            console.log(`${colors.green}✓ PASSED${colors.reset}`);
            console.log(`  Found ${data.months.length} months of data`);
            console.log(`  Items: ${Object.keys(data).filter(k => k !== 'months').join(', ')}`);
        } else {
            failedTests++;
            console.log(`${colors.red}✗ FAILED${colors.reset}`);
        }
    } catch (error) {
        failedTests++;
        console.log(`${colors.red}✗ FAILED - ${error.message}${colors.reset}`);
    }

    console.log('─'.repeat(60) + '\n');
}

async function testBookTraining() {
    totalTests++;
    console.log(`${colors.blue}Test ${totalTests}: Book Training Session${colors.reset}`);

    const testData = {
        date: '2025-12-01',
        time: '10:00'
    };

    try {
        const response = await fetch(`${BASE_URL}/api/book_training`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(testData)
        });

        const result = await response.json();

        if (response.ok && result.success) {
            passedTests++;
            console.log(`${colors.green}✓ PASSED${colors.reset}`);
            console.log(`  Message: ${result.message}`);
            console.log(`  Booking ID: ${result.id}`);
        } else {
            failedTests++;
            console.log(`${colors.red}✗ FAILED${colors.reset}`);
            console.log(`  Response:`, result);
        }
    } catch (error) {
        failedTests++;
        console.log(`${colors.red}✗ FAILED - ${error.message}${colors.reset}`);
    }

    console.log('─'.repeat(60) + '\n');
}

async function testSubmitFeedback() {
    totalTests++;
    console.log(`${colors.blue}Test ${totalTests}: Submit Feedback${colors.reset}`);

    const testData = {
        rating: 5,
        feedback: 'This is a test feedback message'
    };

    try {
        const response = await fetch(`${BASE_URL}/api/submit_feedback`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(testData)
        });

        const result = await response.json();

        if (response.ok && result.success) {
            passedTests++;
            console.log(`${colors.green}✓ PASSED${colors.reset}`);
            console.log(`  Message: ${result.message}`);
            console.log(`  Feedback ID: ${result.id}`);
        } else {
            failedTests++;
            console.log(`${colors.red}✗ FAILED${colors.reset}`);
            console.log(`  Response:`, result);
        }
    } catch (error) {
        failedTests++;
        console.log(`${colors.red}✗ FAILED - ${error.message}${colors.reset}`);
    }

    console.log('─'.repeat(60) + '\n');
}

async function testChatbot() {
    totalTests++;
    console.log(`${colors.blue}Test ${totalTests}: Chatbot Response${colors.reset}`);

    const testMessages = [
        'Hello',
        'Help me with inventory',
        'How do I track my order?'
    ];

    let allPassed = true;

    for (const message of testMessages) {
        try {
            const response = await fetch(`${BASE_URL}/api/chatbot`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message })
            });

            const result = await response.json();

            if (response.ok && result.reply) {
                console.log(`  ✓ "${message}" -> "${result.reply.substring(0, 50)}..."`);
            } else {
                allPassed = false;
                console.log(`  ✗ Failed for message: "${message}"`);
            }
        } catch (error) {
            allPassed = false;
            console.log(`  ✗ Error: ${error.message}`);
        }
    }

    if (allPassed) {
        passedTests++;
        console.log(`${colors.green}✓ PASSED${colors.reset}`);
    } else {
        failedTests++;
        console.log(`${colors.red}✗ FAILED${colors.reset}`);
    }

    console.log('─'.repeat(60) + '\n');
}

async function testVerificationQuick() {
    totalTests++;
    console.log(`${colors.blue}Test ${totalTests}: Verification System (Quick Check)${colors.reset}`);

    try {
        const response = await fetch(`${BASE_URL}/api/verify_certification`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code: 'CERT001' })
        });

        const result = await response.json();

        if (response.ok && result.success) {
            passedTests++;
            console.log(`${colors.green}✓ PASSED${colors.reset}`);
            console.log(`  Code CERT001 verified successfully`);
        } else {
            failedTests++;
            console.log(`${colors.red}✗ FAILED${colors.reset}`);
        }
    } catch (error) {
        failedTests++;
        console.log(`${colors.red}✗ FAILED - ${error.message}${colors.reset}`);
    }

    console.log('─'.repeat(60) + '\n');
}

async function testTrackingQuick() {
    totalTests++;
    console.log(`${colors.blue}Test ${totalTests}: Tracking System (Quick Check)${colors.reset}`);

    try {
        const response = await fetch(`${BASE_URL}/api/track_order?orderId=ORD001`);
        const result = await response.json();

        if (response.ok && result.orderId) {
            passedTests++;
            console.log(`${colors.green}✓ PASSED${colors.reset}`);
            console.log(`  Order ORD001 tracked successfully - Status: ${result.status}`);
        } else {
            failedTests++;
            console.log(`${colors.red}✗ FAILED${colors.reset}`);
        }
    } catch (error) {
        failedTests++;
        console.log(`${colors.red}✗ FAILED - ${error.message}${colors.reset}`);
    }

    console.log('─'.repeat(60) + '\n');
}

async function testInventoryQuick() {
    totalTests++;
    console.log(`${colors.blue}Test ${totalTests}: Inventory System (Quick Check)${colors.reset}`);

    try {
        const response = await fetch(`${BASE_URL}/api/inventory`);
        const items = await response.json();

        if (response.ok && Array.isArray(items) && items.length > 0) {
            passedTests++;
            console.log(`${colors.green}✓ PASSED${colors.reset}`);
            console.log(`  Found ${items.length} inventory items`);
        } else {
            failedTests++;
            console.log(`${colors.red}✗ FAILED${colors.reset}`);
        }
    } catch (error) {
        failedTests++;
        console.log(`${colors.red}✗ FAILED - ${error.message}${colors.reset}`);
    }

    console.log('─'.repeat(60) + '\n');
}

async function runAllTests() {
    console.log(`${colors.yellow}Checking server status...${colors.reset}\n`);

    try {
        const response = await fetch(BASE_URL);
        console.log(`${colors.green}✓ Server is running${colors.reset}\n`);
    } catch (error) {
        console.log(`${colors.red}✗ Server is not running!${colors.reset}`);
        process.exit(1);
    }

    console.log(`${colors.cyan}Testing all system features...${colors.reset}\n`);
    console.log('═'.repeat(60) + '\n');

    // Test core systems
    await testVerificationQuick();
    await new Promise(resolve => setTimeout(resolve, 100));

    await testTrackingQuick();
    await new Promise(resolve => setTimeout(resolve, 100));

    await testInventoryQuick();
    await new Promise(resolve => setTimeout(resolve, 100));

    // Test new features
    await testSalesDemand();
    await new Promise(resolve => setTimeout(resolve, 100));

    await testBookTraining();
    await new Promise(resolve => setTimeout(resolve, 100));

    await testSubmitFeedback();
    await new Promise(resolve => setTimeout(resolve, 100));

    await testChatbot();

    // Print summary
    console.log(`\n${colors.magenta}╔════════════════════════════════════════════════════════════╗${colors.reset}`);
    console.log(`${colors.magenta}║  COMPLETE SYSTEM TEST SUMMARY                             ║${colors.reset}`);
    console.log(`${colors.magenta}╚════════════════════════════════════════════════════════════╝${colors.reset}`);
    console.log(`\nFeatures Tested:`);
    console.log(`  1. Verification System`);
    console.log(`  2. Tracking System`);
    console.log(`  3. Inventory System`);
    console.log(`  4. Sales Demand Data`);
    console.log(`  5. Training Booking`);
    console.log(`  6. Feedback Submission`);
    console.log(`  7. Chatbot`);
    console.log(`\nResults:`);
    console.log(`  Total Tests: ${totalTests}`);
    console.log(`  ${colors.green}Passed: ${passedTests}${colors.reset}`);
    console.log(`  ${colors.red}Failed: ${failedTests}${colors.reset}`);
    console.log(`  Success Rate: ${((passedTests / totalTests) * 100).toFixed(2)}%\n`);

    if (failedTests === 0) {
        console.log(`${colors.green}🎉 ALL FEATURES WORKING! The system is complete and operational.${colors.reset}\n`);
        process.exit(0);
    } else {
        console.log(`${colors.red}⚠ Some features failed. Please review above.${colors.reset}\n`);
        process.exit(1);
    }
}

runAllTests();
