var ModRing = /** @class */ (function () {
    function ModRing(width, height, modulus) {
        if (width === void 0) { width = 500; }
        if (height === void 0) { height = 500; }
        if (modulus === void 0) { modulus = 10; }
        this.width = 500;
        this.height = 500;
        this.expression = 'n';
        this.modulus = 10;
        this.width = width;
        this.height = height;
    }
    /**
     *  Valideate whether the expression is valid
     *
     * Expression is valide if it contains only numbers, n, +, -, *, /, and ^
     */
    ModRing.prototype.validateExpression = function () {
        var regex = /^[0-9n+\-*/^()]+$/;
        return regex.test(this.expression);
    };
    /**
     * Evalueate the expression at the value n.
     * @param n
     */
    ModRing.prototype.evaluateExpression = function (n) {
        this.validateExpression();
        var expression = this.expression.replace(/(\d+)n/, "$1*n")
            .replace("^", "**");
        console.log("Evaluting " + expression + " at n=" + n);
        var evaluation = eval(expression); //urgh
        if (typeof evaluation === 'number') {
            return evaluation;
        }
        else {
            throw new Error('Invalid expression');
        }
    };
    ModRing.prototype.drawIn = function (canvas) {
        var ctx = canvas.getContext('2d');
        if (!ctx) {
            throw new Error('Canvas not supported');
        }
        var width = canvas.width = this.width;
        var height = canvas.height = this.height;
        var center = [width / 2, height / 2];
        var radius = width * 0.45;
        ctx.clearRect(0, 0, width, height);
        ctx.beginPath();
        ctx.arc(center[0], center[1], radius, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.closePath();
        // Draw points and labels
        for (var i = 0; i < this.modulus; i++) {
            var x = radius * Math.cos(2 * Math.PI * i / this.modulus);
            var y = -radius * Math.sin(2 * Math.PI * i / this.modulus);
            var x2 = (radius + 10) * Math.cos(2 * Math.PI * i / this.modulus);
            var y2 = -(radius + 10) * Math.sin(2 * Math.PI * i / this.modulus);
            // Draw a dot at the point
            ctx.beginPath();
            ctx.arc(center[0] + x, center[1] + y, 3, 0, 2 * Math.PI);
            ctx.fill();
            ctx.textBaseline = 'middle';
            ctx.textAlign = 'center';
            ctx.strokeText(i.toString(), center[0] + x2, center[1] + y2);
            ctx.closePath();
        }
        for (var i = 0; i < this.modulus; i++) {
            var x = radius * Math.cos(2 * Math.PI * i / this.modulus);
            var y = -radius * Math.sin(2 * Math.PI * i / this.modulus);
            var j = this.evaluateExpression(i);
            var xj = radius * Math.cos(2 * Math.PI * j / this.modulus);
            var yj = -radius * Math.sin(2 * Math.PI * j / this.modulus);
            ctx.strokeStyle = 'red';
            ctx.beginPath();
            ctx.moveTo(center[0] + x, center[0] + y);
            ctx.lineTo(center[0] + xj, center[0] + yj);
            ctx.stroke();
            ctx.closePath();
        }
    };
    return ModRing;
}());
export default ModRing;
//# sourceMappingURL=ModRing.js.map