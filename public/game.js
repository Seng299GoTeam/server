class Game {
    constructor() {
        this.board = new Board();
        this.currentPlayer= "black";
        this.prevMoveWasPass= "false";
    }
  
    getGrid(){
        return this.board.grid;
    }
    
    
    attemptMove (x,y){
        if ( this.board.grid[x][y] != 0){
            return false;
        }
        else{
        
            if ( this.currentPlayer == "black" ){
                this.board.grid[x][y] = 2;
                this.currentPlayer = "white";
            }
            else if ( this.currentPlayer == 'white' ) {
                this.board.grid[x][y] = 1;
                this.currentPlayer = "black";
            }
            this.prevMoveWasPass = x + " " + y;
            return true;
        }
    }
    
    attemptPass (){
        console.log (this);
        if (this.prevMoveWasPass == "pass"){
            return false;
        }
        
            else {
            if ( this.currentPlayer == "black" ){
                this.currentPlayer = "white";
            }
            else if ( this.currentPlayer == 'white' ) {
                this.currentPlayer = "black";
            }
            this.prevMoveWasPass = "pass";
            return true;
        }
    }
    
}