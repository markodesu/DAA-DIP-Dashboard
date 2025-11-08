// src/pages/dip/filters/ThresholdPage.jsx
import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { applyThreshold } from "./threshold";
import { calculateHistogram, drawHistogram } from "../utils/histogramUtils";
import "./FilterPage.css";

export default function ThresholdPage() {
  const [image, setImage] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [threshold, setThreshold] = useState(128);
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

  useEffect(() => {
    if (image && processedImage) {
      handleApply();
    }
  }, [threshold]);

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
    const result = await applyThreshold(image, threshold);
    setProcessedImage(result);
  };

  return (
    <div className="filter-page">
      <div className="filter-header">
        <Link to="/dip" className="back-link">← Back to DIP Home</Link>
        <h1>Threshold Filter</h1>
        <p>Convert to binary image using thresholding</p>
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
                  Threshold: {threshold}
                  <input
                    type="range"
                    min="0"
                    max="255"
                    value={threshold}
                    onChange={(e) => setThreshold(Number(e.target.value))}
                    className="slider"
                  />
                </label>
              </div>
              <button onClick={handleApply} className="apply-btn">Apply Threshold</button>
            </>
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
              <strong>Threshold Transformation:</strong>
            </p>
            <p className="formula-alt" style={{marginTop: '1rem'}}>
              P' = 255 if G &gt; T, else 0
            </p>
            <p className="formula-alt" style={{marginTop: '0.5rem'}}>
              Where:
            </p>
            <ul style={{textAlign: 'left', marginTop: '0.5rem'}}>
              <li>G = grayscale value (0.3×R + 0.59×G + 0.11×B)</li>
              <li>T = threshold value (0-255)</li>
              <li>P' = output pixel value (0 or 255)</li>
            </ul>
          </div>

          <div className="explanation-content">
            <h3>Step-by-Step Process</h3>
            <ol>
              <li><strong>Convert to Grayscale:</strong> First convert each pixel to grayscale using luminance formula
                <ul>
                  <li>G = 0.3 × R + 0.59 × G + 0.11 × B</li>
                </ul>
              </li>
              <li><strong>Apply Threshold:</strong> Compare grayscale value with threshold
                <ul>
                  <li>If G &gt; T: Set pixel to white (255)</li>
                  <li>If G ≤ T: Set pixel to black (0)</li>
                </ul>
              </li>
              <li><strong>Set RGB:</strong> Set all three color channels to the same value (0 or 255)</li>
            </ol>

            <h3>Understanding Thresholding</h3>
            <p>
              Thresholding is a simple but powerful technique that converts a grayscale image into a binary
              (black and white) image. It's useful for:
            </p>
            <ul>
              <li>Object detection and segmentation</li>
              <li>Text recognition (OCR preprocessing)</li>
              <li>Image binarization for compression</li>
              <li>Creating masks for further processing</li>
            </ul>

            <h3>Example Calculation</h3>
            <div className="example-box">
              <p>Given a pixel with RGB(100, 150, 200) and threshold T = 128</p>
              <p><strong>Step 1:</strong> Convert to grayscale</p>
              <p>G = 0.3 × 100 + 0.59 × 150 + 0.11 × 200</p>
              <p>G = 30 + 88.5 + 22 = 140.5 ≈ 141</p>
              <p><strong>Step 2:</strong> Compare with threshold</p>
              <p>141 &gt; 128 → P' = 255</p>
              <p><strong>Result:</strong> The pixel becomes RGB(255, 255, 255) - white</p>
              <p style={{marginTop: '1rem'}}>For a pixel with RGB(50, 80, 100) and T = 128:</p>
              <p>G = 0.3 × 50 + 0.59 × 80 + 0.11 × 100 = 15 + 47.2 + 11 = 73.2 ≈ 73</p>
              <p>73 ≤ 128 → P' = 0</p>
              <p><strong>Result:</strong> The pixel becomes RGB(0, 0, 0) - black</p>
            </div>

            <h3>Choosing the Threshold Value</h3>
            <ul>
              <li><strong>Low threshold (0-85):</strong> Most pixels become white, only very dark areas remain black</li>
              <li><strong>Medium threshold (86-170):</strong> Balanced separation, good for most images</li>
              <li><strong>High threshold (171-255):</strong> Most pixels become black, only very bright areas remain white</li>
              <li><strong>Optimal threshold:</strong> Often found using Otsu's method or histogram analysis</li>
            </ul>

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

