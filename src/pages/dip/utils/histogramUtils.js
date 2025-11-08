/**
 * Calculate histogram data from an image
 * @param {string} imageSrc - Image data URL
 * @returns {Promise<{r: number[], g: number[], b: number[], gray: number[]}>}
 */
export function calculateHistogram(imageSrc) {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = imageSrc;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;

      const histR = new Array(256).fill(0);
      const histG = new Array(256).fill(0);
      const histB = new Array(256).fill(0);
      const histGray = new Array(256).fill(0);

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const gray = Math.round(0.3 * r + 0.59 * g + 0.11 * b);

        histR[r]++;
        histG[g]++;
        histB[b]++;
        histGray[gray]++;
      }

      resolve({ r: histR, g: histG, b: histB, gray: histGray });
    };
  });
}

/**
 * Draw histogram on canvas
 * @param {HTMLCanvasElement} canvas - Canvas element
 * @param {number[]} histogram - Histogram data array
 * @param {string} color - Color for the histogram
 */
export function drawHistogram(canvas, histogram, color = "#3b82f6") {
  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;

  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#f1f5f9";
  ctx.fillRect(0, 0, width, height);

  const max = Math.max(...histogram);
  const barWidth = width / 256;

  ctx.fillStyle = color;
  for (let i = 0; i < 256; i++) {
    const barHeight = (histogram[i] / max) * height;
    ctx.fillRect(i * barWidth, height - barHeight, barWidth, barHeight);
  }

  // Draw axes
  ctx.strokeStyle = "#64748b";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, height - 1);
  ctx.lineTo(width, height - 1);
  ctx.moveTo(0, 0);
  ctx.lineTo(0, height);
  ctx.stroke();
}

