var Theme = function Theme(){
    this.availableThemes =  {
        pink: {
            lightColor: "#F3C1CE",
            mediumColor: "#EF2465",
            darkColor: "#3C0919",
        },
        blue: {
            lightColor: "#C3D8F0",
            mediumColor: "#2F80ED",
            darkColor: "#0C203B",
        },
        
        purple: {
            lightColor: "#D2CCDC"  ,
            mediumColor: "#6D4F99",
            darkColor: "#36274C" , 
        },
        orange: {
            lightColor: "#FFDB99"  ,
            mediumColor: "#FFA500",
            darkColor: "#332100" , 
        },
    }
    
    
    this.lightColor = "#C3D8F0" ;
    this.mediumColor = "#2F80ED" ;
    this.darkColor = "#0C203B" ;
    this.mode = "light";

    this.darken = function(){
            if (this.mode == "dark" ){
                this.mode = "light";
            }
            else{
                this.mode = "dark";
            }        
            
            var temp = this.lightColor;
            this.lightColor = this.darkColor;
            this.darkColor = temp
            
            this.updateWorker();
            this.buttonSelectorUpdator();
            this.buttonStartGameUpdator();
            this.gameTypeUpdator();
        
        
    }
    
    this.update= function( themeName ){
        var chosenTheme = this.availableThemes[themeName];
        
        if ( this.mode == "light"){
        this.lightColor = chosenTheme.lightColor;
        this.darkColor = chosenTheme.darkColor;
        }
        else{
        this.lightColor = chosenTheme.darkColor;
        this.darkColor = chosenTheme.lightColor;  
        }
        
        
        this.mediumColor = chosenTheme.mediumColor;
        this.updateWorker();
        this.buttonSelectorUpdator();
        this.buttonStartGameUpdator();
        this.gameTypeUpdator();
    }
    this.buttonStartGameUpdator = function(){
        $("#start_game_button").css("background-color", this.lightColor);
    }
    

    
    
    this.buttonSelectorUpdator = function(){
        $(".board_size").css("color", this.mediumColor);
        $(".board_size").css("background-color", this.lightColor);
        
        $(".board_size_clicked").css("color", this.lightColor);
        $(".board_size_clicked").css("background-color", this.mediumColor);
        
    }
    this.dropDownUpdator = function(){
        console.log ( "xxxx")
        
        $(".drop_down_item").css("color", this.mediumColor);
        $(".drop_down_item").css("background-color", this.lightColor);
        
        $(".drop_down_chosen").css("color", this.lightColor);
        $(".drop_down_chosen").css("background-color", this.mediumColor);
        
    }
    
    
    
    
    this.gameTypeUpdator = function(){
        $(".game_type").css("color", this.mediumColor);
        $(".game_type").css("background-color", this.lightColor);
        $(".game_type svg").css("fill", this.mediumColor);

        $(".game_type_clicked").css("color", this.lightColor);
        $(".game_type_clicked").css("background-color", this.mediumColor);
        $(".game_type_clicked svg").css("fill", this.lightColor);
    }
    
    this.updateWorker= function( ){

        var light = this.lightColor; // #234243
        var medium = this.mediumColor;
        var dark = this.darkColor;
        
        $("#first_menu").css("background-color", this.darkColor);
        $("#second_menu").css("background-color", this.mediumColor);
        $("body").css("background-color", this.lightColor); 

        $("h1").css("color", this.lightColor);
        
        $(".board_size").css("color", this.mediumColor);
        $(".board_size").css("border-color", this.mediumColor);
        
        $(".board_size_clicked").css("color", light);
        $(".board_size_clicked").css("background-color", medium);


        $(".game_type").css("color", this.mediumColor);
        $(".game_type").css("border-color", this.mediumColor);
        $(".game_type svg").css("fill", medium);
        
        $(".game_type_clicked").css("color", light);
        $(".game_type_clicked").css("background-color", medium);
        $(".game_type_clicked svg").css("fill", light);
        
        
        $(".board_boxes").css("fill", this.mediumColor);
        $(".board_lines").css("stroke", this.darkColor);


        $("#start_game_button").css("color", this.mediumColor);
        $("#start_game_button").css("border-color", this.mediumColor);
        
        $("#start_game_button").mouseenter(function(){ 
            $(this).css("color", light);
            $(this).css("background", medium);
        });

        
        $("#start_game_button").mouseleave(function(){ 
            $(this).css("color", medium);
            $(this).css("background-color", light);
        });
        
        
        $(".drop_down").css("border-color", this.mediumColor);
        $(".drop_down_item").css("color", this.mediumColor);
        $(".drop_down_item").css("background-color", this.lightColor);
        $(".drop_down_item").css("border-bottom-color", this.mediumColor);
        $(".drop_down_chosen").css("background-color", this.mediumColor);
        $(".drop_down_chosen").css("color", this.lightColor);
        
        $(".upper_menu_item").css ("color", this.lightColor);
        
        
        $("#pass").css ("color", this.lightColor);
        
        $("#pass").css("background-color", this.mediumColor);
        $(".game_end_message").css ("background-color", this.mediumColor);
        
        $("#pass").mouseenter(function(){ 
            $(this).css("background-color", dark);
        });

        
        $("#pass").mouseleave(function(){ 
            $(this).css("background-color", medium);
        });

    }
    
}


