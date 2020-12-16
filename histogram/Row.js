import { createElem, createInput } from "./createElem.js";
export default class Row {
    constructor(lb, ub, frequency, varSymbol, canEditLowerBound) {
        this.show = true;
        this._lowerBound = lb;
        this._upperBound = ub;
        this._frequency = frequency;
        this.varSymbol = varSymbol;
        this.canEditLowerBound = canEditLowerBound;
    }
    get lowerBound() { return this._lowerBound; }
    set lowerBound(lb) {
        this._lowerBound = lb;
        if (this._htmlElement) { //update html element if needed
            const tr = this.htmlElement;
            const lbSpan = tr.querySelector('span.lower-bound');
            if (lbSpan)
                lbSpan.innerHTML = this._lowerBound.toString();
            this.updateFrequencyDensity();
        }
        if (lb >= this.upperBound) {
            this.upperBound = lb + 1;
        }
    }
    get upperBound() { return this._upperBound; }
    set upperBound(ub) {
        this._upperBound = ub;
        if (this._htmlElement) {
            const ubElement = this.htmlElement.querySelector('input.upper-bound');
            if (ubElement)
                ubElement.value = ub.toString();
            this.updateFrequencyDensity();
        }
        if (this.nextRow) {
            this.nextRow.lowerBound = ub;
        }
    }
    get frequency() { return this._frequency; }
    set frequency(frequency) {
        this._frequency = frequency;
        this.updateFrequencyDensity();
    }
    get frequencyDensity() {
        return this.frequency / (this.upperBound - this.lowerBound);
    }
    get htmlElement() {
        if (!this._htmlElement) {
            this.generateHTML();
        }
        if (!this._htmlElement) {
            throw new Error('HTML not generated');
        }
        return this._htmlElement;
    }
    updateFrequencyDensity() {
        if (this._htmlElement) {
            const fdCell = this.htmlElement.querySelector('span.frequency-density');
            if (fdCell)
                fdCell.innerHTML = this.frequencyDensity.toLocaleString(undefined, { maximumFractionDigits: 4 });
        }
    }
    generateHTML() {
        const tr = createElem('tr', undefined);
        const classCell = createElem('td', undefined, tr);
        if (this.canEditLowerBound) {
            const lbInput = createElem('input', 'lower-bound', classCell);
            lbInput.type = 'number';
            lbInput.value = this.lowerBound.toString();
            lbInput.addEventListener('change', () => {
                this.lowerBound = parseFloat(lbInput.value);
            });
        }
        else {
            createElem('span', 'lower-bound', classCell).innerHTML = this.lowerBound.toString();
        }
        classCell.insertAdjacentHTML('beforeend', ` &lt; ${this.varSymbol} &leq; `);
        const ubInput = createElem('input', 'upper-bound', classCell);
        ubInput.type = 'number';
        ubInput.value = this.upperBound.toString();
        ubInput.addEventListener('change', () => {
            this.upperBound = parseFloat(ubInput.value);
        });
        const frequencyCell = createElem('td', undefined, tr);
        const frequencyInput = createInput('number', this.frequency.toString(), frequencyCell, 'frequency');
        frequencyInput.addEventListener('change', () => {
            this.frequency = parseInt(frequencyInput.value);
        });
        const fdCell = createElem('td', undefined, tr);
        fdCell.innerHTML = `<span class="frequency-density">${this.frequencyDensity}</span>`;
        const showCell = createElem('td', undefined, tr);
        const showSwitch = createElem('input', undefined, showCell);
        showSwitch.type = 'checkbox';
        showSwitch.checked = this.show;
        showSwitch.addEventListener('change', () => {
            this.show = showSwitch.checked;
        });
        this._htmlElement = tr;
    }
    get staticHTML() {
        let html = /*html*/ `
    <tr>
      <td>${this.lowerBound} &lt; <span class="variable-symbol">${this.varSymbol}</span> &leq; ${this.upperBound}</td>
      <td>${this.frequency}</td>
      <td>${this.frequencyDensity}</td>
    </tr>
    `;
        return html;
    }
}
