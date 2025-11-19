const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

const dbFiles = [
    'sales.db',
    'training_schedule.db',
    'feedback.db',
    'certifications.db'
];

async function checkDatabase(dbName) {
    return new Promise((resolve) => {
        if (!fs.existsSync(dbName)) {
            console.log(`\n❌ ${dbName} - FILE NOT FOUND`);
            resolve();
            return;
        }

        const db = new sqlite3.Database(dbName, (err) => {
            if (err) {
                console.log(`\n❌ ${dbName} - ERROR: ${err.message}`);
                resolve();
                return;
            }

            console.log(`\n✓ ${dbName}`);
            console.log('─'.repeat(60));

            db.all("SELECT name FROM sqlite_master WHERE type='table'", [], (err, tables) => {
                if (err) {
                    console.log('  Error querying tables:', err.message);
                    db.close();
                    resolve();
                    return;
                }

                if (tables.length === 0) {
                    console.log('  No tables found');
                    db.close();
                    resolve();
                    return;
                }

                console.log('  Tables:', tables.map(t => t.name).join(', '));

                let completed = 0;
                tables.forEach(table => {
                    if (table.name === 'sqlite_sequence') {
                        completed++;
                        if (completed === tables.length) {
                            db.close();
                            resolve();
                        }
                        return;
                    }

                    db.all(`SELECT * FROM ${table.name} LIMIT 3`, [], (err, rows) => {
                        if (err) {
                            console.log(`  Error querying ${table.name}:`, err.message);
                        } else {
                            console.log(`\n  Table: ${table.name} (${rows.length} sample rows):`);
                            if (rows.length > 0) {
                                console.log('  Columns:', Object.keys(rows[0]).join(', '));
                                rows.forEach((row, i) => {
                                    console.log(`    Row ${i + 1}:`, JSON.stringify(row));
                                });
                            } else {
                                console.log('    (empty table)');
                            }
                        }
                        completed++;
                        if (completed === tables.length) {
                            db.close();
                            resolve();
                        }
                    });
                });
            });
        });
    });
}

async function checkAll() {
    console.log('═'.repeat(60));
    console.log('DATABASE STRUCTURE CHECK');
    console.log('═'.repeat(60));

    for (const dbFile of dbFiles) {
        await checkDatabase(dbFile);
    }

    console.log('\n' + '═'.repeat(60));
    console.log('CHECK COMPLETE');
    console.log('═'.repeat(60));
}

checkAll();
