"use strict";
/**
 * 
 * Created by sdiemert on 2016-05-25.
 * Modified by mdemone on 2016-06-07 for Go application
 */

var MongoClient = require("mongodb").MongoClient;


class MongoDB {

    constructor(u, p, db, host, port) {

        this._user   = u;
        this._passwd = p;
        this._dbname = db;
        this._host   = host || "localhost";
        this._port   = port || 27017;

        this._db = null;
		
    }

    /**
     * Connects to the database.
     * @param callback {function} called when the connection completes.
     *      Takes an error parameter.
     */
    connect(callback) {
        
        var that = this; 
		
        MongoClient.connect(
            "mongodb://" + this._host + ":" + this._port + "/" + this._dbname,
            function (err, db) {

                if (err) {
                    console.log("ERROR: Could not connect to database.");
                    that._db = null;
                    callback(err);
                } else {
                    console.log("INFO: Connected to database.");
                    that._db = db;
					that._db.createCollection("Games");
                    callback(null);
                }

            }
        );
    }

    /**
     * Closes the connection to the database.
     */
    close() {
        this._db.close();
    }

    /**
     * Adds a game to the database.
     *
     * @param game {object} represents the game to be added to the DB.
     * @param callback {function} called when query finishes.
     *      callback takes a result (which is game's id) then an error parameter
     */
    addGame(game, callback) {
		
		var collection = this._db.collection("Games");
		
		collection.insertOne(game, function(err, result) {
			if(err) {
				console.log("ERROR adding game: " + err);
				callback(null, err);
			} else {
				console.log("Created a game with an id equal to " + result.ops[0]._id);
				callback(result.ops[0], null);
			}
		});
    }
	
	/**
     * Modifies a game in the database.
     *
     * @param game {object} represents the game to be added to the DB.
     * @param callback {function} called when query finishes.
     *      callback takes an error parameter
     */
	updateGame(game, callback){
		
		var collection = this._db.collection("Games");
		var ObjectId = require('mongodb').ObjectId;
		var o_id = new ObjectId(game._id);
		
		
		collection.updateOne(
			{"_id": o_id}, 
			{
				$set: { currentPlayer : game.currentPlayer, 
					    board : game.board, 
					    previousBoard : game.previousBoard, 
					    previousMove : game.previousMove } 
			},	
			function(err, result) {
			
				if(result.result.ok == 1 && result.result.n == 1){
					callback(null);
				} else {
					console.log("ERROR: Did not update any games");
					callback("Did not update any games");
				}
		});
	}
	
	/**
     * Get a game from the database.
     *
     * @param id {number} id of game to retrieve.
     * @param callback {function} called when retrieval is completed.
	 *		callback takes a result then an error parameter
     */
	getGame(id, callback) {
		var collection = this._db.collection("Games");
		
		var ObjectId = require('mongodb').ObjectId;
		var o_id = new ObjectId(id);
		
		collection.find({"_id": o_id}).toArray(function(err,items){
			if(err) {
				console.log("ERROR getting game: " + err);
				callback(null, err);
			} else if(items[0] != null){
				console.log("Retrieved game with id: " + items[0]._id);
				callback(items[0], err);
			} else {
				console.log("Error: No games found with id: " + id);
				callback(null, "No games found");
			}
        });
	}
	
	/**
     * Get the current player for a game
     *
     * @param id {number} id of object to remove.
     * @param callback {function} called when remove is completed.
     *		callback takes a result then an error parameter
	 */
	getGamePlayer(id, callback) {
		var collection = this._db.collection("Games");
		
		var ObjectId = require('mongodb').ObjectId;
		var o_id = new ObjectId(id);
		
		collection.find({"_id": o_id}).toArray(function(err,items){
			if(err) {
				console.log("ERROR: Could not get game player. " + err)
				callback(null, err);
			} else if(items[0] != null) {
				console.log("Retrieved game with id: " + items[0]._id);
				callback(items[0].currentPlayer, err);
			} else {
				console.log("Error: No games found with id: " + id);
				callback(null, "No games found");
			}
        });
	}

    /**
     * Remove a game from the database.
     *
     * @param id {number} id of object to remove.
     * @param callback {function} called when remove is completed.
     *		callback takes an error parameter
	 */
    endGame(id, player, callback) {
		
		var collection = this._db.collection("Games");
		
		var ObjectId = require('mongodb').ObjectId;
		var o_id = new ObjectId(id);
		
		collection.updateOne({"_id": o_id}, 
			{$set:{gameOver: true, currentPlayer: player}}, function(err, result) {
			
			if(result.result.ok == 1 && result.result.n == 1){
				callback(null);
			} else {
				console.log("ERROR: Did not update any games");
				callback("Did not end any games");
			}
		});
    }
}

module.exports = MongoDB; 
