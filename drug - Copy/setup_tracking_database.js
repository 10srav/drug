const sqlite3 = require('sqlite3').verbose();

// Create a new database connection for order tracking
const db = new sqlite3.Database('tracking.db', (err) => {
    if (err) {
        console.error('Error connecting to tracking database:', err.message);
        return;
    }
    console.log('Connected to the tracking database.');

    db.serialize(() => {
        // Create orders table
        db.run(`CREATE TABLE IF NOT EXISTS orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            orderId TEXT UNIQUE NOT NULL,
            status TEXT NOT NULL,
            status_code TEXT NOT NULL,
            customerName TEXT,
            productName TEXT,
            quantity INTEGER,
            orderDate TEXT NOT NULL
        )`, (err) => {
            if (err) {
                console.error("Error creating orders table:", err.message);
                return;
            }
            console.log("Orders table created successfully");
        });

        // Create tracking_details table
        db.run(`CREATE TABLE IF NOT EXISTS tracking_details (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            orderId TEXT NOT NULL,
            timestamp TEXT NOT NULL,
            location TEXT NOT NULL,
            status TEXT NOT NULL,
            FOREIGN KEY (orderId) REFERENCES orders(orderId)
        )`, (err) => {
            if (err) {
                console.error("Error creating tracking_details table:", err.message);
                return;
            }
            console.log("Tracking details table created successfully");
        });

        // Insert test orders
        const testOrders = [
            {
                orderId: 'ORD001',
                status: 'Delivered',
                status_code: 'delivered',
                customerName: 'John Doe',
                productName: 'Paracetamol 500mg',
                quantity: 100,
                orderDate: '2024-11-10'
            },
            {
                orderId: 'ORD002',
                status: 'Out for Delivery',
                status_code: 'out_for_delivery',
                customerName: 'Jane Smith',
                productName: 'Amoxicillin 250mg',
                quantity: 50,
                orderDate: '2024-11-15'
            },
            {
                orderId: 'ORD003',
                status: 'Shipped',
                status_code: 'shipped',
                customerName: 'Bob Johnson',
                productName: 'Ibuprofen 200mg',
                quantity: 200,
                orderDate: '2024-11-16'
            },
            {
                orderId: 'ORD004',
                status: 'Order Placed',
                status_code: 'placed',
                customerName: 'Alice Williams',
                productName: 'Aspirin 100mg',
                quantity: 150,
                orderDate: '2024-11-18'
            },
            {
                orderId: 'TRACK001',
                status: 'Shipped',
                status_code: 'shipped',
                customerName: 'Test Customer',
                productName: 'Vitamin C 1000mg',
                quantity: 75,
                orderDate: '2024-11-17'
            }
        ];

        // Insert test tracking details
        const trackingDetails = [
            // ORD001 - Delivered
            { orderId: 'ORD001', timestamp: '2024-11-10 09:00', location: 'Warehouse A', status: 'Order Placed' },
            { orderId: 'ORD001', timestamp: '2024-11-11 14:30', location: 'Distribution Center', status: 'Shipped' },
            { orderId: 'ORD001', timestamp: '2024-11-12 08:15', location: 'Local Hub', status: 'Out for Delivery' },
            { orderId: 'ORD001', timestamp: '2024-11-12 16:45', location: 'Customer Address', status: 'Delivered' },

            // ORD002 - Out for Delivery
            { orderId: 'ORD002', timestamp: '2024-11-15 10:00', location: 'Warehouse B', status: 'Order Placed' },
            { orderId: 'ORD002', timestamp: '2024-11-16 15:20', location: 'Distribution Center', status: 'Shipped' },
            { orderId: 'ORD002', timestamp: '2024-11-18 07:30', location: 'Local Hub', status: 'Out for Delivery' },

            // ORD003 - Shipped
            { orderId: 'ORD003', timestamp: '2024-11-16 11:00', location: 'Warehouse A', status: 'Order Placed' },
            { orderId: 'ORD003', timestamp: '2024-11-17 16:45', location: 'Distribution Center', status: 'Shipped' },

            // ORD004 - Order Placed
            { orderId: 'ORD004', timestamp: '2024-11-18 09:30', location: 'Warehouse C', status: 'Order Placed' },

            // TRACK001 - Shipped
            { orderId: 'TRACK001', timestamp: '2024-11-17 08:00', location: 'Warehouse B', status: 'Order Placed' },
            { orderId: 'TRACK001', timestamp: '2024-11-18 10:15', location: 'Distribution Center', status: 'Shipped' }
        ];

        const orderStmt = db.prepare(`INSERT OR IGNORE INTO orders
            (orderId, status, status_code, customerName, productName, quantity, orderDate)
            VALUES (?, ?, ?, ?, ?, ?, ?)`);

        let ordersInserted = 0;
        testOrders.forEach(order => {
            orderStmt.run([
                order.orderId,
                order.status,
                order.status_code,
                order.customerName,
                order.productName,
                order.quantity,
                order.orderDate
            ], function(err) {
                if (err) {
                    console.error(`Error inserting order ${order.orderId}:`, err.message);
                } else if (this.changes > 0) {
                    ordersInserted++;
                    console.log(`Inserted order: ${order.orderId}`);
                }
            });
        });

        orderStmt.finalize(() => {
            console.log(`Orders insertion completed. ${ordersInserted} new records added.`);

            const trackingStmt = db.prepare(`INSERT INTO tracking_details
                (orderId, timestamp, location, status)
                VALUES (?, ?, ?, ?)`);

            let trackingInserted = 0;
            trackingDetails.forEach(detail => {
                trackingStmt.run([
                    detail.orderId,
                    detail.timestamp,
                    detail.location,
                    detail.status
                ], function(err) {
                    if (err) {
                        console.error(`Error inserting tracking detail:`, err.message);
                    } else {
                        trackingInserted++;
                    }
                });
            });

            trackingStmt.finalize(() => {
                console.log(`Tracking details insertion completed. ${trackingInserted} records added.`);

                // Close the database connection
                db.close((err) => {
                    if (err) {
                        console.error('Error closing database:', err.message);
                    } else {
                        console.log('Tracking database connection closed.');
                    }
                });
            });
        });
    });
});
