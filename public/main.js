
console.log("Initalizing Page...."); 
var state = {
    size : 9, 
    board: [],
}
    
    
for ( var i=0 ; i < 9 ; i++){
    var temp = [];
    for ( var j=0 ; j < 9 ; j++){
        temp.push(0);
    }
    state.board.push(temp);
}

updateUI(state);
    


function boardClickHandler(x,y){
    console.log ( state.board[x][y]);
    //alert("x: "+x+" y:"+y);
    state.board[x][y] = 2;
    updateUI(state);
}


/*
function getData(cb){
    $.get("/data", function(data, textStatus, xhr){
        console.log("Response for /data: "+textStatus);  
        cb(data);  

    }); 
}
*/

        
    
    



