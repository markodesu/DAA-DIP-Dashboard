// src/pages/dip/DIPDashboard.jsx
import React, { useState, useEffect, useRef } from "react";
import { applyGrayscale } from "./filters/grayscale";
import { applyNegative } from "./filters/negative";
import { applyHistogram } from "./filters/histogram";
import { adjustBrightnessContrast } from "./filters/brightnessContrast";
import { applyBlur } from "./filters/blur";
import { applyEdgeDetection } from "./filters/edgeDetection";
import { applyThreshold } from "./filters/threshold";
import { applySharpen } from "./filters/sharpen";
import { applyConvolution } from "./filters/convolution";
import { separateChannels } from "./filters/channels";
import { calculateHistogram, drawHistogram } from "./utils/histogramUtils";
import "./DIPDashboard.css";

const FILTER_DESCRIPTIONS = {
  grayscale: "Converts the image to grayscale using the luminance formula (0.3R + 0.59G + 0.11B). This preserves perceived brightness better than simple averaging.",
  negative: "Inverts all color values in the image, creating a negative effect. Each pixel value is subtracted from 255.",
  histogram: "Applies histogram equalization to enhance image contrast by redistributing pixel intensities across the full range.",
  brightnessContrast: "Adjusts image brightness (additive) and contrast (multiplicative). Use sliders to fine-tune the values.",
  blur: "Applies a Gaussian blur effect to smooth the image. Higher radius values create more blur.",
  edgeDetection: "Detects edges using the Sobel operator, which calculates gradients in both X and Y directions.",
  threshold: "Converts the image to binary (black and white) based on a threshold value. Pixels above the threshold become white, below become black.",
  sharpen: "Enhances image sharpness using a sharpening kernel. Higher strength values create more pronounced sharpening.",
  convolution: "Applies a custom convolution kernel (emboss effect). Convolution is a fundamental operation in image processing.",
  separateChannels: "Separates and displays the Red, Green, and Blue channels side by side, showing how each color component contributes to the image.",
};

