const express=require("express");
const { userrouter } = require("./routes/userrouter");
const { connection } = require("./db");
const { postrouter } = require("./routes/postrouter");
const cors=require("cors")
const app=express()
app.use(express.json())
app.use(cors())
require("dotenv").config()
app.use("/users",userrouter)
app.use("/posts",postrouter)
app.listen(process.env.PORT,async()=>{
    try {
        await connection
        console.log("server connected")
    } catch (error) {
      console.log(error)  
    }
    console.log("listening")
})