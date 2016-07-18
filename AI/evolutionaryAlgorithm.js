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

//saveNewPool("mainPool.json",30);
//conductEvolutionGeneration(wrangler.createPool(10));
wrangler.poolFromFile("mainGenePool.json",conductEvolutionGeneration); //Start running the evolution algorithm.

function saveNewPool(path,n){
    var pool = wrangler.createPool(n);
    wrangler.poolToFile(pool,path);
}

function conductSingleTournament(path){
    wrangler.poolFromFile(path,function (pool){
        var results = wrangler.tournament(pool);
        for(var i in results){
            var item = results[i];
            console.log(item.ai.firstName + " " + item.ai.lastName + ": " + item.wins + " wins.\nPoints for/against ratio:  " + item.ratio);
        }
        results[0].ai.title = " the Victorious";
    
        var winners = [results[0].ai,results[1].ai,results[2].ai];
        wrangler.poolToFile(winners,"winners.json");
    });//tournamentAndResults
}


//Pass in path to saved gene pool
function conductEvolutionGeneration(pool){
    //var pool = wrangler.createPool("temp",5);
    console.log("New Generation Begins================================================");
    var results = wrangler.tournament(pool);
    
    
    //calculate fitnesses
    var totalFitness = 0;
    for(var i in results){
        var cur = results[i];
        // use wins as a fitness function (wins * ratio wasn't working great)
        cur.fitness = cur.wins;
        totalFitness += cur.fitness;
    }
    
    //Normalize fitnesses:
    //  (resulting fitness should be % chance of reproducing)
    for(var i in results){
        var cur = results[i];
        cur.fitness = cur.fitness / totalFitness;
    }
    
    //Create new generation
    var newGeneration = [];
    
    
    //Top 3 survive
    results.sort((a,b) => (b.fitness - a.fitness));
    for(var i = 0; i < 3; i++){
        results[i].ai.generationsSurvived += 1;
        newGeneration.push(results[i].ai);
    }
    
    //Reproduce (create 23 new AIs)
    for(var i = 0; i < 23; i++){
        //Choose a random parent A
        var rand = Math.random();
        var runningTotal = 0;
        var parentA = null;
        var parentB = null;
        
        for(var j = 0; j < results.length; j++){
            runningTotal += results[j].fitness;
            if (runningTotal > rand){
                //Choose this person as parent A
                parentA = results[j].ai;
                break;
            }
        }//find parentA
        
        //Just in case:
        if(parentA == null){
            parentA = results[results.length - 1].ai;
        }
        
        //Chooe parent B, avoiding self-incest if possible
        var counter = 0;
        while(true){
            rand = Math.random();
            runningTotal = 0;
            for(var j = 0; j < results.length; j++){
                runningTotal += results[j].fitness;
                if(runningTotal > rand){
                    parentB = results[j].ai;
                    break;
                }
            }
            
            //Just in case:
            if(parentB == null){
                parentB = results[results.length - 1].ai;
            }
            
            counter += 1;
            if(parentA != parentB || counter > 20){
                break;
            }
        }//find parentB
        
        newGeneration.push(wrangler.reproduce(parentA,parentB));
    }
    
    //4 randoms are introduced
    for(var i = 0; i < 4; i++){
        var newAI = new ANN();
        newAI.postConstructor();
        newGeneration.push(newAI);
    }
    
    //Record some stats about prev. generation and new generation:
    var data = "Previous generation fitnesses:\n";
    for (var i in results){
        data += results[i].ai.fullName() + " (" + results[i].ai.generationsSurvived + "):\nFitness " + results[i].fitness + ", " + results[i].wins + " wins, for/against ratio: " + results[i].ratio + "\n";
    }
    data += "\nNew generation names:\n";
    for (var i in newGeneration){
        data += newGeneration[i].fullName() + "\n";
    }
    
    //This should recurr infinitely, but the files get written intermittently
    //  so stopping execution manually doesn't result in data loss.
    fs.writeFile("Evolutioninformation.txt",data,function(){
        wrangler.poolToFile(newGeneration,"mainGenePool.json",function(){
            conductEvolutionGeneration(newGeneration)
        });
    });
}//conductEvolution