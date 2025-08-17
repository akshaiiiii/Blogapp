//setting up server
const http=require('http') ;
const path=require('path');
const fs=require('fs');
const { ConnectDB, getDB } = require('./db');
const querystring = require('querystring');
const { ObjectId } = require('mongodb');
const pool=require('./db1')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const SECRET_KEY="this is my secret key"
const server=http.createServer((req, res) =>{
    const { method,url }=req;
    if (method==='GET'){
        if(url==='/'){
            return servefiles(res,path.join(__dirname,'public','login.html'),'text/html');

        }
        if(url==='/index.html'){
            return servefiles(res,path.join(__dirname,'public','index.html'),'text/html');
        }
        
        if(url.startsWith('/public/')){
            const url_without_query=url.split('?')[0]
            const ext=path.extname(url_without_query);
            const contentTypeMap = {
                '.css': 'text/css',
                '.js': 'application/javascript',
                '.html': 'text/html'
            };
            const contentType=contentTypeMap[ext] || 'text/plain';
            console.log(path.join(__dirname,url));
            return servefiles(res,path.join(__dirname,url_without_query),contentType);
        }
        if (url==='/api/posts'){
            (async ()=>{
            try{
            const db=await ConnectDB();
            
            const posts=await db.collection('blogs').find().toArray();
            res.writeHead(200, {
            'Content-Type': 'application/json',
            });
            res.end(JSON.stringify(posts));
           }catch{
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Failed to fetch posts');
           }
            }
        )();   
        return;
        }
        
    }
    if(method==='POST' && url.startsWith('/api/posts')){
            const contentType = req.headers['content-type'];
            let body='';
            req.on('data',(chunk)=>body+=chunk.toString());
            req.on('end',async ()=>{
                try{
                    if (contentType.includes('application/json')) {
                    
                    data = JSON.parse(body);
                    } else if (contentType.includes('application/x-www-form-urlencoded')) {
                    
                    data = querystring.parse(body);
                    } else {
                    res.writeHead(400, { 'Content-Type': 'text/plain' });
                    return res.end('Unsupported content type');
                }
                    const db=await ConnectDB();
                    const result=await db.collection('blogs').insertOne(data);
                    console.log(data)
                    console.log("haiiii")
                    res.writeHead(200,{'Content-Type':'application/json'});
                    res.end(JSON.stringify({'message':'susessful post','id':result.insertedId}));
                }catch(err){
                    console.error('Error saving post:', err);
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end('Failed to save post');
                }
            })
            return;
    }
    if(method==='PUT' && url.startsWith('/api/posts/')){
        
        let body='';
        req.on('data',(chunk)=>body+=chunk.toString());
        req.on('end',async()=>{
            try{
                const id=url.split('/').pop()
                console.log(id)
                const contentType = req.headers['content-type'];
                let updateddata;
                if(contentType.includes('application/json')){
                    updateddata=JSON.parse(body)
                }
                else{
                    res.writeHead(400, { 'Content-Type': 'text/plain' });
                    return res.end('unsupported content type');
                }
                db=await ConnectDB()
                const result=await db.collection('blogs').updateOne(
                    {_id:new ObjectId(id)},
                    {$set:updateddata});
                if (result.matchedCount === 0) {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                return res.end('Post not found');
            }
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Post updated successfully',result }));
            }catch(err){
                console.error('Error updating post:', err);
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Failed to update post');
            }
            
        })
        return;

    }
    if(method==='DELETE' && url.startsWith('/api/posts/')){
        (async()=>
        {
            const id=url.split('/').pop();
            console.log(id)
            const db= await ConnectDB();
            try{
                const result=await db.collection('blogs').deleteOne({_id:new ObjectId(id)});
                if (result.matchedCount === 0) {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                return res.end('Post not found');
                }
                res.writeHead(200,{'Content-Type':'application/json'})
                res.end(JSON.stringify({message:'post deteted sucess',result}))
            }
            catch(err){
                console.error("error in deleting the post",err)
                res.writeHead(200,{'Content-Type':'text/plain'})
                res.end('cant detete the post')

            }   
    }
    )();
    return
    }
    if(method==='POST' && url==='/signup'){
        let body='';
        req.on('data',chunk=>body+=chunk.toString());
        req.on('end',async()=>{
            try{
                const data= JSON.parse(body)
                const {username,password}=data
                console.log(data)
                if(!username || !password){
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Username and password required' }));
                    return;
                }
                const hashed_password = await bcrypt.hash(password,10)
                const sql='INSERT INTO Users(username,password,role)  VALUES(?,?,?)'
                const values=[username,hashed_password,'user']
                const [result]=await pool.execute(sql,values)
                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'User created', userId: result.insertId }));

            }catch(err){
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Invalid JSON or server error' }));
            }
        })
        return
    
    }
    if(method==='POST' && url==='/login'){
        let body='';
        req.on('data',chunk=>body+=chunk.toString());
        req.on('end',async()=>{
            try{
            const data= JSON.parse(body)
            const {username,password}=data
            if(!username || !password){
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Username and password required' }));
                    return;
                }
            const sql='SELECT username,password,role FROM users WHERE username=?'
            const values=[username]
            const [result]=await pool.execute(sql,values)
            if (result.length===0){
                res.writeHead(401, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Invalid username or password' }));
                return;
            }
            const user=result[0]
            const match=await bcrypt.compare(password,user.password)
            if(!match){
                res.writeHead(401, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Invalid  password' }));
                return;
            }
            const token=jwt.sign(
                { username: user.username, role: user.role },
                SECRET_KEY,
                { expiresIn: '1h' }
            );

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Login successful', token }));
            
            }catch(err){
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error:"error in signing in" }));

            }
        })
        return

    }
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Route not found');


});
server.listen(3000, () => {
  console.log('Server running at http://localhost:3000/');
});
function servefiles(res,filepath,type){
    fs.readFile(filepath,(err, data) => {
        if (err){
        res.writeHead(404);
        res.end("file not found");
    return;
  };
  res.writeHead(200,{ 'Content-Type': type});
  res.end(data);
});
}


