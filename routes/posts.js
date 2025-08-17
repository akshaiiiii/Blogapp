
const url = require('url');
const querystring = require('querystring');
const { getPosts, createPost, updatePost, deletePost } = require('../controllers/postController');
module.exports=async(req,res)=>{
    const {method}=req
    const parsedUrl = url.parse(req.url, true);
    const pathParts = parsedUrl.pathname.split('/').filter(Boolean);
    if (method==='GET'&& pathParts[0]==='api'&&pathParts[1]==='posts'){
        return getPosts(req,res)
    }
    if (method === 'POST' && pathParts[0] === 'api' && pathParts[1] === 'posts') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            const contentType = req.headers['content-type'];
            const data = contentType.includes('json') ? JSON.parse(body) : querystring.parse(body);
            createPost(req, res, data);
        });
        return;
    }
    if (method === 'PUT' && pathParts[0] === 'api' && pathParts[1] === 'posts') {
        const id = pathParts[2];
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            const updatedData = JSON.parse(body);
            updatePost(req, res, id, updatedData);
        });
        return;
    }
    if (method === 'DELETE' && pathParts[0] === 'api' && pathParts[1] === 'posts') {
        const id = pathParts[2];
        return deletePost(req, res, id);
    }
}