// src/pages/dip/filters/HistogramMatchingPage.jsx
import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { applyHistogramMatching } from "./histogramMatching";
import { calculateHistogram, drawHistogram } from "../utils/histogramUtils";
import "./FilterPage.css";

export default function HistogramMatchingPage() {
  const [sourceImage, setSourceImage] = useState(null);
  const [targetImage, setTargetImage] = useState(null);
  const [matchedImage, setMatchedImage] = useState(null);
  const [matchingData, setMatchingData] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [showProcess, setShowProcess] = useState(false);
  
  const sourceHistogramRef = useRef(null);
  const targetHistogramRef = useRef(null);
  const matchedHistogramRef = useRef(null);
  const mappingCanvasRef = useRef(null);

  useEffect(() => {
    if (sourceImage && sourceHistogramRef.current) {
      calculateHistogram(sourceImage).then((hist) => {
        drawHistogram(sourceHistogramRef.current, hist.gray, "#3b82f6");
      });
    }
  }, [sourceImage]);

  useEffect(() => {
    if (targetImage && targetHistogramRef.current) {
      calculateHistogram(targetImage).then((hist) => {
        drawHistogram(targetHistogramRef.current, hist.gray, "#ef4444");
      });
    }
  }, [targetImage]);

  useEffect(() => {
    if (matchedImage && matchedHistogramRef.current && matchingData) {
      drawHistogram(matchedHistogramRef.current, matchingData.matchedHist, "#10b981");
    }
  }, [matchedImage, matchingData]);

  useEffect(() => {
    if (matchingData && mappingCanvasRef.current) {
      const canvas = mappingCanvasRef.current;
      const ctx = canvas.getContext('2d');
      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(0, 0, width, height);

      // Draw mapping function
      ctx.strokeStyle = '#667eea';
      ctx.lineWidth = 2;
      ctx.beginPath();
      
      const mapping = matchingData.mapping;
      for (let i = 0; i < 256; i++) {
        const x = (i / 255) * width;
        const y = height - (mapping[i] / 255) * height;
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();

      // Draw axes
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, height - 1);
      ctx.lineTo(width, height - 1);
      ctx.moveTo(0, 0);
      ctx.lineTo(0, height);
      ctx.stroke();

      // Labels
      ctx.fillStyle = '#1e293b';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Source Intensity', width / 2, height - 5);
      ctx.save();
      ctx.translate(15, height / 2);
      ctx.rotate(-Math.PI / 2);
      ctx.fillText('Target Intensity', 0, 0);
      ctx.restore();
    }
  }, [matchingData]);

  const handleSourceUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSourceImage(reader.result);
        setMatchedImage(null);
        setMatchingData(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTargetUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setTargetImage(reader.result);
        setMatchedImage(null);
        setMatchingData(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMatch = async () => {
    if (!sourceImage || !targetImage) return;
    
    const result = await applyHistogramMatching(sourceImage, targetImage);
    setMatchedImage(result.matchedImage);
    setMatchingData(result);
    setShowProcess(true);
  };

  return (
    <div className="filter-page">
      <div className="filter-header">
        <Link to="/dip" className="back-link">← Back to DIP Home</Link>
        <h1>Histogram Matching</h1>
        <p>Match the histogram of one image to another image</p>
      </div>

      <div className="filter-content">
        <div className="input-section">
          <h2>Input Images</h2>
          
          <div className="upload-section" style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem', color: '#475569' }}>Source Image (to be modified)</h3>
            <label className="upload-button">
              <input type="file" accept="image/*" onChange={handleSourceUpload} />
              {sourceImage ? "Change Source" : "Upload Source Image"}
            </label>
          </div>

          <div className="upload-section">
            <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem', color: '#475569' }}>Target Image (reference histogram)</h3>
            <label className="upload-button">
              <input type="file" accept="image/*" onChange={handleTargetUpload} />
              {targetImage ? "Change Target" : "Upload Target Image"}
            </label>
          </div>

          {sourceImage && targetImage && (
            <button onClick={handleMatch} className="apply-btn" style={{ marginTop: '1.5rem' }}>
              Match Histograms
            </button>
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
                  <strong>Histogram Matching Process:</strong>
                </p>
                <p className="formula-alt" style={{marginTop: '1rem'}}>
                  Step 1: Calculate CDFs (Cumulative Distribution Functions)
                </p>
                <p className="formula">
                  CDF_source[i] = Σ(j=0 to i) H_source[j] / N_source
                </p>
                <p className="formula">
                  CDF_target[i] = Σ(j=0 to i) H_target[j] / N_target
                </p>
                
                <p className="formula-alt" style={{marginTop: '1rem'}}>
                  Step 2: Create mapping function
                </p>
                <p className="formula">
                  For each source intensity s, find target intensity t such that:
                </p>
                <p className="formula">
                  t = argmin |CDF_target[t] - CDF_source[s]|
                </p>
                
                <p className="formula-alt" style={{marginTop: '1rem'}}>
                  Step 3: Apply mapping
                </p>
                <p className="formula">
                  Matched_Image[pixel] = mapping[Source_Image[pixel]]
                </p>
              </div>

              <div className="explanation-content">
                <h3>Step-by-Step Process</h3>
                <ol>
                  <li><strong>Load Images:</strong> Upload source image (to be modified) and target image (reference)</li>
                  <li><strong>Convert to Grayscale:</strong> Both images are converted to grayscale</li>
                  <li><strong>Calculate Histograms:</strong>
                    <ul>
                      <li>H_source[i] = count of pixels with intensity i in source image</li>
                      <li>H_target[i] = count of pixels with intensity i in target image</li>
                    </ul>
                  </li>
                  <li><strong>Calculate CDFs:</strong>
                    <ul>
                      <li>CDF[i] = cumulative sum of histogram up to intensity i</li>
                      <li>Normalized by total number of pixels</li>
                    </ul>
                  </li>
                  <li><strong>Create Mapping:</strong>
                    <ul>
                      <li>For each source intensity (0-255), find target intensity with closest CDF value</li>
                      <li>This creates a mapping function: source_intensity → target_intensity</li>
                    </ul>
                  </li>
                  <li><strong>Apply Mapping:</strong> Transform each pixel in source image using the mapping function</li>
                  <li><strong>Result:</strong> Source image now has histogram similar to target image</li>
                </ol>

                <h3>Why Histogram Matching?</h3>
                <p>
                  Histogram matching is used to make one image look like another in terms of brightness and contrast.
                  It's useful for:
                </p>
                <ul>
                  <li><strong>Image Enhancement:</strong> Apply the look of a well-exposed image to another</li>
                  <li><strong>Consistency:</strong> Make multiple images have similar appearance</li>
                  <li><strong>Color Transfer:</strong> Transfer color characteristics from one image to another</li>
                  <li><strong>Medical Imaging:</strong> Standardize image appearance across different scans</li>
                </ul>

                <h3>Example</h3>
                <div className="example-box">
                  <p>Source image has dark histogram (most values 0-100)</p>
                  <p>Target image has bright histogram (most values 150-255)</p>
                  <p><strong>After matching:</strong> Source image will be brighter, matching target's distribution</p>
                </div>

                <h3>Time Complexity</h3>
                <p>O(n × m + 256²) where n and m are image dimensions. The 256² term comes from finding the best mapping for each intensity level.</p>
              </div>
            </>
          )}
        </div>

        {(sourceImage || targetImage || matchedImage) && (
          <div className="results-section">
            <h2>Results</h2>
            <div className="images-container">
              {sourceImage && (
                <div className="image-panel">
                  <h3>Source Image</h3>
                  <img src={sourceImage} alt="source" className="result-image" />
                  <div className="histogram-container">
                    <h4>Source Histogram</h4>
                    <canvas ref={sourceHistogramRef} width={400} height={150} className="histogram-canvas"></canvas>
                  </div>
                </div>
              )}

              {targetImage && (
                <div className="image-panel">
                  <h3>Target Image</h3>
                  <img src={targetImage} alt="target" className="result-image" />
                  <div className="histogram-container">
                    <h4>Target Histogram</h4>
                    <canvas ref={targetHistogramRef} width={400} height={150} className="histogram-canvas"></canvas>
                  </div>
                </div>
              )}

              {matchedImage && (
                <div className="image-panel">
                  <h3>Matched Image</h3>
                  <img src={matchedImage} alt="matched" className="result-image" />
                  <div className="histogram-container">
                    <h4>Matched Histogram</h4>
                    <canvas ref={matchedHistogramRef} width={400} height={150} className="histogram-canvas"></canvas>
                  </div>
                </div>
              )}
            </div>

            {matchingData && showProcess && (
              <div style={{ marginTop: '2rem', background: 'white', padding: '1.5rem', borderRadius: '8px' }}>
                <h3>Mapping Function</h3>
                <p style={{ color: '#64748b', marginBottom: '1rem' }}>
                  This graph shows how source intensities are mapped to target intensities
                </p>
                <canvas ref={mappingCanvasRef} width={600} height={300} style={{ 
                  width: '100%', 
                  maxWidth: '600px', 
                  border: '2px solid #e2e8f0', 
                  borderRadius: '6px',
                  background: '#f8fafc'
                }}></canvas>
                
                <div style={{ marginTop: '1rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                  <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '6px' }}>
                    <h4 style={{ margin: '0 0 0.5rem 0', color: '#1e293b' }}>Process Summary</h4>
                    <p style={{ margin: '0.25rem 0', fontSize: '0.9rem', color: '#64748b' }}>
                      <strong>Source pixels:</strong> {matchingData.sourceHist.reduce((a, b) => a + b, 0).toLocaleString()}
                    </p>
                    <p style={{ margin: '0.25rem 0', fontSize: '0.9rem', color: '#64748b' }}>
                      <strong>Target pixels:</strong> {matchingData.targetHist.reduce((a, b) => a + b, 0).toLocaleString()}
                    </p>
                    <p style={{ margin: '0.25rem 0', fontSize: '0.9rem', color: '#64748b' }}>
                      <strong>Mapping created:</strong> 256 intensity mappings
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

