console.log("Initalizing Page...."); 
var game = new Game(); 
var ui = new UI();

ui.board(game.getGrid());
    


function boardClickHandler(x,y){
    game.attemptMove(x,y);
    ui.board(game.getGrid());
    
}
function pass(){
    var success = game.attemptPass();
    
    
    if ( success ){
        ui.board(game.getGrid());
    }
    else {
        ui.end ();
    }
    
}


/*
function getData(cb){
    $.get("/data", function(data, textStatus, xhr){
        console.log("Response for /data: "+textStatus);  
        cb(data);  

    }); 
}
*/

        
    
    



