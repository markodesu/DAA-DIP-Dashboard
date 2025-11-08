// src/pages/dip/filters/BrightnessContrastPage.jsx
import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { adjustBrightnessContrast } from "./brightnessContrast";
import { calculateHistogram, drawHistogram } from "../utils/histogramUtils";
import "./FilterPage.css";

export default function BrightnessContrastPage() {
  const [image, setImage] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [brightness, setBrightness] = useState(0);
  const [contrast, setContrast] = useState(100);
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

  useEffect(() => {
    if (image && processedImage) {
      handleApply();
    }
  }, [brightness, contrast]);

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
    const brightnessValue = brightness;
    const contrastValue = contrast / 100;
    const result = await adjustBrightnessContrast(image, brightnessValue, contrastValue);
    setProcessedImage(result);
  };

  return (
    <div className="filter-page">
      <div className="filter-header">
        <Link to="/dip" className="back-link">← Back to DIP Home</Link>
        <h1>Brightness & Contrast Adjustment</h1>
        <p>Adjust image brightness and contrast with interactive controls</p>
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
            <>
              <div className="slider-group">
                <label>
                  Brightness: {brightness}
                  <input
                    type="range"
                    min="-100"
                    max="100"
                    value={brightness}
                    onChange={(e) => setBrightness(Number(e.target.value))}
                    className="slider"
                  />
                </label>
                <label>
                  Contrast: {contrast}%
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={contrast}
                    onChange={(e) => setContrast(Number(e.target.value))}
                    className="slider"
                  />
                </label>
              </div>
              <button onClick={handleApply} className="apply-btn">Apply</button>
            </>
          )}
        </div>

        <div className="explanation-section">
          <h2>Mathematical Formula</h2>
          <div className="formula-box">
            <p className="formula">
              <strong>Adjusted Value:</strong> P' = clamp((P - 128) × C + 128 + B)
            </p>
            <p className="formula-alt">
              Where:
            </p>
            <ul style={{textAlign: 'left', marginTop: '0.5rem'}}>
              <li>P = original pixel value (0-255)</li>
              <li>P' = adjusted pixel value (0-255)</li>
              <li>C = contrast multiplier (typically 0.5 to 2.0)</li>
              <li>B = brightness offset (-255 to 255)</li>
              <li>clamp() = ensures value stays in [0, 255] range</li>
            </ul>
          </div>

          <div className="explanation-content">
            <h3>Step-by-Step Process</h3>
            <ol>
              <li>For each pixel, extract RGB values</li>
              <li><strong>Apply Contrast:</strong> Subtract 128 (midpoint), multiply by contrast factor, add 128 back
                <ul>
                  <li>This centers the operation around the midpoint</li>
                </ul>
              </li>
              <li><strong>Apply Brightness:</strong> Add brightness offset to the result</li>
              <li><strong>Clamp:</strong> Ensure values stay within [0, 255] range</li>
              <li>Apply to all three color channels (R, G, B) independently</li>
            </ol>

            <h3>Understanding the Formula</h3>
            <p>
              The formula (P - 128) × C + 128 centers the contrast operation around 128 (the middle of the 0-255 range).
              This ensures that:
            </p>
            <ul>
              <li>When C = 1, the image remains unchanged (after brightness adjustment)</li>
              <li>When C &gt; 1, contrast increases (darker areas become darker, lighter areas become lighter)</li>
              <li>When C &lt; 1, contrast decreases (values move toward the midpoint)</li>
              <li>Brightness (B) is simply added/subtracted from all values</li>
            </ul>

            <h3>Example Calculation</h3>
            <div className="example-box">
              <p>Given a pixel with RGB(100, 150, 200), C = 1.5, B = 20</p>
              <p><strong>For Red channel (100):</strong></p>
              <p>P' = clamp((100 - 128) × 1.5 + 128 + 20)</p>
              <p>P' = clamp(-28 × 1.5 + 128 + 20)</p>
              <p>P' = clamp(-42 + 128 + 20)</p>
              <p>P' = clamp(106) = 106</p>
              <p><strong>For Green channel (150):</strong></p>
              <p>P' = clamp((150 - 128) × 1.5 + 128 + 20)</p>
              <p>P' = clamp(22 × 1.5 + 128 + 20)</p>
              <p>P' = clamp(33 + 128 + 20) = clamp(181) = 181</p>
              <p><strong>For Blue channel (200):</strong></p>
              <p>P' = clamp((200 - 128) × 1.5 + 128 + 20)</p>
              <p>P' = clamp(72 × 1.5 + 128 + 20)</p>
              <p>P' = clamp(108 + 128 + 20) = clamp(256) = 255 (clamped)</p>
              <p><strong>Result:</strong> RGB(106, 181, 255)</p>
            </div>

            <h3>Parameter Effects</h3>
            <ul>
              <li><strong>Brightness &gt; 0:</strong> Image becomes brighter</li>
              <li><strong>Brightness &lt; 0:</strong> Image becomes darker</li>
              <li><strong>Contrast &gt; 100%:</strong> Increases contrast (more dramatic differences)</li>
              <li><strong>Contrast &lt; 100%:</strong> Decreases contrast (values converge toward midpoint)</li>
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

