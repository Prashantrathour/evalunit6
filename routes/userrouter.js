const express = require("express");
const { userModel } = require("../model/usermodel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { blacklistmodel } = require("../model/blacklistmodel");
const { auth } = require("../middleware/auth");
const userrouter = express.Router();

userrouter.post("/register", async (req, res) => {
  const { name, email, gender, password, age, city, is_married } = req.body;
  try {
    bcrypt.hash(password,5,async(err,hash)=>{
        if(err){
            res.status(404).json({error:err});
            return
        } else{
            const userdata={ name, email, gender, password:hash, age, city, is_married }
            const user=new userModel(userdata)
            await user.save()
            res.json({success:"user registred"})
        }
    })
  } catch (error) {
    res.status(404).send({error: error})
  }
});
userrouter.post("/login", async (req, res) => {
  const {email,password}=req.body
  try {
    const user=await userModel.findOne({email: email})
    if(user){
        bcrypt.compare(password, user.password,async(err,result)=>{
            if(err){
                res.status(404).json({error:err.message});
            }else if(result){
                const token=jwt.sign({userId:user._id,userName:user.name},process.env.SECRATE_KEY,{expiresIn:"7 days"})
                res.json({token:token})
            }else{
                res.status(404).json({error:"somthing wrong in credetials"});     
            }
        })
    }else{
        res.status(404).json({error:"user not found"});   
    }
  } catch (error) {
    res.status(404).json({error});
  }
});
userrouter.get("/logout",auth, async (req, res) => {
  const token=req.headers.authorization?.split(" ")[1]
  if(token){
    try {
        const black=await blacklistmodel.findById("6486f21802de13fcb055ef51")
        console.log(black)
        black.token.push(token)
        await blacklistmodel.findByIdAndUpdate("6486f21802de13fcb055ef51",{token:black.token})
        res.json("loged out")
    } catch (error) {
        res.status(404).json({error});   
    }
  }else{
    res.status(404).json({error:"Invalid token"})
  }
});

module.exports = { userrouter };
