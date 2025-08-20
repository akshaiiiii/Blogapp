const { ConnectDB } = require('../db/mongodb');
const { ObjectId } = require('mongodb');
const SECRET = 'your-secret-key';
const jwt = require('jsonwebtoken');

exports.getPosts = async (req, res) => {
    try {
        const db = await ConnectDB();
        const posts = await db.collection('blogs').find().toArray();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(posts));
    } catch (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Failed to fetch posts');
    }
};

exports.createPost = async (req, res, data) => {
    try {
        const db = await ConnectDB();
        const result = await db.collection('blogs').insertOne(data);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Post created', id: result.insertedId }));
    } catch (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Failed to save post');
    }
};

exports.updatePost = async (req, res, id, updatedData) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if (!token) {
            res.writeHead(401, { 'Content-Type': 'text/plain' });
            return res.end('Access token missing');
        }
        let decoded;
        try {
            decoded = jwt.verify(token, SECRET);
        } catch (err) {
            res.writeHead(403, { 'Content-Type': 'text/plain' });
            return res.end('Invalid or expired token');
        }
        if(decoded.role!=="admin"){
            res.writeHead(403, { 'Content-Type': 'text/plain' });
            return res.end('You do not have permission to delete posts');   
        }
        const db = await ConnectDB();
        const result = await db.collection('blogs').updateOne({ _id: new ObjectId(id) }, { $set: updatedData });
        if (result.matchedCount === 0) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            return res.end('Post not found');
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Post updated', result }));
    } catch (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Failed to update post');
    }
};

exports.deletePost = async (req, res, id) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        console.log(token)
        if (!token) {
            res.writeHead(401, { 'Content-Type': 'text/plain' });
            return res.end('Access token missing');
        }
        let decoded;
        try {
            decoded = jwt.verify(token, SECRET);
        } catch (err) {
            res.writeHead(403, { 'Content-Type': 'text/plain' });
            return res.end('Invalid or expired token');
        }
        if(decoded.role!=="admin"){
            res.writeHead(403, { 'Content-Type': 'text/plain' });
            return res.end('You do not have permission to delete posts');   
        }
        const db = await ConnectDB();
        const result = await db.collection('blogs').deleteOne({ _id: new ObjectId(id) });
        if (result.deletedCount === 0) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            return res.end('Post not found');
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Post deleted', result }));
        
        
    } catch (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Failed to delete post');
    }
};
