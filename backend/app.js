const express = require("express")
require("dotenv").config();
const app = express();;

app.use("/", (req,res) => {

    res.send("hello from server, this project was made by both Abhinav and Nafih. We will never give you up, we will never let you down :)");

})
app.listen(3000, () => {
    
    console.log("server is running at:http://localhost:3000")
})