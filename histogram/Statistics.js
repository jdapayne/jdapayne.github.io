import { createElem } from "./createElem.js";
export default class Statistics {
    constructor(table) {
        this.frequencyTable = table;
    }
    get htmlElement() {
        if (!this._htmlElement)
            this.generateHTML();
        if (!this._htmlElement)
            throw new Error('Failed to generate HTML');
        return this._htmlElement;
    }
    generateHTML() {
        this._htmlElement = createElem('ul', undefined);
        this._htmlElement.innerHTML = /*html*/ `
    <li>Total frequency: <span data-total-frequency>${this.totalFrequency().toString()}</span></li>
    <li>LQ: <span data-quartile="0.25">${this.percentile(0.25).toLocaleString(undefined, { maximumFractionDigits: 4 })}</span></li>
    <li>Median: <span data-quartile="0.5">${this.percentile(0.5).toLocaleString(undefined, { maximumFractionDigits: 4 })}</span></li>
    <li>UQ: <span data-quartile="0.75">${this.percentile(0.75).toLocaleString(undefined, { maximumFractionDigits: 4 })}</span></li>
    <li>Mean: <span data-mean>${this.mean().toLocaleString(undefined, { maximumFractionDigits: 4 })}</li>
    `;
    }
    update() {
        this.htmlElement.querySelectorAll('span[data-quartile]').forEach(span => {
            var _a;
            const quartile = parseFloat((_a = span.dataset.quartile) !== null && _a !== void 0 ? _a : "");
            span.innerHTML = this.percentile(quartile).toLocaleString(undefined, { maximumFractionDigits: 4 });
        });
        this.htmlElement.querySelector('span[data-total-frequency]').innerHTML = this.totalFrequency().toString();
        this.htmlElement.querySelector('span[data-mean]').innerHTML = this.mean().toLocaleString(undefined, { maximumFractionDigits: 4 });
    }
    /**
     *
     * @param x Between 0 and 1. 0.5 is median, 0.25 is LQ etc
     */
    percentile(x) {
        if (this.frequencyTable.rows.length === 0)
            return NaN;
        console.log(`%cWorkings for percentile ${x}:`, 'font-weight: bold');
        const totalFrequency = this.totalFrequency();
        const requiredFrequency = x * totalFrequency; // do I round?
        console.log(`Total frequency = ${totalFrequency}. Required frequency = ${requiredFrequency}`);
        // Find index of row containing median and cumulative frequency at beginning and end of it
        let classIndex = 0;
        let cumulativeFrequencyLB = 0;
        let cumulativeFrequencyUB = 0;
        while (classIndex < this.frequencyTable.rows.length) {
            cumulativeFrequencyLB = cumulativeFrequencyUB;
            cumulativeFrequencyUB += this.frequencyTable.rows[classIndex].frequency;
            if (cumulativeFrequencyUB >= requiredFrequency)
                break;
            classIndex++;
        }
        console.log(`Percentile contained in ${classIndex + 1}nd class`);
        const row = this.frequencyTable.rows[classIndex];
        const frequencyIntoClass = requiredFrequency - cumulativeFrequencyLB;
        console.log(`Need to go ${frequencyIntoClass} into the class`);
        console.log('');
        const percentile = row.lowerBound + (frequencyIntoClass / row.frequency) * (row.upperBound - row.lowerBound);
        return percentile;
    }
    totalFrequency() {
        return this.frequencyTable.rows.reduce((subtotal, row) => subtotal + row.frequency, 0);
    }
    mean() {
        const valueSum = this.frequencyTable.rows.reduce((subtotal, row) => subtotal + row.frequency * (row.upperBound + row.lowerBound) / 2, 0);
        return valueSum / this.totalFrequency();
    }
}
