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


ai.okAI = function(){}
ai.okAI.prototype = new ai.AI();
ai.okAI.prototype.getMove = function(data){
	//no error checking yet
	var board = new go.Board(data.board);
	board.parse();
	
	if(data.last != null){
		var player = (data.last.c == 1 ? 2: 1);
		var otherPlayer = data.last.c;
	}else{
		var player = 1;
		var otherPlayer = 2;
	}
	
	if(data.last = null){
		//if it's the first move, just play randomly.
		var x = Math.floor(Math.random()*data.board.size);
		var y = Math.floor(Math.random()*data.board.size);
		return new go.Move(x,y,player,false);
	}

	//Look only at moves next to existing pieces,
	//  choose one that maximizes weighted (own liberties)/(enemy liberties) ratio
	var currentBest = {};
	currentBest.ratio = -1;
	currentBest.move = null;
	for(var i = 0; i < board.size; i++){
		for(var j = 0; j < board.size; j++){
			if(board.grid[i][j] == 0){
				var sumofneighbours = 0;
				if(i>0){
					sumofneighbours += board.grid[i-1][j];
				}
				if(j>0){
					sumofneighbours += board.grid[i][j-1];
				}
				if(i<board.size - 1){
					sumofneighbours += board.grid[i+1][j];
				}
				if(j<board.size - 1){
					sumofneighbours += board.grid[i][j+1];
				}
				
				if(sumofneighbours > 0){
					var move = new go.Move(i,j,player,false);
					if(board.validateMove(move)[0]){
						//consider as a possible move
						//calculate ratio
						var liberties = [0,0,0]; // [0,p1,p2]
						
						var resultBoard = board.play(move);
						for(var k in resultBoard.armies){
							var curArmy = resultBoard.armies[k];
							var c = (curArmy.colour == "black"? 1 : 2);
							console.log(c);
							liberties[c] += curArmy.countLiberties();
						}
						
						var ownLiberties = liberties[player];
						var enemyLiberties = liberties[otherPlayer];
						
						var ratio = 0;
						//avoid divide-by-zero
						if(enemyLiberties > 0){
							ratio = (ownLiberties*1.0)/(enemyLiberties*1.2);
							console.log("Considering " + i + ", " + j);
							console.log("ratio: " + ratio);
							if(ratio > currentBest.ratio){
								currentBest.ratio = ratio;
								currentBest.move = new go.Move(i,j,player,false);
							}
						}
					}//if valid
				}//if has neighbours		
			}//if empty
		}//for j
	}//for i
	
	if(currentBest.move != null){
		return currentBest.move;
	}
	
	//Emergency fallback: just pass
    return new go.Move(0,0,player,true); //just pass
}//okAI.getMove


module.exports = ai;
