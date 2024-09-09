export default class ModRing {
  width: number = 500;
  height: number = 500;
  expression: string = 'n';
  modulus: number = 10;
  singlePath: boolean = false;
  start: number = 1;
  drawArrows: boolean = false;

  constructor(width = 500, height = 500, modulus = 10) {
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
  evaluateExpression(n: number) {
    this.validateExpression();
    const expression = this.expression.replace(/(\d+)n/, "$1*n")
      .replace("^", "**");
    console.log(`Evaluting ${expression} at n=${n}`);
    const evaluation = eval(expression); //urgh
    if (typeof evaluation === 'number') {
      return evaluation;
    } else {
      throw new Error('Invalid expression');
    }
  }

  /**
   * Draws the circle with labels on the canvas
   * @param ctx CanvasRenderingContext2D The context to draw the circle in
   */
  drawCircle(ctx: CanvasRenderingContext2D, center: number[], radius: number) {
    ctx.beginPath();
    ctx.arc(center[0], center[1], radius, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.closePath();

    const fontSize = this.modulus > 30 ? 35 : 45;
    const offset = this.modulus > 30 ? 30 : 35;

    // Draw points and labels
    for (let i = 0; i < this.modulus; i++) {
      const angle = this.getAngle(i);
      const x = radius * Math.cos(angle);
      const y = -radius * Math.sin(angle);
      const x2 = (radius + offset) * Math.cos(angle);
      const y2 = -(radius + offset) * Math.sin(angle);
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

  drawIn(canvas: HTMLCanvasElement) {
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
    } else {
      this.drawAllIn(ctx, center, radius);
    }
  }

  getAngle(i: number) {
    return Math.PI / 2 - 2 * Math.PI * i / this.modulus;
  }

  drawAllIn(ctx: CanvasRenderingContext2D, center: number[], radius: number) {
    for (let i = 0; i < this.modulus; i++) {
      const angle = this.getAngle(i);
      const x = radius * Math.cos(angle);
      const y = -radius * Math.sin(angle);
      const j = this.evaluateExpression(i);
      const anglej = this.getAngle(j);
      const xj = radius * Math.cos(anglej);
      const yj = -radius * Math.sin(anglej);

      drawLine(ctx, center[0] + x, center[0] + y, center[0] + xj, center[0] + yj, this.drawArrows);
    }
  }

  drawPathIn(ctx: CanvasRenderingContext2D, center: number[], radius: number) {
    const start = this.start;
    let path: number[] = [];
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
      const angle = this.getAngle(i);
      const x = radius * Math.cos(angle);
      const y = -radius * Math.sin(angle);
      const j = this.evaluateExpression(i);
      const anglej = this.getAngle(j);
      const xj = radius * Math.cos(anglej);
      const yj = -radius * Math.sin(anglej);
      drawLine(ctx, center[0] + x, center[0] + y, center[0] + xj, center[0] + yj, this.drawArrows);
    });
  }
}

function drawLine(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, arrow: boolean = false, size: number = 20, offset: number = 30) {

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
