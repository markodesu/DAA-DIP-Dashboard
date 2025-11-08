// src/pages/dip/filters/NegativePage.jsx
import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { applyNegative } from "./negative";
import { calculateHistogram, drawHistogram } from "../utils/histogramUtils";
import "./FilterPage.css";

export default function NegativePage() {
  const [image, setImage] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const originalHistogramRef = useRef(null);
  const processedHistogramRef = useRef(null);

  useEffect(() => {
    if (image && originalHistogramRef.current) {
      calculateHistogram(image).then((hist) => {
        drawHistogram(originalHistogramRef.current, hist.gray, "#3b82f6");
      });
    }
  }, [image]);

  useEffect(() => {
    if (processedImage && processedHistogramRef.current) {
      calculateHistogram(processedImage).then((hist) => {
        drawHistogram(processedHistogramRef.current, hist.gray, "#10b981");
      });
    }
  }, [processedImage]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result);
        setProcessedImage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleApply = async () => {
    if (!image) return;
    const result = await applyNegative(image);
    setProcessedImage(result);
  };

  return (
    <div className="filter-page">
      <div className="filter-header">
        <Link to="/dip" className="back-link">← Back to DIP Home</Link>
        <h1>Negative Filter</h1>
        <p>Invert image colors to create negative effect</p>
      </div>

      <div className="filter-content">
        <div className="input-section">
          <h2>Input</h2>
          <div className="upload-section">
            <label className="upload-button">
              <input type="file" accept="image/*" onChange={handleImageUpload} />
              {image ? "Change Image" : "Upload Image"}
            </label>
          </div>
          {image && (
            <button onClick={handleApply} className="apply-btn">Apply Negative</button>
          )}
        </div>

        <div className="explanation-section">
          <h2>Mathematical Formula</h2>
          <div className="formula-box">
            <p className="formula">
              <strong>For each color channel:</strong> P' = 255 - P
            </p>
            <p className="formula-alt">
              Where P is the original pixel value (0-255) and P' is the inverted value
            </p>
          </div>

          <div className="explanation-content">
            <h3>Step-by-Step Process</h3>
            <ol>
              <li>For each pixel in the image, extract the Red (R), Green (G), and Blue (B) values</li>
              <li>Apply the negative transformation to each channel:
                <ul>
                  <li>R' = 255 - R</li>
                  <li>G' = 255 - G</li>
                  <li>B' = 255 - B</li>
                </ul>
              </li>
              <li>Set the new RGB values to the pixel</li>
              <li>The alpha channel (transparency) remains unchanged</li>
            </ol>

            <h3>Why This Works</h3>
            <p>
              The negative transformation inverts the intensity values. Since pixel values range from 0 to 255,
              subtracting each value from 255 creates the inverse. This is similar to photographic negatives where
              dark areas become light and vice versa.
            </p>

            <h3>Example Calculation</h3>
            <div className="example-box">
              <p>Given a pixel with RGB values: R = 200, G = 150, B = 100</p>
              <p><strong>Step 1:</strong> Apply negative transformation</p>
              <p>R' = 255 - 200 = 55</p>
              <p>G' = 255 - 150 = 105</p>
              <p>B' = 255 - 100 = 155</p>
              <p><strong>Result:</strong> The pixel becomes RGB(55, 105, 155)</p>
            </div>

            <h3>Properties</h3>
            <ul>
              <li><strong>Reversible:</strong> Applying negative twice returns the original image</li>
              <li><strong>Linear:</strong> The transformation is linear and preserves relative differences</li>
              <li><strong>Range:</strong> Output values remain in the valid range [0, 255]</li>
            </ul>

            <h3>Time Complexity</h3>
            <p>O(n × m) where n and m are the width and height of the image. Each pixel is processed once.</p>
          </div>
        </div>

        {image && (
          <div className="results-section">
            <h2>Results</h2>
            <div className="images-container">
              <div className="image-panel">
                <h3>Original Image</h3>
                <img src={image} alt="original" className="result-image" />
                <div className="histogram-container">
                  <h4>Histogram (Grayscale)</h4>
                  <canvas ref={originalHistogramRef} width={400} height={150} className="histogram-canvas"></canvas>
                </div>
              </div>

              {processedImage && (
                <div className="image-panel">
                  <h3>Processed Image</h3>
                  <img src={processedImage} alt="processed" className="result-image" />
                  <div className="histogram-container">
                    <h4>Histogram (Grayscale)</h4>
                    <canvas ref={processedHistogramRef} width={400} height={150} className="histogram-canvas"></canvas>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

