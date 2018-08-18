import Aosl from './Aosl.js';
import Point from './Point.js';

export default class AoslView {
    constructor(aosl,radius,norotate) {
        // aosl :: Aosl
        // radius :: Number 
        
        this.aosl = aosl; // worth keeping a link to it
        this.answered = false;
        
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
                text: aosl.missing[i] == true ? "x°" : aosl.angles[i].toString() + "°",
                style: "normal"
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
        this.translate(canvas.width/2-this.O.x,canvas.height/2-this.O.y); //centre

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

        // labels
        this.labels.forEach(function(l){
            if (!l.hidden) {
                ctx.font = AoslView.styles.get(l.style).font;
                ctx.fillStyle = AoslView.styles.get(l.style).colour;
                ctx.textAlign = AoslView.styles.get(l.style).align;
                ctx.textBaseline = AoslView.styles.get(l.style).baseline;
                ctx.fillText(l.text,l.pos.x,l.pos.y);
            }
        });
        ctx.closePath();
    }

    showAnswer() {
        if (this.answered) return; //nothing to do
        this.labels.forEach( (l,i) => {
            if (this.aosl.missing[i]) {
                l.text = this.aosl.angles[i].toString() + "°";
                l.style = "answer";
            }
        });
        return this.answered = true;
    }

    hideAnswer() {
        if (!this.answered) return; //nothing to do
        this.labels.forEach( (l,i) => {
            if (this.aosl.missing[i]) {
                l.text = "x°"
                l.style = "normal";
            }
        });
        return this.answered = false;
    }

    toggleAnswer() {
        if (this.answered) return this.hideAnswer();
        else return this.showAnswer();
    }
}

AoslView.styles = new Map([
    ["normal" , {font: "16px Arial", colour: "Black", align: "center", baseline: "middle"}],
    ["answer" , {font: "16px Arial", colour: "Red", align: "center", baseline: "middle"}],
    ["extra-answer", {font: "16px Arial", colour: "Red", align: "left", baseline: "bottom"}]
]);
