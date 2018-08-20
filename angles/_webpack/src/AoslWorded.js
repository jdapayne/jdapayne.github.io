import AoslAlgebraic from './AoslAlgebraic.js';
import LinExpr from './LinExpr.js';
import {randBetween} from './Utilities.js';


export default class AoslWorded extends AoslAlgebraic{
    // No idea if this is the best approach...
    constructor(expressions) {
        super(expressions);
    }

    static random(n, options) {
        function comparator(number,operator) {
            switch (operator) {
                case "*":
                    switch (number) {
                        case 1:  return "the same as";
                        case 2:  return "double";
                        default: return number + " times larger than";
                    }
                case "+":
                    switch (number) {
                        case 0:  return "the same as";
                        default: return Math.abs(number).toString() + "° " + ((number<0)?"less than":"more than");
                    }
            }
        }

        const defaults = {
            min_angle: 10,
            min_addend: -90,
            max_addend: 90,
            min_multiplier: 1,
            max_multiplier: 5,
            types: ["add","multiply"]
        }

        const settings = Object.assign({},defaults,options);
        
        // For now: just do it with two.
        let expressions = [new LinExpr(1,0)];
        let instructions = [];

        // Loop til we get one that works
        // Probably really inefficient!!

        let success = false;
        let attemptcount = 0;
        while (!success) {
            if (attemptcount === 10) {
                expressions.push(new LinExpr(1,0));
                console.log("Gave up");
                success = true;
            }
            for (let i=1; i<n; i++) {
                let diceroll = randBetween(0,settings.types.length-1);
                switch(settings.types[diceroll]) {
                    case "add": {
                        let addend = randBetween(settings.min_addend,settings.max_addend);
                        expressions.push(expressions[i-1].add(addend));
                        instructions.push(`Angle ${String.fromCharCode(65+i)} is ${comparator(addend,"+")} angle ${String.fromCharCode(64+i)}`);
                        break;
                    }
                    case "multiply": {
                        let multiplier = randBetween(settings.min_multiplier,settings.max_multiplier);
                        expressions.push(expressions[i-1].times(multiplier));
                        instructions.push(`Angle ${String.fromCharCode(65+i)} is ${comparator(multiplier,"*")} angle ${String.fromCharCode(64+i)}`);
                        break;
                    }
                }
            }
            // check it makes sense
            success = true;
            let expressionsum = expressions.reduce( (exp1,exp2) => exp1.add(exp2) );
            let x = LinExpr.solve(expressionsum,new LinExpr(0,180));

            expressions.forEach(function(expr) {
                if (!success || expr.eval(x) < settings.min_angle) {
                    success = false;
                    instructions = [];
                    expressions = [expressions[0]];
                }
            });

            attemptcount++;
        }
        console.log("Attempts: " + attemptcount);
        
        //let lastexpression = expressions[0];
        //for (let i=1;i<n;i++) {
            //let diceroll = Math.random();
            //if (Math.random() < 0.5) { // do adding
                //let addend = randBetween(settings.min_addend,settings.max_addend);
                //nextexpression = lastexpression.add(addend);
                //nextinstruction = `Angle ${String.fromCharCode(65+i)} is ${comparator(addend,"+")} angle ${String.fromCharCode(65+i-1)}`;
            //} else {
                //let multiplier = randBetween(settings.min_multiplier,settings.max_multiplier);
                //nextexpression = lastexpression.times(multiplier);
                //nextinstruction = `Angle ${String.fromCharCode(65+i)} is ${comparator(multiplier,"*")} angle ${String.fromCharCode(65+i-1)}`;
            //}
            //instructions.push(nextinstruction);
            //expressions.push(nextexpression);
            //lastexpression = nextexpression;
        //}

        let aosl = new AoslWorded(expressions);
        aosl.instructions = instructions;
        return aosl;
    }
}
