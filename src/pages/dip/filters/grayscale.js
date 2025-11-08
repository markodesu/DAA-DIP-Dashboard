/**
 * Grayscale filter - converts image to grayscale using luminance formula
 * @param {string} imageSrc - Image data URL
 * @returns {Promise<string>} - Processed image data URL
 */
export function applyGrayscale(imageSrc) {
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

      for (let i = 0; i < data.length; i += 4) {
        const avg = 0.3 * data[i] + 0.59 * data[i + 1] + 0.11 * data[i + 2];
        data[i] = data[i + 1] = data[i + 2] = avg;
      }

      ctx.putImageData(imgData, 0, 0);
      resolve(canvas.toDataURL());
    };
  });
}

