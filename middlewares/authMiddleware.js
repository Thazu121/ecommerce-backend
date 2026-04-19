import jwt from "jsonwebtoken"
export const authMiddleware=(req,res,next)=>{
const authHeader=req.headers.authorization
if(!authHeader){
    return res.status(401).json({message:"Unauthorized User"})
}
const token = authHeader.split('')[1];
jwt.verify(token,process.env.JWT_SECRET,(err,user)=>{
       if(err){
            return res.status(403).json({message:"forbidden"})

    }
    console.log("user from token",user);
    
    req.user=user
    next()
})
}
