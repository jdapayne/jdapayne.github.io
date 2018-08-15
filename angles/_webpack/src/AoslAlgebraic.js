import Aosl from './Aosl.js';
import LinExpr from './LinExpr.js';

export default class AoslAlgebraic extends Aosl{
    constructor(expressions) {
        // find the angles by solving
        let expressionsum = expressions.reduce( (exp1,exp2) => exp1.add(exp2) );
        let x = LinExpr.solve(expressionsum,180);

        let angles = [];
        expressions.forEach(function(expr) {
            let angle = expr.eval(x);
            if (angle <= 0) {
                throw new Error("Non-positive angles")
            } else {
                angles.push(expr.eval(x))
            }
        });

        super(angles);
        this.expressions = expressions;
    }
}
