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
    var A = new Point(0, triangle.height);
    var B = new Point(triangle.base, triangle.height);
    // bit of coordinate geometry gives:
    var C = new Point(
        (triangle.base*triangle.base + triangle.side1*triangle.side1 - triangle.side2*triangle.side2)/
            (2*triangle.base), 0)
    var ht = new Point(C.x, A.y); // ht is where the altitude from C intersects AB

    // set a flag for if we need to extend base
    var overhangright=false, overhangleft=false;
    if (C.x > B.x) {overhangright = true};
    if (C.x < A.x) {overhangleft = true};
    
    // Labels. Each object will have added a "text" attribute later
    var offset = triangle.maxSide()/settings.offset_factor;
    var labels = {
        base:   new Point((A.x+B.x)/2, A.y + offset),
        side1:  new Point((A.x+C.x)/2 - offset, (A.y+C.y)/2),
        side2:  new Point((B.x+C.x)/2 + offset, (B.y+C.y)/2),
        height: new Point(C.x + offset, (2*A.y+C.y)/3)
    }

    // a nudge if needed
    if (overhangleft) {labels.height.x -= 2*offset};

    // First, rotate by a random amount
    var angle=2*Math.PI*Math.random();

    var allpoints = [A,B,C,ht,labels.base,labels.side1,labels.side2,labels.height];

    allpoints.forEach(function(p){p.rotate(angle)});

    // Scale so 80% of canvas size
    var maxx = Math.max(A.x,B.x,C.x,ht.x);
    var minx = Math.min(A.x,B.x,C.x,ht.x);
    var maxy = Math.max(A.y,B.y,C.y,ht.y);
    var miny = Math.min(A.y,B.y,C.y,ht.y);
    var totalwidth = maxx - minx;
    var totalheight = maxy - miny;
    var sf = 0.8*Math.min(canvas.width/(maxx-minx),canvas.height/(maxy-miny)); //80% of full canvas size

    allpoints.forEach(function(p){p.scale(sf)});

    // Now shift everything so there's a 10% gap
    // TO DO
    var minx = Math.min(A.x,B.x,C.x,ht.x);
    var miny = Math.min(A.y,B.y,C.y,ht.y);

    allpoints.forEach(function(p){
        p.x = p.x - minx + 0.1*canvas.width;
        p.y = p.y - miny + 0.1*canvas.width;
    });

    // Draw triangle
    ctx.moveTo(A.x,A.y);
    ctx.lineTo(B.x,B.y);
    ctx.lineTo(C.x,C.y);
    ctx.lineTo(A.x,A.y)
    ctx.stroke();
    ctx.fillStyle="LightGrey";
    ctx.fill();

    // Label sides
    ctx.font = settings.font;
    ctx.fillStyle = "Black";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(triangle.base.toString() + settings.unit,labels.base.x,labels.base.y);
    ctx.fillText(triangle.side1.toString() + settings.unit,labels.side1.x,labels.side1.y);
    ctx.fillText(triangle.side2.toString() + settings.unit,labels.side2.x,labels.side2.y);

    // Draw and label height - only if not a right angle triangle
    if (!triangle.isRightAngled()) {
        ctx.beginPath();
        ctx.setLineDash([5,3]);
        ctx.moveTo(C.x,C.y);
        ctx.lineTo(ht.x,ht.y);
        ctx.stroke();
        ctx.fillText(triangle.height+settings.unit,labels.height.x,labels.height.y);
    }

    // Extend base if needed
    if (overhangright) {
        ctx.beginPath();
        ctx.setLineDash([5,3]);
        ctx.moveTo(B.x,B.y);
        ctx.lineTo(ht.x,ht.y);
        ctx.stroke();
    }
    if (overhangleft) {
        ctx.beginPath();
        ctx.setLineDash([5,3]);
        ctx.moveTo(A.x,A.y);
        ctx.lineTo(ht.x,ht.y);
        ctx.stroke();
    }
}
