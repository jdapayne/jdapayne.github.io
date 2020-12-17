var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const PADDING_START = 250;
const PADDING_END = 25;
const PADDING_TOP = 20;
const PADDING_BOTTOM = 100;
export default class Histogram {
    constructor(table, width, height) {
        this.frequencyTable = table;
        this.width = width;
        this.height = height;
    }
    get canvas() {
        if (!this._canvas) {
            this._canvas = document.createElement('canvas');
            this._canvas.width = this.width * 2;
            this._canvas.height = this.height * 2;
            this._canvas.style.height = this.height + 'px';
            this._canvas.style.width = this.width + 'px';
        }
        return this._canvas;
    }
    get xMin() {
        if (this.frequencyTable.rows.length === 0)
            return 0;
        return this.frequencyTable.rows[0].lowerBound;
    }
    get xMax() {
        if (this.frequencyTable.rows.length === 0)
            return 10;
        return this.frequencyTable.rows[this.frequencyTable.rows.length - 1].upperBound;
    }
    /** Size of ticks on the y-axis. Returns major then minor sizes*/
    get tickSizeY() {
        let i = 0;
        let tickSize = 0.01;
        let subDivisions = 2;
        while (true) {
            const power = Math.floor(i / 3) - 2;
            const base = i % 3 === 0 ? 1 :
                i % 3 === 1 ? 2 : 5;
            const value = base * Math.pow(10, power);
            if (value > this.maxFD / 5)
                break;
            tickSize = value;
            subDivisions = base === 5 ? 5 : 2;
            i++;
        }
        return [tickSize, tickSize / 10];
    }
    /** The number of ticks on the y-axis */
    get nTicksY() {
        let nTicks = this.maxFD / this.tickSizeY[0];
        nTicks = Math.ceil(nTicks);
        return nTicks;
    }
    get tickSizeX() {
        let i = 0;
        let tickSize = 0.01;
        let subDivisions = 2;
        while (true) {
            const power = Math.floor(i / 3) - 2;
            const base = i % 3 === 0 ? 1 :
                i % 3 === 1 ? 2 : 5;
            const value = base * Math.pow(10, power);
            if (value > this.xMax / 8)
                break;
            tickSize = value;
            subDivisions = base === 5 ? 5 : 2;
            i++;
        }
        return [tickSize, tickSize / 10];
    }
    get nTicksX() {
        return Math.ceil(this.xMax / this.tickSizeX[0]);
    }
    /** The maximum value of the y-axis */
    get yMax() {
        return (this.nTicksY + 1) * this.tickSizeY[0];
    }
    get maxFD() {
        if (this.frequencyTable.rows.length === 0)
            return 1;
        let maxFD = 0;
        this.frequencyTable.rows.forEach(row => {
            if (row.frequencyDensity > maxFD)
                maxFD = row.frequencyDensity;
        });
        return maxFD;
    }
    render() {
        const ctx = this.canvas.getContext('2d');
        if (!ctx)
            throw new Error('Could not get canvas context');
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        // draw axes
        ctx.beginPath();
        ctx.moveTo(...this.scaledCoords([this.xMin, 0]));
        ctx.lineTo(...this.scaledCoords([this.xMax, 0]));
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(...this.scaledCoords([this.xMin, 0]));
        ctx.lineTo(...this.scaledCoords([this.xMin, this.yMax]));
        ctx.stroke();
        //bars
        ctx.fillStyle = 'lightgrey';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 5;
        this.frequencyTable.rows.forEach(row => {
            if (row.show) {
                const [x1, y1] = this.scaledCoords([row.lowerBound, 0]);
                const [x2, y2] = this.scaledCoords([row.upperBound, row.frequencyDensity]);
                const width = x2 - x1;
                const height = y2 - y1;
                ctx.fillRect(x1, y1, width, height);
                ctx.strokeRect(x1, y1, width, height);
            }
        });
        // minor ticks y
        ctx.lineWidth = 1;
        ctx.strokeStyle = 'grey';
        for (let h = 0; h <= this.yMax; h += this.tickSizeY[1]) {
            ctx.beginPath();
            ctx.moveTo(...this.scaledCoords([this.xMin, h]));
            ctx.lineTo(...this.scaledCoords([this.xMax, h]));
            ctx.stroke();
        }
        for (let x = this.xMin; x <= this.xMax; x += this.tickSizeX[1]) {
            ctx.beginPath();
            ctx.moveTo(...this.scaledCoords([x, 0]));
            ctx.lineTo(...this.scaledCoords([x, this.yMax]));
            ctx.stroke();
        }
        // major ticks
        ctx.lineWidth = 2;
        ctx.font = '30px Times';
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'right';
        ctx.fillStyle = 'black';
        ctx.strokeStyle = 'black';
        for (let h = 0; h <= this.yMax; h += this.tickSizeY[0]) {
            ctx.beginPath();
            const [x, y] = this.scaledCoords([this.xMin, h]);
            ctx.moveTo(x - 10, y);
            ctx.lineTo(...this.scaledCoords([this.xMax, h]));
            ctx.stroke();
            const tickStr = h.toLocaleString(undefined, { maximumFractionDigits: 3 });
            ctx.fillText(tickStr, x - 15, y);
        }
        ctx.textBaseline = 'top';
        ctx.textAlign = 'center';
        for (let x1 = this.xMin; x1 <= this.xMax; x1 += this.tickSizeX[0]) {
            ctx.beginPath();
            const [x, y] = this.scaledCoords([x1, 0]);
            ctx.moveTo(x, y + 10);
            ctx.lineTo(...this.scaledCoords([x1, this.yMax]));
            ctx.stroke();
            const tickStr = x1.toLocaleString(undefined, { maximumFractionDigits: 3 });
            ctx.fillText(tickStr, x, y + 15);
        }
        // y label 
        {
            ctx.textAlign = 'right';
            const [x, y] = this.scaledCoords([this.xMin, this.yMax / 2]);
            ctx.textBaseline = 'bottom';
            ctx.fillText('Frequency', x - 100, y);
            ctx.textBaseline = 'top';
            ctx.fillText('density', x - 100, y);
        }
        // x label
        {
            ctx.textAlign = 'center';
            ctx.textBaseline = 'top';
            const [x, y] = this.scaledCoords([(this.xMax - this.xMin) / 2 + this.xMin, 0]);
            ctx.fillText(`${this.frequencyTable.varName} (${this.frequencyTable.unit})`, x, y + 60);
        }
    }
    scaleX(x) {
        return (x - this.xMin) / (this.xMax - this.xMin) * (this.canvas.width - PADDING_START - PADDING_END) + PADDING_START;
    }
    scaleY(y) {
        return this.canvas.height - PADDING_BOTTOM - y / this.yMax * (this.canvas.height - PADDING_BOTTOM - PADDING_TOP);
    }
    scaledCoords([x, y]) {
        return [this.scaleX(x), this.scaleY(y)];
    }
    copyToClipBoard() {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
}
