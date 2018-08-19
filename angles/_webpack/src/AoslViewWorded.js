import AoslView from './AoslView.js';
import Point from './Point.js';

export default class AoslViewWorded extends AoslView{
    constructor(aosl, radius, width, height) {
        super(aosl,radius, width, height);

        this.labels.forEach(function(l,i) {
            l.text = String.fromCharCode(65+i);
        });

        this.aosl.instructions.forEach( (instruction, i) => {
            this.labels.push(
                {
                    text: instruction,
                    pos: new Point(10, height - 10 - 15*i), //this is not idea - assumes fixed font height
                    style: "extra-info",
                    hidden: false
                }
            )
        });
    }

    showAnswer() {
        if (this.answered) return; //nothing to do
        for (let i=0; i<this.labels.length-1; i++) {
            this.labels[i].text = this.aosl.angles[i].toString() + "°";
            this.labels[i].style = "answer";
        }

        return this.answered = true;
    }

    hideAnswer() {
        if (!this.answered) return; //nothing to do
        for (let i=0; i<this.labels.length-1; i++) {
            this.labels[i].text = String.fromCharCode(65+i);
            this.labels[i].style = "normal";
        }

        return this.answered = false;
    }
}
