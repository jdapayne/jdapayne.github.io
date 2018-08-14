function Point(x,y) {
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

function Aosl(angles,missing) {
    // angles :: [int]
    // missing :: int
    if (angles === []) {throw new Error("argument must not be empty")};

    let anglesum = 0;
    for (i=0;i<angles.length;i++) {
        anglesum += angles[i];
    };
    if (anglesum !== 180) {throw new Error("Angle sum must be 180")};

    this.angles = angles;

    this.missing = missing

    // Should probably have info about which angle is missing.
}

Aosl.random = function(n) {
    if (n < 2) return null;
    var angles = [];
    var left = 180;
    for (i=0; i<n-1; i++) {
        let nextangle = 10+Math.floor(Math.random()*(left-20));
        left -= nextangle;
        angles.push(nextangle);
    }
    angles[n-1] = left;
    missing = Math.floor(Math.random()*n);

    return new Aosl(angles,missing);
}


var testAosl = new Aosl([20,60,100],1);

function AoslView(aosl,radius) {
    // aosl :: Aosl
    // radius :: Number 
    
    this.O = new Point(0,0);
    this.A = new Point(radius,0);
    this.B = new Point(-radius,0);

    this.C = [];
    var totalangle = 0; // nb in radians
    for (i=0;i<aosl.angles.length-1;i++) {
        totalangle += aosl.angles[i]*Math.PI/180;
        this.C[i] = Point.fromPolar(radius,totalangle);
    }

    this.labels = [];
    totalangle = 0;
    for (i=0;i<aosl.angles.length;i++) {
        let theta = aosl.angles[i]
        this.labels[i] = {
            pos: Point.fromPolarDeg(radius*(0.4+5/theta),totalangle+theta/2),
            text: aosl.missing === i ? "x°" : aosl.angles[i].toString() + "°"
        }
        totalangle+=theta;
    }

    this.allpoints = function () {
        var allpoints = [this.A,this.O,this.B];
        allpoints = allpoints.concat(this.C);
        this.labels.forEach(function(l) {
            allpoints.push(l.pos)
        });
        return allpoints;
    }
    
    // transformations
    this.scale = function(sf) {
        this.allpoints().forEach(function(p){
            p.scale(sf)
        });
    }
    this.rotate = function(angle) {
        this.allpoints().forEach(function(p){
            p.rotate(angle)
        });
    }
    this.translate = function(x,y) {
        this.allpoints().forEach(function(p){
            p.x += x;
            p.y += y
        });
    }
}

function drawAosl(aosl,canvas) {
    var ctx = canvas.getContext("2d");
    var view = new AoslView(aosl,canvas.width/3,50);

    // transform
    var angle=2*Math.PI*Math.random();
    view.rotate(angle);
    view.translate(canvas.width/2,canvas.height/2);

    // draw lines
    ctx.moveTo(view.A.x,view.A.y);
    ctx.lineTo(view.B.x,view.B.y);
    
    for (i=0;i<view.C.length;i++) {
        ctx.moveTo(view.O.x,view.O.y);
        ctx.lineTo(view.C[i].x,view.C[i].y);
    }
    ctx.stroke();

    // draw labels
    ctx.font = "16px Arial",
    ctx.fillStyle = "Black";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    
    view.labels.forEach(function(l){
        ctx.fillText(l.text,l.pos.x,l.pos.y);
    });
    ctx.stroke();
}
       

