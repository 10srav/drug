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

// Database connections
const db = new sqlite3.Database('database.db', (err) => {
    if (err) {
        console.error('Error connecting to database:', err);
    } else {
        console.log('Connected to SQLite database');
    }
});

const verificationDb = new sqlite3.Database('verification.db', (err) => {
    if (err) {
        console.error('Error connecting to verification database:', err);
    } else {
        console.log('Connected to verification database');
    }
});

const trackingDb = new sqlite3.Database('tracking.db', (err) => {
    if (err) {
        console.error('Error connecting to tracking database:', err);
    } else {
        console.log('Connected to tracking database');
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

// Logout endpoint
app.post('/logout', (req, res) => {
    console.log('Logout request received');
    // In a real application, you would clear session/token here
    res.status(200).json({ message: 'Logged out successfully' });
});

// API endpoint for barcode/certification verification
app.post('/api/verify_certification', (req, res) => {
    console.log('Verification request received:', req.body);
    const { code } = req.body;

    if (!code) {
        return res.status(400).json({
            success: false,
            message: 'Certification code is required'
        });
    }

    // Query to check certification code
    const query = `SELECT * FROM certifications WHERE code = ?`;

    verificationDb.get(query, [code], (err, certification) => {
        if (err) {
            console.error('Database error during verification:', err);
            return res.status(500).json({
                success: false,
                message: 'Internal server error during verification'
            });
        }

        if (!certification) {
            console.log('Certification not found for code:', code);
            return res.json({
                success: false,
                message: 'Certification code not found in database'
            });
        }

        // Check if certification is valid or expired
        const currentDate = new Date();
        const expiryDate = new Date(certification.expiryDate);

        if (certification.status === 'Expired' || expiryDate < currentDate) {
            console.log('Certification expired for code:', code);
            return res.json({
                success: false,
                message: 'Certification has expired',
                details: {
                    code: certification.code,
                    issueDate: certification.issueDate,
                    expiryDate: certification.expiryDate,
                    status: 'Expired',
                    productName: certification.productName,
                    batchNumber: certification.batchNumber,
                    manufacturer: certification.manufacturer
                }
            });
        }

        console.log('Certification verified successfully for code:', code);
        res.json({
            success: true,
            message: 'Certification is valid',
            details: {
                code: certification.code,
                issueDate: certification.issueDate,
                expiryDate: certification.expiryDate,
                status: certification.status,
                productName: certification.productName,
                batchNumber: certification.batchNumber,
                manufacturer: certification.manufacturer
            }
        });
    });
});

// API endpoint for order tracking
app.get('/api/track_order', (req, res) => {
    console.log('Tracking request received for order:', req.query.orderId);
    const { orderId } = req.query;

    if (!orderId) {
        return res.status(400).json({
            error: 'Order ID is required'
        });
    }

    // Query to get order information
    const orderQuery = `SELECT * FROM orders WHERE orderId = ?`;

    trackingDb.get(orderQuery, [orderId], (err, order) => {
        if (err) {
            console.error('Database error during order tracking:', err);
            return res.status(500).json({
                error: 'Internal server error during tracking'
            });
        }

        if (!order) {
            console.log('Order not found:', orderId);
            return res.status(404).json({
                error: 'Order not found'
            });
        }

        // Query to get tracking details
        const detailsQuery = `SELECT * FROM tracking_details WHERE orderId = ? ORDER BY timestamp ASC`;

        trackingDb.all(detailsQuery, [orderId], (err, details) => {
            if (err) {
                console.error('Database error fetching tracking details:', err);
                return res.status(500).json({
                    error: 'Error fetching tracking details'
                });
            }

            console.log('Order tracking successful for:', orderId);
            res.json({
                orderId: order.orderId,
                status: order.status,
                status_code: order.status_code,
                customerName: order.customerName,
                productName: order.productName,
                quantity: order.quantity,
                orderDate: order.orderDate,
                details: details || []
            });
        });
    });
});

// Start server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
