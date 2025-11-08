/**
 * Convolution filter - applies a custom kernel convolution to the image
 * @param {string} imageSrc - Image data URL
 * @param {number[][]} kernel - Convolution kernel (2D array)
 * @returns {Promise<string>} - Processed image data URL
 */
export function applyConvolution(imageSrc, kernel) {
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

      const gray = [];
      for (let i = 0; i < data.length; i += 4) {
        gray.push(0.3 * data[i] + 0.59 * data[i + 1] + 0.11 * data[i + 2]);
      }

      const kSize = kernel.length;
      const offset = Math.floor(kSize / 2);

      for (let y = offset; y < h - offset; y++) {
        for (let x = offset; x < w - offset; x++) {
          let val = 0;
          for (let ky = 0; ky < kSize; ky++) {
            for (let kx = 0; kx < kSize; kx++) {
              val += gray[(y + ky - offset) * w + (x + kx - offset)] * kernel[ky][kx];
            }
          }
          val = Math.min(255, Math.max(0, val));
          const idx = (y * w + x) * 4;
          result[idx] = result[idx + 1] = result[idx + 2] = val;
          result[idx + 3] = 255;
        }
      }

      ctx.putImageData(new ImageData(result, w, h), 0, 0);
      resolve(canvas.toDataURL());
    };
  });
}
  