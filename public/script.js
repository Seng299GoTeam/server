/**
 * Requests a new board state from the server's /data route.
 * 
 * @param cb {function} callback to call when the request comes back from the server.
 */
function getData(cb){
    $.get("/data", function(data, textStatus, xhr){
        console.log("Response for /data: "+textStatus);  
        
        
        
        // handle any errors here....

        // draw the board....
        cb(data);  

    }); 
}

/**
 * Draws the board to the #canvas element on the page. 
 *
 * You may find the following links helpful: 
 *  - https://api.jquery.com/
 *  - https://api.jquery.com/append/
 *  - http://www.tutorialspoint.com/jquery/
 *  - http://www.w3schools.com/jquery/ 
 *
 * @param state {object} - an object representing the state of the board.  
 */ 
function drawBoard(state){
    console.log (state);
    var nol = state.size;
    var lw = 5;
    var bw = 50;
    var sw = lw + bw;
    var frame = 40;

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
                svg.append ( makeCircle( (lw+bw)*j+loc, (lw+bw)*i+loc ,20,"white"));
            }
            else if ( state.board[i][j] == 2){
                svg.append ( makeCircle( (lw+bw)*j+loc, (lw+bw)*i+loc ,20,"black"));
            }
        }
    }
    canvas.append(svg);

}

function init(){

    // do page load things here...

    console.log("Initalizing Page...."); 
    getData(drawBoard); 
}
