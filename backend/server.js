const express = require("express");
const app = express();
const PORT = 3000;

app.get("/", (req, res) => {
    res.send("Welcome to NutriAI Backend");
});

app.listen(PORT, () => {
    console.log(`NutriAI server running on port ${PORT}`);
});
