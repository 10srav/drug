const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('inventory.db', (err) => {
    if (err) {
        console.error('Error connecting to database:', err);
        process.exit(1);
    }
});

// Check tables
db.all("SELECT name FROM sqlite_master WHERE type='table'", [], (err, tables) => {
    if (err) {
        console.error('Error querying tables:', err);
        process.exit(1);
    }

    console.log('Tables in inventory.db:');
    tables.forEach(table => {
        console.log(`  - ${table.name}`);
    });

    if (tables.length > 0) {
        // Get schema of first table
        const tableName = tables[0].name;
        db.all(`PRAGMA table_info(${tableName})`, [], (err, columns) => {
            if (err) {
                console.error('Error getting schema:', err);
                db.close();
                return;
            }

            console.log(`\nSchema for ${tableName}:`);
            columns.forEach(col => {
                console.log(`  - ${col.name} (${col.type})`);
            });

            // Get data
            db.all(`SELECT * FROM ${tableName}`, [], (err, rows) => {
                if (err) {
                    console.error('Error querying data:', err);
                } else {
                    console.log(`\nData (${rows.length} rows):`);
                    rows.forEach(row => {
                        console.log(JSON.stringify(row, null, 2));
                    });
                }
                db.close();
            });
        });
    } else {
        console.log('No tables found in database.');
        db.close();
    }
});
