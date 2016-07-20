/*
main.js is reponsible for handling all user's events of any page.
*/


console.log("Initalizing Page...."); 
var ui = new UI();
var theme = new Theme();
var game;

var availableAIs = [];
availableAIs.push(new aiInterface('roberts.seng.uvic.ca','/ai/maxLibs','30000'));
availableAIs.push(new aiInterface('roberts.seng.uvic.ca','/ai/attackEnemy','30000'));
availableAIs.push(new aiInterface('roberts.seng.uvic.ca','/ai/formEyes','30000'));
availableAIs.push(new aiInterface('localhost','/okai','3001'));
availableAIs.push(new aiInterface('localhost','/neuralnetwork','3001'));

//var ai = new aiInterface('roberts.seng.uvic.ca','/ai/random','30000');

var network = new nwInterface();
var networkId = -1;
var ai = availableAIs[3];


// Used by startgame
var boardSize = 9;
var gameType = "network";



// Show the default Page
ui.show ( "startPage");

function startNewGame(){
	console.log(document.location.href);
    game = new Game ( "network", boardSize );
	
    ui.board(game.board.grid );
    ui.show ( "boardPage" );
	
	if ( gameType == "network") {
		var callback = function(_id) {
			networkId = _id;
			game._id = _id;
			// TODO: Implement pop up screen for this url
			console.log("Send this url to a friend to play with them: " + "localhost:3000/?id=" + _id);
		};
		
		var errback = function(err) {
			alert("Error: " + err);
		}
		network.createGame(game.toJSON(), callback, errback);
	}
}

function boardClickHandler(x,y){
    
	if(gameType == "network" && game.whichPlayer != game.currentPlayer) {
		return;
	}
	
	var move = new go.Move (x, y, game.currentPlayer , false);
	
    game.attemptMove(move,successfulMove,invalidMove);
}


function successfulMove (){          // What should happen if a move is successfull
    ui.board(game.board.grid);
    if(game.gameType == "ai"){
        ai.getMove(game,10,aiMoveTemp,function(){});
    } else if( gameType == "network"){
		network.setAndCheckGame(game, networkId, ui);
	}
}

function invalidMove ( message ){    // What should happen if a move is invalid
    ui.invalid( message );
}

function gameEnds (){               // What should happen if the move results to end the game
    ui.end()
}

function pass(){
	
	if(game.gameType == "network" && game.currentPlayer != game.whichPlayer) {
		console.log("Cannot pass when it's not your turn");
		return;
	}
	
    function successfulMove (){          // What should happen if a move is successfull

        ui.board(game.board.grid);
		if(game.gameType == "ai"){
			ai.getMove(game,10,aiMoveTemp,function(){});
		}
		if(game.gameType = "network") {
			network.setAndCheckGame(game, networkId, ui);
		}
    }
    function invalidMove ( message ){    // What should happen if a move is invalid
        ui.invalid( message );
    }
    function gameEnds (){               // What should happen if the move results to end the game
		if(gameType = "network") {
			var cb = function(){};
			network.endGame(game.toJSON(), networkId, cb, cb);
		}
		ui.end()
    }
    
    var move = new go.Move (-1, -1, game.currentPlayer , true);
    game.attemptMove(move,successfulMove,invalidMove, gameEnds);
	
    if(game.gameType == "ai"){
        ai.getMove(game,10,aiMoveTemp,function(){});
    }
}

//TEMP: This is just for testing that we can deal with ai moves.
//Takes a move
function aiMoveTemp(move){
    game.attemptMove(move,successfulAiMove,invalidMove,gameEnds);
}


//TEMPORARY - still working out how AI will work.
function successfulAiMove(){
    ui.board(game.board.grid);
}


document.body.onload = function() {
	
	var re = /\?id=(.*)/;
	var url = document.location.href;
	var result = url.match(re);
	
	console.log(result);
	
	if (result) {
		var id = result[1];
		joinNetworkGame(id);
	}
}

function joinNetworkGame(id) {
	game = new Game ( "network", boardSize );
	
	// callbacks for getting game
	var cb = function(newGame) {
		var gameParsed = JSON.parse(newGame);
		var boardsize = gameParsed.board.length;
		
		game = new Game("network", boardsize);
		game.whichPlayer = 2;
		game.gameID = id;
		networkId = id;
		game.updateFromJSON(newGame);
		
		if(game.previousMove.pass) {
			alert("Other user passed")
		}
		
		ui.board(game.board.grid);
		ui.show ( "boardPage" );
	};
	
	var er = function(err) {
		// DISPLAY SOME SORT OF ERROR
		console.log("Error occured: " + err);
	};
	
	network.getGame(id, cb, er);
}


function colorChanger( themeName ){
    theme.update ( themeName );
}

function boardSizeChoser ( boardSizeOption ){
    ui.updateSizeButton(boardSizeOption);

}

function gameTypeChoser ( gameTypeOption ){
    ui.updateTypeButton( gameTypeOption );
    
    /*
    if  ( gameTypeOption == "ai" ){
        ui.showUIoptions();
    }
    */
}
    
    



