function Bullet(player) {

    // Sprite.
    this.image = sprites.bullet;

    // Core information.
    this.x = player.x ;
    this.y = player.y + player.image.height / 2 - this.image.height / 2;
    this.direction = player.direction;
    this.player = player;

    if (this.direction == -1) this.x -= this.image.width + 1;
    else this.x += this.player.image.width;

    // Update.
    this.update = function (delta) {

        // Move in the direction.
        this.x += XV_BULLET * this.direction * delta;

    };

    // Render.
    this.render = function (context) {

        // Render the bullet.
        context.drawImage(this.image, this.x, this.y);

    };

    // Get the bounding box.
    this.bbox = function () {

        return [this.x, this.y, this.image.width, this.image.height];

    }

}
