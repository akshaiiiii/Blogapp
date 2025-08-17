console.log("hai i am in the db1 folder")
const mysql=require('mysql2')
const pool=mysql.createPool('mysql://root:root@localhost:3306/user_authentication');
const promisedpool=pool.promise()
module.exports=promisedpool
