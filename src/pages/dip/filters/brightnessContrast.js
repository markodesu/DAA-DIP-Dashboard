/**
 * Brightness and Contrast adjustment
 * @param {string} imageSrc - Image data URL
 * @param {number} brightness - Brightness adjustment (-255 to 255)
 * @param {number} contrast - Contrast multiplier (0.5 to 2.0)
 * @returns {Promise<string>} - Processed image data URL
 */
export function adjustBrightnessContrast(imageSrc, brightness = 0, contrast = 1) {
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
        data[i] = Math.min(255, Math.max(0, (data[i] - 128) * contrast + 128 + brightness));
        data[i + 1] = Math.min(255, Math.max(0, (data[i + 1] - 128) * contrast + 128 + brightness));
        data[i + 2] = Math.min(255, Math.max(0, (data[i + 2] - 128) * contrast + 128 + brightness));
      }

      ctx.putImageData(imgData, 0, 0);
      resolve(canvas.toDataURL());
    };
  });
}

