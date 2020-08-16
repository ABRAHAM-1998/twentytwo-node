function token(req,res,next){
    const bearerHeader = req.headers["authorization"];
     if ( bearerHeader !== 'null' && typeof bearerHeader !== 'undefined'){
        
        const bearerToken = bearerHeader.split(" ");
         const tokenset = bearerToken[0];
         req.token = tokenset;
        //  console.log('middleware success',tokenset)
        
        next();
        
        }else {
        
        res.sendStatus(403)
        }

    return
}
module.exports = token;