import Aosl from './Aosl.js';
import Point from './Point.js';

export default class AoslView {
    constructor(aosl,radius,norotate) {
        // aosl :: Aosl
        // radius :: Number 
        
        this.aosl = aosl; // worth keeping a link to it
        
        this.O = new Point(0,0);
        this.A = new Point(radius,0);
        this.B = new Point(-radius,0);

        this.C = [];
        var totalangle = 0; // nb in radians
        for (var i=0;i<aosl.angles.length-1;i++) {
            totalangle += aosl.angles[i]*Math.PI/180;
            this.C[i] = Point.fromPolar(radius,totalangle);
        }

        this.labels = [];
        totalangle = 0;
        for (var i=0;i<aosl.angles.length;i++) {
            let theta = aosl.angles[i]
            this.labels[i] = {
                pos: Point.fromPolarDeg(radius*(0.4+5/theta),totalangle+theta/2),
                text: aosl.missing[i] == true ? "x°" : aosl.angles[i].toString() + "°"
            }
            totalangle+=theta;
        }

        if (!norotate) this.randomRotate();
    }

    get allpoints () {
        let allpoints = [this.A,this.O,this.B];
        allpoints = allpoints.concat(this.C);
        this.labels.forEach(function(l) {
            allpoints.push(l.pos)
        });
        return allpoints;
    }
    
    // transformations
    scale(sf) {
        this.allpoints.forEach(function(p){
            p.scale(sf)
        });
    }

    rotate(angle) {
        this.allpoints.forEach(function(p){
            p.rotate(angle)
        });
    }

    translate(x,y) {
        this.allpoints.forEach(function(p){
            p.x += x;
            p.y += y
        });
    }

    randomRotate() {
        var angle=2*Math.PI*Math.random();
        this.rotate(angle);
    }

    // draw
    drawIn(canvas) {
        this.translate(canvas.width/2,canvas.height/2); //centre

        var ctx = canvas.getContext("2d");

        ctx.clearRect(0,0,canvas.width,canvas.height); // clear

        ctx.beginPath();
        ctx.moveTo(this.A.x,this.A.y); // draw lines
        ctx.lineTo(this.B.x,this.B.y);
        for (var i=0;i<this.C.length;i++) {
            ctx.moveTo(this.O.x,this.O.y);
            ctx.lineTo(this.C[i].x,this.C[i].y);
        }
        ctx.stroke();

        ctx.font = "16px Arial",    // draw labels
        ctx.fillStyle = "Black";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        this.labels.forEach(function(l){
            ctx.fillText(l.text,l.pos.x,l.pos.y);
        });
        ctx.closePath();
    }
}

