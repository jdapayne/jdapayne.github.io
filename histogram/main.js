import { createElem } from './createElem.js';
import FrequencyTable from './FrequencyTable.js';
import Histogram from './Histogram.js';
/* Make table and buttons*/
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
/* Event listeners for table buttons*/
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
/* Make histogram and buttons*/
const histogramDiv = document.getElementById('histogram');
const histogram = new Histogram(frequencyTable, 800, 600);
histogramDiv.append(histogram.canvas);
histogram.render();
createElem('br', undefined, histogramDiv);
const histogramCopy = createElem('button', undefined, histogramDiv);
histogramCopy.innerHTML = 'Copy histogram';
const histogramDownload = createElem('button', undefined, histogramDiv);
histogramDownload.innerHTML = 'Download image';
/* Make the histogram respond to changes in the table*/
frequencyTable.htmlElement.addEventListener('change', () => { histogram.render(); });
/* Event listeners for histogram buttons */
histogramCopy.addEventListener('click', () => {
    const blobPromise = new Promise((resolve, reject) => {
        histogram.canvas.toBlob(blob => {
            if (!blob)
                reject();
            else
                resolve(blob);
        });
    });
    blobPromise.then(blob => {
        const clipItem = new ClipboardItem({ [blob.type]: blob });
        return clipItem;
    }).then(clipItem => {
        return navigator.clipboard.write([clipItem]);
    }).then(() => {
        window.alert('Copied histogram to clipboard');
    }, reason => {
        window.alert(`Error copying: ${reason}`);
    });
});
histogramDownload.addEventListener('click', () => {
    const dataURL = histogram.canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = 'histogram.png';
    link.click();
});
