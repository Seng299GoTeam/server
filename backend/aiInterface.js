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
//Takes data about the target AI server, plus a Game object to get moves for.
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
    
    this.getMove = function(game){
        //will get a move for the current player
        var postData = {
            "size": game.board.size,
            "board": game.board.grid,
            "last": game.previousMove
        }//postData
        
        //send {options,postdata} to server.
    }
}
