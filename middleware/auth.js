const jwt=require('jsonwebtoken')

auth=(req,res,next)=>{
    const token =req.header('x-auth-token');
    console.log(token,"token here=")
    if(!token) return res.status(401).send("Access denied")

    try{
        const decoded = jwt.verify(token,"keyPrivateJwt")
        req.user=decoded;
        next();
    }
    catch(ex){
        res.status(400).send("invalid token");
    }
}

module.exports =auth;