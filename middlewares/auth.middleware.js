const jwt=require("jsonwebtoken")

const auth=async(req,res,next)=>{
    const token= req.headers.authorization?.split(" ")[1]
    if(token){
        try {
          const decode=jwt.verify(token,process.env.SECRATE_KEY)
        console.log(decode,token,process.env.SECRATE_KEY)
        if(decode){
            req.body.userId=decode.userId
            req.body.user=decode.userName
            next()
        }else{
            res.status(403).json({msg:"Invalid token: " + token})
        }  
        } catch (error) {
            res.status(403).json({msg:error.message})   
        }
        
    }else{
        res.status(403).json({msg:"enter token"})  
    }
}
module.exports=auth