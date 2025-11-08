// src/pages/dip/filters/BlurPage.jsx
import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { applyBlur } from "./blur";
import { calculateHistogram, drawHistogram } from "../utils/histogramUtils";
import "./FilterPage.css";

export default function BlurPage() {
  const [image, setImage] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [blurRadius, setBlurRadius] = useState(3);
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
  }, [blurRadius]);

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
    const result = await applyBlur(image, blurRadius);
    setProcessedImage(result);
  };

  return (
    <div className="filter-page">
      <div className="filter-header">
        <Link to="/dip" className="back-link">← Back to DIP Home</Link>
        <h1>Blur Filter</h1>
        <p>Apply Gaussian blur for image smoothing</p>
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
                  Blur Radius: {blurRadius}px
                  <input
                    type="range"
                    min="1"
                    max="20"
                    value={blurRadius}
                    onChange={(e) => setBlurRadius(Number(e.target.value))}
                    className="slider"
                  />
                </label>
              </div>
              <button onClick={handleApply} className="apply-btn">Apply Blur</button>
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
              <strong>Gaussian Blur:</strong> Uses a Gaussian function for smoothing
            </p>
            <p className="formula-alt" style={{marginTop: '1rem'}}>
              The blur effect is applied using CSS filter: blur(radius)
            </p>
            <p className="formula-alt" style={{marginTop: '0.5rem'}}>
              Where radius is the standard deviation (σ) of the Gaussian distribution
            </p>
          </div>

          <div className="explanation-content">
            <h3>Step-by-Step Process</h3>
            <ol>
              <li>Load the image onto a canvas</li>
              <li>Apply CSS filter property with blur radius</li>
              <li>The browser's rendering engine applies a Gaussian blur algorithm</li>
              <li>Each pixel's value is replaced by a weighted average of surrounding pixels</li>
              <li>The weight distribution follows a Gaussian (normal) distribution</li>
            </ol>

            <h3>Understanding Gaussian Blur</h3>
            <p>
              Gaussian blur reduces image detail and noise by averaging pixel values with their neighbors.
              The blur radius determines how many pixels are averaged together. A larger radius creates
              more blur by averaging over a larger area.
            </p>

            <h3>Gaussian Function</h3>
            <div className="example-box">
              <p><strong>2D Gaussian Function:</strong></p>
              <p>G(x, y) = (1 / (2πσ²)) × e^(-(x² + y²) / (2σ²))</p>
              <p>Where:</p>
              <ul style={{marginLeft: '1.5rem'}}>
                <li>σ (sigma) = blur radius</li>
                <li>x, y = distance from center pixel</li>
                <li>The function creates a bell-shaped weight distribution</li>
              </ul>
            </div>

            <h3>Effect of Blur Radius</h3>
            <ul>
              <li><strong>Small radius (1-3px):</strong> Subtle smoothing, reduces minor noise</li>
              <li><strong>Medium radius (4-8px):</strong> Noticeable blur, good for background separation</li>
              <li><strong>Large radius (9-20px):</strong> Strong blur effect, creates dreamy/soft focus</li>
            </ul>

            <h3>Applications</h3>
            <ul>
              <li>Noise reduction in images</li>
              <li>Creating depth of field effects</li>
              <li>Background blurring (bokeh effect)</li>
              <li>Preprocessing for other image operations</li>
            </ul>

            <h3>Time Complexity</h3>
            <p>O(n × m × r²) where n and m are image dimensions and r is blur radius. However, modern browsers use optimized algorithms that are more efficient.</p>
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

