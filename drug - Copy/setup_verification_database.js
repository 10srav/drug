const sqlite3 = require('sqlite3').verbose();

// Create a new database connection for verification
const db = new sqlite3.Database('verification.db', (err) => {
    if (err) {
        console.error('Error connecting to verification database:', err.message);
        return;
    }
    console.log('Connected to the verification database.');

    // Create certifications table
    db.run(`CREATE TABLE IF NOT EXISTS certifications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        code TEXT UNIQUE NOT NULL,
        issueDate TEXT NOT NULL,
        expiryDate TEXT NOT NULL,
        status TEXT NOT NULL,
        productName TEXT,
        batchNumber TEXT,
        manufacturer TEXT
    )`, (err) => {
        if (err) {
            console.error("Error creating certifications table:", err.message);
            return;
        }
        console.log("Certifications table created successfully");

        // Insert test certification codes for testing
        const testCertifications = [
            {
                code: 'CERT001',
                issueDate: '2025-01-15',
                expiryDate: '2026-01-15',
                status: 'Valid',
                productName: 'Paracetamol 500mg',
                batchNumber: 'BATCH2025001',
                manufacturer: 'PharmaCorp Inc.'
            },
            {
                code: 'CERT002',
                issueDate: '2025-02-20',
                expiryDate: '2026-02-20',
                status: 'Valid',
                productName: 'Amoxicillin 250mg',
                batchNumber: 'BATCH2025002',
                manufacturer: 'MediLife Ltd.'
            },
            {
                code: 'CERT003',
                issueDate: '2024-03-10',
                expiryDate: '2025-03-10',
                status: 'Expired',
                productName: 'Ibuprofen 200mg',
                batchNumber: 'BATCH2024003',
                manufacturer: 'HealthCare Solutions'
            },
            {
                code: 'QR12345',
                issueDate: '2025-06-01',
                expiryDate: '2026-06-01',
                status: 'Valid',
                productName: 'Aspirin 100mg',
                batchNumber: 'BATCH2025004',
                manufacturer: 'Global Pharma'
            },
            {
                code: 'SCAN001',
                issueDate: '2025-07-15',
                expiryDate: '2026-07-15',
                status: 'Valid',
                productName: 'Vitamin C 1000mg',
                batchNumber: 'BATCH2025005',
                manufacturer: 'NutriMed Inc.'
            }
        ];

        const stmt = db.prepare(`INSERT OR IGNORE INTO certifications
            (code, issueDate, expiryDate, status, productName, batchNumber, manufacturer)
            VALUES (?, ?, ?, ?, ?, ?, ?)`);

        let inserted = 0;
        testCertifications.forEach(cert => {
            stmt.run([
                cert.code,
                cert.issueDate,
                cert.expiryDate,
                cert.status,
                cert.productName,
                cert.batchNumber,
                cert.manufacturer
            ], function(err) {
                if (err) {
                    console.error(`Error inserting certification ${cert.code}:`, err.message);
                } else if (this.changes > 0) {
                    inserted++;
                    console.log(`Inserted certification: ${cert.code}`);
                }
            });
        });

        stmt.finalize(() => {
            console.log(`Test certifications insertion completed. ${inserted} new records added.`);

            // Close the database connection
            db.close((err) => {
                if (err) {
                    console.error('Error closing database:', err.message);
                } else {
                    console.log('Verification database connection closed.');
                }
            });
        });
    });
});
