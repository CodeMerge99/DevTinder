const express = require("express");
const app = express();


app.use((req,res)=>{
    res.send("Hey there this is an active server on port no:7777");
})

app.listen(7777,()=>{
    console.log("Server is listening on Port No:7777");
})