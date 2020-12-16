import { createElem, createInput } from "./createElem.js";
import Row from "./Row.js";
export default class FrequencyTable {
    constructor(varName, varSymbol, unit) {
        this.rows = [];
        this.varName = varName;
        this._varSymbol = varSymbol;
        this.unit = unit;
    }
    addRow(random = true) {
        if (this.rows.length === 0) {
            this.addFirstRow();
        }
        else {
            const lowerBound = this.rows[this.rows.length - 1].upperBound;
            const upperBound = lowerBound + 10;
            const frequency = random ? Math.ceil(this.rows[this.rows.length - 1].frequency * (Math.random() + 0.5)) : 1;
            const row = new Row(lowerBound, upperBound, frequency, this.varSymbol, false);
            this.rows[this.rows.length - 1].nextRow = row;
            this.rows.push(row);
            if (this._htmlElement) {
                this._htmlElement.append(row.htmlElement);
            }
        }
    }
    removeLastRow() {
        const lastRow = this.rows.pop();
        lastRow === null || lastRow === void 0 ? void 0 : lastRow.htmlElement.remove();
    }
    addFirstRow() {
        const lowerBound = 0;
        const upperBound = 10;
        const frequency = Math.ceil(Math.random() * 10);
        const row = new Row(lowerBound, upperBound, frequency, this.varSymbol, true);
        this.rows.push(row);
        if (this._htmlElement) {
            this._htmlElement.append(row.htmlElement);
        }
    }
    get varSymbol() {
        return this._varSymbol;
    }
    set varSymbol(varSymbol) {
        this._varSymbol = varSymbol;
        this.rows.forEach(row => {
            row.varSymbol = varSymbol;
        });
    }
    get htmlElement() {
        if (!this._htmlElement)
            this.generateHTML();
        if (!this._htmlElement)
            throw new Error('Generating HTML element failed');
        return this._htmlElement;
    }
    get staticHTML() {
        // first append relevant styles
        let html = '<style>';
        const docRules = document.styleSheets[0].cssRules;
        for (let i = 0; i < docRules.length; i++) {
            const rule = docRules[i];
            if (rule.type !== CSSRule.STYLE_RULE)
                continue;
            if (rule.selectorText.search(/table|th|tr|td|span/) >= 0 && !rule.selectorText.includes(':')) {
                html += rule.cssText;
            }
        }
        html += '</style>';
        html += /*html*/ ` <table>
    <tr>
      <th>${this.varName} (<span class="variable-symbol">${this.varSymbol}</span> ${this.unit})</th>
      <th>Frequency</th>
      <th>Frequency density</th>
    </tr>`;
        this.rows.forEach(row => {
            html += row.staticHTML;
        });
        html += '</table>';
        return html;
    }
    generateHTML() {
        const table = createElem('table', 'frequency-table');
        const headerRow = createElem('tr', undefined, table);
        const classTitle = createElem('th', undefined, headerRow);
        const varNameInput = createInput('text', this.varName, classTitle, 'variable-name');
        varNameInput.addEventListener('change', () => {
            this.varName = varNameInput.value;
        });
        classTitle.append(' (');
        const varSymbolInput = createInput('text', this.varSymbol, classTitle, 'variable-symbol');
        varSymbolInput.addEventListener('change', () => {
            this.varSymbol = varSymbolInput.value;
        });
        classTitle.append(' ');
        const unitInput = createInput('text', this.unit, classTitle, 'unit');
        unitInput.addEventListener('change', () => {
            this.unit = unitInput.value;
        });
        classTitle.append(')');
        createElem('th', undefined, headerRow).innerHTML = 'Frequency';
        createElem('th', undefined, headerRow).innerHTML = 'Frequency Density';
        createElem('th', undefined, headerRow).innerHTML = 'Show bar';
        this.rows.forEach(row => {
            table.append(row.htmlElement);
        });
        this._htmlElement = table;
    }
}
