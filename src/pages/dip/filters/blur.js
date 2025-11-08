/**
 * Blur filter - applies a blur effect to the image
 * @param {string} imageSrc - Image data URL
 * @param {number} radius - Blur radius in pixels (default: 3)
 * @returns {Promise<string>} - Processed image data URL
 */
export function applyBlur(imageSrc, radius = 3) {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.src = imageSrc;
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.filter = `blur(${radius}px)`;
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL());
    };
  });
}

