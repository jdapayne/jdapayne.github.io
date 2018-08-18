import AoslAlgebraic from './AoslAlgebraic.js'
import AoslView from './AoslView.js'

export default class AoslViewAlgebraic extends AoslView{
    constructor(aosl, radius) {
        super(aosl,radius);

        this.labels.forEach(function(l,idx) {
            l.text = aosl.expressions[idx].toStringP() + "°";
        });
    }

    showAnswer() {
        if (this.answered) return; //nothing to do
        this.labels.forEach( (l,i) => {
            l.text = this.aosl.angles[i].toString() + "°";
            l.style = "answer";
        });
        return this.answered = true;
    }

    hideAnswer() {
        if (!this.answered) return; //nothing to do
        this.labels.forEach( (l,i) => {
            l.text = this.aosl.expressions[i].toStringP() + "°";
            l.style = "normal"
        });
        return this.answered = false;
    }
}
