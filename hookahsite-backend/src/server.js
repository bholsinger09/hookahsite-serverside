
const express = require('express');
const cors = require('cors');
//const mysql = require("mysql");
//this was the old way and did not support secure password 
mysql = require('mysql2');

// below is the heroku server url 
// mysql://b30364b552e522:377dacbf@us-cdbr-east-04.cleardb.com/heroku_797492669a9c426?reconnect=true
//         username       password    hostname                 database 
const app = express();

const port = process.env.PORT || 8000

/*
local connection 

const db =  mysql.createConnection({
    connectionaLimit: 50,
    user:'root',
    host: 'localhost',
    password:'Myspam#09',
    database:'sys',
    port: 3306
});

*/


const pool =  mysql.createPool({
    connectionaLimit: 500,
    waitForConnections: true,
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    password: process.env.DB_PASSWORD,
    database: process.env.DATABASE,
    port: 3306
});


app.use(cors());


app.use(express.urlencoded({extended: true}));
app.use(express.json());

//SQL connection test
pool.getConnection((err) => {
    if (err) console.error(err);
    console.log('MySQL Connection Established.');
  });
  
/* not used get request
app.get('/', (req,res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.send('Hello back');
}

);
*/


app.post('/' , (req,res) => {
    const {email, name, question} = req.body;
    res.header("Access-Control-Allow-Origin", "*");
    console.log(`Your Email is ${email} and your name is ${name} and your ${question}`);



//MYSQL updating table

pool.query("INSERT INTO customer_questions (name, email, question) VALUES (?,?,?)",
    [name, email, question], (err,res)=> {
        if (err) {
            console.log(err)
        }else {
            console.log('data sent')
        }
        
    }
    );


});
 


app.listen(port);
console.log(`server is listing on ${port}`);