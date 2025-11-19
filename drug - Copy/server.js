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
        // Auto-initialize verification database if empty
        verificationDb.get("SELECT COUNT(*) as count FROM sqlite_master WHERE type='table' AND name='certifications'", (err, row) => {
            if (!err && row.count === 0) {
                console.log('Initializing verification database...');
                initializeVerificationDb();
            }
        });
    }
});

const trackingDb = new sqlite3.Database('tracking.db', (err) => {
    if (err) {
        console.error('Error connecting to tracking database:', err);
    } else {
        console.log('Connected to tracking database');
        // Auto-initialize tracking database if empty
        trackingDb.get("SELECT COUNT(*) as count FROM sqlite_master WHERE type='table' AND name='orders'", (err, row) => {
            if (!err && row.count === 0) {
                console.log('Initializing tracking database...');
                initializeTrackingDb();
            }
        });
    }
});

const inventoryDb = new sqlite3.Database('inventory.db', (err) => {
    if (err) {
        console.error('Error connecting to inventory database:', err);
    } else {
        console.log('Connected to inventory database');
    }
});

const salesDb = new sqlite3.Database('sales.db', (err) => {
    if (err) {
        console.error('Error connecting to sales database:', err);
    } else {
        console.log('Connected to sales database');
    }
});

const trainingDb = new sqlite3.Database('training_schedule.db', (err) => {
    if (err) {
        console.error('Error connecting to training database:', err);
    } else {
        console.log('Connected to training database');
    }
});

const feedbackDb = new sqlite3.Database('feedback.db', (err) => {
    if (err) {
        console.error('Error connecting to feedback database:', err);
    } else {
        console.log('Connected to feedback database');
    }
});