export default function DIPDashboard() {
  const [image, setImage] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [histogramData, setHistogramData] = useState(null);
  
  // Slider values
  const [brightness, setBrightness] = useState(0);
  const [contrast, setContrast] = useState(100);
  const [blurRadius, setBlurRadius] = useState(3);
  const [threshold, setThreshold] = useState(128);
  const [sharpenStrength, setSharpenStrength] = useState(100);

  // Canvas refs for histograms
  const originalHistogramRef = useRef(null);
  const processedHistogramRef = useRef(null);

  // Update histograms when images change
  useEffect(() => {
    if (image && originalHistogramRef.current) {
      calculateHistogram(image).then((hist) => {
        setHistogramData(hist);
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

  // --- Upload Image ---
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result);
        setProcessedImage(null);
        setSelectedFilter(null);
      };
      reader.readAsDataURL(file);
    }
  };

  // --- Filter Handlers ---
  const handleGrayscale = async () => {
    if (!image) return;
    setSelectedFilter("grayscale");
    const result = await applyGrayscale(image);
    setProcessedImage(result);
  };

  const handleNegative = async () => {
    if (!image) return;
    setSelectedFilter("negative");
    const result = await applyNegative(image);
    setProcessedImage(result);
  };

  const handleHistogram = async () => {
    if (!image) return;
    setSelectedFilter("histogram");
    const result = await applyHistogram(image);
    setProcessedImage(result);
  };

  const handleBrightnessContrast = async () => {
    if (!image) return;
    setSelectedFilter("brightnessContrast");
    const brightnessValue = brightness;
    const contrastValue = contrast / 100; // Convert percentage to multiplier
    const result = await adjustBrightnessContrast(image, brightnessValue, contrastValue);
    setProcessedImage(result);
  };

  const handleBlur = async () => {
    if (!image) return;
    setSelectedFilter("blur");
    const result = await applyBlur(image, blurRadius);
    setProcessedImage(result);
  };

  const handleEdgeDetection = async () => {
    if (!image) return;
    setSelectedFilter("edgeDetection");
    const result = await applyEdgeDetection(image);
    setProcessedImage(result);
  };

  const handleThreshold = async () => {
    if (!image) return;
    setSelectedFilter("threshold");
    const result = await applyThreshold(image, threshold);
    setProcessedImage(result);
  };

  const handleSharpen = async () => {
    if (!image) return;
    setSelectedFilter("sharpen");
    const strength = sharpenStrength / 100; // Convert percentage to strength
    const result = await applySharpen(image, strength);
    setProcessedImage(result);
  };

  const handleConvolution = async () => {
    if (!image) return;
    setSelectedFilter("convolution");
    const embossKernel = [
      [-2, -1, 0],
      [-1, 1, 1],
      [0, 1, 2],
    ];
    const result = await applyConvolution(image, embossKernel);
    setProcessedImage(result);
  };

  const handleSeparateChannels = async () => {
    if (!image) return;
    setSelectedFilter("separateChannels");
    const result = await separateChannels(image);
    setProcessedImage(result);
  };

  // Auto-apply filters with sliders when filter is already selected
  useEffect(() => {
    if (selectedFilter === "brightnessContrast" && image) {
      const applyFilter = async () => {
        const brightnessValue = brightness;
        const contrastValue = contrast / 100;
        const result = await adjustBrightnessContrast(image, brightnessValue, contrastValue);
        setProcessedImage(result);
      };
      applyFilter();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [brightness, contrast, selectedFilter]);

  useEffect(() => {
    if (selectedFilter === "blur" && image) {
      const applyFilter = async () => {
        const result = await applyBlur(image, blurRadius);
        setProcessedImage(result);
      };
      applyFilter();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blurRadius, selectedFilter]);

  useEffect(() => {
    if (selectedFilter === "threshold" && image) {
      const applyFilter = async () => {
        const result = await applyThreshold(image, threshold);
        setProcessedImage(result);
      };
      applyFilter();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [threshold, selectedFilter]);

  useEffect(() => {
    if (selectedFilter === "sharpen" && image) {
      const applyFilter = async () => {
        const strength = sharpenStrength / 100;
        const result = await applySharpen(image, strength);
        setProcessedImage(result);
      };
      applyFilter();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sharpenStrength, selectedFilter]);

  // --- JSX ---
  return (
    <div className="dip-dashboard">
      <div className="dip-header">
        <h1>Digital Image Processing Dashboard</h1>
        <p className="dip-subtitle">Upload an image and apply various filters to see the results</p>
        <div className="upload-section">
          <label className="upload-button">
            <input type="file" accept="image/*" onChange={handleImageUpload} />
            {image ? "Change Image" : "Upload Image"}
          </label>
        </div>
      </div>

      {image && (
        <div className="dip-content">
          {/* Filters Section */}
          <div className="filters-section">
            <h2>Image Filters</h2>
            <div className="filters-grid">
              {/* Grayscale */}
              <div className="filter-card">
                <h3>Grayscale</h3>
                <p className="filter-description">{FILTER_DESCRIPTIONS.grayscale}</p>
                <button onClick={handleGrayscale} className="filter-button">Apply Grayscale</button>
              </div>

              {/* Negative */}
              <div className="filter-card">
                <h3>Negative</h3>
                <p className="filter-description">{FILTER_DESCRIPTIONS.negative}</p>
                <button onClick={handleNegative} className="filter-button">Apply Negative</button>
              </div>

              {/* Histogram Equalization */}
              <div className="filter-card">
                <h3>Histogram Equalization</h3>
                <p className="filter-description">{FILTER_DESCRIPTIONS.histogram}</p>
                <button onClick={handleHistogram} className="filter-button">Apply Histogram</button>
              </div>

              {/* Brightness & Contrast */}
              <div className="filter-card">
                <h3>Brightness & Contrast</h3>
                <p className="filter-description">{FILTER_DESCRIPTIONS.brightnessContrast}</p>
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
                <button onClick={handleBrightnessContrast} className="filter-button">Apply</button>
              </div>

              {/* Blur */}
              <div className="filter-card">
                <h3>Blur</h3>
                <p className="filter-description">{FILTER_DESCRIPTIONS.blur}</p>
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
                <button onClick={handleBlur} className="filter-button">Apply Blur</button>
              </div>

              {/* Edge Detection */}
              <div className="filter-card">
                <h3>Edge Detection</h3>
                <p className="filter-description">{FILTER_DESCRIPTIONS.edgeDetection}</p>
                <button onClick={handleEdgeDetection} className="filter-button">Apply Edge Detection</button>
              </div>

              {/* Threshold */}
              <div className="filter-card">
                <h3>Threshold</h3>
                <p className="filter-description">{FILTER_DESCRIPTIONS.threshold}</p>
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
                <button onClick={handleThreshold} className="filter-button">Apply Threshold</button>
              </div>

              {/* Sharpen */}
              <div className="filter-card">
                <h3>Sharpen</h3>
                <p className="filter-description">{FILTER_DESCRIPTIONS.sharpen}</p>
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
                <button onClick={handleSharpen} className="filter-button">Apply Sharpen</button>
              </div>

              {/* Convolution */}
              <div className="filter-card">
                <h3>Convolution (Emboss)</h3>
                <p className="filter-description">{FILTER_DESCRIPTIONS.convolution}</p>
                <button onClick={handleConvolution} className="filter-button">Apply Convolution</button>
              </div>

              {/* Separate Channels */}
              <div className="filter-card">
                <h3>Separate Channels</h3>
                <p className="filter-description">{FILTER_DESCRIPTIONS.separateChannels}</p>
                <button onClick={handleSeparateChannels} className="filter-button">Separate RGB</button>
              </div>
            </div>
          </div>

          {/* Results Section */}
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
        </div>
      )}

      {!image && (
        <div className="empty-state">
          <p>Please upload an image to get started</p>
        </div>
      )}
    </div>
  );
}
