/**
 * Test Script for Inventory Management
 * This script tests the inventory API endpoints
 */

const BASE_URL = 'http://localhost:3000';

// Color codes for terminal output
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m'
};

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

console.log(`${colors.cyan}╔════════════════════════════════════════════════════════════╗${colors.reset}`);
console.log(`${colors.cyan}║  Inventory Management Test Suite                          ║${colors.reset}`);
console.log(`${colors.cyan}╚════════════════════════════════════════════════════════════╝${colors.reset}\n`);

/**
 * Test fetching all inventory items
 */
async function testFetchInventory() {
    totalTests++;
    console.log(`${colors.blue}Test ${totalTests}: Fetch All Inventory Items${colors.reset}`);

    try {
        const response = await fetch(`${BASE_URL}/api/inventory`);
        const items = await response.json();

        if (response.ok && Array.isArray(items) && items.length > 0) {
            passedTests++;
            console.log(`${colors.green}✓ PASSED${colors.reset}`);
            console.log(`Found ${items.length} inventory items:`);
            items.forEach(item => {
                console.log(`  - ${item.itemName} (Qty: ${item.quantity}, Cat: ${item.category})`);
            });
        } else {
            failedTests++;
            console.log(`${colors.red}✗ FAILED${colors.reset}`);
            console.log(`Expected items array, got:`, items);
        }
    } catch (error) {
        failedTests++;
        console.log(`${colors.red}✗ FAILED - Error: ${error.message}${colors.reset}`);
    }

    console.log('─'.repeat(60) + '\n');
}

/**
 * Test searching inventory
 */
async function testSearchInventory() {
    totalTests++;
    console.log(`${colors.blue}Test ${totalTests}: Search Inventory (Medication)${colors.reset}`);

    try {
        const response = await fetch(`${BASE_URL}/api/inventory?search=Medication`);
        const items = await response.json();

        if (response.ok && Array.isArray(items)) {
            passedTests++;
            console.log(`${colors.green}✓ PASSED${colors.reset}`);
            console.log(`Found ${items.length} items matching "Medication":`);
            items.forEach(item => {
                console.log(`  - ${item.itemName} (${item.category})`);
            });
        } else {
            failedTests++;
            console.log(`${colors.red}✗ FAILED${colors.reset}`);
        }
    } catch (error) {
        failedTests++;
        console.log(`${colors.red}✗ FAILED - Error: ${error.message}${colors.reset}`);
    }

    console.log('─'.repeat(60) + '\n');
}

/**
 * Test adding a new inventory item
 */
async function testAddInventory() {
    totalTests++;
    console.log(`${colors.blue}Test ${totalTests}: Add New Inventory Item${colors.reset}`);

    const newItem = {
        itemName: 'Test Medicine',
        quantity: 100,
        category: 'Test Category'
    };

    try {
        const response = await fetch(`${BASE_URL}/api/inventory`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newItem)
        });

        const result = await response.json();

        if (response.ok && result.id) {
            passedTests++;
            console.log(`${colors.green}✓ PASSED${colors.reset}`);
            console.log(`Added item with ID: ${result.id}`);
            console.log(`  - Name: ${result.itemName}`);
            console.log(`  - Quantity: ${result.quantity}`);
            console.log(`  - Category: ${result.category}`);
            return result.id; // Return the ID for deletion test
        } else {
            failedTests++;
            console.log(`${colors.red}✗ FAILED${colors.reset}`);
            console.log(`Response:`, result);
        }
    } catch (error) {
        failedTests++;
        console.log(`${colors.red}✗ FAILED - Error: ${error.message}${colors.reset}`);
    }

    console.log('─'.repeat(60) + '\n');
    return null;
}

/**
 * Test deleting an inventory item
 */
async function testDeleteInventory(itemId) {
    if (!itemId) {
        console.log(`${colors.yellow}Skipping delete test (no item ID)${colors.reset}\n`);
        return;
    }

    totalTests++;
    console.log(`${colors.blue}Test ${totalTests}: Delete Inventory Item (ID: ${itemId})${colors.reset}`);

    try {
        const response = await fetch(`${BASE_URL}/api/inventory/${itemId}`, {
            method: 'DELETE'
        });

        const result = await response.json();

        if (response.ok) {
            passedTests++;
            console.log(`${colors.green}✓ PASSED${colors.reset}`);
            console.log(`Deleted item with ID: ${itemId}`);
        } else {
            failedTests++;
            console.log(`${colors.red}✗ FAILED${colors.reset}`);
            console.log(`Response:`, result);
        }
    } catch (error) {
        failedTests++;
        console.log(`${colors.red}✗ FAILED - Error: ${error.message}${colors.reset}`);
    }

    console.log('─'.repeat(60) + '\n');
}

/**
 * Test error handling - invalid item
 */
async function testInvalidAdd() {
    totalTests++;
    console.log(`${colors.blue}Test ${totalTests}: Add Invalid Item (Missing Fields)${colors.reset}`);

    try {
        const response = await fetch(`${BASE_URL}/api/inventory`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ itemName: 'Invalid' }) // Missing quantity and category
        });

        const result = await response.json();

        if (!response.ok && result.error) {
            passedTests++;
            console.log(`${colors.green}✓ PASSED${colors.reset}`);
            console.log(`Correctly rejected invalid item: ${result.error}`);
        } else {
            failedTests++;
            console.log(`${colors.red}✗ FAILED - Should have rejected invalid item${colors.reset}`);
        }
    } catch (error) {
        failedTests++;
        console.log(`${colors.red}✗ FAILED - Error: ${error.message}${colors.reset}`);
    }

    console.log('─'.repeat(60) + '\n');
}

/**
 * Run all tests
 */
async function runAllTests() {
    console.log(`${colors.yellow}Starting inventory tests...${colors.reset}\n`);

    // Check server
    try {
        const response = await fetch(BASE_URL);
        console.log(`${colors.green}✓ Server is running${colors.reset}\n`);
    } catch (error) {
        console.log(`${colors.red}✗ Server is not running. Please start with: node server.js${colors.reset}`);
        process.exit(1);
    }

    // Run all tests
    await testFetchInventory();
    await new Promise(resolve => setTimeout(resolve, 100));

    await testSearchInventory();
    await new Promise(resolve => setTimeout(resolve, 100));

    const newItemId = await testAddInventory();
    await new Promise(resolve => setTimeout(resolve, 100));

    await testDeleteInventory(newItemId);
    await new Promise(resolve => setTimeout(resolve, 100));

    await testInvalidAdd();

    // Print summary
    console.log(`\n${colors.cyan}╔════════════════════════════════════════════════════════════╗${colors.reset}`);
    console.log(`${colors.cyan}║  Test Summary                                              ║${colors.reset}`);
    console.log(`${colors.cyan}╚════════════════════════════════════════════════════════════╝${colors.reset}`);
    console.log(`Total Tests: ${totalTests}`);
    console.log(`${colors.green}Passed: ${passedTests}${colors.reset}`);
    console.log(`${colors.red}Failed: ${failedTests}${colors.reset}`);
    console.log(`Success Rate: ${((passedTests / totalTests) * 100).toFixed(2)}%\n`);

    if (failedTests === 0) {
        console.log(`${colors.green}🎉 All tests passed! Inventory system is working correctly.${colors.reset}\n`);
        process.exit(0);
    } else {
        console.log(`${colors.red}⚠ Some tests failed. Please review the failures above.${colors.reset}\n`);
        process.exit(1);
    }
}

// Run the tests
runAllTests();
