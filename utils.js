const { createCanvas } = require('canvas');
const path = require('path');


async function generateQuoteImage(quoteText, authorUsername, authorNickname) {
  const canvasWidth = 800;
  const canvasHeight = 400;
  const canvas = createCanvas(canvasWidth, canvasHeight);
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#121212';
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  ctx.font = '36px Roboto';
  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const words = quoteText.split(' ');
  let line = '';
  const lines = [];
  const maxWidth = canvasWidth - 100;
  const maxLines = 5;

  for (const word of words) {
    const testLine = line + word + ' ';
    if (ctx.measureText(testLine).width > maxWidth && line.trim().length > 0) {
      lines.push(line);
      line = word + ' ';
    } else {
      line = testLine;
    }
  }

  if (lines.length >= maxLines) {
    lines[maxLines] = lines[maxLines].trim() + '...';
    lines.splice(maxLines);
  }

  lines.push(line);

  const lineHeight = 40;
  const totalTextHeight = lines.length * lineHeight;
  let y = (canvasHeight - totalTextHeight) / 2;

  for (const line of lines) {
    ctx.fillText(line, canvasWidth / 2, y);
    y += lineHeight;
  }

  ctx.font = '20px Roboto';
  ctx.fillStyle = '#999999';
  ctx.textAlign = 'right';
  ctx.textBaseline = 'bottom';

  const authorInfo = `${authorNickname} (@${authorUsername})`;
  ctx.fillText(authorInfo, canvasWidth - 50, canvasHeight - 20);

  ctx.font = '16px Roboto';
  ctx.textAlign = 'left';
  ctx.fillText('Quotify', 50, canvasHeight - 20);

  return canvas.toBuffer();
}
module.exports = generateQuoteImage
