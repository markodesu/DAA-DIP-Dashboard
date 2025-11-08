/**
 * Edge Detection (Sobel operator) - detects edges in the image
 * @param {string} imageSrc - Image data URL
 * @returns {Promise<string>} - Processed image data URL
 */
export function applyEdgeDetection(imageSrc) {
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
      const gray = [];

      // grayscale
      for (let i = 0; i < data.length; i += 4) {
        gray.push(0.3 * data[i] + 0.59 * data[i + 1] + 0.11 * data[i + 2]);
      }

      const result = new Uint8ClampedArray(data.length);
      const kernelX = [
        [-1, 0, 1],
        [-2, 0, 2],
        [-1, 0, 1],
      ];
      const kernelY = [
        [-1, -2, -1],
        [0, 0, 0],
        [1, 2, 1],
      ];

      for (let y = 1; y < h - 1; y++) {
        for (let x = 1; x < w - 1; x++) {
          let gx = 0;
          let gy = 0;
          for (let ky = -1; ky <= 1; ky++) {
            for (let kx = -1; kx <= 1; kx++) {
              const px = x + kx;
              const py = y + ky;
              const val = gray[py * w + px];
              gx += val * kernelX[ky + 1][kx + 1];
              gy += val * kernelY[ky + 1][kx + 1];
            }
          }
          const g = Math.min(255, Math.sqrt(gx * gx + gy * gy));
          const idx = (y * w + x) * 4;
          result[idx] = result[idx + 1] = result[idx + 2] = g;
          result[idx + 3] = 255;
        }
      }

      ctx.putImageData(new ImageData(result, w, h), 0, 0);
      resolve(canvas.toDataURL());
    };
  });
}

