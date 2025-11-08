// src/components/DIPDashboard.jsx
import React, { useState } from 'react';

const DIPDashboard = () => {
  const [image, setImage] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const applyGrayscale = () => {
    if (!image) return;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.src = image;
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;
      for (let i = 0; i < data.length; i += 4) {
        const gray = 0.3 * data[i] + 0.59 * data[i + 1] + 0.11 * data[i + 2];
        data[i] = data[i + 1] = data[i + 2] = gray;
      }
      ctx.putImageData(imgData, 0, 0);
      setProcessedImage(canvas.toDataURL());
    };
  };

  return (
    <div>
      <h2>DIP Dashboard</h2>
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      {image && (
        <div>
          <h3>Original Image</h3>
          <img src={image} alt="original" style={{ maxWidth: '400px' }} />
        </div>
      )}
      {image && (
        <button onClick={applyGrayscale}>Apply Grayscale</button>
      )}
      {processedImage && (
        <div>
          <h3>Processed Image</h3>
          <img src={processedImage} alt="processed" style={{ maxWidth: '400px' }} />
        </div>
      )}
    </div>
  );
};

export default DIPDashboard;
