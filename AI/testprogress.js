//Just used to test the progress of the evolutionary algorithm
//  By playing winner against a bunch of random enemies and seeing how it does

"use strict";
var numeric = require("numeric");
//Game stuff:
var go = require("../public/libraries/go.js");
var Game = require("../public/libraries/Game.js");
var fs = require("fs");
//Load AI stuff:
var ai = require("./ai.js");
var ANN = require("./ANN.js");

var wrangler = require("./evolution.js");


wrangler.poolFromFile("mainGenePool.json",function (pool){
    var mainAI = pool[0];
    console.log(mainAI.fullName());
    var wins = 0;
    for(var i = 0; i < 250; i++){
        var rand = new ANN();
        rand.postConstructor();
        wrangler.conductGame(mainAI,rand,function(board){
            board.score();
            if(board.scores[0] > board.scores[1]){
                console.log("Won");
                wins = wins + 1;
            }else{
                console.log("Lost");
            }
            
        },false);
        if(i%10 == 0){
            console.log(i + "/" + 500 + " test rounds complete");
            console.log("Running percentage: " + (wins*100.0/i) + "%");
        }
    }
    var goingFirstRate = (wins/250.0)*100;
    
    var wins2 = 0;
    for(var i = 0; i < 250; i++){
        var rand = new ANN();
        rand.postConstructor();
        wrangler.conductGame(rand,mainAI,function(board){
            board.score();
            if(board.scores[1] > board.scores[0]){
                console.log("Won");
                wins = wins + 1;
                wins2 = wins2 + 1;
            }else{
                console.log("Lost");
            }
            
        },false);
        
        if(i%10 == 0){
            console.log((250 + i) + "/" + 500 + " test rounds complete");
            console.log("Running percentage (Round 2): " + (wins2*100.0/i) + "%");
        }
    }
    var goingSecondRate = (wins2/250.0)*100;
    
    console.log(wins + " wins, " + (500 - wins) + " losses");
    console.log("Win rate: " + (wins/500.0)*100 + "%");
    console.log("When going first: " + goingFirstRate + "%");
    console.log("When going second: " + goingSecondRate + "%");

}); //Start running the evolution algorithm.
