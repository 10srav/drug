const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('verification.db', (err) => {
    if (err) {
        console.error('Error connecting to database:', err);
        process.exit(1);
    }
});

db.all("SELECT * FROM certifications", [], (err, rows) => {
    if (err) {
        console.error('Error querying database:', err);
        process.exit(1);
    }

    console.log('Certifications in database:');
    console.log('Total records:', rows.length);
    console.log('\nAll certifications:');
    rows.forEach(row => {
        console.log(JSON.stringify(row, null, 2));
    });

    db.close();
});
