var go = require("../public/libraries/go.js");
var Game = require("../public/libraries/Game.js");
var numeric = require("numeric");
var ai = require("./ai.js");
var randomName = require("node-random-name");

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

//The actual AI object to be exported
var ANN = {};

ANN = function(){}
ANN.prototype = new ai.AI();
/*
ANN.prototype.constructor = function ANNCon(){
    var layer1 = numeric.random([81,81]);
    console.log("constructor was called");
    this.layer1 = layer1;
}*/
//Can't get constructor to work;
ANN.prototype.postConstructor = function(){
    this.gender = (Math.random() > 0.5? "male" : "female");
    this.firstName = randomName({random:Math.random,first:true,gender:this.gender});
    this.lastName = randomName({random:Math.random,last:true});
    this.patronymic = ""; //Son/Daughter of ..., for tracking ancestry somewhat
    this.title = "";      //i.e. "The first Gomega, he of many generations, etc.
    this.generationsSurvived = 0;
    
    var layers = [];
    for(var i = 0; i < 4; i++){
        layers[i] = balancedRandomMatrix(83,81);
    }
    this.layers = layers;
}
//Takes a (parsed) json object and updates ANN to match it.
ANN.prototype.restoreFromJSON = function(jsonObject){
    this.gender = jsonObject.gender;
    this.firstName = jsonObject.firstName;
    this.lastName = jsonObject.lastName;
    this.patronymic = jsonObject.patronymic;
    this.title = jsonObject.title;
    this.generationsSurvived = jsonObject.generationsSurvived;
    
    this.layers = jsonObject.layers;
}
ANN.prototype.getMove = function(data){
    //Do some error checking at some point in future
    
    //Deal with input
    var grid = data.board;
    var board = new go.Board(data.board);
    board.parse();
    var player = 1;
    if(data.last != null){
        player = (data.last.c == 1 ? 2: 1);
    }
    var otherPlayer = (player == 1 ? 2 : 1);
    
    //If opponent passed and you have high score, also pass
    //   (I didn't want to specify this, but the game never ends otherwise.)
    if(data.last != null && data.last.pass){
        board.score();
        if(board.scores[player - 1] > board.scores[otherPlayer - 1]){
            return new go.Move(0,0,player,true); //just pass, guaranteed to win
        }
    }
    
    
    
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
    
    var result = boardVec;
    
    for(var i = 0; i < this.layers.length; i++){
        //Add biases.
        result.push(1);
        result.push(-1);
        //multiply
        result = numeric.dot(result,this.layers[i]);
    }
    
    //Find highest value
    var highest = {value:-100000000,move:null} //value, move
    for (var i in result){
        //Convert i to x and y coords
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
    
    numeric.largeArray = Infinity;
    //console.log(numeric.prettyPrint(result));
    
    //Not going into production yet:
    if(highest.move != null){
        //console.log(JSON.stringify(highest.move));
        return highest.move;
    }
    
    return new go.Move(0,0,player,true); //just pass
}
ANN.prototype.fullName = function(){
    return this.firstName + " " + this.lastName + this.title + this.patronymic;
}

module.exports = ANN;




function balancedRandomMatrix(x,y){
    //creates a matrix with values ranging from -1 to 1
    var mat = numeric.random([x,y]);
    numeric.muleq(mat,2);
    numeric.subeq(mat,1);
    //console.log(numeric.prettyPrint(mat));
    return mat;
}
