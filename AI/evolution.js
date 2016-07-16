"use strict";
var numeric = require("numeric");
//Game stuff:
var go = require("../public/libraries/go.js");
var Game = require("../public/libraries/Game.js");
var fs = require("fs");
//Load AI stuff:
var ai = require("./ai.js");
var ANN = require("./ANN.js");

//Conduct a game, passing in two AIs and a callback, and optionally logging the successive boards
//   Callback should take a Board object, for information about the game result
function conductGame(p1,p2,callback,logOutput){
    var game = new Game("ai",9);
    var players = [null,p1,p2]; //So that player 1 is addressed 1 etc.
    var counter = 0;
    
    if(logOutput){
        console.log("Starting new game");
    }
    
    doTurn(p1,game);
    
    function doTurn(){
        counter += 1;
        if(counter > 400){
            //Avoid infinite loops, which apparently happen sometimes.
            callback(game.board);
            return;
        }
        
        
        if(logOutput) {
            console.log(game.board.toString());
        }
        var aiPlayer = players[game.currentPlayer];
        
        var move = aiPlayer.getMove(game.getMoveRequest());
        if(logOutput){
            console.log(JSON.stringify(move));
        }
        game.attemptMove(move,doTurn,invalidMove,gameEnd);
    }
    
    function invalidMove(err){
        if(logOutput){
            console.log(err + " - passing instead"); //log the error
        }
        
        var move = new go.Move(0,0,game.currentPlayer,true);
        game.attemptMove(move,doTurn,invalidMove,gameEnd);
    }
    
    function gameEnd(){
        callback(game.board);
    }
}//conductGame


//Conduct a round-robin tournament;
// Takes an array of AIs.
// Ranks them by average score as % vs. opponents.
function tournament(players){
    var numPlayers = players.length;
    
    //Array of objects representing each player and their performance
    var participants = [];
    for (var i = 0; i < numPlayers; i++){
        participants[i] = {
            ai:players[i],
            wins:0,
            pointsFor:0.0,
            pointsAgainst:0.0,
            ratio: 0.0
        }
    }
    
    
    //Actually play the tournament
    for(var i = 0; i < numPlayers - 1; i++){
        for(var j = i + 1; j < numPlayers; j++){
            console.log("Player " + i + " vs. Player " + j + ":");
            //Two games so neither player has the play first advantage.
            conductGame(players[i],players[j],updateScores(i,j),false);
            conductGame(players[j],players[i],updateScores(j,i),false);
        }
    }//tournamentBody
    
    //Callback which adds scores (ratios) to running total
    function updateScores(player1,player2){
        return function(board){
            board.score();
            
            
            var winner = (board.scores[0] > board.scores[1] ? player1 : player2);
            var p1 = participants[player1];
            var p2 = participants[player2];
            
            p1.pointsFor += board.scores[0];
            p1.pointsAgainst += board.scores[1];
            p1.ratio = p1.pointsFor/p1.pointsAgainst;
            
            p2.pointsFor += board.scores[1];
            p2.pointsAgainst += board.scores[0];
            p2.ratio = p2.pointsFor/p2.pointsAgainst;
            
            var winner = participants[(board.scores[0] > board.scores[1] ? player1 : player2)];
            winner.wins += 1;
        }
    }//showScores

    
    //for sorting the results by wins first, then by score:
    function compare(a,b){
        if(a.wins != b.wins){
            return b.wins - a.wins;
        }
        var aratio = a.pointsFor/a.pointsAgainst;
        var bratio = b.pointsFor/b.pointsAgainst;
        
        return bratio - aratio;
    }//compare
    
    participants.sort(compare);
    //List results:
    for(var i in participants){
        var item = participants[i];
        var s = item.ai.firstName + " " + item.ai.lastName + ": " + item.wins + " wins, ratio: " + item.ratio;
        console.log(s);
    }
}//tournament


//Load a gene pool from file.
//The format is expected to be an array of ANN objects
//callback should take the recovered gene pool as an argument
function poolFromFile(path,callback){
    var contents = fs.readFile(path,'utf8', function(err,data) {
        if(err){
            console.log("Error reading file");
        }else{
            var parsedData = JSON.parse(data);
            var finalArray = [];
            for (var i = 0; i < parsedData.length; i++){
                var newAI = new ANN();
                newAI.restoreFromJSON(parsedData[i]);
                finalArray[i] = newAI;
            }
            callback(finalArray);
        }
    });
}

//Save a gene pool to a path:
function poolToFile(pool,path){
    var data = JSON.stringify(pool);
    
    fs.writeFile(path,data,function(err) {
        if(err){
            console.log("Error writing to file.");
        }
    });
}

function conductEvolution(genePool){
    tournament(genePool);
    poolToFile(genePool,"genepool.txt");
}

function listNames(genePool){
    var s = "";
    for(var i in genePool){
        var item = genePool[i];
        s += item.firstName + " " + item.lastName + item.title + item.patronymic + "\n";
    }
    
    return s;
}

//Create a pool of size n, save to files
function createPool(poolName, n){
    var genePool = [];
    for (var i = 0; i < n; i++){
        genePool[i] = new ANN();
        genePool[i].postConstructor();
    }
    
    poolToFile(genePool,poolName + ".txt");
    
    
    fs.writeFile(poolName + "names.txt", listNames(genePool));
    
    return genePool;
}

//main, for testing:
function main(){
    poolFromFile("contestants.txt",(pool) => (console.log(listNames(pool))) );
    
    //createPool("contestants",15);
    //conductEvolution(genePool);
}
main();