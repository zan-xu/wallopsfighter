function Platform(x, y, w, h) {

    // Record the dimensions.
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;

    // Render the platform.
    this.render = function (context) {

        // Draw the rectangle.
        context.fillRect(this.x, this.y, this.w, this.h);

    };

    // Return the boundary box.
    this.bbox = function () {
        return [this.x, this.y, this.w, this.h];
    }

}
