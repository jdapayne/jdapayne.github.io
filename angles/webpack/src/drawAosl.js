import AoslView from './AoslView.js';

// TODO: This needs splitting into (a) preprosessing the Aosl (rotating, fudging etc) and (b) drawing from the AoslView

export default function drawAosl(aosl,canvas) {
    var ctx = canvas.getContext("2d");
    var view = new AoslView(aosl,canvas.width/3,50);

    // transform
    var angle=2*Math.PI*Math.random();
    view.rotate(angle);
    view.translate(canvas.width/2,canvas.height/2);

    // draw lines
    ctx.moveTo(view.A.x,view.A.y);
    ctx.lineTo(view.B.x,view.B.y);
    
    for (var i=0;i<view.C.length;i++) {
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
