const jwt = require("jsonwebtoken");
const User = require("../models/user");

//userAuth middleware//
const userAuth = async(req,res,next) =>{
     try {
        //read toke from the cookies//
     const {token} = req.cookies;
     //if token is missing or not valid//
     if(!token){
        throw new Error("Token is Not valid");
     }
     //verify the token//
     const decodedobj = await jwt.verify(token,"SECRET_KEY");

     const{_id } = decodedobj;

     const user = await User.findbyId(_id);
     if(!user){
        throw new Error('User Not Found');
     }
     next();
     } catch(error) {
         res.status(400).send("Error +",error.message);
     }
}

module.exports ={
    userAuth
}