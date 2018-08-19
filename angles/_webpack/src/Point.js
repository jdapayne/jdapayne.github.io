export default class Point {
    constructor (x,y) {
        this.x = x;
        this.y = y;
    }

    rotate (angle) {
        var newx, newy;
        newx = Math.cos(angle)*this.x - Math.sin(angle)*this.y;
        newy = Math.sin(angle)*this.x + Math.cos(angle)*this.y;
        this.x = newx;
        this.y = newy
    }

    scale (sf) {
        this.x = this.x * sf;
        this.y = this.y * sf;
    }

    translate(x,y) {
        this.x += x;
        this.y += y
    }

    static fromPolar (r,theta) {
        return new Point(
            Math.cos(theta)*r,
            Math.sin(theta)*r
        )
    }

    static fromPolarDeg (r,theta) {
        theta = theta*Math.PI/180;
        return Point.fromPolar(r,theta)
    }
}
