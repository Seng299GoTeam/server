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
	this.name = "Nameless AI";
	
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

ai.ANN = function(){}
ai.ANN.prototype = new ai.AI();
//ai.ANN.prototype.constructor = ANN;
/*
function ANN(layer1){
    this.layer1 = layer1;
}*/
ai.ANN.prototype.getMove = function(data){
    //Do some error checking at some point in future
    
    //Deal with input
    var grid = data.board;
    var board = new go.Board(data.board);
    board.parse();
	var player = (data.last.c == 1 ? 2: 1);
    
    //Convert board to 1D vector/array in correct input format:
    var boardVec = new Array(81); //Apparently this syntax is not ideal, but whatevs.
    
    for (var i = 0; i < grid.length; i++){
        for (var j = 0; j < grid.length; j++){
            var cur = grid[i][j];
            if(cur != 0){
                cur = (cur == player? 1 : -1);  //AI sees own pieces as 1, enemy as -1
            }
            boardVec[9*j + i] = cur;
        }//for j
    }//for i
    
    var layer1 = numeric.random([81,81]);
    //console.log(layer1);
    
    //Perform the multiplication
    //(Test; in future, there'll be three or more levels)
    var result = numeric.dot(boardVec,layer1);
    
    //Find highest value
    var highest = {value:result[0],move:null} //value, move
    for (var i in result){
        //Convery i to x and y coords
        var x = i % grid.length;
        var y = Math.floor(i / grid.length); //
        
        //Look for highest-valued legal move:
        if(result[i] >= highest.value){
            var move = new go.Move(x,y,player,false);
            if(board.validateMove(move)[0]){
                highest.value = result[i];
                highest.move = move;
            }
        }//if higher than highest
    }//for i in result

    console.log(result);
    
    //Not going into production yet:
    if(highest.move != null){
        console.log(JSON.stringify(highest.move));
        return highest.move;
    }
    
    return new go.Move(0,0,player,true); //just pass
}


module.exports = ai;
