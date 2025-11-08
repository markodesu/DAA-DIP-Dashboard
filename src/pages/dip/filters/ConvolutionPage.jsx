// src/pages/dip/filters/ConvolutionPage.jsx
import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { applyConvolution } from "./convolution";
import { calculateHistogram, drawHistogram } from "../utils/histogramUtils";
import "./FilterPage.css";

export default function ConvolutionPage() {
  const [image, setImage] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [kernelType, setKernelType] = useState("emboss");
  const [showExplanation, setShowExplanation] = useState(false);
  const originalHistogramRef = useRef(null);
  const processedHistogramRef = useRef(null);

  const kernels = {
    emboss: [
      [-2, -1, 0],
      [-1, 1, 1],
      [0, 1, 2],
    ],
    sharpen: [
      [0, -1, 0],
      [-1, 5, -1],
      [0, -1, 0],
    ],
    edge: [
      [-1, -1, -1],
      [-1, 8, -1],
      [-1, -1, -1],
    ],
    blur: [
      [1/9, 1/9, 1/9],
      [1/9, 1/9, 1/9],
      [1/9, 1/9, 1/9],
    ],
  };

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
    const kernel = kernels[kernelType];
    const result = await applyConvolution(image, kernel);
    setProcessedImage(result);
  };

  return (
    <div className="filter-page">
      <div className="filter-header">
        <Link to="/dip" className="back-link">← Back to DIP Home</Link>
        <h1>Convolution Filter</h1>
        <p>Apply custom convolution kernels for various image effects</p>
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
              <div className="kernel-selector">
                <label>
                  Kernel Type:
                  <select value={kernelType} onChange={(e) => setKernelType(e.target.value)} className="kernel-select">
                    <option value="emboss">Emboss</option>
                    <option value="sharpen">Sharpen</option>
                    <option value="edge">Edge Detection</option>
                    <option value="blur">Blur</option>
                  </select>
                </label>
              </div>
              <button onClick={handleApply} className="apply-btn">Apply Convolution</button>
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
              <strong>Convolution Operation:</strong>
            </p>
            <p className="formula-alt" style={{marginTop: '1rem'}}>
              For a kernel K of size n×n and pixel neighborhood P:
            </p>
            <p className="formula" style={{marginTop: '0.5rem'}}>
              Result = Σ(i=0 to n-1) Σ(j=0 to n-1) K[i][j] × P[i][j]
            </p>
          </div>

          <div className="explanation-content">
            <h3>Selected Kernel</h3>
            <div className="example-box">
              <p><strong>{kernelType.charAt(0).toUpperCase() + kernelType.slice(1)} Kernel:</strong></p>
              <pre style={{margin: '0.5rem 0', textAlign: 'center', fontFamily: 'monospace'}}>
{`${kernels[kernelType].map(row => 
  `[${row.map(v => v.toString().padStart(4)).join(' ')}]`
).join('\n')}`}
              </pre>
            </div>

            <h3>Step-by-Step Process</h3>
            <ol>
              <li><strong>Convert to Grayscale:</strong> First convert the image to grayscale</li>
              <li><strong>Select Kernel:</strong> Choose the convolution kernel to apply</li>
              <li><strong>For each pixel:</strong>
                <ul>
                  <li>Extract the n×n neighborhood around the pixel</li>
                  <li>Multiply each kernel value with corresponding neighborhood pixel</li>
                  <li>Sum all the products</li>
                  <li>Clamp the result to [0, 255] range</li>
                </ul>
              </li>
              <li><strong>Edge Handling:</strong> Pixels at image edges are skipped (no padding)</li>
              <li><strong>Set RGB:</strong> Set all three color channels to the computed value</li>
            </ol>

            <h3>Understanding Convolution</h3>
            <p>
              Convolution is a fundamental operation in image processing. It applies a small matrix (kernel)
              to each pixel's neighborhood, creating various effects:
            </p>
            <ul>
              <li><strong>Emboss:</strong> Creates a 3D embossed effect by detecting directional gradients</li>
              <li><strong>Sharpen:</strong> Enhances edges by subtracting surrounding values from a weighted center</li>
              <li><strong>Edge Detection:</strong> Highlights edges by detecting rapid intensity changes</li>
              <li><strong>Blur:</strong> Averages neighboring pixels to create smoothing effect</li>
            </ul>

            <h3>Example Calculation</h3>
            <div className="example-box">
              <p>Given a 3×3 pixel neighborhood (grayscale values):</p>
              <pre style={{margin: '0.5rem 0'}}>
{`[100 120 140]
[110 130 150]
[105 125 145]`}
              </pre>
              <p>And Emboss kernel:</p>
              <pre style={{margin: '0.5rem 0'}}>
{`[-2 -1  0]
[-1  1  1]
[ 0  1  2]`}
              </pre>
              <p><strong>Step 1:</strong> Multiply corresponding values</p>
              <p>(-2×100) + (-1×120) + (0×140) + (-1×110) + (1×130) + (1×150) + (0×105) + (1×125) + (2×145)</p>
              <p><strong>Step 2:</strong> Sum the products</p>
              <p>= -200 - 120 + 0 - 110 + 130 + 150 + 0 + 125 + 290</p>
              <p>= 265</p>
              <p><strong>Step 3:</strong> Clamp to [0, 255]</p>
              <p>Result = 255 (clamped from 265)</p>
            </div>

            <h3>Kernel Properties</h3>
            <ul>
              <li><strong>Size:</strong> Typically 3×3, but can be any odd size (5×5, 7×7, etc.)</li>
              <li><strong>Sum:</strong> Some kernels sum to 0 (edge detection), others to 1 (blur)</li>
              <li><strong>Symmetry:</strong> Many kernels are symmetric for uniform effects</li>
              <li><strong>Normalization:</strong> Blur kernels are often normalized (sum = 1) to preserve brightness</li>
            </ul>

            <h3>Time Complexity</h3>
            <p>O(n × m × k²) where n and m are image dimensions and k is kernel size (typically 3).</p>
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

