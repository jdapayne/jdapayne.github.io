"use strict";
var CodeWheel = /** @class */ (function () {
    function CodeWheel(maxWidth, canvas, n, startLetter, rScale) {
        if (n === void 0) { n = 26; }
        if (startLetter === void 0) { startLetter = 'A'; }
        if (rScale === void 0) { rScale = 0.76; }
        this.shift = 0;
        this.innerRotation = 0;
        this.isDragging = false;
        this.mouseClickAngle = 0; // Angle of mouse when clicked
        this.mouseClickRotation = 0; // Angle of the wheel when clicked
        this.canvas = canvas;
        var viewportWidth = window.innerWidth;
        var viewportHeight = window.innerHeight;
        this.width = Math.min(viewportWidth, viewportHeight, maxWidth);
        this.height = this.width; // Make it a square
        this.n = n;
        this.startLetter = startLetter.charCodeAt(0);
        this.outerR = this.width / 2 - 5;
        this.stripWidth = this.outerR * (1 - rScale);
        this.innerR = rScale * this.outerR;
        this.canvas.width = this.width * 2; // Double the width for high resolution
        this.canvas.height = this.height * 2; // Double the height for high resolution
        this.canvas.style.width = this.width + "px";
        this.canvas.style.height = this.height + "px";
        var ctx = this.canvas.getContext('2d');
        if (!ctx) {
            throw new Error('2D Context is not supported');
        }
        this.ctx = ctx;
        this.ctx.scale(2, 2); // Scale the context to match the high resolution
        this.initEventListeners();
    }
    CodeWheel.prototype.initEventListeners = function () {
        this.canvas.addEventListener('mousedown', this.onStart.bind(this));
        this.canvas.addEventListener('mousemove', this.onMove.bind(this));
        this.canvas.addEventListener('mouseup', this.onEnd.bind(this));
        this.canvas.addEventListener('touchstart', this.onStart.bind(this));
        this.canvas.addEventListener('touchmove', this.onMove.bind(this));
        this.canvas.addEventListener('touchend', this.onEnd.bind(this));
    };
    CodeWheel.prototype.getEventCoordinates = function (event) {
        if (event instanceof MouseEvent) {
            return { x: event.clientX, y: event.clientY };
        }
        else {
            var touch = event.touches[0];
            return { x: touch.clientX, y: touch.clientY };
        }
    };
    CodeWheel.prototype.handleStart = function (x, y) {
        var radius = Math.sqrt(Math.pow((x - this.width / 2), 2) + Math.pow((y - this.height / 2), 2));
        if (radius > this.innerR)
            return;
        if (!this.isDragging) {
            this.isDragging = true;
            this.mouseClickAngle = Math.atan2(y - this.height / 2, x - this.width / 2);
            this.mouseClickRotation = this.innerRotation;
        }
    };
    CodeWheel.prototype.handleMove = function (x, y) {
        if (!this.isDragging)
            return;
        var currentAngle = Math.atan2(y - this.height / 2, x - this.width / 2);
        var angleDifference = this.mouseClickAngle - currentAngle;
        this.innerRotation = this.mouseClickRotation + angleDifference;
        this.render();
    };
    CodeWheel.prototype.handleEnd = function () {
        this.isDragging = false;
        this.updateShiftFromRotation();
        this.updateRotationFromShift();
        this.render();
    };
    CodeWheel.prototype.onStart = function (event) {
        var _a = this.getEventCoordinates(event), x = _a.x, y = _a.y;
        this.handleStart(x, y);
    };
    CodeWheel.prototype.onMove = function (event) {
        var _a = this.getEventCoordinates(event), x = _a.x, y = _a.y;
        this.handleMove(x, y);
    };
    CodeWheel.prototype.onEnd = function () {
        this.handleEnd();
    };
    CodeWheel.prototype.render = function () {
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.drawOuter();
        this.drawInner();
    };
    CodeWheel.prototype.setShift = function (shift) {
        this.shift = shift;
        this.updateRotationFromShift();
        this.render();
    };
    CodeWheel.prototype.shiftUp = function () {
        this.shift = (this.shift + 1) % this.n;
        this.updateRotationFromShift();
        this.render();
    };
    CodeWheel.prototype.shiftDown = function () {
        this.shift = (this.shift - 1 + this.n) % this.n;
        this.updateRotationFromShift();
        this.render();
    };
    CodeWheel.prototype.drawOuter = function () {
        this.drawCircle(this.innerR);
        this.drawCircle(this.outerR);
        for (var i = 0; i < this.n; i++) {
            this.drawLine(i);
            this.drawLetter(i);
        }
    };
    CodeWheel.prototype.drawInner = function () {
        var innerInnerR = this.innerR - this.stripWidth;
        this.drawCircle(innerInnerR);
        for (var i = 0; i < this.n; i++) {
            var letter = String.fromCharCode(this.startLetter + i).toLowerCase();
            this.drawLine(i, innerInnerR, this.innerR, this.innerRotation);
            this.drawLetter(i, innerInnerR, this.innerR, letter, this.innerRotation);
        }
    };
    CodeWheel.prototype.drawCircle = function (radius) {
        // Draw the outer circle
        this.ctx.beginPath();
        this.ctx.arc(this.width / 2, this.height / 2, radius, 0, Math.PI * 2);
        this.ctx.strokeStyle = 'black';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
    };
    CodeWheel.prototype.drawLine = function (i, innerR, outerR, rotation) {
        if (innerR === void 0) { innerR = this.innerR; }
        if (outerR === void 0) { outerR = this.outerR; }
        if (rotation === void 0) { rotation = 0; }
        var stepAngle = Math.PI * 2 / this.n;
        var angle = Math.PI / 2 + stepAngle / 2 - i * stepAngle + rotation;
        var startPoint = {
            x: innerR * Math.cos(angle),
            y: -innerR * Math.sin(angle)
        };
        var endPoint = {
            x: outerR * Math.cos(angle),
            y: -outerR * Math.sin(angle)
        };
        this.ctx.beginPath();
        this.ctx.moveTo(this.width / 2 + startPoint.x, this.height / 2 + startPoint.y);
        this.ctx.lineTo(this.width / 2 + endPoint.x, this.height / 2 + endPoint.y);
        this.ctx.stroke();
    };
    CodeWheel.prototype.drawLetter = function (i, innerR, outerR, letterOverride, rotation) {
        if (innerR === void 0) { innerR = this.innerR; }
        if (outerR === void 0) { outerR = this.outerR; }
        if (rotation === void 0) { rotation = 0; }
        var stepAngle = Math.PI * 2 / this.n;
        var letter = letterOverride !== null && letterOverride !== void 0 ? letterOverride : String.fromCharCode(this.startLetter + i);
        var angle = Math.PI / 2 - i * stepAngle + rotation;
        var rotateAngle = i * stepAngle;
        this.ctx.font = '30px "AbeeZee", sans-serif';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        var textPoint = {
            x: (innerR + outerR) / 2 * Math.cos(angle) + this.width / 2,
            y: -(innerR + outerR) / 2 * Math.sin(angle) + this.height / 2
        };
        // Save the current canvas state
        this.ctx.save();
        // Translate to the text position
        this.ctx.translate(textPoint.x, textPoint.y);
        // Rotate the canvas by the desired angle
        this.ctx.rotate(Math.PI / 2 - angle);
        // Draw the text
        this.ctx.fillText(letter, 0, 0);
        // Restore the canvas state
        this.ctx.restore();
    };
    /** Set rotation to match with shift */
    CodeWheel.prototype.updateRotationFromShift = function () {
        this.innerRotation = Math.PI * 2 / this.n * this.shift;
    };
    CodeWheel.prototype.updateShiftFromRotation = function () {
        this.shift = Math.round(this.innerRotation / (Math.PI * 2 / this.n));
    };
    return CodeWheel;
}());
// Instantiate the CodeWheel class and call the setup method
var canvas = document.createElement('canvas');
document.body.appendChild(canvas);
var codeWheel = new CodeWheel(500, canvas);
codeWheel.setShift(5);
codeWheel.render();
