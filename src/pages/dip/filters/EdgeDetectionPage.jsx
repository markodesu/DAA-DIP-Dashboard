// src/pages/dip/filters/EdgeDetectionPage.jsx
import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { applyEdgeDetection } from "./edgeDetection";
import { calculateHistogram, drawHistogram } from "../utils/histogramUtils";
import "./FilterPage.css";

export default function EdgeDetectionPage() {
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
    const result = await applyEdgeDetection(image);
    setProcessedImage(result);
  };

  return (
    <div className="filter-page">
      <div className="filter-header">
        <Link to="/dip" className="back-link">← Back to DIP Home</Link>
        <h1>Edge Detection (Sobel Operator)</h1>
        <p>Detect edges using gradient-based Sobel operator</p>
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
            <button onClick={handleApply} className="apply-btn">Apply Edge Detection</button>
          )}
        </div>

        <div className="explanation-section">
          <h2>Mathematical Formula</h2>
          <div className="formula-box">
            <p className="formula">
              <strong>Sobel X Kernel (Gx):</strong>
            </p>
            <pre style={{textAlign: 'center', margin: '1rem 0'}}>
{`[-1  0  1]
[-2  0  2]
[-1  0  1]`}
            </pre>
            <p className="formula">
              <strong>Sobel Y Kernel (Gy):</strong>
            </p>
            <pre style={{textAlign: 'center', margin: '1rem 0'}}>
{`[-1 -2 -1]
[ 0  0  0]
[ 1  2  1]`}
            </pre>
            <p className="formula-alt">
              <strong>Gradient Magnitude:</strong> G = √(Gx² + Gy²)
            </p>
          </div>

          <div className="explanation-content">
            <h3>Step-by-Step Process</h3>
            <ol>
              <li><strong>Convert to Grayscale:</strong> First convert the image to grayscale using the luminance formula</li>
              <li><strong>Apply Sobel X Kernel:</strong> Convolve the grayscale image with the Sobel X kernel to detect vertical edges</li>
              <li><strong>Apply Sobel Y Kernel:</strong> Convolve the grayscale image with the Sobel Y kernel to detect horizontal edges</li>
              <li><strong>Calculate Gradient Magnitude:</strong> For each pixel, compute G = √(Gx² + Gy²)</li>
              <li><strong>Normalize:</strong> Clamp values to [0, 255] range</li>
              <li><strong>Set RGB:</strong> Set all three color channels to the gradient magnitude value</li>
            </ol>

            <h3>Convolution Operation</h3>
            <p>
              For a 3×3 kernel K and pixel neighborhood P, the convolution is:
            </p>
            <div className="example-box">
              <p><strong>Gx or Gy =</strong> Σ(i=0 to 2) Σ(j=0 to 2) K[i][j] × P[i][j]</p>
            </div>

            <h3>Why Sobel Operator?</h3>
            <p>
              The Sobel operator is a discrete differentiation operator that computes an approximation of the gradient
              of the image intensity function. It emphasizes pixels that correspond to edges by detecting areas where
              the intensity changes rapidly.
            </p>
            <ul>
              <li><strong>Gx:</strong> Detects vertical edges (changes in horizontal direction)</li>
              <li><strong>Gy:</strong> Detects horizontal edges (changes in vertical direction)</li>
              <li><strong>G:</strong> Combined magnitude shows edges in all directions</li>
            </ul>

            <h3>Example Calculation</h3>
            <div className="example-box">
              <p>Given a 3×3 pixel neighborhood (grayscale values):</p>
              <pre style={{margin: '0.5rem 0'}}>
{`[100 120 140]
[110 130 150]
[105 125 145]`}
              </pre>
              <p><strong>Step 1:</strong> Apply Sobel X kernel</p>
              <p>Gx = (-1×100) + (0×120) + (1×140) + (-2×110) + (0×130 + (2×150) + (-1×105) + (0×125) + (1×145)</p>
              <p>Gx = -100 + 0 + 140 - 220 + 0 + 300 - 105 + 0 + 145 = 160</p>
              <p><strong>Step 2:</strong> Apply Sobel Y kernel</p>
              <p>Gy = (-1×100) + (-2×120) + (-1×140) + (0×110) + (0×130) + (0×150) + (1×105) + (2×125) + (1×145)</p>
              <p>Gy = -100 - 240 - 140 + 0 + 0 + 0 + 105 + 250 + 145 = 20</p>
              <p><strong>Step 3:</strong> Calculate magnitude</p>
              <p>G = √(160² + 20²) = √(25600 + 400) = √26000 ≈ 161</p>
              <p><strong>Result:</strong> The center pixel becomes RGB(161, 161, 161)</p>
            </div>

            <h3>Time Complexity</h3>
            <p>O(n × m × k²) where n and m are image dimensions and k is kernel size (3 for Sobel).</p>
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

