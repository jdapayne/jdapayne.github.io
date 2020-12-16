import { createElem } from './createElem.js';
import FrequencyTable from './FrequencyTable.js';
import Histogram from './Histogram.js';
const tableDiv = document.getElementById('table');
const frequencyTable = new FrequencyTable('time', 't', 'seconds');
frequencyTable.addRow();
frequencyTable.addRow();
frequencyTable.addRow();
tableDiv.append(frequencyTable.htmlElement);
const addRow = createElem('button', undefined, tableDiv);
addRow.innerHTML = 'Add row';
const removeRow = createElem('button', 'undefined', tableDiv);
removeRow.innerHTML = 'Remove row';
createElem('br', undefined, tableDiv);
const tableCopy = createElem('button', undefined, tableDiv);
tableCopy.innerHTML = 'Copy formatted table';
tableDiv.append('(e.g. for pasting into Word)');
const histogramDiv = document.getElementById('histogram');
const histogram = new Histogram(frequencyTable, 800, 600);
histogramDiv.append(histogram.canvas);
histogram.render();
createElem('br', undefined, histogramDiv);
const histogramCopy = createElem('button', undefined, histogramDiv);
histogramCopy.innerHTML = 'Copy histogram';
frequencyTable.htmlElement.addEventListener('change', () => { histogram.render(); });
addRow.addEventListener('click', () => {
    frequencyTable.addRow();
    histogram.render();
});
removeRow.addEventListener('click', () => {
    frequencyTable.removeLastRow();
    histogram.render();
});
tableCopy.addEventListener('click', () => {
    const htmlBlob = new Blob([frequencyTable.staticHTML], { type: 'text/html' });
    const clipItem = new ClipboardItem({ 'text/html': htmlBlob });
    navigator.clipboard.write([clipItem]).then(() => {
        window.alert('Copied to clipboard');
    }, reason => {
        window.alert(`Error: ${reason}`);
    });
});
histogramCopy.addEventListener('click', () => {
    const blob = histogram.canvas.toBlob(blob => {
        if (!blob)
            throw new Error('Could not get blob');
        const clipItem = new ClipboardItem({ [blob.type]: blob });
        navigator.clipboard.write([clipItem]).then(() => {
            window.alert('Copied histogram to clipboard');
        }, reason => {
            window.alert(`Error copying: ${reason}`);
        });
    });
});
