function Particle(image, player, engine) {
	
    // Engine.
    this.engine = engine;
    
    // Particle info.
    this.image = image;
    this.player = player;
    
    // Timing.
    this.time = Date.now();
	
    // Position and physics.
    this.x = this.player.x;
    this.y = this.player.y;
    this.angle = Math.random() * 2 * Math.PI
    this.xv = Math.cos(this.angle) * XV_PARTICLE;
    this.yv = Math.sin(this.angle) * YV_PARTICLE;

    if (this.player.y > this.engine.canvas.height) {
        this.yv = -Math.abs(this.yv);
        this.y = this.engine.canvas.height + 10;
    }
	
    // Update the particles physics and remove if necessary.
    this.update = function(delta) {
                
        // Update position.
        this.yv += YV_GRAVITY;
        if (Math.abs(this.yv) > YV_TERMINAL) this.yv = (this.yv > 0 ? 1 : -1) * YV_TERMINAL;
        this.x += this.xv * delta;
        this.y += this.yv * delta;
    
        // Check if the particle has fallen out of the world.
        if (this.x + this.image.width < 0 || this.x > this.engine.canvas.width || 
            this.y + this.image.height < 0 || this.y > this.engine.canvas.height || 
            Date.now() - this.time > PARTICLE_TIMEOUT) {
            var index = this.player.particles.indexOf(this);
            this.player.particles.splice(index, 1);
        }
    }
	
    // Render the particle.
    this.render = function(context) {
        context.drawImage(this.image, this.x, this.y);
    }
}
