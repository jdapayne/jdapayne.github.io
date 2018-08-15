export default function Point(x,y) {
    this.x = x;
    this.y = y;

    this.rotate = function (angle) {
        var newx, newy;
        newx = Math.cos(angle)*this.x - Math.sin(angle)*this.y;
        newy = Math.sin(angle)*this.x + Math.cos(angle)*this.y;
        this.x = newx;
        this.y = newy
    };

    this.scale = function (sf) {
        this.x = this.x * sf;
        this.y = this.y * sf;
    }
}

Point.fromPolar = function (r,theta) {
    return new Point(
        Math.cos(theta)*r,
        Math.sin(theta)*r
    )
}

Point.fromPolarDeg = function (r,theta) {
    theta = theta*Math.PI/180;
    return Point.fromPolar(r,theta)
}
