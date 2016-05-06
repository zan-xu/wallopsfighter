// Physics constants.
var XV_ACCELERATION = 0.085;
var XV_TERMINAL = 0.6;
var XV_FRICTION = 0.05;
var YV_GRAVITY = 0.05;
var YV_TERMINAL = 100;
var XV_BULLET = 0.75;

// Jumping physics constants
var JUMP = 0.9;
var JUMP_MAX = 2;
var JUMP_COOLDOWN = 400;

// Particle constants
var XV_PARTICLE = 0.5;
var YV_PARTICLE = 1;
var PARTICLE_TIMEOUT = 5000;

// Player constants
var MAX_BULLETS = 20;
var BULLET_COOLDOWN = 200;
var INVINCIBILITY_TIME = 2000;
var SHIELD_TIME = 2000;

var MAP_TIME = 500;

// Platform constants.
var PLATFORM_THICKNESS = 4;

// Animation limits.
var FPS_CAP = 100;
var FPS_INTERVAL = 1000 / FPS_CAP;
var F = 0;
var S = 0;

var globalEngine;

var units = [
    "pole", "pound", "square meter", "second", "hour", "year", "decade", "mile", "stade", "acre", "dollar", "cookie", "frame",
    "cubic millimeter", "quartic cubit", "object", "coffee", "error", "failure", "mistake", "exception", "warning", "point",
    "gallon", "ounce", "gram", "kilograms", "decibel", "tonne", "ton", "furlong", "fortnight", "firkin"
];
var unit = " " + units[Math.floor(Math.random() * units.length)] + "s/" + units[Math.floor(Math.random() * units.length)];

window.onfocus = function () {
    F = 0;
    S = Date.now();
};

// Input.
var keys = {};

// Sprites and particles.
var spritesPaths = {
    zero: "images/man.png",
    infinity: "images/infinity.png",
    ddx: "images/ddx.png",
    evil: "images/evilThing.png",
    intlarge: "images/intlarge.png",
    mechakienzle: "images/mechakienzle.png",
    backgroundBeach1: "images/backgroundBeach1.jpg",
    bullet: "images/bullet.png",
    crab: "images/crab.png",
    lettuce: "images/lettuce.png",
    backgroundMarsh1: "images/backgroundMarsh1.jpg",
    horse: "images/pony.png",
    backgroundBoat1: "images/backgroundBoat1.jpg" ,
    red: "images/red.png"
};
var spritesReady = {};
var sprites = {};

var key, image;
for (key in spritesPaths) {
    spritesReady[key] = false;

    image = new Image();
    image.key = key;
    image.onload = function () {
        spritesReady[this.key] = true;
    };
    image.src = spritesPaths[key];

    sprites[key] = image;
}

var particlePaths = ["images/particle/0.png", "images/particle/1.png", "images/particle/2.png", "images/particle/3.png", "images/particle/4.png", "images/particle/5.png", "images/particle/6.png", "images/particle/7.png", "images/particle/8.png", "images/particle/9.png"];
var particlesReady = [];
var particles = [];

var i;
for (i = 0; i < particlePaths.length; i++) {
    particlesReady[i] = false;

    image = new Image();
    image.key = i;
    image.onload = function () {
        particlesReady[this.key] = true;
    };
    image.src = particlePaths[i];

    particles[i] = image;
}

var ready = false;

// Animation
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

// Rectangular intersection.
function intersects(r1, r2) {
    return !(r1[0] + r1[2] < r2[0] || r1[0] > r2[0] + r2[2] || r1[1] + r1[3] < r2[1] || r1[1] > r2[1] + r2[3]);
}

