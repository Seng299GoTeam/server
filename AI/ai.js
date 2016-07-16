var go = require("../public/libraries/go.js");
var Game = require("../public/libraries/Game.js");
var numeric = require("numeric");

/*Note to self: this is expected format of the input
{
    "size" : number,
    "board" : [ [...], ...],
    "last" : {
        "x" : number,
        "y" : number,
        "c" : number,
        "pass" : boolean
    }
}
*/

//For module.exports
var ai = {};



//Classes may look different from those used elsewhere, since here I actually want inheritance
//   (Sorry about that)

//"Abstract" class
ai.AI = function AI(){
	
	//Take the input from the request, return a move.
	this.getMove = function(data){
		var player = (data.last.c == 1 ? 2: 1);
		return new go.Move(0,0,player,true); //just pass
	}
	
	this.test = function(){
		console.log("old log");
	}
}

ai.basicAI = function(){}
ai.basicAI.prototype = new ai.AI();
ai.basicAI.prototype.getMove = function(data){
	//no error checking yet
	var board = new go.Board(data.board);
	board.parse();
	
	var player = (data.last.c == 1 ? 2: 1);
	
	var validMoves = [];

	for(var i in board.grid){
		for(var j in board.grid){
			var move = new go.Move(i,j,player,false);
			if(board.validateMove(move)[0]){
				//console.log("DEBUG: Valid move: " + JSON.stringify(move));
                return move;
			}
		}//for j
	}//for i
	
    return new go.Move(0,0,player,true); //just pass
	
	
}//basicAI.getMove


module.exports = ai;
