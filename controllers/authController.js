const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db/mysql');
const SECRET_KEY = 'your-secret-key';

exports.signup = async (req, res, data) => {
    const { username, password } = data;
    if (!username || !password) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'Username and password required' }));
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const sql = 'INSERT INTO users(username, password, role) VALUES (?, ?, ?)';
        const values = [username, hashedPassword, 'user'];
        const [result] = await pool.execute(sql, values);
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'User created', userId: result.insertId }));
    } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Server error' }));
    }
};

exports.login = async (req, res, data) => {
    const { username, password } = data;
    if (!username || !password) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'Username and password required' }));
    }

    try {
        const sql = 'SELECT * FROM users WHERE username = ?';
        const [result] = await pool.execute(sql, [username]);
        if (result.length === 0) {
            res.writeHead(401, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: 'Invalid credentials' }));
        }

        const user = result[0];
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            res.writeHead(401, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: 'Invalid password' }));
        }

        const token = jwt.sign({ username: user.username, role: user.role }, SECRET_KEY, { expiresIn: '1h' });

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Login successful', token }));
    } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Server error' }));
    }
};
