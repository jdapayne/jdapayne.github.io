import AoslAlgebraic from './AoslAlgebraic.js';
import AoslView from './AoslView.js';
import Point from './Point.js';

export default class AoslViewAlgebraic extends AoslView{
    constructor(aosl, radius, width, height) {
        super(aosl,radius, width, height);

        this.labels.forEach(function(l,idx) {
            l.text = aosl.expressions[idx].toStringP() + "°";
        });

        this.labels.push(
            {
                text: "x = " + aosl.solution,
                pos: new Point(10, height - 10),
                style: "extra-answer",
                hidden: true
            }
        )
    }

    showAnswer() {
        if (this.answered) return; //nothing to do
        for (let i=0; i<this.labels.length-1; i++) {
            this.labels[i].text = this.aosl.angles[i].toString() + "°";
            this.labels[i].style = "answer";
        }
        this.labels[this.labels.length - 1].hidden = false;

        return this.answered = true;
    }

    hideAnswer() {
        if (!this.answered) return; //nothing to do
        for (let i=0; i<this.labels.length-1; i++) {
            this.labels[i].text = this.aosl.expressions[i].toStringP() + "°";
            this.labels[i].style = "normal";
        }
        this.labels[this.labels.length - 1].hidden = true;
        return this.answered = false;
    }
}
