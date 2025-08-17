const http = require('http');
const path = require('path');
const fs = require('fs');
const postsRoute = require('./routes/posts');
const authRoute = require('./routes/auth');
const serveFiles = require('./utils/serveFiles');

const server = http.createServer((req, res) => {
    const { method, url } = req;

    if (method === 'GET' && url === '/') {
        return serveFiles(res, path.join(__dirname, 'public', 'login.html'), 'text/html');
    }
    if(url==='/index.html'){
            return serveFiles(res,path.join(__dirname,'public','index.html'),'text/html');
    }

    if (url.startsWith('/public/')) {
        const ext = path.extname(url);
        const contentTypeMap = {
            '.css': 'text/css',
            '.js': 'application/javascript',
            '.html': 'text/html'
        };
        const contentType = contentTypeMap[ext] || 'text/plain';
        return serveFiles(res, path.join(__dirname, url), contentType);
    }

    if (url.startsWith('/api/posts')) {
        console.log("in api posts")
        return postsRoute(req, res);
    }

    if (url === '/signup' || url === '/login') {
        console.log("99999")
        return authRoute(req, res);
    }

    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Route not found');
});

server.listen(3000, () => {
    console.log('Server running at http://localhost:3000/');
});
