/*
main.js is reponsible for handling all user's events of any page.
*/



console.log("Initalizing Page...."); 
var ui = new UI();
ui.show ( "startPage");
var game;

//var ai = new aiInterface('roberts.seng.uvic.ca','/ai/random','30000');
var ai = new aiInterface('localhost','/moron','3001');




function startNewGame(){
    var selected = $('input[type=radio][name=selected_size]:checked').attr('id');  

    
    game = new Game ( "ai", selected );
    ui.board(game.board.grid );
    ui.show ( "boardPage" );
}


function boardClickHandler(x,y){
    var move = new go.Move (x, y, game.currentPlayer , false);

    game.attemptMove(move,successfulMove,invalidMove);
}

function successfulMove (){          // What should happen if a move is successfull
    ui.board(game.board.grid);
    if(game.gameType == "ai"){
        ai.getMove(game,10,aiMoveTemp,function(){});
    }
}

function invalidMove ( message ){    // What should happen if a move is invalid
    ui.invalid( message );
}

function gameEnds (){               // What should happen if the move results to end the game
    ui.end()
}

function pass(){
    var move = new go.Move (-1, -1, game.currentPlayer , true);
    game.attemptMove(move,successfulMove,invalidMove, gameEnds);
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






        
    
    



