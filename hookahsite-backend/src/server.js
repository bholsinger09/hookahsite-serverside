
const express = require('express');
const cors = require('cors');
//const mysql = require("mysql");
//this was the old way and did not support secure password 
const mysql = require('mysql2');
const timeout = require('connect-timeout');


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
    connectionaLimit: 60000,
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


app.post('/' ,timeout('6s'), async (req,res) => {
    const {email, name, question} = await req.body;
    res.header("Access-Control-Allow-Origin", "*");
    console.log(`Your Email is ${email} and your name is ${name} and your ${question}`);



//MYSQL updating table

pool.query("INSERT INTO customer_questions (name, email, question) VALUES (?,?,?)",
    [name, email, question], (err, response)=> {
        /**
         *  This is the callback function for the query. By default every nodejs callback is function that
         *  has two params (at least) in order 1st param err that indicates if an error ocurred, second
         *  param is the response data from the function that you call (in this case query.pool). 
         *  I changed the name to response so it does not clash with express's res in the above function.
         * 
         *  As you know a server endpoint like the POST route (app.post above this function) receives two things
         *  req and res, req is the request with headers, params, body, etc that the client sent
         *  and res is the response body that you have to send back to the client, here you are never 
         *  sending it back to the client so from the clients perspective (React or postman) it effectively
         *  times out. Below this comment I will place some standard code on how to send responses.
         *  
         *  Note on callbacks: Callbacks are sort of outdated, and only used when needed; promises and 
         *  async/await are equivalent to callbacks with less drawbacks (search for 'callback hell')
         *  Some functions like pool.query may or may not have overloads that accept callback, promises and
         *  async/await, it really depends on the function and  you would have to check the docs for each specific one.
         *  When presented with the opportunity to use promise or async/await over callback always do it.
         * 
         *  
         * */
        
        if (err) {
            console.log(err); // this just prints the error on the server console.
            if (err.message) {
                res.send({ message: 'error', data: err.message});
            } else{
                res.send ({ message: 'error', data: 'generic error'})
                // you can also specify a status for the response like this
                /**
                 * res.status(500).send({ // your object })
                 */
            }
            
        }else {
            console.log('data sent') // this just prints data sent on the server console.
            res.send({ message: 'success', data: response}) 
        }
        
    }
    );


});
 


app.listen(port);
console.log(`server is listing on ${port}`);