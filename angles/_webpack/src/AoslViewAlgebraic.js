import AoslAlgebraic from './AoslAlgebraic.js'
import AoslView from './AoslView.js'

export default class AoslViewAlgebraic extends AoslView{
    constructor(aosl, radius) {
        super(aosl,radius);

        this.labels.forEach(function(l,idx) {
            l.text = aosl.expressions[idx].toString();
        });
    }
}
