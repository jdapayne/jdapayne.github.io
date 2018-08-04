function Triangle(base, side1, side2, height) {
    // Won't acually use the constructor.
    // Instead, use `$.extend(new Triangle(), obj)`, where `obj` has the right attributes
    this.base = base;
    this.side1 = side1;
    this.side2 = side2;
    this.height = height

    this.area = function () {
        return this.base * this.height / 2;
    }

    this.isRightAngled = function () {
        return (this.height === this.side1 || this.height === this.side2)
    }

    this.isIsosceles = function () {
        return (this.side1 === this.side2)
    }

    this.maxSide = function () {
        return Math.max(this.base,this.side1,this.side2)
    }

    // separate scaleDown to avoid floating point errors
    this.scaleDown = function (sf) {
        this.base = this.base / sf;
        this.side1 = this.side1 / sf;
        this.side2 = this.side2 / sf;
        this.height = this.height /sf;
    }
}

var testTriangle = new Triangle(8,5,5,3);

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

function TriangleView(triangle) {
    this.A; //Point
    this.B;
    this.C;
    this.ht;
    this.labels;
    //TODO: Move most of drawTriangle in to a constructor for this

    this.minPoint =  function () { //top left of bounding rectangle
        var minx = Math.min(this.A.x,this.B.x,this.C.x,this.ht.x);
        var miny = Math.min(this.A.y,this.B.y,this.C.y,this.ht.y);
        return new Point(minx, miny);
    }

    this.maxPoint = function () { //bottom right of bounding rectangle
        var maxx = Math.max(this.A.x,this.B.x,this.C.x,this.ht.x);
        var maxy = Math.max(this.A.y,this.B.y,this.C.y,this.ht.y);
        return new Point(maxx, maxy);
    }

    // computed properties
    this.width = function () { 
        return this.maxPoint().x - this.minPoint().x;
    }
    this.height = function () {
        return this.maxPoint().y - this.minPoint().y;
    }
    this.centre = function () {
        if (this._centre) {return this._centre};
        var x = (this.minPoint().x + this.maxPoint().x)/2;
        var y = (this.minPoint().y + this.maxPoint().y)/2;
        this._centre = new Point(x,y);
        return this._centre;
    }

    this.allpoints = function () {
        return [this.A,this.B,this.C,this.ht,
            this.labels.base,this.labels.side1,this.labels.side2,this.labels.height]
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

function drawTriangle(triangle,canvas,options) {
    if (!(triangle instanceof Triangle)){
        throw new Error("drawTriangle is to be called on a triangle object only")
    }

    var defaults = {
        unit: "cm",
        font: "16px Arial",
        offset_factor: 15
    };

    var settings = $.extend({}, defaults, options);

    var ctx = canvas.getContext("2d");

    // Plot points - don't worry about scale etc yet
    // Vertices
    
    var view = new TriangleView();

    view.A = new Point(0, triangle.height);
    view.B = new Point(triangle.base, triangle.height);
    // bit of coordinate geometry gives:
    view.C = new Point(
        (triangle.base*triangle.base + triangle.side1*triangle.side1 - triangle.side2*triangle.side2)/
            (2*triangle.base), 0)
    view.ht = new Point(view.C.x, view.A.y);

    // set a flag for if we need to extend base
    var overhangright=false, overhangleft=false;
    if (view.C.x > view.B.x) {overhangright = true};
    if (view.C.x < view.A.x) {overhangleft = true};
    
    // Labels. Each object will have added a "text" attribute later
    var offset = triangle.maxSide()/settings.offset_factor;
    view.labels = {
        base:   new Point((view.A.x+view.B.x)/2, view.A.y + offset),
        side1:  new Point((view.A.x+view.C.x)/2 - offset, (view.A.y+view.C.y)/2),
        side2:  new Point((view.B.x+view.C.x)/2 + offset, (view.B.y+view.C.y)/2),
        height: new Point(view.C.x + offset, (2*view.A.y+view.C.y)/3)
    }

    // a nudge if needed
    if (overhangleft) {view.labels.height.x -= 2*offset};

    // First, rotate by a random amount
    var angle=2*Math.PI*Math.random();
    view.rotate(angle);

    // Scale to 80% of canvas size
    var sf = 0.8*Math.min(canvas.width/view.width(),canvas.height/view.height());
    view.scale(sf);

    // shift to centre
    view.translate(canvas.width/2-view.centre().x , canvas.height/2-view.centre().y);

    // Draw triangle
    ctx.moveTo(view.A.x,view.A.y);
    ctx.lineTo(view.B.x,view.B.y);
    ctx.lineTo(view.C.x,view.C.y);
    ctx.lineTo(view.A.x,view.A.y)
    ctx.stroke();
    ctx.fillStyle="LightGrey";
    ctx.fill();

    // Label sides
    ctx.font = settings.font;
    ctx.fillStyle = "Black";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(triangle.base.toString() + settings.unit,view.labels.base.x,view.labels.base.y);
    ctx.fillText(triangle.side1.toString() + settings.unit,view.labels.side1.x,view.labels.side1.y);
    ctx.fillText(triangle.side2.toString() + settings.unit,view.labels.side2.x,view.labels.side2.y);

    // Draw and label height - only if not a right angle triangle
    if (!triangle.isRightAngled()) {
        ctx.beginPath();
        ctx.setLineDash([5,3]);
        ctx.moveTo(view.C.x,view.C.y);
        ctx.lineTo(view.ht.x,view.ht.y);
        ctx.stroke();
        ctx.fillText(triangle.height+settings.unit,view.labels.height.x,view.labels.height.y);
    }

    // Extend base if needed
    if (overhangright) {
        ctx.beginPath();
        ctx.setLineDash([5,3]);
        ctx.moveTo(view.B.x,view.B.y);
        ctx.lineTo(view.ht.x,view.ht.y);
        ctx.stroke();
    }
    if (overhangleft) {
        ctx.beginPath();
        ctx.setLineDash([5,3]);
        ctx.moveTo(view.A.x,view.A.y);
        ctx.lineTo(view.ht.x,view.ht.y);
        ctx.stroke();
    }

    // debug
    //ctx.beginPath();
    //// red view.centre()
    //ctx.arc(view.centre().x, view.centre().y, 3, 0, 2 * Math.PI, false);
    //ctx.fillStyle = 'red';
    //ctx.fill();

    //// blue view.minPoint()
    //ctx.beginPath();
    //ctx.arc(view.minPoint().x, view.minPoint().y, 3, 0, 2 * Math.PI, false);
    //ctx.fillStyle = 'blue';
    //ctx.fill();

    //// gree view.maxPoint()
    //ctx.beginPath();
    //ctx.arc(view.maxPoint().x, view.maxPoint().y, 3, 0, 2 * Math.PI, false);
    //ctx.fillStyle = 'red';
    //ctx.fill();
}

function drawTriangleIn(triangle,div,options) {
    let canvas = $('<canvas width=300, height=250 class="triangle-view"/>');
    drawTriangle(triangle,canvas[0],options);
    canvas.appendTo(div);
}

