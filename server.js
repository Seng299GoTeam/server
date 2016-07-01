"use strict";

var express    = require("express");

var app = express();

// server static files from the public/ directory.
app.use(express.static('public'));





/**
 * Handle a request for task data.
 */
app.get("/data", function (req, res) {
    console.log("GET Request to: /data");
    res.json(generateBoard()); 
});

app.listen(process.env.PORT || 3000, function () {
    console.log("Listening on port 3000");
});
