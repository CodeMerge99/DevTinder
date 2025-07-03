const adminAuth =(req,res,next)=>{
    const token = "xyz";
    let isAdmin = token === "xyz";
    if(!isAdmin){
        res.send("Unauthorised Access");
    }else{
        next();
    }
}

module.exports ={
    adminAuth,
}