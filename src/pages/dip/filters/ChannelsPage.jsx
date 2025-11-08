// src/pages/dip/filters/ChannelsPage.jsx
import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { separateChannels } from "./channels";
import { calculateHistogram, drawHistogram } from "../utils/histogramUtils";
import "./FilterPage.css";

export default function ChannelsPage() {
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
    const result = await separateChannels(image);
    setProcessedImage(result);
  };

  return (
    <div className="filter-page">
      <div className="filter-header">
        <Link to="/dip" className="back-link">← Back to DIP Home</Link>
        <h1>Separate Channels</h1>
        <p>Visualize RGB channels separately</p>
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
            <button onClick={handleApply} className="apply-btn">Separate Channels</button>
          )}
        </div>

        <div className="explanation-section">
          <h2>Mathematical Formula</h2>
          <div className="formula-box">
            <p className="formula">
              <strong>Channel Separation:</strong>
            </p>
            <p className="formula-alt" style={{marginTop: '1rem'}}>
              For Red channel: R' = R, G' = 0, B' = 0
            </p>
            <p className="formula-alt">
              For Green channel: R' = 0, G' = G, B' = 0
            </p>
            <p className="formula-alt">
              For Blue channel: R' = 0, G' = 0, B' = B
            </p>
          </div>

          <div className="explanation-content">
            <h3>Step-by-Step Process</h3>
            <ol>
              <li>For each pixel in the original image, extract RGB values</li>
              <li><strong>Create Red Channel Image:</strong>
                <ul>
                  <li>Set R' = original R value</li>
                  <li>Set G' = 0</li>
                  <li>Set B' = 0</li>
                </ul>
              </li>
              <li><strong>Create Green Channel Image:</strong>
                <ul>
                  <li>Set R' = 0</li>
                  <li>Set G' = original G value</li>
                  <li>Set B' = 0</li>
                </ul>
              </li>
              <li><strong>Create Blue Channel Image:</strong>
                <ul>
                  <li>Set R' = 0</li>
                  <li>Set G' = 0</li>
                  <li>Set B' = original B value</li>
                </ul>
              </li>
              <li>Place all three channel images side by side in a single output image</li>
            </ol>

            <h3>Understanding Channel Separation</h3>
            <p>
              Color images are composed of three color channels: Red, Green, and Blue. Each channel
              represents the intensity of that color at each pixel. By separating channels, we can:
            </p>
            <ul>
              <li>Analyze color distribution in the image</li>
              <li>Identify which colors dominate different regions</li>
              <li>Understand how each channel contributes to the final image</li>
              <li>Perform channel-specific processing</li>
            </ul>

            <h3>Example Calculation</h3>
            <div className="example-box">
              <p>Given a pixel with RGB(200, 150, 100):</p>
              <p><strong>Red Channel:</strong></p>
              <p>R' = 200, G' = 0, B' = 0 → RGB(200, 0, 0) - appears red</p>
              <p><strong>Green Channel:</strong></p>
              <p>R' = 0, G' = 150, B' = 0 → RGB(0, 150, 0) - appears green</p>
              <p><strong>Blue Channel:</strong></p>
              <p>R' = 0, G' = 0, B' = 100 → RGB(0, 0, 100) - appears blue</p>
              <p style={{marginTop: '1rem'}}>The output image shows all three channels side by side:</p>
              <p>[Red Channel] [Green Channel] [Blue Channel]</p>
            </div>

            <h3>Visual Interpretation</h3>
            <ul>
              <li><strong>Bright areas in Red channel:</strong> Indicate high red intensity in those regions</li>
              <li><strong>Bright areas in Green channel:</strong> Indicate high green intensity (most sensitive to human eye)</li>
              <li><strong>Bright areas in Blue channel:</strong> Indicate high blue intensity</li>
              <li><strong>Dark areas:</strong> Indicate low intensity of that color channel</li>
            </ul>

            <h3>Applications</h3>
            <ul>
              <li>Color analysis and correction</li>
              <li>Channel-specific filtering</li>
              <li>Understanding color composition</li>
              <li>Preprocessing for color-based segmentation</li>
              <li>Identifying color casts or imbalances</li>
            </ul>

            <h3>Time Complexity</h3>
            <p>O(n × m) where n and m are the width and height of the image. Each pixel is processed once to create three channel images.</p>
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
                  <h3>Processed Image (R | G | B Channels)</h3>
                  <img src={processedImage} alt="processed" className="result-image" style={{maxWidth: '100%'}} />
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

