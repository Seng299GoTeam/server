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


app.post("/pass",function (req,res){
    console.log("POST Request to: /pass");
	
	//Passes every time
	var moronAI = new ai.AI();	
	var move = moronAI.getMove(req.body);
	
	res.send(JSON.stringify(move));
	
});// post to ai

app.post("/moron",function (req,res){
    console.log("POST Request to: /moron");
	
	//Plays in the first valid spot from top left
	var moronAI = new ai.basicAI();	
	var move = moronAI.getMove(req.body);
	
	res.send(JSON.stringify(move));
});// post to ai


app.listen(3001, function () {
    console.log("Listening on port 3001");
});
