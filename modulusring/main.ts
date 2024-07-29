import ModRing from './ModRing.js';

document.addEventListener('DOMContentLoaded', () => {
  // Get the input and canvas elements by their ids
  const expressionInput = document.getElementById('expression') as HTMLInputElement|null;
  const nInput = document.getElementById('n') as HTMLInputElement|null;
  const canvas = document.getElementById('canvas') as HTMLCanvasElement;
  const modRing = new ModRing();
  
  function getInfoAndDraw() {
    const expression = expressionInput?.value ?? 'n';
    const n = parseInt(nInput?.value ?? '10');
    modRing.expression = expression;
    modRing.modulus = n;
    modRing.drawIn(canvas);
  }

  document.getElementById('form')?.addEventListener('change', getInfoAndDraw);
  
  getInfoAndDraw();
});

function error(message: string) {
  console.log('Error:', message);
}