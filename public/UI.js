function updateUI(state){
    
    // If a previous board exist, delete the old one before appending a new one.
    if ($("#mainsvg").length === 1){
        $( "#mainsvg" ).remove();
    }
    
    
    var nol = state.size;       // How many lines are needed in the baord
    var lw = 5;                 // The width of lines in the board
    var bw = 50;                // The size of squares in the board
    var frame = 40;             // The size of the frame around the board
    
    
    var sw = lw + bw;
    var canvas = $("#canvas"); 
    var W = (sw*(nol-1))+(2*frame), H = (sw*(nol-1))+(2*frame); 
    canvas.css("height", H); 
    canvas.css("width", W); 
    var svg = $(makeSVG(W, H));
    
    
    
    svg.append ( makeRectangle( 0 , 0 , frame , (sw*(nol-1))+(2*frame) ,"#2F80ED"));
    svg.append ( makeRectangle( 0 , 0 , (sw*(nol-1))+(2*frame) , frame ,"#2F80ED"));
    svg.append ( makeRectangle( (sw*(nol-1))+frame , 0 , frame , (sw*(nol-1))+(2*frame) ,"#2F80ED"));
    svg.append ( makeRectangle( 0 , (sw*(nol-1))+frame , (sw*(nol-1))+(2*frame), frame ,"#2F80ED"));
    
    
    svg.append ( makeRectangle( frame , frame , (sw*(nol-1)) , (sw*(nol-1)) ,"#2F80ED"));
    for ( var i=0 ; i < nol ; i++){
        var x = (sw*i)+lw/2;
        svg.append ( makeLine(  x+frame , 0+frame , x+frame , (sw*(nol-1))+lw+frame ,"#012B4B",5));
        svg.append ( makeLine(  0+frame,  x+frame , (sw*(nol-1))+lw+frame , x+frame  , "#012B4B" , 5 ) );
    }
    
    var loc = (frame+(lw/2));
    for ( var i=0 ; i < nol;i++){
        for ( var j=0 ; j < nol ; j++ ){
            if ( state.board[i][j] == 1){
                svg.append ( makeCircle( (lw+bw)*j+loc, (lw+bw)*i+loc ,20,"#FFFFFF"));
            }
            else if ( state.board[i][j] == 2){
                svg.append ( makeCircle( (lw+bw)*j+loc, (lw+bw)*i+loc ,20,"#000000"));
            }
        }
    }
    
    for ( var i=0 ; i < nol;i++){
        for ( var j=0 ; j < nol ; j++ ){
            if ( state.board[i][j] == 0){
                svg.append ( makeMapCircle( (lw+bw)*j+loc, (lw+bw)*i+loc ,20, i, j));
            }
        }
    }
    
    
    
    canvas.append(svg);

}
