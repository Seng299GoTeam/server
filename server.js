"use strict";

var express    = require("express");
var http = require("http");
var bodyparser = require("body-parser");
var mongo = require("./MongoDB");

var app = express();

//body parser for parsing requests
app.use(bodyparser.json());

// server static files from the public/ directory.
app.use(express.static('public'));


// Create database
var db = new mongo(null, null, "testing"); 

db.connect(function(err) {
	
});

/**
 * Handle a request for task data.
 */
app.get("/data", function (req, res) {
    console.log("GET Request to: /data");
    res.json(generateBoard()); 
});

app.get("/checkGame", function(req, res) {
	console.log("GET Request to: /checkGame");
	// Will return the current player of a game
	// given the game id
	
	var gameid = req.body.gameData._id;
	
	db.getGamePlayer(gameid, function(player, err) {
		if(!err)
			res.send(player);
		else {
			res.send(err);
		}
	});
});

app.get("/getGame", function(req, res) {
	console.log("GET Request to: /getGame");
	// Will return the game associated with a game id
	// as a JSON object or will return an error message
	
	var gameid = req.body.gameData.id;
	
	
	db.getGame(gameid, function(game, err) {
		if(err)
			res.send(JSON.stringify(game));
		else {
			res.send(err);
		}
	});
	
	
});

app.get("/createGame", function(req, res) {
	console.log("GET Request to: /createGame");
	// Will create a game given a game object and will return
	// an id (or an error)
	
	var game = JSON.parse(req.body.gameData);
	
	db.addGame(game, function(id, err) {
		if(err) {
			res.send(err);
		} else {
			res.send(id);
		}
	});
	
});


app.post("/updateGame", function(req, res) {
	console.log("POST Request to: /updateGame");
	// will update the game given a game object and will return
	// either "Success" or an error message
	
	var updatedGame = JSON.parse(req.body.gameData);
	
	db.updateGame(game, function(err) {
		if(err) {
			res.send(err);
		} else {
			res.send("Success");
		}
	});
});

app.post("/endGame", function(req, res) {
	console.log("POST Request to: /endGame");
	// will end the game given an id and will return either 
	// "Success" or an error message
	
	var id = req.body.gameData._id;
	
	deleteGame(id, function(err) {
		if(err)
			res.send(err);
		else
			res.send("Success");
	});
});

app.post("/ai",function (req,res){
    console.log("POST Request to: /ai");
    //will receive an object containing "options" and "data"
    //then send "data" to path specified by "options" and return the response.
    
    //If options are invalid, don't error check here
    //  (we'll just error check whether this request comes back as valid)
    var options = req.body.options;
    var moveData = req.body.moveData;

    //in case data comes back in multiple chunks
    //   (it shouldn't, though, so this is kinda overkill)
    var callback = function(response){
        var str = '';
        response.on('data', function(chunk){
            str += chunk.toString();
        });
        
        response.on('end', function(){
            //TODO: Put some error echecking here, since response may be "Invalid request format"
            console.log(str);
            res.send(str);
            //res.json(newreq.body);
        });
    }//callback

    var newreq = http.request(options,callback);
    newreq.setHeader('Content-Type','application/json');
    newreq.write(JSON.stringify(moveData));
    
    newreq.end();
});// post to ai


app.listen(process.env.PORT || 3000, function () {
    console.log("Listening on port 3000");
});
