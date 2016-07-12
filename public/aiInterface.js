//For use on client-side
//Assumes go and Game have been included.

if (typeof go === 'undefined'){
    go = require("../public/libraries/go.js");
}
if (typeof Game === 'undefined'){
    Game = require("../public/libraries/Game.js");
}


//Is used to send AI requests to server.js, which relays them to the actual AI server.
//Has one function, getMove, which returns a go move object.
//Takes data about the target AI server
var aiInterface = function aiInterface(host, path, port){
    /*
    //Example of valid options:
        host: 'roberts.seng.uvic.ca'
        path: '/ai/random'
        port: '30000'
    */
    this.options = {
        "host": host,
        "path": path,
        "port": port,
        "method": 'POST'
    }
    
    //takes a game, and a number (n) of times to try to get a move from server, before just returning a pass
    this.getMove = function(game,n){
        if(n == 0){
            //just pass
            return new go.Move(0,0,game.currentPlayer,true);
        }
        //will get a move for the current player
        var moveData = {
            "size": game.board.size,
            "board": game.board.grid,
            "last": game.previousMove
        }//postData
        
        var postData = JSON.stringify({"options":options,"moveData":moveData});
        
        //send {options,postdata} to server.
        
    }
}
