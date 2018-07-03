function drawTriangle(base,side1,side2,height,ra) {
        var unit = "cm";
	var font = "25px Arial";
	
	// First create the canvas
        // The width and height probably shouldn't be magic numbers
        var canvas = document.createElement("canvas");
        canvas.width = 300;
        canvas.height = 250;
        canvas.style = "margin: 20px";
	var ctx = canvas.getContext("2d");

        // Plot points - don't worry about scale etc yet
	// Vertices
	var Ax = 0, Ay=height;
	var Bx = base, By = height;
	var Cx = (base*base + side1*side1 - side2*side2)/(2*base); // A bit of coordinate geometry gets this
	var Cy = 0;
        var [htx, hty] = [Cx,Ay];

        // set a flag for if we need to extend base
        var overhangright=false, overhangleft=false;
        if (Cx > Bx) {overhangright = true};
        if (Cx < Ax) {overhangleft = true};
	
	// Labels
        var offset = Math.max(base,side1,side2)/15;
	var [label_base_x, label_base_y] = [(Ax+Bx)/2,Ay+offset];
	var label_side1_x = (Ax+Cx)/2 - offset, label_side1_y = (Ay+Cy)/2;
	var label_side2_x = (Bx+Cx)/2 + offset, label_side2_y = (By+Cy)/2;
	var label_height_x = Cx + offset, label_height_y = (2*Ay+Cy)/3;
        if (overhangleft) {label_height_x -= 2*offset};

	// First, rotate by a random amount about centroid
        var angle=2*Math.PI*Math.random();
        [Ax,Ay] = rotate(angle,Ax,Ay);
        [Bx,By] = rotate(angle,Bx,By);
        [Cx,Cy] = rotate(angle,Cx,Cy);
        [label_base_x,label_base_y] = rotate(angle,label_base_x,label_base_y);
        [label_side1_x,label_side1_y] = rotate(angle,label_side1_x,label_side1_y);
        [label_side2_x,label_side2_y] = rotate(angle,label_side2_x,label_side2_y);
        [label_height_x,label_height_y] = rotate(angle,label_height_x,label_height_y);
        [htx,hty] = rotate(angle,htx,hty);

	// Scale so 80% of canvas size
	var maxx = Math.max(Ax,Bx,Cx,htx);
	var minx = Math.min(Ax,Bx,Cx,htx);
	var maxy = Math.max(Ay,By,Cy,hty);
	var miny = Math.min(Ay,By,Cy,hty);
        var totalwidth = maxx - minx;
        var totalheight = maxy - miny;
        console.log("width=",totalwidth, "height=",totalheight);
        var sf = 0.8*Math.min(canvas.width/(maxx-minx),canvas.height/(maxy-miny)); //80% of full canvas size
        Ax = sf*Ax;
        Bx = sf*Bx;
        Cx = sf*Cx;
        Ay = sf*Ay;
        By = sf*By;
        Cy = sf*Cy;
        htx = sf*htx;
        hty = sf*hty;
        label_base_x = sf*label_base_x;
        label_base_y = sf*label_base_y;
        label_side1_x = sf*label_side1_x;
        label_side1_y = sf*label_side1_y;
        label_side2_x = sf*label_side2_x;
        label_side2_y = sf*label_side2_y;
        label_height_x = sf*label_height_x;
        label_height_y = sf*label_height_y;

	// Now shift everything so there's a 10% gap
	// TO DO
	var minx = Math.min(Ax,Bx,Cx,htx);
	var miny = Math.min(Ay,By,Cy,hty);
	Ax = Ax - minx + 0.1*canvas.width;
	Bx = Bx - minx + 0.1*canvas.width;
	Cx = Cx - minx + 0.1*canvas.width;
	htx = htx - minx + 0.1*canvas.width;
	Ay = Ay - miny + 0.1*canvas.height;
	By = By - miny + 0.1*canvas.height;
	Cy = Cy - miny + 0.1*canvas.height;
	hty = hty - miny + 0.1*canvas.height;
	label_base_x = label_base_x - minx + 0.1*canvas.width;
	label_base_y = label_base_y - miny + 0.1*canvas.height;
	label_side1_x = label_side1_x - minx + 0.1*canvas.width;
	label_side1_y = label_side1_y - miny + 0.1*canvas.height;
	label_side2_x = label_side2_x - minx + 0.1*canvas.width;
	label_side2_y = label_side2_y - miny + 0.1*canvas.height;
	label_height_x = label_height_x - minx + 0.1*canvas.width;
	label_height_y = label_height_y - miny + 0.1*canvas.height;

        // Draw triangle
	ctx.moveTo(Ax,Ay);
	ctx.lineTo(Bx,By);
	ctx.lineTo(Cx, Cy);
	ctx.lineTo(Ax,Ay)
	ctx.stroke();
        ctx.fillStyle="LightGrey";
        ctx.fill();

        // Label sides
        ctx.font = font;
        ctx.fillStyle = "Black";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(base + unit,label_base_x,label_base_y);
        ctx.fillText(side1 + unit,label_side1_x,label_side1_y);
        ctx.fillText(side2 + unit,label_side2_x,label_side2_y);

        // Draw and label height - only if not a right angle triangle
        if (!ra) {
            ctx.beginPath();
            ctx.setLineDash([5,3]);
            ctx.moveTo(Cx,Cy);
            ctx.lineTo(htx,hty);
            ctx.stroke();
            ctx.fillText(height+unit,label_height_x,label_height_y);
        }

        // Extend base if needed
        if (overhangright) {
            ctx.beginPath();
            ctx.setLineDash([5,3]);
            ctx.moveTo(Bx,By);
            ctx.lineTo(htx,hty);
            ctx.stroke();
        }
        if (overhangleft) {
            ctx.beginPath();
            ctx.setLineDash([5,3]);
            ctx.moveTo(Ax,Ay);
            ctx.lineTo(htx,hty);
            ctx.stroke();
        }

        // Put it in
        document.body.appendChild(canvas);
}

//function rotate(angle,centre_x,centre_y,x,y) {
	//// Translate so centre is now origin
	//x = x - centre_x;
	//y = y - centre_y;
	//// Rotate
	//var newx, newy;
	//newx = Math.cos(angle)*x - Math.sin(angle)*y;
	//newy = Math.sin(angle)*x + Math.cos(angle)*y;
	//// Shift back
	//x = newx + centre_x;
	//y = newy + centre_y;
	
	//return [x,y];
//}

function rotate(angle,x,y) {
	// Translate so centre is now origin
	var newx, newy;
	newx = Math.cos(angle)*x - Math.sin(angle)*y;
	newy = Math.sin(angle)*x + Math.cos(angle)*y;
	return [newx,newy];
}
