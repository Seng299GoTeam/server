"use strict";
var numeric = require("numeric");
//Game stuff:
var go = require("../public/libraries/go.js");
var Game = require("../public/libraries/Game.js");
//Load AI stuff:
var ai = require("./ai.js");
var ANN = require("./ANN.js");

var game = new Game("ai",9); //Global game for convenience
//Should be fine as long as only one game runs at a time

//Conduct a game, passing in two AIs and optionally loggin the successive boards
function conductGame(p1,p2,logOutput){
    game = new Game("ai",9);
    var players = [null,p1,p2]; //So that player 1 is addressed 1 etc.
    
    console.log("Starting new game");
    
    doTurn(p1,game);
    
    function doTurn(){
        if(logOutput) {
            console.log(game.board.toString());
        }
        var aiPlayer = players[game.currentPlayer];
        
        var move = aiPlayer.getMove(game.getMoveRequest());
        console.log(JSON.stringify(move));
        game.attemptMove(move,doTurn,invalidMove,()=>console.log("Game ended"));
    }
    
    function invalidMove(err){
        if(logOutput){
            console.log(err + " - passing instead"); //log the error
        }
        
        var move = new go.Move(0,0,game.currentPlayer,true);
        game.attemptMove(move,doTurn,invalidMove,()=>console.log("Game ended"));
    }
}//conductGame

var player1 = new ANN();
player1.postConstructor();

conductGame(player1,player1,true);