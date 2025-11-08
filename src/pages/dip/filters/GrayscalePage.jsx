// src/pages/dip/filters/GrayscalePage.jsx
import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { applyGrayscale } from "./grayscale";
import { calculateHistogram, drawHistogram } from "../utils/histogramUtils";
import "./FilterPage.css";

export default function GrayscalePage() {
  const [image, setImage] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
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
    const result = await applyGrayscale(image);
    setProcessedImage(result);
  };

  return (
    <div className="filter-page">
      <div className="filter-header">
        <Link to="/dip" className="back-link">← Back to DIP Home</Link>
        <h1>Grayscale Filter</h1>
        <p>Convert color images to grayscale using luminance formula</p>
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
            <button onClick={handleApply} className="apply-btn">Apply Grayscale</button>
          )}
        </div>

        <div className="explanation-section">
          <button 
            className="explanation-toggle"
            onClick={() => setShowExplanation(!showExplanation)}
          >
            {showExplanation ? "▼" : "▶"} Mathematical Formula & Explanation
          </button>
          {showExplanation && (
            <>
              <h2>Mathematical Formula</h2>
              <div className="formula-box">
            <p className="formula">
              <strong>Grayscale Value:</strong> G = 0.299 × R + 0.587 × G + 0.114 × B
            </p>
            <p className="formula-alt">
              Or using simplified coefficients: G = 0.3 × R + 0.59 × G + 0.11 × B
            </p>
          </div>

          <div className="explanation-content">
            <h3>Step-by-Step Process</h3>
            <ol>
              <li>For each pixel in the image, extract the Red (R), Green (G), and Blue (B) values (0-255)</li>
              <li>Calculate the grayscale value using the luminance formula:
                <ul>
                  <li>G = 0.299 × R + 0.587 × G + 0.114 × B</li>
                </ul>
              </li>
              <li>Set all three color channels (R, G, B) to the calculated grayscale value</li>
              <li>The alpha channel (transparency) remains unchanged</li>
            </ol>

            <h3>Why These Coefficients?</h3>
            <p>
              The coefficients (0.299, 0.587, 0.114) are based on human eye sensitivity to different colors.
              The human eye is most sensitive to green light, followed by red, and least sensitive to blue.
              These weights ensure the grayscale image appears with the same perceived brightness as the original color image.
            </p>

            <h3>Example Calculation</h3>
            <div className="example-box">
              <p>Given a pixel with RGB values: R = 200, G = 150, B = 100</p>
              <p><strong>Step 1:</strong> Apply the formula</p>
              <p>G = 0.299 × 200 + 0.587 × 150 + 0.114 × 100</p>
              <p>G = 59.8 + 88.05 + 11.4</p>
              <p>G = 159.25 ≈ 159</p>
              <p><strong>Result:</strong> The pixel becomes RGB(159, 159, 159)</p>
            </div>

            <h3>Time Complexity</h3>
            <p>O(n × m) where n and m are the width and height of the image. Each pixel is processed once.</p>
          </div>
            </>
          )}
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

