const {MongoClient}=require('mongodb');
require('dotenv').config();

let db;
async function ConnectDB() {
    if(db) return db;
    const uri = process.env.MONGO_URL
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

