const sqlite3 = require('sqlite3').verbose();

// Create a new database connection
const db = new sqlite3.Database('database.db', (err) => {
    if (err) {
        console.error('Error connecting to database:', err.message);
        return;
    }
    console.log('Connected to the authentication database.');

    // Create users table
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        name TEXT
    )`, (err) => {
        if (err) {
            console.error("Error creating users table:", err.message);
            return;
        }
        console.log("Users table created successfully");
        
        // Insert a test user
        const testUser = {
            email: 'test@example.com',
            password: 'password123',
            name: 'Test User'
        };
        
        // First check if the test user exists
        db.get('SELECT email FROM users WHERE email = ?', [testUser.email], (err, row) => {
            if (err) {
                console.error("Error checking for existing user:", err.message);
                return;
            }
            
            if (!row) {
                // User doesn't exist, so insert them
                db.run('INSERT INTO users (email, password, name) VALUES (?, ?, ?)',
                    [testUser.email, testUser.password, testUser.name],
                    (err) => {
                        if (err) {
                            console.error("Error inserting test user:", err.message);
                        } else {
                            console.log("Test user created successfully");
                        }
                        
                        // Close the database connection after all operations are complete
                        db.close((err) => {
                            if (err) {
                                console.error('Error closing database:', err.message);
                            } else {
                                console.log('Database connection closed.');
                            }
                        });
                    }
                );
            } else {
                console.log("Test user already exists");
                // Close the database if we're not inserting
                db.close((err) => {
                    if (err) {
                        console.error('Error closing database:', err.message);
                    } else {
                        console.log('Database connection closed.');
                    }
                });
            }
        });
    });
});