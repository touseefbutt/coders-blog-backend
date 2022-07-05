//<====== Importing Mongoose DB ======>
const mongoose = require('mongoose')
//<====== Importing and configuring dotenv for DB ======>
require('dotenv').config();

//<====== Database connection ======> 
const connect  = async () =>{
    try{
        const response = await mongoose.connect(process.env.MONGO_URI, {useUnifiedTopology: true, useNewUrlParser: true})
        console.log(`DB Successfully connected!`)
    }catch(e){
        console.log(e);
    }
}

module.exports = connect;
