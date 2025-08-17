const {MongoClient}=require('mongodb');

let db;
async function ConnectDB() {
    if(db) return db;
    const uri = 'mongodb://localhost:27017';
    const client = new MongoClient(uri);
    try{
        await client.connect();
        db= client.db('Blogapp');
        console.log('connected!!!!');
        return db
    }
    catch {
        console.error('MongoDB connection error:',err);
        process.exit(1);
    };
    
}

module.exports={ConnectDB}

