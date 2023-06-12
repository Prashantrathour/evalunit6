const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config()
const { blacklistmodel } = require("../model/blacklistmodel");
const auth=async(req,res,next)=>{
    const tokent=req.headers.authorization?.split(" ")[1]
    if(tokent){
        const blacklist=await blacklistmodel.findById("6486f21802de13fcb055ef51")
        console.log(blacklist)
        if(!blacklist.token.includes(tokent)){
            try {
               const decode=jwt.verify(tokent,process.env.SECRATE_KEY) 
               if(decode){
                req.body.userId=decode.userId
                req.body.userName=decode.userName
                next()
               }else{
                res.status(404).json({error:"invalid token"})
               }
            } catch (error) {
                res.status(404).json({message:error})  
            }

        }else{
            res.status(404).json({message:"please login again"})
        }
    }
}

module.exports={auth}