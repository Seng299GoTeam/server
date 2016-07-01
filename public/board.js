class Board {
  constructor() {
    this.size = 9;
    this.grid = [];
    
    for ( var i=0 ; i < 9 ; i++){
        var temp = [];
        for ( var j=0 ; j < 9 ; j++){
            temp.push(0);
        }
        this.grid.push(temp);
    }
    
  }
}