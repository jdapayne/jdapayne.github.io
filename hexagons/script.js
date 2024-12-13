document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('hex-container');

  const rows = 20;
  const cols = 20;

  const s = 50; // side length
  const hexWidth = Math.sqrt(3) * s;   // ~86.6
  const hexHeight = 2 * s;             // 100
  // For a pointy-topped layout:
  // xCenter = hexWidth * (c + (r%2)*0.5)
  // yCenter = 1.5 * s * r

  // Precomputed polygon points with slight offset to reduce aliasing issues
  const points = [
    [43.5, 0.5],
    [86.8, 25.5],
    [86.8, 75.5],
    [43.5, 100.5],
    [0.2, 75.5],
    [0.2, 25.5]
  ];
  const pointsString = points.map(p => p.join(',')).join(' ');

  // Offset the entire grid so it's visible and centered nicely
  const xBase = 100;
  const yBase = 100;

  for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
          const xCenter = hexWidth * (c + (r % 2) * 0.5);
          const yCenter = 1.5 * s * r;

          const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
          svg.classList.add('inactive-hex');
          // Make the SVG slightly larger than the polygon to ensure no clipping
          svg.setAttribute('width', Math.ceil(hexWidth)+5);
          svg.setAttribute('height', hexHeight+5);
          svg.setAttribute('overflow', 'visible');
          svg.style.position = 'absolute';
          // Align so that polygon center aligns with (xCenter, yCenter)
          // The polygon is roughly centered around (43.5,50.5)
          svg.style.left = (xBase + xCenter - 43.5) + 'px';
          svg.style.top = (yBase + yCenter - 50.5) + 'px';

          const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
          polygon.setAttribute('points', pointsString);

          svg.addEventListener('click', () => {
              svg.classList.toggle('active-hex');
              svg.classList.toggle('inactive-hex');
          });

          svg.appendChild(polygon);
          container.appendChild(svg);
      }
  }
  
  const toggleButton = document.getElementById('grid');
  toggleButton.addEventListener('click', () => {
    const hexes = document.querySelectorAll('svg');
    hexes.forEach(hex => {
      hex.classList.toggle('hideable');
    });
  });
  const resetButton = document.getElementById('reset');
});