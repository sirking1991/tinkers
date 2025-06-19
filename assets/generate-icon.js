const fs = require('fs');
const { createCanvas } = require('canvas');

// Create a 1024x1024 canvas for the icon
const size = 1024;
const canvas = createCanvas(size, size);
const ctx = canvas.getContext('2d');

// Fill background with a gradient
const gradient = ctx.createLinearGradient(0, 0, size, size);
gradient.addColorStop(0, '#3498db');
gradient.addColorStop(1, '#8e44ad');
ctx.fillStyle = gradient;
ctx.fillRect(0, 0, size, size);

// Draw a code symbol
ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
ctx.font = 'bold 400px sans-serif';
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';
ctx.fillText('{ }', size / 2, size / 2);

// Draw app name
ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
ctx.font = 'bold 120px sans-serif';
ctx.fillText('Tinkers', size / 2, size / 2 + 200);

// Save as PNG
const buffer = canvas.toBuffer('image/png');
fs.writeFileSync('./assets/icon.png', buffer);

console.log('Icon generated successfully at ./assets/icon.png');
