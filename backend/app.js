const express = require("express")
require("dotenv").config();
const app = express();

app.use("/", (req,res) => {
    res.send("hello from server");
})
app.listen(3000, () => {
    console.log("server is running at:http://localhost:3000")
})