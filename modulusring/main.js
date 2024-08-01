import ModRing from './ModRing.js';
document.addEventListener('DOMContentLoaded', () => {
    var _a;
    // Get the input and canvas elements by their ids
    const expressionInput = document.getElementById('expression');
    const nInput = document.getElementById('n');
    const singlePath = document.getElementById('path');
    const startInput = document.getElementById('start');
    const drawArrows = document.getElementById('arrows');
    const canvas = document.getElementById('canvas');
    const modRing = new ModRing();
    function getInfoAndDraw() {
        var _a, _b, _c, _d, _e;
        const expression = (_a = expressionInput === null || expressionInput === void 0 ? void 0 : expressionInput.value) !== null && _a !== void 0 ? _a : 'n';
        const n = parseInt((_b = nInput === null || nInput === void 0 ? void 0 : nInput.value) !== null && _b !== void 0 ? _b : '10');
        const single = (_c = singlePath === null || singlePath === void 0 ? void 0 : singlePath.checked) !== null && _c !== void 0 ? _c : false;
        const start = parseInt((_d = startInput === null || startInput === void 0 ? void 0 : startInput.value) !== null && _d !== void 0 ? _d : '1');
        const arrows = (_e = drawArrows === null || drawArrows === void 0 ? void 0 : drawArrows.checked) !== null && _e !== void 0 ? _e : false;
        modRing.expression = expression;
        modRing.modulus = n;
        modRing.singlePath = single;
        modRing.start = start;
        modRing.drawArrows = arrows;
        modRing.drawIn(canvas);
    }
    (_a = document.getElementById('form')) === null || _a === void 0 ? void 0 : _a.addEventListener('change', getInfoAndDraw);
    getInfoAndDraw();
});
function error(message) {
    console.log('Error:', message);
}
//# sourceMappingURL=main.js.map