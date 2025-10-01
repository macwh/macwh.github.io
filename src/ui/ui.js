export {
  doUI,
  base_colors,
  rgbTripleToCss,
  mixRGB
}

const base_colors = {
  "Logical / Reasoning": [76, 158, 209],
  "Exploration / Observation": [122, 166, 51],
  "Reflex / Action": [255, 89, 94],
  "Management / Systems": [140, 92, 222]
}

function rgbStringToTriple(cssColor) {
  const match = cssColor.match(/\d+/g);
  if (!match || match.length < 3) return [0, 0, 0];
  return match.slice(0, 3).map(Number);
}

function rgbTripleToCss(rgb) {
  return `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`;
}

function mixRGB(colors) {
  const n = colors.length;
  if (n === 0) return [0, 0, 0];

  let sum = colors.reduce((acc, c) => [
    acc[0] + rgbStringToTriple(c)[0],
    acc[1] + rgbStringToTriple(c)[1],
    acc[2] + rgbStringToTriple(c)[2]
  ], [0, 0, 0]);

  return [
    Math.round(sum[0] / n),
    Math.round(sum[1] / n),
    Math.round(sum[2] / n)
  ];
}

function doUI() {
  // set toolbar genre buttons colors
  document.querySelectorAll('.toolbar button[data-target]').forEach((btn, i) => {
    if (btn.dataset.target in base_colors)
      btn.style.backgroundColor = rgbTripleToCss(base_colors[btn.dataset.target]);
  });
}