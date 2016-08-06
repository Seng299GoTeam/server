/*
main.js is reponsible for handling all user's events of any page.
*/


console.log("Initalizing Page....");


//key event handler
document.onkeydown = function keyHandler(event){
    //alert(event.keyCode);
    if(event.keyCode == 84){
        //"t" for territory
        showTerritory = !showTerritory;
        ui.board(game.board.grid );
    }else if(event.keyCode == 65 || event.keyCode == 83){
        //"a" for advice or "s" for suggestion
        showSuggestion = !showSuggestion;
        ui.board(game.board.grid );
    }
}


var host = "localhost";
var port = "30088";
var hostForAI = host;
var portForAI = port;
var aihost = "localhost";
var aiport = "30089";


var ui = new UI();
var theme = new Theme();
var game;

var availableAIs = [];
availableAIs.push(new aiInterface('roberts.seng.uvic.ca','/ai/maxLibs','30000'));
availableAIs.push(new aiInterface('roberts.seng.uvic.ca','/ai/attackEnemy','30000'));
availableAIs.push(new aiInterface('roberts.seng.uvic.ca','/ai/formEyes','30000'));
availableAIs.push(new aiInterface(host,'/okai',aiport));
availableAIs.push(new aiInterface(host,'/neuralnetwork',aiport));

//var ai = new aiInterface('roberts.seng.uvic.ca','/ai/random','30000');

var network = new nwInterface();
var networkId = -1;
var ai = availableAIs[3];


// Used by startgame
var boardSize = 9;
var gameType = "hotseat";
var aiType = "maxLibs";


//A couple other important globals:
var gameOver = false;
var showTerritory = false;
var showSuggestion = false;


// Show the default Page
ui.show ( "startPage");

function startNewGame(){
	
    game = new Game ( gameType, boardSize );
    gameOver = false;
	
    ui.board(game.board.grid );
    ui.show ( "boardPage" );
    
	
	if ( gameType == "network") {
		var callback = function(_id) {
			networkId = _id;
			game._id = _id;
			// TODO: Implement pop up screen for this url
			console.log("Send this url to a friend to play with them: " + host + ":" + port + "/?id=" + _id + "&player=2");
			var Neturl = host + ":" + port + "/?id=" + _id + "&player=2" ;
			
			ui.showNetworkUrl ( Neturl );
			
		};
		
		var errback = function(err) {
			// TODO: Implement pop up for this error (or just console.log it)
			ui.notify("Error: " + err);
		}
		network.createGame(game.toJSON(), callback, errback);
	}else if(gameType == "ai"){
		//insert ai choosing stuff
		switch(aiType){
			case "maxLibs":
				ai = availableAIs[0];
				break;
			case "attack":
				ai = availableAIs[1];
				break;
			case "ANN":
				ai = availableAIs[4];
				break;
			case "Gomega":
				ai = availableAIs[3];
				break;
			default:
				ai = availableAIs[3];
		}
	}
}

function boardClickHandler(x,y){
	
    if(gameOver) return; //Don't do anything if game is over
    var move = new go.Move (x, y, (game.gameType=="hotseat"?game.currentPlayer:game.whichPlayer), false);
    
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
    ui.notify( message );
}

function gameEnds (){               // What should happen if the move results to end the game
    ui.end();
    gameOver = true;
}

function pass(){
	if(gameOver) {
		ui.end(game.board.scores);
		return;
	}
	
	if(game.gameType == "network" && game.currentPlayer != game.whichPlayer) {
		ui.notify("Cannot pass when it's not your turn");
		return;
	}
	
    function successfulMove (){          // What should happen if a move is successfull
        ui.board(game.board.grid);
		if(game.gameType == "ai"){
			ai.getMove(game,10,aiMoveTemp,function(){});
		}
		if(game.gameType == "network") {
			network.setAndCheckGame(game, networkId, ui);
		}
    }
    function invalidMove ( message ){    // What should happen if a move is invalid
        ui.notify( message );
    }
    function gameEnds (){               // What should happen if the move results to end the game
		if(gameType == "network") {
			var cb = function(){};
			network.endGame(game.toJSON(), networkId, cb, cb);
		}
		gameOver = true;
		game.board.score();
		ui.end(game.board.scores);
    }
    
    var move = new go.Move (-1, -1,(game.gameType=="hotseat"?game.currentPlayer:game.whichPlayer), true);
    game.attemptMove(move,successfulMove,invalidMove, gameEnds);
}

//Turned out not to be temporary
//Takes a move
function aiMoveTemp(move){
    game.attemptMove(move,successfulAiMove,invalidMove,gameEnds);
}


function successfulAiMove(){
	if(game.previousMove.pass) {
		ui.notify("AI has passed");
	}
    ui.board(game.board.grid);
}


document.body.onload = function() {
	
	var re = /\?id=(.*?)&player=(.*)/;
	var url = document.location.href;
	var result = url.match(re);
	
	if(result) {
		var id = result[1];
		var player = result[2];
		joinNetworkGame(id, player);
		return;
	} else {
		re = /\?id=(.*)/;
		result = url.match(re);
		if(result) {
			var id = result[1];
			var player = result[2];
			joinNetworkGame(id, null);
		}
	}
	
	
}

function joinNetworkGame(id, player) {
	game = new Game ( "network", boardSize );
	
	// callbacks for getting game
	var cb = function(newGame) {
		var gameParsed = JSON.parse(newGame);
		var boardsize = gameParsed.board.length;
		gameType = "network";
		game = new Game("network", boardsize);
		game.whichPlayer = (player ? player : 2);
		game.gameID = id;
		networkId = id;
		game.updateFromJSON(newGame);
		
		if(game.gameOver) {
			ui.end(game.board.scores);
			return;
		} else if( game.previousMove && game.previousMove.pass){
			ui.notify("Other player passed");
		}
		
		
		ui.board(game.board.grid);
		ui.show ( "boardPage" );
		
		if(game.currentPlayer != game.whichPlayer) {
			network.setAndCheckGame(game, networkId, ui);
		}
	};
	
	var er = function(err) {
		ui.notify("Could not join new game because of error: " + err);
	};
	
	network.getGame(id, cb, er);

}

function goHome() {
	
	ui.show("startPage");
	game = null;
	networkId = -1;


	// Used by startgame
	ui.close_url();


	//A couple other important globals:
	gameOver = false;
	showTerritory = false;
	showSuggestion = false;
}

function colorChanger( themeName ){
    theme.update ( themeName );
}

function callDarken( themeType ){
    theme.darken ( themeType );
}

function boardSizeChoser ( boardSizeOption ){
    ui.updateSizeButton(boardSizeOption);

}

function gameTypeChoser ( gameTypeOption ){
    ui.updateTypeButton( gameTypeOption );
    
    
    if  ( gameTypeOption == "ai" ){
        ui.showAIoptions();
    }
    
}
    
function aiTypeChoser ( aiType ){
    
    ui.updateAItype( aiType );
}


function close_url(){
	ui.close_url();
}
