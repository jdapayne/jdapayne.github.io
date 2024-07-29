export default class ModRing {
  width: number = 500;
  height: number = 500;
  expression: string = 'n';
  modulus: number = 10; 

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
    const expression = this.expression.replace(/(\d+)n/,"$1*n")
    .replace("^", "**");
    console.log(`Evaluting ${expression} at n=${n}`);
    const evaluation =  eval(expression); //urgh
    if (typeof evaluation === 'number') {
      return evaluation;
    } else {
      throw new Error('Invalid expression');
    }
  }
  
  drawIn(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Canvas not supported');
    }
    const width = canvas.width = this.width;
    const height = canvas.height = this.height;
    const center = [width / 2, height / 2];
    const radius = width *0.45;
    
    ctx.clearRect(0, 0, width, height);
    ctx.beginPath();
    ctx.arc(center[0], center[1], radius, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.closePath();

    // Draw points and labels
    for (let i = 0; i < this.modulus; i++) {
      const x = radius * Math.cos(2 * Math.PI * i / this.modulus);
      const y = -radius * Math.sin(2 * Math.PI * i / this.modulus);
      const x2 = (radius+10) * Math.cos(2 * Math.PI * i / this.modulus);
      const y2 = -(radius+10) * Math.sin(2 * Math.PI * i / this.modulus);
      // Draw a dot at the point
      ctx.beginPath();
      ctx.arc(center[0] + x, center[1] + y, 3, 0, 2 * Math.PI);
      ctx.fill();
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'center';
      ctx.strokeText(i.toString(), center[0] + x2, center[1] + y2);
      ctx.closePath();
    }
    
    for (let i = 0; i < this.modulus; i++) {
      const x = radius * Math.cos(2 * Math.PI * i / this.modulus);
      const y = -radius * Math.sin(2 * Math.PI * i / this.modulus);
      const j = this.evaluateExpression(i);
      const xj = radius * Math.cos(2 * Math.PI * j / this.modulus);
      const yj = -radius * Math.sin(2 * Math.PI * j / this.modulus);

      ctx.strokeStyle = 'red';
      ctx.beginPath();
      ctx.moveTo(center[0] + x, center[0] + y);
      ctx.lineTo(center[0] + xj, center[0] + yj);
      ctx.stroke();
      ctx.closePath();
    }
    
  }
}
