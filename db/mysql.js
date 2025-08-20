console.log("hai i am in the db1 folder")
const mysql=require('mysql2')
require('dotenv').config();
const url=process.env.MYSQL_URL
const pool=mysql.createPool(url);
const promisedpool=pool.promise()
module.exports=promisedpool

