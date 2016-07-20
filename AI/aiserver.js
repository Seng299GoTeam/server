"use strict";

var express    = require("express");
var http = require("http");
var bodyparser = require("body-parser");
var numeric = require("numeric");

//Load from ai.js
var ai = require("./ai.js");
var ANN = require("./ANN.js");
var AIwrangler = require("./evolution.js");

var app = express();

//body parser for parsing requests
app.use(bodyparser.json());

// server static files from the public/ directory.
app.use(express.static('public'));

//Load up whatever the current best ANN AI is.
var mainAI = new ANN();
mainAI.postConstructor;
AIwrangler.poolFromFile("mainGenePool.json",function(pool){
    mainAI = pool[0];
});




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

app.post("/untrained",function (req,res){
    console.log("POST Request to: /untrained");
	
    var untrainedAI = new ANN();
    untrainedAI.postConstructor();
	var move = untrainedAI.getMove(req.body);
	
	res.send(JSON.stringify(move));
});// post to ai

app.post("/neuralnetwork",function (req,res){
    console.log("POST Request to: /neuralnetwork");
	
	var move = mainAI.getMove(req.body);
	
	res.send(JSON.stringify(move));
});// post to ai

app.post("/okai",function (req,res){
    console.log("POST Request to: /okai");
	
	var okai = new ai.okAI();
	var move = okai.getMove(req.body);
	
	res.send(JSON.stringify(move));
});// post to ai


app.listen(3001, function () {
    console.log("Listening on port 3001");
});
