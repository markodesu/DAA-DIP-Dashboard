// src/pages/dip/filters/SharpenPage.jsx
import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { applySharpen } from "./sharpen";
import { calculateHistogram, drawHistogram } from "../utils/histogramUtils";
import "./FilterPage.css";

export default function SharpenPage() {
  const [image, setImage] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [sharpenStrength, setSharpenStrength] = useState(100);
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
  }, [sharpenStrength]);

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
    const strength = sharpenStrength / 100;
    const result = await applySharpen(image, strength);
    setProcessedImage(result);
  };

  return (
    <div className="filter-page">
      <div className="filter-header">
        <Link to="/dip" className="back-link">← Back to DIP Home</Link>
        <h1>Sharpen Filter</h1>
        <p>Enhance image sharpness using sharpening kernel</p>
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
                  Strength: {sharpenStrength}%
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={sharpenStrength}
                    onChange={(e) => setSharpenStrength(Number(e.target.value))}
                    className="slider"
                  />
                </label>
              </div>
              <button onClick={handleApply} className="apply-btn">Apply Sharpen</button>
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
              <strong>Sharpening Kernel:</strong>
            </p>
            <pre style={{margin: '1rem 0', textAlign: 'center', fontFamily: 'monospace'}}>
{`[  0    -s    0  ]
[ -s  1+4s   -s  ]
[  0    -s    0  ]`}
            </pre>
            <p className="formula-alt">
              Where s = strength parameter (0-2)
            </p>
            <p className="formula-alt" style={{marginTop: '0.5rem'}}>
              <strong>Convolution:</strong> P' = Σ(i,j) K[i][j] × P[i][j]
            </p>
          </div>

          <div className="explanation-content">
            <h3>Step-by-Step Process</h3>
            <ol>
              <li>For each pixel (excluding edges), extract the 3×3 neighborhood</li>
              <li>Apply the sharpening kernel using convolution
                <ul>
                  <li>Multiply each kernel value with corresponding neighborhood pixel</li>
                  <li>Sum all products</li>
                </ul>
              </li>
              <li>Clamp the result to [0, 255] range</li>
              <li>Apply to each color channel (R, G, B) independently</li>
              <li>Edge pixels remain unchanged (no padding applied)</li>
            </ol>

            <h3>Understanding Sharpening</h3>
            <p>
              Sharpening enhances edges and fine details by subtracting a weighted average of surrounding
              pixels from the center pixel. The kernel has a positive center value and negative surrounding
              values, which creates a high-pass filter effect.
            </p>

            <h3>How It Works</h3>
            <ul>
              <li><strong>Center pixel:</strong> Multiplied by (1 + 4s), emphasizing its value</li>
              <li><strong>Neighbors:</strong> Multiplied by -s, subtracting their influence</li>
              <li><strong>Result:</strong> Edges become more pronounced, smooth areas remain relatively unchanged</li>
            </ul>

            <h3>Example Calculation</h3>
            <div className="example-box">
              <p>Given a 3×3 pixel neighborhood (grayscale values) and s = 1:</p>
              <pre style={{margin: '0.5rem 0'}}>
{`[100 120 140]
[110 130 150]
[105 125 145]`}
              </pre>
              <p>Kernel with s = 1:</p>
              <pre style={{margin: '0.5rem 0'}}>
{`[ 0  -1   0 ]
[-1   5  -1 ]
[ 0  -1   0 ]`}
              </pre>
              <p><strong>Step 1:</strong> Apply convolution</p>
              <p>P' = (0×100) + (-1×120) + (0×140) + (-1×110) + (5×130) + (-1×150) + (0×105) + (-1×125) + (0×145)</p>
              <p>P' = 0 - 120 + 0 - 110 + 650 - 150 + 0 - 125 + 0</p>
              <p>P' = 145</p>
              <p><strong>Step 2:</strong> Clamp to [0, 255]</p>
              <p>Result = 145 (within range)</p>
              <p>The center pixel (130) is enhanced to 145, making the edge more pronounced</p>
            </div>

            <h3>Effect of Strength Parameter</h3>
            <ul>
              <li><strong>s = 0:</strong> No sharpening, original image</li>
              <li><strong>s = 0.5:</strong> Subtle sharpening, good for most images</li>
              <li><strong>s = 1.0:</strong> Moderate sharpening, enhances details</li>
              <li><strong>s &gt; 1.5:</strong> Strong sharpening, may introduce artifacts</li>
            </ul>

            <h3>Applications</h3>
            <ul>
              <li>Enhancing image details after resizing</li>
              <li>Improving text readability in scanned documents</li>
              <li>Compensating for soft focus in photographs</li>
              <li>Preprocessing for edge detection algorithms</li>
            </ul>

            <h3>Time Complexity</h3>
            <p>O(n × m × k²) where n and m are image dimensions and k is kernel size (3).</p>
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

