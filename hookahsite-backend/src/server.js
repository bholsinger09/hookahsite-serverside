
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const timeout = require('connect-timeout');
const app = express();

//port
const port = process.env.PORT || 8000



//connection pool 
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
    [name, email, question], (err,response)=> {
        if (err) {
            console.log(err); 
            if (err.message) {
                res.send({ message: 'error', data: err.message});
            } else{
                res.send ({ message: 'error', data: 'generic error'})
                // specify a status for the response 
                /**
                 * res.status(500).send({ // object })
                 */
            }

        }else {
           
            console.log('data sent') //testing data sent in console
            res.send({ message: 'success', data: response}) 
        }

    }
);


});
 


app.listen(port);
console.log(`server is listing on ${port}`);