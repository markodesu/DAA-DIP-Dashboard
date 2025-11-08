// src/pages/dip/filters/HistogramPage.jsx
import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { applyHistogram } from "./histogram";
import { calculateHistogram, drawHistogram } from "../utils/histogramUtils";
import "./FilterPage.css";

export default function HistogramPage() {
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
    const result = await applyHistogram(image);
    setProcessedImage(result);
  };

  return (
    <div className="filter-page">
      <div className="filter-header">
        <Link to="/dip" className="back-link">← Back to DIP Home</Link>
        <h1>Histogram Equalization</h1>
        <p>Enhance image contrast using histogram equalization</p>
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
            <button onClick={handleApply} className="apply-btn">Apply Histogram Equalization</button>
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
              <strong>Equalized Value:</strong> P' = round((CDF(P) - CDF_min) / (N - CDF_min) × 255)
            </p>
            <p className="formula-alt" style={{marginTop: '1rem'}}>
              Where:
            </p>
            <ul style={{textAlign: 'left', marginTop: '0.5rem'}}>
              <li>P = original pixel intensity (0-255)</li>
              <li>CDF(P) = Cumulative Distribution Function at P</li>
              <li>CDF_min = minimum non-zero CDF value</li>
              <li>N = total number of pixels</li>
            </ul>
          </div>

          <div className="explanation-content">
            <h3>Step-by-Step Process</h3>
            <ol>
              <li><strong>Convert to Grayscale:</strong> Convert the image to grayscale</li>
              <li><strong>Build Histogram:</strong> Count frequency of each intensity value (0-255)
                <ul>
                  <li>H[i] = count of pixels with intensity i</li>
                </ul>
              </li>
              <li><strong>Calculate CDF:</strong> Compute Cumulative Distribution Function
                <ul>
                  <li>CDF[0] = H[0]</li>
                  <li>CDF[i] = CDF[i-1] + H[i] for i = 1 to 255</li>
                </ul>
              </li>
              <li><strong>Find CDF_min:</strong> Find the first non-zero value in CDF</li>
              <li><strong>Apply Transformation:</strong> For each pixel, apply the equalization formula</li>
              <li><strong>Normalize:</strong> Round and clamp values to [0, 255]</li>
            </ol>

            <h3>Why Histogram Equalization?</h3>
            <p>
              Histogram equalization redistributes pixel intensities to use the full dynamic range [0, 255].
              This enhances contrast, especially in images with poor contrast where pixel values are concentrated
              in a narrow range. The transformation makes the histogram more uniform.
            </p>

            <h3>Example Calculation</h3>
            <div className="example-box">
              <p>Given a small 4×4 image with intensity values:</p>
              <pre style={{margin: '0.5rem 0'}}>
{`[50  50  100 100]
[50  50  100 150]
[100 100 150 200]
[150 200 200 255]`}
              </pre>
              <p><strong>Step 1:</strong> Build histogram</p>
              <p>H[50] = 4, H[100] = 5, H[150] = 3, H[200] = 2, H[255] = 1, others = 0</p>
              <p><strong>Step 2:</strong> Calculate CDF</p>
              <p>CDF[50] = 4, CDF[100] = 9, CDF[150] = 12, CDF[200] = 14, CDF[255] = 15</p>
              <p><strong>Step 3:</strong> Find CDF_min = 4 (first non-zero)</p>
              <p><strong>Step 4:</strong> Transform pixel with value 50</p>
              <p>P' = round((4 - 4) / (15 - 4) × 255) = round(0) = 0</p>
              <p><strong>Step 5:</strong> Transform pixel with value 100</p>
              <p>P' = round((9 - 4) / (15 - 4) × 255) = round(116.36) = 116</p>
              <p><strong>Step 6:</strong> Transform pixel with value 255</p>
              <p>P' = round((15 - 4) / (15 - 4) × 255) = round(255) = 255</p>
            </div>

            <h3>Properties</h3>
            <ul>
              <li><strong>Contrast Enhancement:</strong> Improves contrast by spreading intensity values</li>
              <li><strong>Automatic:</strong> No manual parameter tuning required</li>
              <li><strong>Monotonic:</strong> Preserves relative ordering of intensities</li>
              <li><strong>Full Range:</strong> Utilizes the entire [0, 255] range</li>
            </ul>

            <h3>Time Complexity</h3>
            <p>O(n × m + 256) where n and m are image dimensions. The 256 term comes from histogram and CDF calculation.</p>
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