// The main game engine class.
function Engine(canvas) {
    
    this.running = true;

    // Graphics.
    this.canvas = canvas;
    this.context = canvas.getContext("2d");
    this.context.font = "20px Verdana";

    // Set up timing.
    this.time = Date.now();

    // Input binding.
    addEventListener("keydown", function (e) {
        keys[e.keyCode] = true;
        if ([37, 39, 38, 40].indexOf(e.keyCode) > -1) {e.preventDefault();}
    }, false);
    addEventListener("keyup", function (e) {
        keys[e.keyCode] = undefined;
    }, false);

    // Game objects.
    /**********************************************************************************
    **  HERE BE MAPS                                                                 **
    **                                                                               **
    **********************************************************************************/
    this.map = 0;
        this.maps = [
        {
            platforms: [
                new Platform((canvas.width - 400) / 2, canvas.height * 13 / 20, 400, PLATFORM_THICKNESS),
                new Platform((canvas.width - 650) / 2, canvas.height * 9 / 20, 150, PLATFORM_THICKNESS),
                new Platform((canvas.width + 350) / 2, canvas.height * 9 / 20, 150, PLATFORM_THICKNESS),
                new Platform((canvas.width - 100) / 2, canvas.height * 17 / 20, 100, PLATFORM_THICKNESS)
            ],
            spawns: {
                kienzle: ["kienzle", sprites.mechakienzle, sprites.intlarge, particles, DUMB_MOVE, this, canvas.width - 100, -1],
            },
            onstart: function(){
                overlay("Welcome to Wallops Fighter, based off the code of Calculus Fighter. WASD to move, 1 to shoot, the shield is broken. Note that the shooting cooldown is much slower than before.");
            },
            //background: sprites.backgroundBeach1,
        },
        {
            platforms: [
                new Platform(30, 267, 330, PLATFORM_THICKNESS),
                new Platform(160,450, 600, PLATFORM_THICKNESS),
            ],
            spawns: {
                evil: ["evil", sprites.crab, sprites.intlarge, particles, DUMB_MOVE, this, canvas.width - 100, -1],
            },
            onstart: function(){
                overlay(
        "Horseshoe crabs live in shallow ocean waters on soft muddy floors. The variety seen at Chincoteague is the" +
        " <i>Limulus polyphemus</i>. They have been around for about 450 Ma and have changed very little. The tail is called"+
        " the telson and is used to move itself around, not to sting. <br> <img src='images/crab.png'></img>"
                );
            },
            background: sprites.backgroundBeach1,
        },
        {
            platforms: [
                new Platform(30, 200, 100, PLATFORM_THICKNESS),
                new Platform(250, 250, 300, PLATFORM_THICKNESS),
                new Platform(450, 450, 300, PLATFORM_THICKNESS),
                new Platform(550, 250, 300, PLATFORM_THICKNESS),
            ],
            spawns: {
                evil3: ["evil3", sprites.horse, sprites.intlarge, particles, getDumbMover(8, 1), this, canvas.width - 400, -1],
                evil4: ["evil4", sprites.horse, sprites.intlarge, particles, getDumbMover(7, 1), this, canvas.width - 600, -1],
                evil5: ["evil5", sprites.horse, sprites.intlarge, particles, getDumbMover(3, 3), this, canvas.width - 500, -1],
                evil6: ["evil6", sprites.horse, sprites.intlarge, particles, getDumbMover(4, 2), this, canvas.width - 300, -1],
                evil7: ["evil7", sprites.crab, sprites.intlarge, particles, DUMB_MOVE, this, 330, -1],
                kienzle: ["kienzle", sprites.crab, sprites.intlarge, particles, DUMB_MOVE, this, 550, -1],
            },
            onstart: function(){
                overlay(
        "Chincoteague ponies are really short, around 55 inches, due to a combonation of crappy food and incest. "+
        "About 300 ponies live on the island. On the Chincoteague side, the ponies are given medical care. "+
        "On the Assateague side, the ponies are mostly just feral."
                );
            },
            background: sprites.backgroundMarsh1,
        },
        {
            platforms: [
                new Platform(30, 267, 330, PLATFORM_THICKNESS),
                new Platform(160,450, 600, PLATFORM_THICKNESS),
            ],
            spawns: {
                evil: ["evil", sprites.crab, sprites.intlarge, particles, AVOID_MOVE, this, canvas.width - 100, -1],
                evil2: ["evil2", sprites.horse, sprites.intlarge, particles, AVOID_MOVE, this, canvas.width - 300, -1],
                evil3: ["evil3", sprites.lettuce, sprites.intlarge, particles, PLANT_MOVE, this, canvas.width - 500, -1],
            },
            onstart: function(){
                overlay(
        "Sea lettuce is a very common, globally found form of green algae. It is edible and found in sublittoral and coastal zones. They are of the genus Ulva or Monostroma."
                );
            },
            background: sprites.backgroundBoat1,
        }
        
    ];
    
    this.mapTime = 0;

    this.bullets = [];
    this.players = {
        //zero: new Player("zero", sprites.zero, sprites.intlarge, particles, keymap[0], this),
        //evil: new Enemy("evil", sprites.evil, sprites.intlarge, particles, keymap[0], this, canvas.length-100, -1)
    };
    
    this.players.zero = new Player("zero", sprites.zero, sprites.intlarge, particles, HUMAN_MOVE, this, 100, 1);
    this.players.zero.spawn(100);

    // Update the game.
    this.update = function (delta) {

        // Update the players
        var name, bullet;
        for (name in this.players) {
            this.players[name].update(delta);
        }
        for (i = 0; i < this.bullets.length; i++) {
            bullet = this.bullets[i];
            bullet.update(delta);

            // Check if a bullet has died.
            if (bullet.x + bullet.image.width < 0 || bullet.x > canvas.width) {
                this.dieBullet(i);
            }
        }
        
        var player, bbox;

        // Collision detection
        for (name in this.players) {

            // Get the actual player.
            player = this.players[name];
            if(player !== undefined){

                // Generate boundary boxes.
                bbox = player.bbox();

                // Platform collision.
                player.grounded = false;
                for (i = 0; i < this.platforms.length; i++) {

                    // Access the individual platform. 
                    var platform = this.platforms[i];

                    // Check if colliding with platform while FALLING.
                    if (player.yv > 0 && intersects(bbox, platform.bbox()) && !(i in player.collisions)) {
                        //console.log(platform.bbox());
                        player.y = platform.y - player.image.height;
                        player.yv = 0;
                        player.grounded = true;
                        player.jump = 0;
                        player.collisions[i] = true;
                    } else {
                        delete player.collisions[i];
                    }
                }

            

                for (i = 0; i < this.bullets.length; i++) {

                    // Access the bullet.
                    bullet = this.bullets[i];

                    //ensure no friendly fire
                    if (player.name == "zero" || bullet.player.name == "zero"){

                        // Intersection with bullet.
                        if (!player.invincible() && !player.shielded && intersects(bbox, bullet.bbox())) {
                            this.die(player);
                            this.dieBullet(i);
                        } else if (player.shielded && intersects(bbox, bullet.bbox())) {
                            this.dieBullet(i);
                        }
                    }

                }

                // Edge detection.
                if (player.x < 0) player.x = 0;
                else if (player.x + player.image.width > canvas.width) player.x = canvas.width - player.image.width;
                if (player.y < 0) player.y = 0;
                else if (player.y + player.image.height > canvas.height + 150) this.die(player);
            }

        }

    };

    // Draw the game to the canvas. 
    this.render = function () {

        // Check if reasources are ready.
        if (!ready) {
            ready = true;
            for (var key in spritesReady) ready &= spritesReady[key];
            return;
        }

        if("background" in this.maps[this.map]){
            // Redraw the background.
            this.context.drawImage(this.maps[this.map].background, 0, 0, this.canvas.width, this.canvas.height);
        }
        else{
            this.context.fillStyle = "#CCC";
            this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
        }
            
        // Draw the platforms.
        this.context.fillStyle = "#000";
        for (var i = 0; i < this.platforms.length; i++) {
            this.platforms[i].render(this.context);
        }

        // Draw the players.
        for (var name in this.players) {
            this.players[name].render(this.context);
        }

        // Draw the bullets.
        for (var i = 0; i < this.bullets.length; i++) {
            this.bullets[i].render(this.context);
        }

        // Draw frames per second.
        this.context.fillStyle = "#AAA";

        this.context.textAlign = "left";
        this.context.textBaseline = "top";
        this.context.fillText(Math.round(F / (Date.now() - S) * 1000) + unit, 10, 10);

        this.context.fillRect(10, this.canvas.height - 40, 0.1 * this.players.zero.shield, 3);
        this.context.textBaseline = "bottom";
        if(this.players.zero.lives > 0){
            this.context.fillText(this.players.zero.score + " kills " 
                                  + "♥".repeat(this.players.zero.lives), 10, this.canvas.height - 10);
        }

        this.context.textAlign = "right";

        this.context.textBaseline = "top";
        this.context.fillText("Level " + (this.map + 1), this.canvas.width - 10, 10);

    };

    // The main game loop.
    this.main = function () {

        // Record timing.
        var now = Date.now();
        var delta = now - this.time;

        if (delta > FPS_INTERVAL) {

            // Update and render.
            this.update(delta);
            this.render();

            // Update timing.
            this.time = now;

            // Update frame count.
            F++;

        }

        // Next frame
        //if(this.running){
            requestAnimationFrame(this.main.bind(this));
        //}

    };

    // Called when a player dies.
    this.die = function (player) {

        // Move the player and update score.
        
        player.die();
        player.lives--;
        
        if (player.name == "zero"){
            if(player.lives <= 0){
                overlay("Game Over! Hit Continue to restart.");
                player.lives = 10;
                this.setMap(0);
            }
            player.spawn(100);
        }
        else{
            this.players.zero.score++;
            if(--this.maps[this.map].killCount == 0){
                this.setMap(this.map+1);
            }
            
        }
        
        

    };

    // Wait for resources before going to main.
    this.start = function () {
        S = Date.now();
        this.setMap(0);
        this.main();
    };

    // Kill a bullet.
    this.dieBullet = function (index) {
        this.bullets[index].player.bullet++;
        this.bullets.splice(index, 1);
    };

    this.setMap = function (index) {
        if (Date.now() - this.mapTime < MAP_TIME) return;

        this.map = index % this.maps.length;

        this.platforms = this.maps[this.map].platforms;
        this.maps[this.map].killCount = Object.keys(this.maps[this.map].spawns).length;
        
        //this.players = {zero: this.players.zero};
        this.players.zero.spawn(100);
        
        if("onstart" in this.maps[this.map]){
            this.maps[this.map].onstart();
        }
        
        //Construct a mob for each specified in the map
        spawns = this.maps[this.map].spawns;
        for (var playerArgs in spawns) {
            if(playerArgs != "zero"){
                this.players[playerArgs] = constructPlayer(spawns[playerArgs]);
                this.players[playerArgs].spawn(spawns[playerArgs][6]);
            }
        }
        
        this.players.zero.deathTime = Date.now();

        //this.players.zero.x = this.maps[this.map].spawns.zero - this.players.zero.image.width / 2;
        this.mapTime = Date.now();
    }

}


// Makes a player/monster
function constructPlayer(args){
    return new Player(args[0], args[1], args[2], args[3], args[4], args[5], args[6], args[7]);
}

// Start the game.
function start() {
    var canvas = document.getElementById("canvas");
    var e = new Engine(canvas);
    globalEngine = e;
    e.setMap(0);
    e.start();
}


//Display dialog box.
function overlay(string) {
    document.getElementById("guideContent").innerHTML = string;
    
	o = document.getElementById("overlay");
    if(o.style.visibility == "visible"){
	    o.style.visibility = "hidden";
        globalEngine.running = true;
       
    }
    else{
        o.style.visibility = "visible";
        globalEngine.running = false;
    }
}