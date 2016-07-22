var UI = function UI() {

this.show = function show( page ){
    
    if ( page == "startPage" ){
        $( "#board_page" ).hide();
        $( "#start_page" ).show();
    }
    else if ( page == "boardPage" ){
        $( "#start_page" ).hide();
        $( "#board_page" ).show();
    }
}

/*
Updates the board

@parameters:
state: A 2D array that has the 0,1,2 for empty, black, white respectively
*/
this.board = function board(state){

    // If a previous board exist, delete the old one before appending a new one.
    if ($("#mainsvg").length === 1){
        $( "#mainsvg" ).remove();
    }
    $("#pass").css('display', 'block')
    $(".game_end_message").css('display','none');
    
    var nol = state.length;       // How many lines are needed in the baord
    var lw = 5;                 // The width of lines in the board
    var bw = 50;                // The size of squares in the board
    var frame = 40;             // The size of the frame around the board
    
    
    var sw = lw + bw;
    var canvas = $("#canvas"); 
    var W = (sw*(nol-1))+(2*frame), H = (sw*(nol-1))+(2*frame); 
    canvas.css("height", H); 
    canvas.css("width", W); 
    var svg = $(makeSVG(W, H));
    
    
    
    svg.append ( makeRectangle( 0 , 0 , frame , (sw*(nol-1))+(2*frame) ,"board_boxes"));
    svg.append ( makeRectangle( 0 , 0 , (sw*(nol-1))+(2*frame) , frame ,"board_boxes"));
    svg.append ( makeRectangle( (sw*(nol-1))+frame , 0 , frame , (sw*(nol-1))+(2*frame) ,"board_boxes"));
    svg.append ( makeRectangle( 0 , (sw*(nol-1))+frame , (sw*(nol-1))+(2*frame), frame ,"board_boxes"));
    
    
    svg.append ( makeRectangle( frame , frame , (sw*(nol-1)) , (sw*(nol-1)) ,"board_boxes"));
    for ( var i=0 ; i < nol ; i++){
        var x = (sw*i)+lw/2;
        svg.append ( makeLine(  x+frame , 0+frame , x+frame , (sw*(nol-1))+lw+frame ,"board_lines",5));
        svg.append ( makeLine(  0+frame,  x+frame , (sw*(nol-1))+lw+frame , x+frame  , "board_lines" , 5 ) );
    }
    
    var loc = (frame+(lw/2));
    
    for ( var i=0 ; i < nol;i++){
        for ( var j=0 ; j < nol ; j++ ){
            if ( state[i][j] == 1){
                svg.append ( makeCircle( (lw+bw)*j+loc, (lw+bw)*i+loc ,20,"#000000"));
            }
            else if ( state[i][j] == 2){
                svg.append ( makeCircle( (lw+bw)*j+loc, (lw+bw)*i+loc ,20,"#FFFFFF"));
            }
        }
    }
    
    

    //Show territory, if turned on
    if(showTerritory){
        var board = new go.Board(state);
        board.parse();
        board.score(); //causes it to count territories
        
        for(var i = 0; i < board.territories.length; i++){
            var territory = board.territories[i];
            if(territory.colour() > 0){
                //draw an X on each intersection
                for(var j = 0; j < territory.intersections.length; j++){
                    var intersection = territory.intersections[j];
                    var colour = (territory.colour()==1?"#000000":"#FFFFFF");
                    
                    var x1 = (lw+bw)*(intersection.y)+loc - bw*0.5;
                    var y1 = (lw+bw)*(intersection.x)+loc - bw*0.5;
                    var x2 = (lw+bw)*(intersection.y)+loc + bw*0.5;
                    var y2 = (lw+bw)*(intersection.x)+loc + bw*0.5;
                    svg.append(makeLinePure(x1,y1,x2,y2,colour,4));
                    
                    x1 = (lw+bw)*(intersection.y)+loc - bw*0.5;
                    y1 = (lw+bw)*(intersection.x)+loc + bw*0.5;
                    x2 = (lw+bw)*(intersection.y)+loc + bw*0.5;
                    y2 = (lw+bw)*(intersection.x)+loc - bw*0.5;
                    svg.append(makeLinePure(x1,y1,x2,y2,colour,4));
                }
            }
        }
    }
    
    //Show a suggested move, if that option is turned on
    if(showSuggestion){
        try{
            var advisor = new aiInterface('localhost','/okai','3001');
            //gonna use the global game object here, even though it might not be ideal.
            advisor.getMove(game,10,function(move){
				if(!move.pass){
					var x = (lw+bw)*move.y+loc;
					var y = (lw+bw)*move.x+loc;
					svg.append(makeUnfilledCircle(x,y,20,"#00FF00",3));
				}
            },function(){});
        }catch(err){
        }
    }
    
    for ( var i=0 ; i < nol;i++){
        for ( var j=0 ; j < nol ; j++ ){
            //if ( state[i][j] == 0){
                svg.append ( makeMapCircle( (lw+bw)*j+loc, (lw+bw)*i+loc ,20, i, j));
            //}
        }
    }
    
    
    canvas.append(svg);

}  



/*
Ends the game and show score

@parameters:
state: A 2D array that has the 0,1,2 for empty, black, white respectively
*/



/*
Ends the game and show score

@parameters:
state: A 2D array that has the 0,1,2 for empty, black, white respectively
*/
this.end = function end( scoreArray ){
    $("#pass").css('display', 'none')
    $(".game_end_message").css('display','block');
    
    $("#game_end_number_black").text( scoreArray[0]);
    $("#game_end_number_white").text( scoreArray[1]);
    
    
    
}    

this.notify = function( message ){
    var notification = $('<div class="notification">' + message +'</div>');

    $('body').append(notification);

    setTimeout(function(){
        notification.fadeOut();
        notification.remove();
    },3000);
    
}

this.showNetworkUrl = function ( NetUrl ){
    $(".game_url").text( NetUrl );
    $(".game_url").css( 'display','block' );

}
this.close_url = function(){
    $(".game_url").css( 'display','none' );
}


this.updateSizeButton = function updateSizeButton(boardSizeOption){
    $("#size_" + boardSize).removeClass ( "board_size_clicked");
    boardSize = boardSizeOption;
    $("#size_" + boardSize).addClass ( "board_size_clicked"  );
    theme.buttonSelectorUpdator();
}


this.updateTypeButton = function updateTypeButton(gameTypeOption){
    $(".drop_down").css('display','none');
    $(".drop_down_text_group").css('display','none');
    $(".drop_down_item").css('display','none');
    $(".drop_down_chosen").css('display','none');

    $("#type_" + gameType ).removeClass ( "game_type_clicked");
    gameType = gameTypeOption;
    $("#type_" + gameType ).addClass ( "game_type_clicked"  );
    
    theme.gameTypeUpdator();
}

this.showAIoptions = function showAIoptions(){
    $(".drop_down").css('display','block');
    $(".drop_down_text_group").css('display','block');
    $(".drop_down_item").css('display','block');
    $(".drop_down_chosen").css('display','block');

}


this.updateAItype = function updateAItype( aiTypeOption ){
    $("#type_" + aiType ).removeClass ( "drop_down_chosen");
    aiType = aiTypeOption;
    $("#type_" + aiType ).addClass ( "drop_down_chosen"  );
    theme.dropDownUpdator();
}

}