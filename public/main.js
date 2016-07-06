/*
main.js is reponsible for handling all user's events of any page.
*/



console.log("Initalizing Page...."); 
var ui = new UI();
ui.show ( "startPage");
var game;




function startNewGame(){
    var selected = $('input[type=radio][name=selected_size]:checked').attr('id');  

    
    game = new Game ( "hotseat", selected );
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






        
    
    



