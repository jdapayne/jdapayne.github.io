// Useful things

function randBetween(n,m) {
    // return a random integer between n and m inclusive
    return n+Math.floor(Math.random()*(m-n+1));
}


// Algebra stuff
function LinExpr(a,b) {
    this.a = a;
    this.b = b;
}

LinExpr.prototype.toString = function() {
    var string = "";

    // x term
    if (this.a===1) { string += "x"}
    else if (this.a===-1) { string += "-x"}
    else if (this.a!==0) { string += this.a + "x"}
    
    // sign
    if (this.a!==0 && this.b>0) {string += " + "}
    else if (this.a!==0 && this.b<0) {string += " - "}

    // constant
    if (this.b>0) {string += this.b}
    else if (this.b<0 && this.a===0) {string += this.b}
    else if (this.b<0) {string += Math.abs(this.b)}

    return string;
}

LinExpr.prototype.eval = function(x) {
    return this.a*x + this.b
}

LinExpr.prototype.add = function(that) {
    return new LinExpr(this.a+that.a,this.b+that.b)
}

LinExpr.solve = function(expr1, expr2) {
    // solves the two expressions set equal to each other
    return (expr2.b-expr1.b)/(expr1.a-expr2.a)
}


// General geometry stuff
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

// Aosl stuff

function Aosl(angles,missing) {
    // angles :: [int]
    // missing :: [boolean]
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

Aosl.random = function(n,minangle) {
    if (n < 2) return null;
    if (minangle === undefined) minangle = 10;

    var angles = [];
    var left = 180;
    for (i=0; i<n-1; i++) {
        let maxangle = left - minangle*(n-i-1);
        let nextangle = minangle + Math.floor(Math.random()*(maxangle-minangle));
        left -= nextangle;
        angles.push(nextangle);
    }
    angles[n-1] = left;

    var missing = [];
    missing.fill(false,0,n-1);
    missing[Math.floor(Math.random()*n)] = true;

    return new Aosl(angles,missing);
}

Aosl.randomrep = function(n,m,minangle) {
    // n: number of angle
    // m: number of repeated angles (must be <= n)
    if (n < 2) return null;
    if (m < 1) return null;
    if (m > n) return null;
    if (minangle === undefined) minangle = 10;

    // All missing - do as a separate case
    if (n === m) {
        var angles = [];
        angles.length = n;
        angles.fill(180/n);
        var missing = [];
        missing.length = n;
        missing.fill(true);

        return new Aosl(angles,missing);
    }

    var angles = [];
    var missing = [];
    missing.length = n;
    missing.fill(false);

    // choose a value for the missing angles
    var maxrepangle = (180-minangle*(n-m))/m;
    var repangle = minangle + Math.floor(Math.random()*(maxrepangle-minangle));

    // choose values for the other angles
    var otherangles = [];
    var left = 180 - repangle*m;

    for (i=0; i<n-m-1; i++) {
        let maxangle = left - minangle*(n-m-i-1);
        let nextangle = minangle + Math.floor(Math.random()*(maxangle-minangle));
        left -= nextangle;
        otherangles.push(nextangle);
    }
    otherangles[n-m-1] = left;

    // choose where the missing angles are
    var i=0;
    while (i<m) {
        let j = Math.floor(Math.random()*n);
        if (missing[j] === false) {
            missing[j] = true;
            angles[j] = repangle;
            i++
        }
    }

    // fill in the other angles

    var j=0;
    for (i=0;i<n;i++) {
        if (missing[i] === false) {
            angles[i] = otherangles[j];
            j++
        }
    }

    return new Aosl(angles,missing);
}


var testAosl = new Aosl([20,60,100],[false,true,false]);
var testAosl2 = new Aosl([40,100,40],[1,0,1]);

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
            text: aosl.missing[i] == true ? "x°" : aosl.angles[i].toString() + "°"
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
       