// Auto-initialization functions
function initializeVerificationDb() {
    verificationDb.run(`CREATE TABLE IF NOT EXISTS certifications (
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

        const testCertifications = [
            { code: 'CERT001', issueDate: '2025-01-15', expiryDate: '2026-01-15', status: 'Valid', productName: 'Paracetamol 500mg', batchNumber: 'BATCH2025001', manufacturer: 'PharmaCorp Inc.' },
            { code: 'CERT002', issueDate: '2025-02-20', expiryDate: '2026-02-20', status: 'Valid', productName: 'Amoxicillin 250mg', batchNumber: 'BATCH2025002', manufacturer: 'MediLife Ltd.' },
            { code: 'CERT003', issueDate: '2024-03-10', expiryDate: '2025-03-10', status: 'Expired', productName: 'Ibuprofen 200mg', batchNumber: 'BATCH2024003', manufacturer: 'HealthCare Solutions' },
            { code: 'QR12345', issueDate: '2025-06-01', expiryDate: '2026-06-01', status: 'Valid', productName: 'Aspirin 100mg', batchNumber: 'BATCH2025004', manufacturer: 'Global Pharma' },
            { code: 'SCAN001', issueDate: '2025-07-15', expiryDate: '2026-07-15', status: 'Valid', productName: 'Vitamin C 1000mg', batchNumber: 'BATCH2025005', manufacturer: 'NutriMed Inc.' }
        ];

        const stmt = verificationDb.prepare(`INSERT OR IGNORE INTO certifications (code, issueDate, expiryDate, status, productName, batchNumber, manufacturer) VALUES (?, ?, ?, ?, ?, ?, ?)`);
        testCertifications.forEach(cert => {
            stmt.run([cert.code, cert.issueDate, cert.expiryDate, cert.status, cert.productName, cert.batchNumber, cert.manufacturer]);
        });
        stmt.finalize(() => {
            console.log('✓ Verification database initialized with test data');
        });
    });
}

function initializeTrackingDb() {
    trackingDb.serialize(() => {
        trackingDb.run(`CREATE TABLE IF NOT EXISTS orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            orderId TEXT UNIQUE NOT NULL,
            status TEXT NOT NULL,
            status_code INTEGER NOT NULL,
            customerName TEXT NOT NULL,
            productName TEXT NOT NULL,
            quantity INTEGER NOT NULL,
            orderDate TEXT NOT NULL
        )`, (err) => {
            if (err) {
                console.error("Error creating orders table:", err.message);
                return;
            }
        });

        trackingDb.run(`CREATE TABLE IF NOT EXISTS tracking_details (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            orderId TEXT NOT NULL,
            status TEXT NOT NULL,
            location TEXT NOT NULL,
            timestamp TEXT NOT NULL,
            description TEXT
        )`, (err) => {
            if (err) {
                console.error("Error creating tracking_details table:", err.message);
                return;
            }
        });

        const testOrders = [
            { orderId: 'ORD001', status: 'Delivered', status_code: 4, customerName: 'John Doe', productName: 'Paracetamol 500mg', quantity: 100, orderDate: '2025-01-10' },
            { orderId: 'ORD002', status: 'Out for Delivery', status_code: 3, customerName: 'Jane Smith', productName: 'Amoxicillin 250mg', quantity: 50, orderDate: '2025-01-15' },
            { orderId: 'TRACK001', status: 'Shipped', status_code: 2, customerName: 'Bob Johnson', productName: 'Ibuprofen 200mg', quantity: 75, orderDate: '2025-01-18' }
        ];

        const orderStmt = trackingDb.prepare(`INSERT OR IGNORE INTO orders (orderId, status, status_code, customerName, productName, quantity, orderDate) VALUES (?, ?, ?, ?, ?, ?, ?)`);
        testOrders.forEach(order => {
            orderStmt.run([order.orderId, order.status, order.status_code, order.customerName, order.productName, order.quantity, order.orderDate]);
        });
        orderStmt.finalize();

        const testDetails = [
            { orderId: 'ORD001', status: 'Order Placed', location: 'Warehouse A', timestamp: '2025-01-10 10:00:00', description: 'Order received and processing started' },
            { orderId: 'ORD001', status: 'Shipped', location: 'Distribution Center', timestamp: '2025-01-11 14:30:00', description: 'Package dispatched from warehouse' },
            { orderId: 'ORD001', status: 'Out for Delivery', location: 'Local Hub', timestamp: '2025-01-12 08:00:00', description: 'Out for delivery to customer' },
            { orderId: 'ORD001', status: 'Delivered', location: 'Customer Address', timestamp: '2025-01-12 16:45:00', description: 'Successfully delivered to customer' },
            { orderId: 'ORD002', status: 'Order Placed', location: 'Warehouse B', timestamp: '2025-01-15 09:15:00', description: 'Order received and processing started' },
            { orderId: 'ORD002', status: 'Shipped', location: 'Distribution Center', timestamp: '2025-01-16 11:20:00', description: 'Package dispatched from warehouse' },
            { orderId: 'ORD002', status: 'Out for Delivery', location: 'Local Hub', timestamp: '2025-01-17 07:30:00', description: 'Out for delivery to customer' },
            { orderId: 'TRACK001', status: 'Order Placed', location: 'Warehouse A', timestamp: '2025-01-18 13:00:00', description: 'Order received and processing started' },
            { orderId: 'TRACK001', status: 'Shipped', location: 'Distribution Center', timestamp: '2025-01-19 10:45:00', description: 'Package dispatched from warehouse' }
        ];

        const detailsStmt = trackingDb.prepare(`INSERT OR IGNORE INTO tracking_details (orderId, status, location, timestamp, description) VALUES (?, ?, ?, ?, ?)`);
        testDetails.forEach(detail => {
            detailsStmt.run([detail.orderId, detail.status, detail.location, detail.timestamp, detail.description]);
        });
        detailsStmt.finalize(() => {
            console.log('✓ Tracking database initialized with test data');
        });
    });
}

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

// API endpoint for inventory - Get all items or search
app.get('/api/inventory', (req, res) => {
    const searchTerm = req.query.search || '';

    let query = 'SELECT * FROM inventory';
    let params = [];

    if (searchTerm) {
        query += ' WHERE itemName LIKE ? OR category LIKE ?';
        params = [`%${searchTerm}%`, `%${searchTerm}%`];
    }

    console.log('Fetching inventory with search term:', searchTerm);

    inventoryDb.all(query, params, (err, items) => {
        if (err) {
            console.error('Error fetching inventory:', err);
            return res.status(500).json({ error: 'Error fetching inventory' });
        }

        console.log(`Found ${items.length} inventory items`);
        res.json(items);
    });
});

// API endpoint for inventory - Add new item
app.post('/api/inventory', (req, res) => {
    const { itemName, quantity, category } = req.body;

    console.log('Adding new inventory item:', { itemName, quantity, category });

    if (!itemName || quantity === undefined || !category) {
        return res.status(400).json({ error: 'Missing required fields: itemName, quantity, category' });
    }

    if (typeof quantity !== 'number' || quantity < 0) {
        return res.status(400).json({ error: 'Quantity must be a non-negative number' });
    }

    const query = 'INSERT INTO inventory (itemName, quantity, category) VALUES (?, ?, ?)';

    inventoryDb.run(query, [itemName, quantity, category], function(err) {
        if (err) {
            console.error('Error adding inventory item:', err);
            return res.status(500).json({ error: 'Error adding item to inventory' });
        }

        console.log(`Item added successfully with ID: ${this.lastID}`);
        res.status(201).json({
            id: this.lastID,
            itemName,
            quantity,
            category
        });
    });
});

// API endpoint for inventory - Delete item
app.delete('/api/inventory/:id', (req, res) => {
    const itemId = req.params.id;

    console.log('Deleting inventory item with ID:', itemId);

    const query = 'DELETE FROM inventory WHERE id = ?';

    inventoryDb.run(query, [itemId], function(err) {
        if (err) {
            console.error('Error deleting inventory item:', err);
            return res.status(500).json({ error: 'Error deleting item' });
        }

        if (this.changes === 0) {
            console.log('No item found with ID:', itemId);
            return res.status(404).json({ error: 'Item not found' });
        }

        console.log(`Item deleted successfully, ID: ${itemId}`);
        res.json({ message: 'Item deleted successfully', id: itemId });
    });
});

// API endpoint for sales demand data
app.get('/api/sales_demand', (req, res) => {
    console.log('Fetching sales demand data');

    const query = 'SELECT * FROM sales_demand ORDER BY itemName, year, month';

    salesDb.all(query, [], (err, rows) => {
        if (err) {
            console.error('Error fetching sales demand:', err);
            return res.status(500).json({ error: 'Error fetching sales demand data' });
        }

        // Transform data into format expected by frontend
        const result = { months: [] };
        const monthsSet = new Set();

        rows.forEach(row => {
            monthsSet.add(`${row.year}-${String(row.month).padStart(2, '0')}`);

            if (!result[row.itemName]) {
                result[row.itemName] = [];
            }
            result[row.itemName].push(row.demand);
        });

        result.months = Array.from(monthsSet).sort();

        console.log(`Fetched sales demand data for ${Object.keys(result).length - 1} items`);
        res.json(result);
    });
});

// API endpoint for booking training sessions
app.post('/api/book_training', (req, res) => {
    const { date, time } = req.body;

    console.log('Booking training session:', { date, time });

    if (!date || !time) {
        return res.status(400).json({
            success: false,
            message: 'Date and time are required'
        });
    }

    // Note: The database column is named 'text' not 'time'
    const query = 'INSERT INTO session (date, text) VALUES (?, ?)';

    trainingDb.run(query, [date, time], function(err) {
        if (err) {
            console.error('Error booking training session:', err);
            return res.status(500).json({
                success: false,
                message: 'Error booking training session'
            });
        }

        console.log(`Training session booked successfully, ID: ${this.lastID}`);
        res.json({
            success: true,
            message: `Training session booked for ${date} at ${time}`,
            id: this.lastID
        });
    });
});

// API endpoint for submitting feedback
app.post('/api/submit_feedback', (req, res) => {
    const { rating, feedback } = req.body;

    console.log('Submitting feedback:', { rating, feedback });

    if (!rating && !feedback) {
        return res.status(400).json({
            success: false,
            message: 'Rating or feedback is required'
        });
    }

    const query = 'INSERT INTO feedback (rating, comment, submitted_at) VALUES (?, ?, ?)';
    const timestamp = new Date().toISOString();

    feedbackDb.run(query, [rating || 0, feedback || '', timestamp], function(err) {
        if (err) {
            console.error('Error submitting feedback:', err);
            return res.status(500).json({
                success: false,
                message: 'Error submitting feedback'
            });
        }

        console.log(`Feedback submitted successfully, ID: ${this.lastID}`);
        res.json({
            success: true,
            message: 'Thank you for your feedback!',
            id: this.lastID
        });
    });
});

// API endpoint for chatbot
app.post('/api/chatbot', (req, res) => {
    const { message } = req.body;

    console.log('Chatbot received message:', message);

    if (!message) {
        return res.status(400).json({
            error: 'Message is required'
        });
    }

    // Simple chatbot responses
    const userMsg = message.toLowerCase();
    let reply = '';

    if (userMsg.includes('hello') || userMsg.includes('hi') || userMsg.includes('hey')) {
        reply = 'Hello! How can I assist you with the pharmaceutical management system today?';
    } else if (userMsg.includes('help')) {
        reply = 'I can help you with:\n- Inventory management\n- Order tracking\n- Certification verification\n- Sales reports\n- Training schedules\nWhat would you like to know?';
    } else if (userMsg.includes('inventory')) {
        reply = 'You can manage your inventory from the Inventory page. Add, update, or remove items, and track stock levels.';
    } else if (userMsg.includes('tracking') || userMsg.includes('order')) {
        reply = 'To track an order, go to the Tracking page and enter your order ID. You can see real-time updates on order status.';
    } else if (userMsg.includes('verification') || userMsg.includes('certificate')) {
        reply = 'Use the Verification page to scan barcodes or enter certification codes to verify product authenticity.';
    } else if (userMsg.includes('sales') || userMsg.includes('demand')) {
        reply = 'Check the Sales page to view demand trends and analyze sales data with interactive charts.';
    } else if (userMsg.includes('training')) {
        reply = 'Visit the Training page to view available training sessions and book slots for staff training.';
    } else if (userMsg.includes('thank')) {
        reply = "You're welcome! Let me know if you need anything else.";
    } else if (userMsg.includes('bye') || userMsg.includes('goodbye')) {
        reply = 'Goodbye! Feel free to return if you have more questions.';
    } else {
        reply = 'I understand you need help with: "' + message + '". Could you please provide more details or choose from our main features: Inventory, Tracking, Verification, Sales, or Training?';
    }

    console.log('Chatbot reply:', reply);
    res.json({ reply });
});

// Start server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
