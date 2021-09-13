
const express = require('express');
const cors = require('cors');
//const mysql = require("mysql");
//this was the old way and did not support secure password 
mysql = require('mysql2');

const app = express();

const db =  mysql.createConnection({
    connectionaLimit: 50,
    user:'root',
    host: 'localhost',
    password:'Myspam#09',
    database:'sys',
    port: 3306
});

app.use(cors());


app.use(express.urlencoded({extended: true}));
app.use(express.json());

//SQL connection test
db.connect((err) => {
    if (err) console.error(err);
    console.log('MySQL Connection Established.');
  });
  

app.get('/', (req,res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.send('Hello back');
}

);

app.post('/' , (req,res) => {
    const {email, name, question} = req.body;
    res.header("Access-Control-Allow-Origin", "*");
    console.log(`Your Email is ${email} and your name is ${name} and your ${question}`);



//MYSQL updating table

db.query("INSERT INTO Customer_Questions (CustName, CustEmail, CustQuestion) VALUES (?,?,?)",
    [name, email, question], (err,result)=> {
        if (err) {
            console.log(err)
        }else {
            res.send('data sent')
        }
        db.end();
    }
    );


});
 


app.listen(8000, ()=> console.log(' Listening on port 8000'));