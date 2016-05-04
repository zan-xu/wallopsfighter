var HUMAN_KEYMAP = {left: 65, right: 68, up: 87, down: 83, shoot: 49, shield: 192}

var HUMAN_MOVE = function (delta) {
    if (HUMAN_KEYMAP.left in keys) {
        this.dowalk(-1);
    }
    if (HUMAN_KEYMAP.right in keys) {
        this.dowalk(1);
    }
    
    if (HUMAN_KEYMAP.shoot in keys) {
        this.doshoot();
    }
    
    if (HUMAN_KEYMAP.shield in keys) {
        this.doshield(delta);
    }
    
    if (HUMAN_KEYMAP.up in keys) {
        this.dojump();
    }
    
}

var DUMB_MOVE = function (delta) {
    if (this.engine.players.zero.x < this.x) {
        this.dowalk(-1);
    }
    else if (this.engine.players.zero.x > this.x) {
        this.dowalk(1);
    }
    
    if ((this.engine.players.zero-this.x) * this.direction < 0) {
        this.doshoot();
    }
    this.doshoot();
    
    if (this.engine.players.zero.y < this.y) {
        this.dojump();
    }
    
}