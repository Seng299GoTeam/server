/*
main.js is reponsible for handling all user's events of any page.
*/



console.log("Initalizing Page...."); 
var ui = new UI();
var theme = new Theme();
var game;

var boardSize = 9;

ui.show ( "startPage");





function startNewGame(){
 

    
    game = new Game ( "hotseat", boardSize );
    ui.board(game.board.grid );
    ui.show ( "boardPage" );

}
function boardClickHandler(x,y){
    var move = new go.Move (x, y, game.currentPlayer , false);

    function successfulMove (){         // What should happen if a move is successfull
        ui.board(game.board.grid);
    }
    function invalidMove ( message ){   // What should happen if a move is invalid
        ui.invalid( message );
    }

    game.attemptMove(move,successfulMove,invalidMove);
}
function pass(){
    function successfulMove (){          // What should happen if a move is successfull
        ui.board(game.board.grid);
    }
    function invalidMove ( message ){    // What should happen if a move is invalid
        ui.invalid( message );
    }
    function gameEnds (){               // What should happen if the move results to end the game
        ui.end()
    }
    
    var move = new go.Move (-1, -1, game.currentPlayer , true);
    game.attemptMove(move,successfulMove,invalidMove, gameEnds);
    
}

function colorChanger( themeName ){
    theme.update ( themeName );
}

function boardSizeChoser ( boardSizeOption ){
    ui.updateSizeButton(boardSizeOption);

}



        
    
    



