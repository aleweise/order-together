import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Create MySQL connection pool
const pool = mysql.createPool({
    host: process.env.VITE_DB_HOST,
    user: process.env.VITE_DB_USER,
    password: process.env.VITE_DB_PASSWORD,
    database: process.env.VITE_DB_NAME,
    port: process.env.VITE_DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Helper function to execute queries
async function query(sql, params = []) {
    const [rows] = await pool.execute(sql, params);
    return rows;
}

// ============================================
// ROUTES
// ============================================

// GET /api/restaurants - Get all restaurants
app.get('/api/restaurants', async (req, res) => {
    try {
        const restaurants = await query(
            `SELECT id, name, address, type, logo_url 
             FROM restaurants 
             ORDER BY name ASC`
        );
        res.json(restaurants);
    } catch (error) {
        console.error('Error fetching restaurants:', error);
        res.status(500).json({ error: 'Failed to fetch restaurants' });
    }
});

// POST /api/sessions - Create a new session
app.post('/api/sessions', async (req, res) => {
    try {
        const { code, organizerName, restaurantName } = req.body;

        // 1. Create Session
        const sessionResult = await query(
            `INSERT INTO sessions (id, code, organizer_name, restaurant_name, status) 
             VALUES (UUID(), ?, ?, ?, 'open')`,
            [code, organizerName, restaurantName]
        );

        // Get the created session
        const [session] = await query(
            'SELECT * FROM sessions WHERE code = ?',
            [code]
        );

        // 2. Create Organizer Participant
        await query(
            `INSERT INTO participants (id, session_id, name, is_organizer) 
             VALUES (UUID(), ?, ?, true)`,
            [session.id, organizerName]
        );

        const participants = await query(
            'SELECT * FROM participants WHERE session_id = ?',
            [session.id]
        );

        res.json({ ...session, participants });
    } catch (error) {
        console.error('Error creating session:', error);
        res.status(500).json({ error: 'Failed to create session' });
    }
});

// GET /api/sessions/:code - Get session by code
app.get('/api/sessions/:code', async (req, res) => {
    try {
        const { code } = req.params;
        const rows = await query(
            `SELECT * FROM sessions WHERE code = ? AND status = 'open' LIMIT 1`,
            [code]
        );

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Session not found' });
        }

        res.json(rows[0]);
    } catch (error) {
        console.error('Error fetching session:', error);
        res.status(500).json({ error: 'Failed to fetch session' });
    }
});

// GET /api/sessions/:id/details - Get session details with participants and orders
app.get('/api/sessions/:id/details', async (req, res) => {
    try {
        const { id } = req.params;

        // Get Session
        const sessionRows = await query('SELECT * FROM sessions WHERE id = ?', [id]);
        if (sessionRows.length === 0) {
            return res.status(404).json({ error: 'Session not found' });
        }
        const session = sessionRows[0];

        // Get Participants
        const participants = await query(
            'SELECT * FROM participants WHERE session_id = ?',
            [id]
        );

        // Get Orders
        const orders = await query('SELECT * FROM orders WHERE session_id = ?', [id]);

        res.json({ ...session, participants, orders });
    } catch (error) {
        console.error('Error fetching session details:', error);
        res.status(500).json({ error: 'Failed to fetch session details' });
    }
});

// POST /api/sessions/:id/join - Join a session
app.post('/api/sessions/:id/join', async (req, res) => {
    try {
        const { id } = req.params;
        const { participantName } = req.body;

        const result = await query(
            `INSERT INTO participants (id, session_id, name, is_organizer) 
             VALUES (UUID(), ?, ?, false)`,
            [id, participantName]
        );

        const [participant] = await query(
            'SELECT * FROM participants WHERE session_id = ? AND name = ? ORDER BY joined_at DESC LIMIT 1',
            [id, participantName]
        );

        res.json(participant);
    } catch (error) {
        console.error('Error joining session:', error);
        res.status(500).json({ error: 'Failed to join session' });
    }
});

// POST /api/sessions/:id/close - Close a session
app.post('/api/sessions/:id/close', async (req, res) => {
    try {
        const { id } = req.params;

        await query(
            `UPDATE sessions 
             SET status = 'closed', closed_at = NOW() 
             WHERE id = ?`,
            [id]
        );

        const [session] = await query('SELECT * FROM sessions WHERE id = ?', [id]);
        res.json(session);
    } catch (error) {
        console.error('Error closing session:', error);
        res.status(500).json({ error: 'Failed to close session' });
    }
});

// POST /api/orders - Add an order
app.post('/api/orders', async (req, res) => {
    try {
        const { sessionId, participantId, participantName, items, total } = req.body;

        const result = await query(
            `INSERT INTO orders (id, session_id, participant_id, participant_name, items, total) 
             VALUES (UUID(), ?, ?, ?, ?, ?)`,
            [sessionId, participantId, participantName, JSON.stringify(items), total]
        );

        const [order] = await query(
            'SELECT * FROM orders WHERE session_id = ? AND participant_id = ? ORDER BY created_at DESC LIMIT 1',
            [sessionId, participantId]
        );

        res.json(order);
    } catch (error) {
        console.error('Error adding order:', error);
        res.status(500).json({ error: 'Failed to add order' });
    }
});

// GET /api/menu/:restaurantId - Get menu items for a restaurant
app.get('/api/menu/:restaurantId', async (req, res) => {
    try {
        const { restaurantId } = req.params;
        const menuItems = await query(
            'SELECT * FROM menu_items WHERE restaurant_id = ?',
            [restaurantId]
        );
        res.json(menuItems);
    } catch (error) {
        console.error('Error fetching menu:', error);
        res.status(500).json({ error: 'Failed to fetch menu' });
    }
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Server is running' });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📊 Database: ${process.env.VITE_DB_NAME}`);
});
