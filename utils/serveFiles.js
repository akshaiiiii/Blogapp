const fs = require('fs');

function serveFiles(res, filePath, contentType) {
    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404);
            return res.end('File not found');
        }
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(data);
    });
}

module.exports = serveFiles;
