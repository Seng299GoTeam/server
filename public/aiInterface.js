//For use on client-side
//Assumes go and Game have been included.


//Is used to send AI requests to server.js, which relays them to the actual AI server.
//Has one function, getMove, which returns a go move object.
//Takes data about the target AI server
var aiInterface = function aiInterface(host, path, port){
    /*
    //Example of valid options:
        host: 'roberts.seng.uvic.ca'
        path: '/ai/random'
        port: '30000'
    */
    this.options = {
        "host": host,
        "path": path,
        "port": port,
        "method": 'POST'
    }
    
    //takes a game, and a number (n) of times to try to get a move from server, before just returning a pass
    //Also takes a callback and errback, because that's kinda necessary given how the request works.
    //The callback should take a go.Move object
    //The errback should take err as an argument.
    this.getMove = function(game,n,cb,eb){
        console.log("DEBUG: ai getMove called " + n + " times");
        if(n <= 0){
            //just pass
			console.log("DEBUG: AI passes");
            cb(new go.Move(0,0,game.currentPlayer,true));
			return;
        }
        
        //will get a move for the current player
        var moveData = {
            "size": game.board.size,
            "board": game.board.grid,
            "last": game.previousMove
        }//postData
        
        var postData = JSON.stringify({"options":this.options,"moveData":moveData});
        
        var postXhr = new XMLHttpRequest();
        postXhr.open("POST","http://" + aihost + ":" + portForAI + "/ai", true);
        postXhr.setRequestHeader("Content-Type", "application/json");
        postXhr.send(postData);
        
        var thisAI = this;
        
        postXhr.onreadystatechange = function(){
            if (postXhr.readyState == 4 && postXhr.status == 200){
                var response = postXhr.responseText;
                try{
                    var parsedMove = JSON.parse(response);
                    var move = new go.Move(parsedMove["x"],parsedMove["y"],parsedMove["c"],parsedMove["pass"]);
                    //ensure it's a valid move
                    if(game.board.validateMove(move,game.previousBoard.grid)[0]){
                        cb(move);
                    }else{
						//console.log("DEBUG: calling for " + n + "th time");
                        thisAI.getMove(game,n-1,cb,eb);
                    }
                }catch(err){
                    eb(err);
                }
            }else if(postXhr.readyState == 4 && postXhr.status !== 200){
                //do some sort of error handling
                alert("error: " + postXhr.status);
            }
        }//onreadystatechange
    }//getMove
}//aiInterface
