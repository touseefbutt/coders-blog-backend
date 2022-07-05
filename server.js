//<====== Importing and configuring Express ======>
const express = require('express');
const app = express();
//<====== Accessing Body Parser ======>
const bodyParser = require('body-parser')
//<====== Importing and configuring dotenv for Port ======>
require('dotenv').config();
//<====== Defining PORT for Testing ======>
const port = process.env.PORT || 8080
//<====== Accessing db File from Config folder ======>
const connect = require('./config/db')
//<====== Accessing Routes  ======>
const router = require('./routes/userRoute')
//Mongo DB Connection
connect();


//<====== Calling Middlewares ======>
app.use(bodyParser.json())
app.use('/', router)

//<====== ROUTE TO TEST APP ========>
// app.get('/', (req,res)=>{
//         res.send("Welcome to coders Blog")
// })



//<====== CALLING  PORT ========>
app.listen(port, ()=> {
console.log(`Your app is running at Port: ${port}`)  
})