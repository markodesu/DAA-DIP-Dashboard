/**
 * Histogram Equalization - enhances image contrast using histogram equalization
 * @param {string} imageSrc - Image data URL
 * @returns {Promise<string>} - Processed image data URL
 */
export function applyHistogram(imageSrc) {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.src = imageSrc;
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;

      // convert to grayscale
      const gray = [];
      for (let i = 0; i < data.length; i += 4) {
        const avg = 0.3 * data[i] + 0.59 * data[i + 1] + 0.11 * data[i + 2];
        gray.push(avg);
      }

      // histogram
      const hist = new Array(256).fill(0);
      gray.forEach((val) => (hist[Math.floor(val)] += 1));

      // cumulative distribution
      const cdf = [];
      hist.reduce((a, b, i) => (cdf[i] = a + b), 0);

      const cdfMin = cdf.find((v) => v > 0);
      const total = gray.length;

      for (let i = 0; i < data.length; i += 4) {
        const val = 0.3 * data[i] + 0.59 * data[i + 1] + 0.11 * data[i + 2];
        const eqVal = Math.round(((cdf[Math.floor(val)] - cdfMin) / (total - cdfMin)) * 255);
        data[i] = data[i + 1] = data[i + 2] = eqVal;
      }

      ctx.putImageData(imgData, 0, 0);
      resolve(canvas.toDataURL());
    };
  });
}

