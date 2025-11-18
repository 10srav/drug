const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

// Enable CORS for development
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

// Database connection
const db = new sqlite3.Database('database.db', (err) => {
    if (err) {
        console.error('Error connecting to database:', err);
    } else {
        console.log('Connected to SQLite database');
    }
});

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/login', (req, res) => {
    console.log('Login attempt received:', req.body);
    const { email, password } = req.body;
    
    // Query to check user credentials
    const query = 'SELECT * FROM users WHERE email = ? AND password = ?';
    
    console.log('Checking credentials for email:', email);
    
    db.get(query, [email, password], (err, user) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        
        if (!user) {
            console.log('Invalid credentials for email:', email);
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        console.log('Successful login for user:', email);
        // Successful login
        res.redirect('/dashboard.html');
    });
});

// Start server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
