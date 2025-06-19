const fs = require('fs');
const { createCanvas } = require('canvas');

// Create a 600x400 canvas for the DMG background
const width = 600;
const height = 400;
const canvas = createCanvas(width, height);
const ctx = canvas.getContext('2d');

// Fill background with a gradient
const gradient = ctx.createLinearGradient(0, 0, width, height);
gradient.addColorStop(0, '#3498db');
gradient.addColorStop(1, '#8e44ad');
ctx.fillStyle = gradient;
ctx.fillRect(0, 0, width, height);

// Add some decoration
ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
ctx.beginPath();
ctx.arc(width * 0.8, height * 0.2, 100, 0, Math.PI * 2);
ctx.fill();

ctx.beginPath();
ctx.arc(width * 0.2, height * 0.8, 80, 0, Math.PI * 2);
ctx.fill();

// Draw app name
ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
ctx.font = 'bold 48px sans-serif';
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';
ctx.fillText('Tinkers', width / 2, height / 2 - 40);

// Draw instruction text
ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
ctx.font = '16px sans-serif';
ctx.fillText('Drag the application to the Applications folder', width / 2, height / 2 + 20);
ctx.fillText('to install', width / 2, height / 2 + 40);

// Save as PNG
const buffer = canvas.toBuffer('image/png');
fs.writeFileSync('./assets/dmg-background.png', buffer);

console.log('DMG background generated successfully at ./assets/dmg-background.png');
