var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var width = document.documentElement.clientWidth;
var height = document.documentElement.clientHeight;
var DELTA = Math.PI / 15;
var SPLIT = Math.floor(width / 40);
var x = [width / 2];
var y = [height / 2];
var dir = [Math.PI / 2]; //up
var colour = [[255, 255, 255]];
var steps = 0;
var requestId;
var leftSplit = DELTA;
var rightSplit = DELTA;
var canvas = document.getElementById("cvs");
var ctx = canvas.getContext("2d");
var counter = document.getElementById("counter");
document.getElementById("randomSplit").addEventListener("click", function () {
    reset();
    randomSplit();
});
document.getElementById("nonRandomTree").addEventListener("click", function () {
    reset();
    leftSplit = DELTA;
    rightSplit = DELTA;
    SPLIT = Math.floor(width / 70);
    ctx.fillStyle = 'rgba(255,255,255,0.2)';
    dir = [-Math.PI / 2];
    y = [0.9 * canvas.height];
    nonRandomTree();
});
document.getElementById("randomishTree").addEventListener("click", function () {
    reset();
    leftSplit = Math.random() * Math.PI / 3;
    rightSplit = Math.random() * Math.PI / 3;
    SPLIT = 20;
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    dir = [Math.random() * Math.PI * 2];
    nonRandomTree();
});
canvas.width = width;
canvas.height = height;
function nonRandomTree() {
    var _a;
    var n = x.length;
    for (var i = 0; i < n; i++) {
        ctx.fillRect(x[i], y[i], 1, 1);
        _a = move(x[i], y[i], dir[i], 2), x[i] = _a[0], y[i] = _a[1]; // Method 1
    }
    if (steps % SPLIT === 0) {
        for (var i = 0; i < n; i++) {
            x.push(x[i]);
            y.push(y[i]);
            dir.push(dir[i] - leftSplit);
            dir[i] += rightSplit;
        }
    }
    counter.innerHTML = "frames: " + steps + "<br>Paths: " + n;
    steps++;
    requestId = requestAnimationFrame(nonRandomTree);
}
function reset() {
    if (requestId)
        cancelAnimationFrame(requestId);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    x = [width / 2];
    y = [height / 2];
    dir = [Math.PI / 2]; //up
    colour = [[255, 255, 255]];
    steps = 0;
}
function randomSplit() {
    var _a;
    //move/draw each point
    var n = x.length;
    for (var i = 0; i < n; i++) {
        ctx.fillStyle = "rgb(" + colour[i][0] + "," + colour[i][1] + "," + colour[i][2] + ")";
        ctx.fillRect(x[i], y[i], 1, 1);
        _a = move(x[i], y[i], dir[i]), x[i] = _a[0], y[i] = _a[1];
        dir[i] += coinToss() ? DELTA : -DELTA;
        if (steps % 60 === 0 && Math.random() < 1 / (i + 1)) {
            x.push(x[i]);
            y.push(y[i]);
            dir.push(dir[i]);
            colour.push(nudgeColour(colour[i]));
        }
    }
    //split
    counter.innerHTML = steps.toString();
    steps++;
    requestId = requestAnimationFrame(randomSplit);
}
function move(x, y, dir, dist) {
    dist = dist !== null && dist !== void 0 ? dist : 1;
    x += dist * Math.cos(dir);
    y += dist * Math.sin(dir);
    return [x, y];
}
function coinToss() {
    return (Math.random() < 0.5);
}
function nudgeColour(rgb, d) {
    d = d !== null && d !== void 0 ? d : 30;
    var index = Math.floor(Math.random() * 3);
    var change = rgb[index] === 255 ? -d :
        rgb[index] === 0 ? +d :
            coinToss() ? +d : -d;
    var newRgb = __spreadArrays(rgb);
    newRgb[index] += change;
    return newRgb;
}
