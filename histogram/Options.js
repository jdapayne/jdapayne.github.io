import { createElem } from "./createElem.js";
export default class Options {
    constructor() {
        this.showXValues = true;
        this.showYValues = true;
        this.fillBars = true;
        this.startAtZero = false;
        this.square = false;
    }
    get htmlElement() {
        if (!this._htmlElement)
            this.generateHTML();
        if (!this._htmlElement)
            throw new Error('Could not build element');
        return this._htmlElement;
    }
    generateHTML() {
        this._htmlElement = createElem('ul', 'options');
        this._htmlElement.innerHTML = /*html*/
            `<li>Show x-axis values: <input type="checkbox" id="show-x-values" checked></li>
    <li>Show y-axis values: <input type="checkbox" id="show-y-values" checked></li>
    <li>Fill bars: <input type="checkbox" id="fill-bars" checked></li>
    <li>Start x-axis at 0: <input type="checkbox" id="start-at-zero"></li>
    <li>Square grid: <input type="checkbox" id="square"></li>`;
        this._htmlElement.addEventListener('change', e => {
            if (e.target instanceof HTMLInputElement) {
                switch (e.target.id) {
                    case 'show-x-values':
                        this.showXValues = e.target.checked;
                        break;
                    case 'show-y-values':
                        this.showYValues = e.target.checked;
                        break;
                    case 'fill-bars':
                        this.fillBars = e.target.checked;
                        break;
                    case 'start-at-zero':
                        this.startAtZero = e.target.checked;
                        break;
                    case 'square':
                        this.square = e.target.checked;
                        break;
                    default:
                        break;
                }
            }
        });
    }
}
