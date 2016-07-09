"use strict";

var express    = require("express");
var http = require("http");
var bodyparser = require("body-parser");

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
    res.json(generateBoard()); 
});


app.post("/ai",function (req,res){
    console.log("POST Request to: /ai");
    //will receive an object containing "options" and "data"
    //then send "data" to path specified by "options" and return the response.
    
    //If options are invalid, don't error check here
    //  (we'll just error check whether this request comes back as valid)
    var options = req.body.options;
    var moveData = req.body.moveData;
    
    //console.log(req.body);

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
    
    //var newreq = http.request(options,callback);
    var newreq = http.request(options,callback);
    newreq.setHeader('Content-Type','application/json');
    newreq.write(JSON.stringify(moveData));
    
    newreq.end();
});// post to ai


app.listen(process.env.PORT || 3000, function () {
    console.log("Listening on port 3000");
});
