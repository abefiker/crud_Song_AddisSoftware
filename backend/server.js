const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config()
const connectDB = require('./config/db');
connectDB()
const port = process.env.PORT || 2323;
app.get('/',(req,res)=>{
    res.send('hello');
})
app.listen(port,()=>{
    console.log(`Listsening on port ${port}`);
})