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
	board.score();
	
	if(data.last != null){
		var player = (data.last.c == 1 ? 2: 1);
		var otherPlayer = data.last.c;
	}else{
		var player = 1;
		var otherPlayer = 2;
	}
	
	var currentScore = board.scores[player-1]; 
	
	if(data.last == null){
		//if it's the first move, just play randomly.
		var x = Math.floor(Math.random()*data.board.size);
		var y = Math.floor(Math.random()*data.board.size);
		return new go.Move(x,y,player,false);
	}else if(data.last.pass){
        if(board.scores[player-1] > board.scores[otherPlayer-1]){
            return new go.Move(0,0,player,true); //pass, guaranteed win
        }
    }

	//Look only at moves next to existing pieces,
	//  choose one that maximizes weighted (own liberties)/(enemy liberties) ratio
	var currentBest = {};
	currentBest.ratio = -1;
	currentBest.score = currentScore;
	currentBest.ratioMove = null;
	currentBest.scoreMove = null;
	
	for(var i = 0; i < board.size; i++){
		for(var j = 0; j < board.size; j++){
			if(board.grid[i][j] == 0){
                //Find neighbours
				var sumofneighbours = 0;
                var neighbours = [-1,-1,-1,-1];//So edges
				if(i>0){
                    //var val = board.grid[i-1][j];
					//sumofneighbours += board.grid[i-1][j];
                    sumofneighbours += val;
                    neighbours[0] = board.grid[i-1][j];
				}
				if(j>0){
                    //var val = board.grid[i][j-1];
					//sumofneighbours += board.grid[i][j-1];
                    sumofneighbours += val;
                    neighbours[1] = val;
				}
				if(i<board.size - 1){
                    var val = board.grid[i+1][j];
					//sumofneighbours += board.grid[i+1][j];
                    sumofneighbours += val;
                    neighbours[2] = val;
				}
				if(j<board.size - 1){
                    var val = board.grid[i][j+1];
					//sumofneighbours += board.grid[i][j+1];
                    sumofneighbours += val;
                    neighbours[3] = val;
				}
                
                //make note if it's an eye and if it borders another piece
                
                var isEye = true;
                var isBordering = false;
                for(var k = 0; k < neighbours.length; k++){
                    if(neighbours[k] == 0){
                        isEye = false;
                    }else if(neighbours[k] > 0){
                        isBordering = true;
                    }
                }
				
                //Only play in places bordering other pieces
				if(isBordering){
					var move = new go.Move(i,j,player,false);
					
					var isValid = board.validateMove(move)[0];
					if(isValid){
						//rough check for ko rule, 
						//  though this will also rule out some valid moves.
						var resultBoard = board.play(move);
                        resultBoard.score();
						//if the previously played stone is captured, and no other stone is, assume the move violates ko rule
						if(resultBoard.grid[data.last.x][data.last.y] == 0 && resultBoard.scores[player-1] - currentScore < 3){
							isValid = false;
						}
					}
					
					if(isValid){
						//consider as a possible move
						
						//Check for highest scoring move and move with highest liberty ratio
						//Score:
						var resultBoard = board.play(move);
						resultBoard.score();
						var myScore = resultBoard.scores[player-1];
						if(myScore > currentBest.score){
							currentBest.score = myScore;
							currentBest.scoreMove = new go.Move(i,j,player,false);
						}
						
						//Liberty ratio sort of thing (lots of fudging)
						var liberties = [0,0,0]; // [0,p1,p2]
                        var totalStones = [0,0,0];
						
						for(var k in resultBoard.armies){
							var curArmy = resultBoard.armies[k];
							var c = (curArmy.colour == "black"? 1 : 2);
                            var stones = Math.min(curArmy.countStones(),3)//Small incentive to play in groups
							liberties[c] += stones * curArmy.countLiberties();
                            totalStones[c] += curArmy.countStones();
                           // totalStones[c] += stones;
						}
						
						var ownLib = liberties[player]/(totalStones[otherPlayer] != 0 ? totalStones[otherPlayer] : 1);
						var enemyLib = liberties[otherPlayer]/(totalStones[player] != 0 ? totalStones[player] : 1);
						
						var ratio = 0;
						//avoid divide-by-zero
						if(enemyLib > 0){
							ratio = (ownLib*1.0)/(enemyLib*1.2);
                            //if ratio is good AND the location is not an eye:
							if(ratio > currentBest.ratio && !isEye){
								currentBest.ratio = ratio;
								currentBest.ratioMove = new go.Move(i,j,player,false);
							}
						}
					}//if valid
				}//if has neighbours		
			}//if empty
		}//for j
	}//for i
	
	//check whether score difference was high enough to matter
    
	if(currentBest.score - currentScore > 1 && currentBest.scoreMove != null){
		return currentBest.scoreMove; //Perform the high-scoring move (i.e. capture)
	}
	
	//otherwise, perfom a move that maximizes liberties
	if(currentBest.ratioMove != null){
		return currentBest.ratioMove;
	}
	
	//Emergency fallback: just pass
    return new go.Move(0,0,player,true); //just pass
}//okAI.getMove


module.exports = ai;
