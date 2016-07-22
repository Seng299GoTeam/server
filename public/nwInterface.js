//This is comment to try and git commit
//For use on client-side
//Assumes go and Game have been included.
//checkGame,getGame,setGame

//Is used to send networked player move requests to server.js, which relays them to the actual opponent
//Has three functon
//  checkGame, takes id, returns current player
//  getGame, takes id, returns current the updated board
//  setGame, takes id and game, updates the game in the database
var nwInterface = function nwInterface(){
    
	
	
	this.setAndCheckGame = function(game, networkId, ui) {
		
		var cbSetGame = function(){
			
			var cbGetPlayer = function(player) {
				if(JSON.parse(player).err) {
					ui.notify("Error accessing database: " + JSON.parse(player).err);
				}
				if (player != game.currentPlayer) {
					
					// callbacks for getting game
					var cbGetGame = function(newGame) {
						var parsedGame = JSON.parse(newGame);
						game.updateFromJSON(newGame);
						if(game.previousMove.pass) {
							ui.notify("Other player passed")
						}
						if(parsedGame.gameOver) {
							ui.end();
						}
						ui.board(game.board.grid);
					};
					var erGetGame = function(err) {
						// DISPLAY SOME SORT OF ERROR
						console.log("Error occured: " + err);
					};
					
					network.getGame(networkId, cbGetGame, erGetGame);
				} else {
					setTimeout(cbSetGame, 500);
				}
				
			}; // callback of checking player
			
			var erGetPlayer = function (err) {
				// DISPLAY SOME SORT OF ERROR
				console.log("Error occured: " + err);
			}
			
			
			network.checkGame(networkId, cbGetPlayer, erGetPlayer);
			
		}; // Set game callback
		
		var ebSetGame = function(err) {
			// DISPLAY SOME SORT OF ERROR
			console.log("Error occured: " + err);
		};
		
		network.setGame(game.toJSON(), networkId, cbSetGame, ebSetGame);
	}
	
    //Takes a game id and returns a game state from the database
    this.checkGame = function(id,cb,eb){
       
        //will get a move for the current player
        var gameData = {
            "_id": id
        }//postData
		
        var postData = JSON.stringify(gameData);
		
        //send {postdata} to server.
        var postXhr = new XMLHttpRequest();
        postXhr.open("POST", "http://" + host + ":" + port + "/checkGame", true);
        postXhr.setRequestHeader("Content-Type", "application/json");
        postXhr.send(postData);
        
        postXhr.onreadystatechange = function(){
            if (postXhr.readyState == 4 && postXhr.status == 200){
                var response = postXhr.responseText;
                try{
                    var player = response;
                    cb(player);
                }catch(err){
                    eb(err);
                }
            }else if(postXhr.readyState == 4 && postXhr.status !== 200){
                ui.notify("Could not check game because of error: " + postXhr.status);
            }
        }//onreadystatechange
    }//checkGame
    
    this.getGame = function(id,cb,eb){
       
        //will get a move for the current player
        var gameData = {
            "_id": id
        }//postData
        
        var postData = JSON.stringify(gameData);
        
        //send {postdata} to server.
        var postXhr = new XMLHttpRequest();
        postXhr.open("POST", "http://" + host + ":" + port + "/getGame", true);
        postXhr.setRequestHeader("Content-Type", "application/json");
        postXhr.send(postData);
        
        
        postXhr.onreadystatechange = function(){
            if (postXhr.readyState == 4 && postXhr.status == 200){
                var response = postXhr.responseText;
                try{
                    // Don't need to parse because game has set game
					// via json function
                    cb(response);
                }catch(err){
                    eb(err);
                }
            }else if(postXhr.readyState == 4 && postXhr.status !== 200){
			    ui.notify("Could not get game because of error: " + postXhr.status);
            }
        }//onreadystatechange
    }//getGame

    this.setGame = function(gameData,id,cb,eb){
		
		gameData = JSON.parse(gameData);
		gameData._id = id;
		gameData = JSON.stringify(gameData);
		
        var postData = JSON.stringify({"gameData":gameData});

        //send {postdata} to server.
        var postXhr = new XMLHttpRequest();
        postXhr.open("POST", "http://" + host + ":" + port + "/updateGame", true);
        postXhr.setRequestHeader("Content-Type", "application/json");
        postXhr.send(postData);
        
        postXhr.onreadystatechange = function(){
            if (postXhr.readyState == 4 && postXhr.status == 200){
                var response = postXhr.responseText;
                try{
                    var parsedRes = JSON.parse(response);
					var message = parsedRes["message"];
                    cb(parsedRes);
                }catch(err){
                    eb(err);
                }
            }else if(postXhr.readyState == 4 && postXhr.status !== 200){
                //do some sort of error handling
				ui.notify("Could not set game because of error: " + postXhr.status);
            }
        }//onreadystatechange
    }//setGame
    
    this.createGame = function(gameData,cb,eb){

        var postData = JSON.stringify({"gameData":gameData});

        //send {postdata} to server.
        var postXhr = new XMLHttpRequest();
        postXhr.open("POST","http://" + host + ":" + port + "/createGame", true);
        postXhr.setRequestHeader("Content-Type", "application/json");
        postXhr.send(postData);
        
        postXhr.onreadystatechange = function(){
            if (postXhr.readyState == 4 && postXhr.status == 200){
                var response = postXhr.responseText;
                try{
                    var parsedRes = JSON.parse(response);
                    var id = parsedRes["message"];
                    cb(id);
                }catch(err){
                    eb(err);
                }
            }else if(postXhr.readyState == 4 && postXhr.status !== 200){
                //do some sort of error handling
                ui.notify("Could not create game because of error: " + postXhr.status);
            }
        }//onreadystatechange
    }//createGame
    
	this.endGame = function(gameData, id, cb,eb){
		
		gameData = JSON.parse(gameData);
		gameData._id = id;
		gameData = JSON.stringify(gameData);
        var postData = JSON.stringify({"gameData":gameData});

        //send {postdata} to server.
        var postXhr = new XMLHttpRequest();
        postXhr.open("POST","http://" + host + ":" + port + "/endGame", true);
        postXhr.setRequestHeader("Content-Type", "application/json");
        postXhr.send(postData);
        
        postXhr.onreadystatechange = function(){
            if (postXhr.readyState == 4 && postXhr.status == 200){
                var response = postXhr.responseText;
                try{
                    var parsedRes = JSON.parse(response);
                    var message = parsedRes["message"];
                    cb(message);
                }catch(err){
                    eb(err);
                }
            }else if(postXhr.readyState == 4 && postXhr.status !== 200){
                //do some sort of error handling
                ui.notify("Could not end game because of error: " + postXhr.status);
            }
        }//onreadystatechange
    }//createGame
	
	
}//nwInterface
