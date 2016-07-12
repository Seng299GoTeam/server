"use strict";

var express    = require("express");
var http = require("http");
var bodyparser = require("body-parser");

//Load from ai.js
var ai = require("./ai.js");

var app = express();

//body parser for parsing requests
app.use(bodyparser.json());

// server static files from the public/ directory.
app.use(express.static('public'));





/**
 * Handle a request for task data.
 */
app.get("/data", function (req, res) {
    console.log("GET Request to: /data");
});


app.post("/moron",function (req,res){
    console.log("POST Request to: /moron");
	
	var moronAI = new ai.basicAI();	
	//moronAI.test();
	var move = moronAI.getMove(req.body);
	
	//always pass
	res.send(JSON.stringify(move));
	
});// post to ai


app.listen(3001, function () {
    console.log("Listening on port 3001");
});
