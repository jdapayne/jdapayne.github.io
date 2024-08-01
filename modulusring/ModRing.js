export default class ModRing {
    constructor(width = 500, height = 500, modulus = 10) {
        this.width = 500;
        this.height = 500;
        this.expression = 'n';
        this.modulus = 10;
        this.singlePath = false;
        this.start = 1;
        this.drawArrows = false;
        this.width = width;
        this.height = height;
    }
    /**
     *  Valideate whether the expression is valid
     *
     * Expression is valide if it contains only numbers, n, +, -, *, /, and ^
     */
    validateExpression() {
        const regex = /^[0-9n+\-*/^()]+$/;
        return regex.test(this.expression);
    }
    /**
     * Evalueate the expression at the value n.
     * @param n
     */
    evaluateExpression(n) {
        this.validateExpression();
        const expression = this.expression.replace(/(\d+)n/, "$1*n")
            .replace("^", "**");
        console.log(`Evaluting ${expression} at n=${n}`);
        const evaluation = eval(expression); //urgh
        if (typeof evaluation === 'number') {
            return evaluation;
        }
        else {
            throw new Error('Invalid expression');
        }
    }
    /**
     * Draws the circle with labels on the canvas
     * @param ctx CanvasRenderingContext2D The context to draw the circle in
     */
    drawCircle(ctx, center, radius) {
        ctx.beginPath();
        ctx.arc(center[0], center[1], radius, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.closePath();
        const fontSize = this.modulus > 30 ? 35 : 45;
        const offset = this.modulus > 30 ? 30 : 35;
        // Draw points and labels
        for (let i = 0; i < this.modulus; i++) {
            const x = radius * Math.cos(2 * Math.PI * i / this.modulus);
            const y = -radius * Math.sin(2 * Math.PI * i / this.modulus);
            const x2 = (radius + offset) * Math.cos(2 * Math.PI * i / this.modulus);
            const y2 = -(radius + offset) * Math.sin(2 * Math.PI * i / this.modulus);
            // Draw a dot at the point
            ctx.beginPath();
            ctx.arc(center[0] + x, center[1] + y, 6, 0, 2 * Math.PI);
            ctx.fill();
            ctx.font = `${fontSize}px "ABeeZee", sans-serif`;
            ctx.textBaseline = 'middle';
            ctx.textAlign = 'center';
            if (this.modulus < 70) {
                ctx.fillText(i.toString(), center[0] + x2, center[1] + y2);
            }
            ctx.closePath();
        }
    }
    drawIn(canvas) {
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            throw new Error('Canvas not supported');
        }
        const width = canvas.width = this.width * 2;
        const height = canvas.height = this.height * 2;
        canvas.style.width = this.width + 'px';
        canvas.style.height = this.height + 'px';
        const center = [width / 2, height / 2];
        const radius = width * 0.43;
        ctx.clearRect(0, 0, width, height);
        this.drawCircle(ctx, center, radius);
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 4;
        if (this.singlePath) {
            this.drawPathIn(ctx, center, radius);
        }
        else {
            this.drawAllIn(ctx, center, radius);
        }
    }
    drawAllIn(ctx, center, radius) {
        for (let i = 0; i < this.modulus; i++) {
            const x = radius * Math.cos(2 * Math.PI * i / this.modulus);
            const y = -radius * Math.sin(2 * Math.PI * i / this.modulus);
            const j = this.evaluateExpression(i);
            const xj = radius * Math.cos(2 * Math.PI * j / this.modulus);
            const yj = -radius * Math.sin(2 * Math.PI * j / this.modulus);
            drawLine(ctx, center[0] + x, center[0] + y, center[0] + xj, center[0] + yj, this.drawArrows);
        }
    }
    drawPathIn(ctx, center, radius) {
        const start = this.start;
        let path = [];
        let current = start;
        while (true) {
            path.push(current);
            const next = this.evaluateExpression(current) % this.modulus;
            if (path.includes(next)) {
                break;
            }
            current = next;
        }
        console.log(path);
        path.forEach(i => {
            const x = radius * Math.cos(2 * Math.PI * i / this.modulus);
            const y = -radius * Math.sin(2 * Math.PI * i / this.modulus);
            const j = this.evaluateExpression(i);
            const xj = radius * Math.cos(2 * Math.PI * j / this.modulus);
            const yj = -radius * Math.sin(2 * Math.PI * j / this.modulus);
            drawLine(ctx, center[0] + x, center[0] + y, center[0] + xj, center[0] + yj, this.drawArrows);
        });
    }
}
function drawLine(ctx, x1, y1, x2, y2, arrow = false, size = 20, offset = 30) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    if (arrow) {
        const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
        const unitVector = [(x2 - x1) / length, (y2 - y1) / length];
        const normalVector = [-unitVector[1], unitVector[0]];
        const pt0 = [
            x2 - unitVector[0] * (size + offset) + normalVector[0] * size / 2,
            y2 - unitVector[1] * (size + offset) + normalVector[1] * size / 2
        ];
        const pt1 = [x2 - unitVector[0] * offset, y2 - unitVector[1] * offset];
        const pt2 = [
            x2 - unitVector[0] * (size + offset) - normalVector[0] * size / 2,
            y2 - unitVector[1] * (size + offset) - normalVector[1] * size / 2
        ];
        ctx.moveTo(pt0[0], pt0[1]);
        ctx.lineTo(pt1[0], pt1[1]);
        ctx.lineTo(pt2[0], pt2[1]);
    }
    ctx.stroke();
    ctx.closePath();
}
//# sourceMappingURL=ModRing.js.map