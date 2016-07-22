"use strict";
var numeric = require("numeric");
//Game stuff:
var go = require("../public/libraries/go.js");
var Game = require("../public/libraries/Game.js");
var fs = require("fs");
var randomName = require("node-random-name");
//Load AI stuff:
var ai = require("./ai.js");
var ANN = require("./ANN.js");


var AIwrangler = {}
AIwrangler.conductGame = conductGame;
AIwrangler.tournament = tournament;
AIwrangler.poolFromFile = poolFromFile;
AIwrangler.poolToFile = poolToFile;
AIwrangler.listNames = listNames;
AIwrangler.createPool = createPool;
AIwrangler.reproduce = reproduce;
module.exports = AIwrangler;

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
// Ranks them by number of wins.
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
    
    var numGames = ((numPlayers)*(numPlayers - 1))/2;
    var gamesCompleted = 0;
    //Actually play the tournament
    for(var i = 0; i < numPlayers - 1; i++){
        for(var j = i + 1; j < numPlayers; j++){
            //Two games so neither player has the play first advantage.
            conductGame(players[i],players[j],updateScores(i,j),false);
            conductGame(players[j],players[i],updateScores(j,i),false);
            gamesCompleted += 1;
            if(gamesCompleted % 10 == 0){
                console.log(gamesCompleted + "/" + numGames + " completed");
            }
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
    
    //Return the full results, in sorted order.
    participants.sort(compare);
    return participants;
}//tournament


//Load a gene pool from file.
//The format is expected to be an array of ANN objects
//callback should take the recovered gene pool as an argument
function poolFromFile(path,callback){
    var contents = fs.readFile(path,'utf8', function(err,data) {
        if(err){
            console.log("Error reading file:");
            console.log(err);
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
function poolToFile(pool,path,callback){
    var data = JSON.stringify(pool);
    
    fs.writeFile(path,data,function(err) {
        if(err){
            console.log("Error writing to file.");
        }else if(callback){
            callback();
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
function createPool(n){
    var genePool = [];
    for (var i = 0; i < n; i++){
        genePool[i] = new ANN();
        genePool[i].postConstructor();
    }
    
    return genePool;
}

//Return a new ANN that is the offspring of parentA and parentB
function reproduce(parentA,parentB){
    var child = {};
    child.gender = (Math.random() > 0.5? "male" : "female");
    
    //Name stuff:
    child.firstName = randomName({random:Math.random,first:true,gender:child.gender});
    child.lastName = parentA.lastName;
    //Chance of hyphenated last name:
    if(Math.random() < 0.05){
        child.lastName = parentA.lastName + "-" + parentB.lastName;
    }
    
    child.title = "";
    child.patronymic = ", " + (child.gender == "male"? "son" : "daughter") + " of " + parentA.fullName();
    child.generationsSurvived = 0;
    
    child.layers = [];
    
    //The important part - combine the actual neural networks.
    for(var i = 0; i < parentA.layers.length; i++){
        //combine each row by random midpoint selection.
        var mutationRate = 0.001; //1% mutation rate
        var A = parentA.layers[i];
        var B = parentB.layers[i];
        
        //Choose a random midpoint:
        var mid = Math.floor(Math.random()*A.length);
        
        var curLayer = [];
        for (var j = 0; j < A.length; j++){
            curLayer[j] = [];
            for(var k = 0; k < A[0].length; k++){
                //Choose which parent's genome to use
                curLayer[j][k] = (k < mid? A[j][k] : B[j][k]);
                
                //Possible mutation:
                if(Math.random() < mutationRate){
                    curLayer[j][k] = Math.random()*2 - 1;
                }
            }//For columns
        }//For rows
        
        child.layers[i] = curLayer;
    }//for each layer
    
    var finalChild = new ANN();
    finalChild.restoreFromJSON(child);
    return finalChild;
}//Reproduce


//main, for testing:
function main(){
    poolFromFile("contestants.txt",(pool) => (console.log(listNames(pool))) );
    
    //createPool(15);
    //conductEvolution(genePool);
}
//main();