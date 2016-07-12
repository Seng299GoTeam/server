var go = require("../public/libraries/go.js");
var Game = require("../public/libraries/Game.js");
var assert = require("assert");

describe("Game tester",function(){
    
    
    it("should successfully complete a valid move",function(){
        var game = new Game("hotseat",9);
       
       
        var successful = false;
        var callback = ()=>(successful=true);
        var errback = (err)=>(successful=false);
       
        var move = new go.Move(0,0,1,false);
        game.attemptMove(move,callback,errback);
       
        assert(successful,"Success callback was not called");
        assert(game.board.grid[0][0] == 1, "Board does not reflect move");
    });
    
    it("should disallow an invalid move",function(){
        var game = new Game("hotseat",9);
       
        var successful = true;
        var callback = ()=>(successful=true);
        var errback = (err)=>(successful=false);
       
        var move = new go.Move(-1,0,1,false);
        game.attemptMove(move,callback,errback);
       
        assert(!successful,"Errback callback was not called");
        assert(game.board.grid[0][0] == 0, "Board invalid move was applied");
    });
    
    it("should detect the end of a game",function(){
        var game = new Game("hotseat",9);
       
        var gameover = false;
        var callback2 = ()=>(gameover=false);
        var errback2 = (err)=>(gameover=false);
        var endOfGame = ()=>(gameover=true);
       
        var move = new go.Move(0,0,1,true);
        game.attemptMove(move,callback2,errback2,endOfGame);
       
        var move = new go.Move(0,0,2,true);
        game.attemptMove(move,callback2,errback2,endOfGame);
       
        assert(gameover,"Game over callback was not called");
    });
    
    it("should not allow player to play out of order",function(){
        var game = new Game("hotseat",9);
       
        var successful = true;
        var callback = ()=>(successful=true);
        var errback = (err)=>(successful=false);
        
        //White should not be able to go first
        var move = new go.Move(0,0,2,false); 
        game.attemptMove(move,callback,errback);
       
        assert(!successful,"Errback callback was not called");
    });
    
    it("should succesfully be restored from a JSON string",function(){
        var game = new Game("hotseat",9);
        var callback = ()=>(true);
        var errback = (err)=>(false);
       
        var move = new go.Move(0,0,1,false);
        game.attemptMove(move,callback,errback);
        var move = new go.Move(0,1,2,false);
        game.attemptMove(move,callback,errback);
       
        var contents = game.toJSON();
       
        //The following move should be undone when the game is restored.
        var move = new go.Move(1,1,1,false);
        game.attemptMove(move,callback,errback);
       
        var result = game.updateFromJSON(contents);
        assert(result,"Update was unsuccessful");
        assert(game.currentPlayer = 1,"Current player was not updated");
       
        var boardIsCorrect = (game.board.grid[1][1] == 0 && game.board.grid[0][1] == 2);
        assert(boardIsCorrect,"Game board was not updated");
       
        var prevIsCorrect = (game.previousBoard.grid[0][1] == 0 && game.previousBoard.grid[0][0] == 1);
        assert(prevIsCorrect, "Previous board was not updated");
    });
    
    it("should restore a brand-new game without error",function(){
        var game = new Game("hotseat",9);
        var callback = ()=>(true);
        var errback = (err)=>(false);
       
        var contents = game.toJSON();
       
        //The following should be absent from the restored game
        var move = new go.Move(0,0,1,false);
        game.attemptMove(move,callback,errback);
        var move = new go.Move(0,1,2,false);
        game.attemptMove(move,callback,errback);
       
        var result = game.updateFromJSON(contents);
        assert(result,"Update was unsuccessful");
       
        var boardIsCorrect = (game.board.grid[0][0] == 0 && game.board.grid[0][1] == 0);
        assert(boardIsCorrect,"Game board was not updated");
       
        assert(game.previousBoard == null, "Previous board was not updated");
    });
    
    it("should handle invalid json data",function(){
        var game = new Game("hotseat",9);
        var result = game.updateFromJSON("Invalid json string!");
       
        assert(!result,"Error was not detected");
    });

});













