/**
 * Quick test of the verification endpoint
 */

const BASE_URL = 'http://localhost:3000';

async function testVerification(code) {
    console.log(`\nTesting code: "${code}"`);

    try {
        const response = await fetch(`${BASE_URL}/api/verify_certification`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ code: code })
        });

        const result = await response.json();
        console.log('Response:', JSON.stringify(result, null, 2));

        if (result.success) {
            console.log('✓ SUCCESS - Verification passed');
        } else {
            console.log('✗ FAILED - Verification failed');
        }

        return result.success;
    } catch (error) {
        console.log('✗ ERROR:', error.message);
        return false;
    }
}

async function main() {
    console.log('Testing verification endpoint...');

    // Check if server is running
    try {
        const response = await fetch(BASE_URL);
        console.log('✓ Server is running\n');
    } catch (error) {
        console.log('✗ Server is NOT running. Please start with: node server.js');
        process.exit(1);
    }

    // Test all valid codes
    const codes = ['CERT001', 'CERT002', 'QR12345', 'SCAN001'];

    let allPassed = true;
    for (const code of codes) {
        const passed = await testVerification(code);
        if (!passed) allPassed = false;
        await new Promise(resolve => setTimeout(resolve, 100));
    }

    if (allPassed) {
        console.log('\n✓ All verification tests PASSED!');
    } else {
        console.log('\n✗ Some verification tests FAILED!');
    }
}

main();
