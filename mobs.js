var HUMAN_KEYMAP = {left: 65, right: 68, up: 87, down: 83, shoot: 49, shield: 192}

var HUMAN_MOVE = function (delta) {
    if (keys[HUMAN_KEYMAP.left]) {
        this.dowalk(-1);
    }
    if (keys[HUMAN_KEYMAP.right]) {
        this.dowalk(1);
    }
    
    if (keys[HUMAN_KEYMAP.shoot]) {
        this.doshoot(BULLET_COOLDOWN);
    }
    
    if (keys[HUMAN_KEYMAP.shield]) {
        this.doshield(delta);
    }
    
    if (keys[HUMAN_KEYMAP.up]) {
        this.dojump();
    }
    
}

var DUMB_MOVE = function (delta) {
    if(!("count" in this)){
        this.count = 0;
    }
    this.count = (this.count+1)%1;
    
    if(this.count==0 && (Math.sign(this.engine.players.zero.x-this.x)*this.direction<0
                         || distance(this.engine.players.zero, this) > 200)){
        if (this.engine.players.zero.x < this.x) {
            this.dowalk(-1);
        }
        else if (this.engine.players.zero.x > this.x) {
            this.dowalk(1);
        }
        if (this.engine.players.zero.y < this.y) {
            this.dojump();
        }
    }
    else{
        this.doshoot(1000);
    }
    //if ((this.engine.players.zero-this.x) * this.direction < 0) {
    //    this.doshoot();
    //}
    
}


var AUTO_MOVE = function (delta) {
    
    if(!("platform" in this)){
    
        for (i = 0; i < this.engine.platforms.length; i++) {

            // Access the individual platform. 
            var platform = this.engine.platforms[i];
            if(this.x>platform.x && this.x-platform.x < platform.w 
               && Math.abs(this.y-platform.y-this.image.height-platform.h) < 10){
                this.platform = platform;
                this.dowalk(1);
                break;
            }
        }
    
    }
    
    // Check if it is about to fall off the platform.
    if ((this.x + 20*this.direction < this.platform.x) || (this.x + 20*this.direction > this.platform.x+this.platform.w)){
        this.dowalk(this.direction*-1);
    }
    this.doshoot(2000);
    
}

function distance(a,b){
    return Math.sqrt(Math.pow(a.x-b.x, 2)+Math.pow(a.y-b.y, 2))
}