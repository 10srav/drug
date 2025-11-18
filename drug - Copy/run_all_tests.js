/**
 * Master Test Runner
 * Runs all test suites for the Drug Management System
 */

const { spawn } = require('child_process');
const path = require('path');

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

console.log(`${colors.magenta}╔══════════════════════════════════════════════════════════════╗${colors.reset}`);
console.log(`${colors.magenta}║  Drug Management System - Master Test Runner                ║${colors.reset}`);
console.log(`${colors.magenta}╚══════════════════════════════════════════════════════════════╝${colors.reset}\n`);

const testSuites = [
    {
        name: 'Barcode Scanning Verification Tests',
        script: 'test_verification.js',
        description: 'Tests certification verification and barcode scanning functionality'
    },
    {
        name: 'Order Tracking Tests',
        script: 'test_tracking.js',
        description: 'Tests order tracking and status monitoring functionality'
    }
];

let currentTest = 0;
let passedSuites = 0;
let failedSuites = 0;

/**
 * Run a single test suite
 */
function runTestSuite(testSuite) {
    return new Promise((resolve, reject) => {
        console.log(`${colors.cyan}═══════════════════════════════════════════════════════════${colors.reset}`);
        console.log(`${colors.cyan}Running: ${testSuite.name}${colors.reset}`);
        console.log(`${colors.cyan}Description: ${testSuite.description}${colors.reset}`);
        console.log(`${colors.cyan}═══════════════════════════════════════════════════════════${colors.reset}\n`);

        const testProcess = spawn('node', [testSuite.script], {
            cwd: __dirname,
            stdio: 'inherit'
        });

        testProcess.on('close', (code) => {
            if (code === 0) {
                passedSuites++;
                console.log(`${colors.green}✓ ${testSuite.name} completed successfully${colors.reset}\n`);
                resolve();
            } else {
                failedSuites++;
                console.log(`${colors.red}✗ ${testSuite.name} failed${colors.reset}\n`);
                resolve(); // Continue running other tests even if one fails
            }
        });

        testProcess.on('error', (error) => {
            failedSuites++;
            console.error(`${colors.red}Error running ${testSuite.name}:${colors.reset}`, error);
            resolve();
        });
    });
}

/**
 * Run all test suites sequentially
 */
async function runAllTests() {
    console.log(`${colors.yellow}Starting all test suites...${colors.reset}\n`);

    // Check if server is running
    console.log('Checking if server is running...');
    try {
        const response = await fetch('http://localhost:3000');
        console.log(`${colors.green}✓ Server is running${colors.reset}\n\n`);
    } catch (error) {
        console.log(`${colors.red}✗ Server is not running!${colors.reset}`);
        console.log(`${colors.yellow}Please start the server in a separate terminal with:${colors.reset}`);
        console.log(`${colors.cyan}  cd "drug - Copy"${colors.reset}`);
        console.log(`${colors.cyan}  node server.js${colors.reset}\n`);
        process.exit(1);
    }

    // Run each test suite
    for (const testSuite of testSuites) {
        currentTest++;
        await runTestSuite(testSuite);
    }

    // Print final summary
    console.log(`\n${colors.magenta}╔══════════════════════════════════════════════════════════════╗${colors.reset}`);
    console.log(`${colors.magenta}║  Final Test Summary                                          ║${colors.reset}`);
    console.log(`${colors.magenta}╚══════════════════════════════════════════════════════════════╝${colors.reset}`);
    console.log(`Total Test Suites: ${testSuites.length}`);
    console.log(`${colors.green}Passed: ${passedSuites}${colors.reset}`);
    console.log(`${colors.red}Failed: ${failedSuites}${colors.reset}`);
    console.log(`Success Rate: ${((passedSuites / testSuites.length) * 100).toFixed(2)}%\n`);

    if (failedSuites === 0) {
        console.log(`${colors.green}════════════════════════════════════════════════════════════${colors.reset}`);
        console.log(`${colors.green}🎉 ALL TESTS PASSED!${colors.reset}`);
        console.log(`${colors.green}The system is working correctly.${colors.reset}`);
        console.log(`${colors.green}════════════════════════════════════════════════════════════${colors.reset}\n`);
        process.exit(0);
    } else {
        console.log(`${colors.red}════════════════════════════════════════════════════════════${colors.reset}`);
        console.log(`${colors.red}⚠ SOME TESTS FAILED${colors.reset}`);
        console.log(`${colors.red}Please review the failures above.${colors.reset}`);
        console.log(`${colors.red}════════════════════════════════════════════════════════════${colors.reset}\n`);
        process.exit(1);
    }
}

// Run all tests
runAllTests();
