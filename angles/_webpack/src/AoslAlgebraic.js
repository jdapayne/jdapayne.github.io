import Aosl from './Aosl.js';
import LinExpr from './LinExpr.js';
import {randBetween, randMultBetween} from './Utilities';

export default class AoslAlgebraic extends Aosl{
    constructor(expressions) {
        // find the angles by solving
        let expressionsum = expressions.reduce( (exp1,exp2) => exp1.add(exp2) );
        let x = LinExpr.solve(expressionsum,new LinExpr(0,180));

        let angles = [];
        expressions.forEach(function(expr) {
            let angle = expr.eval(x);
            if (angle <= 0) {
                throw "negative angle";
            } else {
                angles.push(expr.eval(x))
            }
        });

        let missing = [];
        missing.length = angles.length;
        missing.fill(false);

        super(angles,missing);
        this.expressions = expressions;
        this.solution = x;
    }

    static random(n,options) {
        // generates random
        const defaults = {
            min_x_coeff: 0,
            max_x_coeff: 4,
            max_const: 90,
            min_angle: 10,
            min_x: 1,
            max_x: 30,
            multiple_of: 5
        }

        const settings = Object.assign({},defaults,options);

        let x = randBetween(settings.min_x,settings.max_x);
        let expressions = [];
        let angles = [];
        let aosl;
        let allconstant = true;

        let left=180;
        for (let i=0; i<n-1;i++) {
            let a = randBetween(settings.min_x_coeff,settings.max_x_coeff);
            left -= a*x;
            let maxb = Math.min(left - settings.min_angle*(n-i-1),settings.max_const);
            let minb = settings.min_angle - a*x;
            let b = randMultBetween(minb,maxb,settings.multiple_of);
            if (a !== 0) {allconstant = false};
            left -= b;
            expressions.push(new LinExpr(a,b));
            angles.push(a*x+b);
        }

        let last_min_x_coeff = allconstant? 1 : settings.min_x_coeff;
        //let a = randBetween(last_min_x_coeff,Math.min(settings.max_x_coeff,Math.floor(left/x)));
        let a = randBetween(last_min_x_coeff,settings.max_x_coeff);
        let b = left-a*x;
        let lastexpression = new LinExpr(a,b);
        expressions.splice(randBetween(0,n-1),0,lastexpression);

        console.log(lastexpression.toString());
        //console.log(`x = ${x}, expressions = ${expressions.map((e) => e.toString())}, angles = ${angles}`);

        return new AoslAlgebraic(expressions); 
    }
}
