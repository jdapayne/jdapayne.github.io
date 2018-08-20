import AoslView from './AoslView.js';
import Point from './Point.js';
import {roundDP} from './Utilities.js';

export default class AoslViewWorded extends AoslView{
    constructor(aosl, radius, width, height) {
        super(aosl,radius, width, height);

        this.labels.forEach(function(l,i) {
            l.text = String.fromCharCode(65+i);
        });

        let ninstructions = this.aosl.instructions.length;
        this.aosl.instructions.forEach( (instruction, i) => {
            this.labels.push(
                {
                    text: instruction,
                    pos: new Point(10, height - 10 - 15*(ninstructions-i-1)), //this is not idea - assumes fixed font height
                    style: "extra-info",
                    hidden: false
                }
            )
        });
    }

    showAnswer() {
        if (this.answered) return; //nothing to do
        for (let i=0; i<this.aosl.angles.length; i++) {
            this.labels[i].text = roundDP(this.aosl.angles[i],2).toString() + "°";
            this.labels[i].style = "answer";
        }

        return this.answered = true;
    }

    hideAnswer() {
        if (!this.answered) return; //nothing to do
        for (let i=0; i<this.aosl.angles.length; i++) {
            this.labels[i].text = String.fromCharCode(65+i);
            this.labels[i].style = "normal";
        }

        return this.answered = false;
    }
}
