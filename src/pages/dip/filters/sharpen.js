/**
 * Sharpen filter - enhances image sharpness using a sharpening kernel
 * @param {string} imageSrc - Image data URL
 * @param {number} strength - Sharpening strength (0-2, default: 1)
 * @returns {Promise<string>} - Processed image data URL
 */
export function applySharpen(imageSrc, strength = 1) {
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
      const w = canvas.width;
      const h = canvas.height;
      const result = new Uint8ClampedArray(data.length);

      // Sharpening kernel
      const kernel = [
        [0, -strength, 0],
        [-strength, 1 + 4 * strength, -strength],
        [0, -strength, 0],
      ];

      for (let y = 1; y < h - 1; y++) {
        for (let x = 1; x < w - 1; x++) {
          for (let c = 0; c < 3; c++) {
            let sum = 0;
            for (let ky = -1; ky <= 1; ky++) {
              for (let kx = -1; kx <= 1; kx++) {
                const px = x + kx;
                const py = y + ky;
                const idx = (py * w + px) * 4 + c;
                sum += data[idx] * kernel[ky + 1][kx + 1];
              }
            }
            const idx = (y * w + x) * 4 + c;
            result[idx] = Math.min(255, Math.max(0, sum));
          }
          result[(y * w + x) * 4 + 3] = 255; // alpha channel
        }
      }

      // Copy edges (no processing)
      for (let i = 0; i < data.length; i += 4) {
        const y = Math.floor(i / 4 / w);
        const x = (i / 4) % w;
        if (y === 0 || y === h - 1 || x === 0 || x === w - 1) {
          result[i] = data[i];
          result[i + 1] = data[i + 1];
          result[i + 2] = data[i + 2];
          result[i + 3] = data[i + 3];
        }
      }

      ctx.putImageData(new ImageData(result, w, h), 0, 0);
      resolve(canvas.toDataURL());
    };
  });
}

