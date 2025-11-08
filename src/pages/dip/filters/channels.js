/**
 * Separate Channels - displays RGB channels side by side
 * @param {string} imageSrc - Image data URL
 * @returns {Promise<string>} - Processed image data URL with RGB channels separated
 */
export function separateChannels(imageSrc) {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = imageSrc;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = img.width * 3; // three channels side by side
      canvas.height = img.height;

      const imgData = ctx.getImageData(0, 0, img.width, img.height);
      const data = imgData.data;

      const newCanvas = document.createElement("canvas");
      const newCtx = newCanvas.getContext("2d");
      newCanvas.width = img.width * 3;
      newCanvas.height = img.height;

      // Draw original to get image data
      ctx.drawImage(img, 0, 0);
      const originalData = ctx.getImageData(0, 0, img.width, img.height).data;

      const red = newCtx.createImageData(img.width, img.height);
      const green = newCtx.createImageData(img.width, img.height);
      const blue = newCtx.createImageData(img.width, img.height);

      for (let i = 0; i < originalData.length; i += 4) {
        red.data[i] = originalData[i];       // R
        red.data[i + 1] = 0;
        red.data[i + 2] = 0;
        red.data[i + 3] = 255;

        green.data[i] = 0;
        green.data[i + 1] = originalData[i + 1]; // G
        green.data[i + 2] = 0;
        green.data[i + 3] = 255;

        blue.data[i] = 0;
        blue.data[i + 1] = 0;
        blue.data[i + 2] = originalData[i + 2]; // B
        blue.data[i + 3] = 255;
      }

      newCtx.putImageData(red, 0, 0);
      newCtx.putImageData(green, img.width, 0);
      newCtx.putImageData(blue, img.width * 2, 0);

      resolve(newCanvas.toDataURL());
    };
  });
}
  