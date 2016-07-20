//Require dependency, but not if already defined
// (this makes it work in browser as well as in a node context).
if (typeof go === 'undefined'){
    go = require("./go.js");
}

//create a new game, specifying type of game & size of board
var Game = function Game(type, size){
    this.gameType = type;   //"hotseat", "network", or "ai"
    this.currentPlayer = 1; //1 for black, 2 for white
    this.previousMove = null;   //the previous move
    
    this.gameID = 0;        //Only for network games
    this.whichPlayer = 1;   //For network & AI games - which player is on this end?
    
    this.board = go.emptyBoard(size);
    this.previousBoard = null;
    
    
    //Attempt Move attempts to make a move:
    //  Callback is called if the move is valid
    //  Errback is called if the move is invalid or something else goes wrong.
    //  Errback should take a string containing the error message
    //  Winback (optional) is called if a player wins.
    this.attemptMove = function(move, callback, errback,winback){
        
        if(move.colour != this.currentPlayer){
            errback("Player attempted to play out of order");
            return;
        }
    
        var result = this.board.validateMove(move);
        
        if(this.previousBoard){
            result = this.board.validateMove(move,this.previousBoard.grid);
        }
        
        if(!result[0]){
            errback(result[1]); // result[1] contains informative error message
        }else if (move.pass && (this.previousMove != null && this.previousMove.pass)){
            if(winback){
                winback();
            }else{
                this.endGame(); //Default; should not be used in practice.
            }
        }else{
            this.previousBoard = this.board;
            this.previousMove = move;
            
            this.board = this.board.play(move);
            this.changeCurrentTurn();
            callback();
        }
    }//attemptMove
    
    this.endGame = function(){
        //Not sure precisely what this'll do.
        //For now, just console.log a message.
        console.log("Game has ended");
        var scores = this.board.score();
        console.log("Black's score: " + scores[0] + "\nWhite's Score: " + scores[1]);
        console.log("Winner is: " + (scores[0] > scores[1]?"Black":"White"));
    }
    
    //Convert to a specific JSON format for use in network games.
    //Converts only some relevant information.
    this.toJSON = function(){
        var jsonObj = {
            "board": this.board.grid,
            "previousBoard": (this.previousBoard?this.previousBoard.grid:-1),
            "previousMove": this.previousMove,
            "currentPlayer": this.currentPlayer
        };
		
        return JSON.stringify(jsonObj);
    }
    
    //Update from a database record, overwriting only certain information.
    //Returns true if successful, false otherwise.
    this.updateFromJSON = function(jsonString){
        var data = {};
        try{
            data = JSON.parse(jsonString);
        }catch(err){
            //console.log("Invalid json game data");
            return false;
        }
        
        //Should probably add more error checking in the future
        this.board = new go.Board(data["board"]);
        this.board.parse();
        this.previousMove = data["previousMove"];
        this.currentPlayer = data["currentPlayer"];
        if(data["previousBoard"] == -1){
            this.previousBoard = null;
        }else{
            this.previousBoard = new go.Board(data["previousBoard"]);
            this.previousBoard.parse();
        }
        
        return true;
    }
    
    
    //Automatically generate the appropriate data for a request to the ai:
    this.getMoveRequest = function(){
        var data = {
            size: this.board.size,
            board: this.board.grid,
            last: this.previousMove
        }
        
        return data;
    }//getMoveRequest
    
    
    //switch whose turn it is
    this.changeCurrentTurn = function(){
        this.currentPlayer = (this.currentPlayer == 1? 2 : 1);
    }//changeTurn
}//Game


module.exports = Game;

