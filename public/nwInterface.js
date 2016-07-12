//For use on client-side
//Assumes go and Game have been included.
//checkGame,getGame,setGame

//Is used to send networked player move requests to server.js, which relays them to the actual opponent
//Has three functon
//  checkGame, takes id, returns current player
//  getGame, takes id, returns current the updated board
//  setGame, takes id and game, updates the game in the database
var nwInterface = function nwInterface(host, path, port){
    /*
    //Example of valid options
        host: 'localhost'
        path: '/getGame','/updateGame','/checkGame','/createGame'
        port: '3000'
    */
    this.options = {
        "host": host,
        "path": path,
        "port": port,
        "method": 'POST'
    }
    
    //Takes a game id and returns a game state from the database
    this.checkGame = function(id,cb,eb){
       
        //will get a move for the current player
        var gameData = {
            "_id": id
        }//postData
        
        var postData = JSON.stringify({"options":options,"gameData":gameData});
        
        //send {options,postdata} to server.
        var postXhr = new XMLHttpRequest();
        postXhr.open("POST","http://localhost:3000/checkGame", true);
        postXhr.setRequestHeader("Content-Type", "application/json");
        postXhr.send(postData);
        
        var thisAI = this;
        
        postXhr.onreadystatechange = function(){
            if (postXhr.readyState == 4 && postXhr.status == 200){
                var response = postXhr.responseText;
                try{
                    var parsedMove = JSON.parse(response);
                    var turn = parsedMove["player"];
                    cb(turn);
                }catch(err){
                    eb(err);
                }
            }else if(postXhr.readyState == 4 && postXhr.status !== 200){
                //do some sort of error handling
                alert("error: " + postXhr.status);
            }
        }//onreadystatechange
    }//checkGame
    
    this.getGame = function(id,cb,eb){
       
        //will get a move for the current player
        var gameData = {
            "_id": id
        }//postData
        
        var postData = JSON.stringify({"options":options,"gameData":gameData});
        
        //send {options,postdata} to server.
        var postXhr = new XMLHttpRequest();
        postXhr.open("POST","http://localhost:3000/getGame", true);
        postXhr.setRequestHeader("Content-Type", "application/json");
        postXhr.send(postData);
        
        
        postXhr.onreadystatechange = function(){
            if (postXhr.readyState == 4 && postXhr.status == 200){
                var response = postXhr.responseText;
                try{
                    var parsedMove = JSON.parse(response);
                    cb(parsedMove);
                }catch(err){
                    eb(err);
                }
            }else if(postXhr.readyState == 4 && postXhr.status !== 200){
                //do some sort of error handling
                alert("error: " + postXhr.status);
            }
        }//onreadystatechange
    }//getGame

    this.setGame = function(gameData,id,cb,eb){

        var postData = JSON.stringify({"options":options,"gameData":gameData});

        //send {options,postdata} to server.
        var postXhr = new XMLHttpRequest();
        postXhr.open("POST","http://localhost:3000/updateGame", true);
        postXhr.setRequestHeader("Content-Type", "application/json");
        postXhr.send(postData);
        
        postXhr.onreadystatechange = function(){
            if (postXhr.readyState == 4 && postXhr.status == 200){
                var response = postXhr.responseText;
                try{
                    var parsedRes = JSON.parse(response);
                    cb(parsedRes);
                }catch(err){
                    eb(err);
                }
            }else if(postXhr.readyState == 4 && postXhr.status !== 200){
                //do some sort of error handling
                alert("error: " + postXhr.status);
            }
        }//onreadystatechange
    }//setGame
    
    this.createGame = function(gameData,id,cb,eb){

        var postData = JSON.stringify({"options":options,"gameData":gameData});

        //send {options,postdata} to server.
        var postXhr = new XMLHttpRequest();
        postXhr.open("POST","http://localhost:3000/createGame", true);
        postXhr.setRequestHeader("Content-Type", "application/json");
        postXhr.send(postData);
        
        postXhr.onreadystatechange = function(){
            if (postXhr.readyState == 4 && postXhr.status == 200){
                var response = postXhr.responseText;
                try{
                    var parsedRes = JSON.parse(response);
                    var id = parsedRed["_id"];
                    cb(id);
                }catch(err){
                    eb(err);
                }
            }else if(postXhr.readyState == 4 && postXhr.status !== 200){
                //do some sort of error handling
                alert("error: " + postXhr.status);
            }
        }//onreadystatechange
    }//createGame
    
}//nwInterface
