"use strict";

var MongoDB = require('./MongoDB');
var assert = require("assert");

var db = new MongoDB(null, null, "testing"); // Create database

// Create game object for storing
var game = { player : 1,
			 board : [],
		   };
		   
/******** TESTING *************/
describe('MongoDatabaseTester', function() {
	
	before(function(done){
		console.log("Tests are about to start");
		
		// Connect to database
		db.connect(function(err){
			if(err) {
				throw new Error("Could not connect to database");
			}
			done();
		});
	});
	
	it("should successfully insert game", function(done) {
		db.addGame(game, function(result, err) {
			assert.equal(err, null);
			game._id = result;
			done();
		});
		
	});
	
	it("should successfully check current player", function(done){
		db.getGamePlayer(game._id, function(result, err){
			assert.equal(err, null);
			assert(result === game.player);
			done();
		});
	});
	
	it("should successfully get game", function(done){
		db.getGame(game._id, function(result, err){
			assert(err == null);
			assert(String(result._id) === String(game._id));
			done();
		});
	});
	
	it("should update game in database", function(done){
		
		// Change game object
		game.player = 2;
		game.board = [1, 2, 3, 4];
		
		db.updateGame(game, function(err){
			assert.equal(err, null);
			
			//check game was updated
			db.getGame(game._id, function(newgame, err){
				console.log(typeof(newgame.board));
				
				assert(String(newgame._id) == String(game._id));
				assert(newgame.player == game.player);
				assert(newgame.board[0] === game.board[0]);
				assert(newgame.board[1] === game.board[1]);
				done();
			}); 
		}); 
	}); 
	
	it("should successfully remove game", function(done){
		// Delete the game
		db.deleteGame(game._id, function(err){
			assert(err == null);
			console.log("Deleted Game...");
			
			// Try to receive game after deletion
			db.getGame(game._id, function(result, err){
				console.log("Checking game was deleted...");
				
				// Should receive error
				assert(err);
				assert(result == null);
				done();
			});
		});
	});
	
	it("should try to delete a game and fail", function(done){
		// Try to delete the game again, and fail
		db.deleteGame(game._id, function(err){
			assert(err);
			done();
		})
	});
	
	after(function(){
		db.close();
		console.log("All tests are completed");
	});
});