import AoslAlgebraic from './AoslAlgebraic.js';
import LinExpr from './LinExpr.js';
import {randBetween} from './Utilities.js';


export default class AoslWorded extends AoslAlgebraic{
    // No idea if this is the best approach...
    constructor(expressions) {
        super(expressions);
    }

    static random(n, options) {
        const defaults = {
            min_addend: -90,
            max_addend: 90,
            min_multiplier: 1,
            max_multiplier: 5
        }

        const settings = Object.assign({},defaults,options);

        //let expressions = [new LinExpr(1,0)]; // x - their job to do this
        //for (let i=1; i<n; i++) {
            //let nextexpr;
            //if (Math.random()<0.5) {
                //nextexpr
        
        // For now: just do it with two.
        let expressions = [new LinExpr(1,0)];
        let instructions = [];
        let nextexpression;
        let nextinstruction;
        let lastexpression = expressions[0];
        for (let i=1;i<n;i++) {
            if (Math.random() < 0.5) { // do adding
                let addend = randBetween(settings.min_addend,settings.max_addend);
                nextexpression = lastexpression.add(addend);
                nextinstruction = 
                    `Angle ${String.fromCharCode(65+i)} is ${Math.abs(addend)}° ${(addend<0)?"less":"more"} than angle ${String.fromCharCode(65+i-1)}`;
            } else {
                let multiplier = randBetween(settings.min_multiplier,settings.max_multiplier);
                nextexpression = lastexpression.times(multiplier);
                nextinstruction = `Angle ${String.fromCharCode(65+i)} is ${multiplier} times larger than angle ${String.fromCharCode(65+i-1)}`;
            }
            instructions.push(nextinstruction);
            expressions.push(nextexpression);
            lastexpression = nextexpression;
        }

        let aosl = new AoslWorded(expressions);
        aosl.instructions = instructions;
        return aosl;
    }
}
