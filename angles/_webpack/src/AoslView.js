import Aosl from './Aosl.js';
import Point from './Point.js';

export default class AoslView {
    constructor(aosl,radius) {
        // aosl :: Aosl
        // radius :: Number 
        
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
}

