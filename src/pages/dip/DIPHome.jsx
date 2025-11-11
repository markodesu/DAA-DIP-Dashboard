// src/pages/dip/DIPHome.jsx
import { Link } from "react-router-dom";
import "./DIPHome.css";

export default function DIPHome() {
  return (
    <div className="dip-home">
      <div className="dip-home-header">
        <h1>Digital Image Processing</h1>
        <p className="dip-home-subtitle">Explore image filters with detailed explanations and formulas</p>
      </div>

      <div className="filters-grid">
        <Link to="/dip/grayscale" className="filter-card">
          <div className="filter-icon">⚫</div>
          <h2>Grayscale</h2>
          <p>Convert color images to grayscale using luminance formula</p>
        </Link>

        <Link to="/dip/negative" className="filter-card">
          <div className="filter-icon">🔄</div>
          <h2>Negative</h2>
          <p>Invert image colors to create negative effect</p>
        </Link>

        <Link to="/dip/histogram" className="filter-card">
          <div className="filter-icon">📊</div>
          <h2>Histogram Equalization</h2>
          <p>Enhance contrast using histogram equalization</p>
        </Link>

        <Link to="/dip/histogram-matching" className="filter-card">
          <div className="filter-icon">🔗</div>
          <h2>Histogram Matching</h2>
          <p>Match histogram of one image to another</p>
        </Link>

        <Link to="/dip/brightness-contrast" className="filter-card">
          <div className="filter-icon">☀️</div>
          <h2>Brightness & Contrast</h2>
          <p>Adjust brightness and contrast with interactive sliders</p>
        </Link>

        <Link to="/dip/blur" className="filter-card">
          <div className="filter-icon">🌫️</div>
          <h2>Blur</h2>
          <p>Apply Gaussian blur for image smoothing</p>
        </Link>

        <Link to="/dip/edge-detection" className="filter-card">
          <div className="filter-icon">🔍</div>
          <h2>Edge Detection</h2>
          <p>Detect edges using Sobel operator</p>
        </Link>

        <Link to="/dip/threshold" className="filter-card">
          <div className="filter-icon">⚪</div>
          <h2>Threshold</h2>
          <p>Convert to binary image using thresholding</p>
        </Link>

        <Link to="/dip/sharpen" className="filter-card">
          <div className="filter-icon">✨</div>
          <h2>Sharpen</h2>
          <p>Enhance image sharpness using sharpening kernel</p>
        </Link>

        <Link to="/dip/convolution" className="filter-card">
          <div className="filter-icon">🌀</div>
          <h2>Convolution</h2>
          <p>Apply custom convolution kernels for various effects</p>
        </Link>

        <Link to="/dip/channels" className="filter-card">
          <div className="filter-icon">🌈</div>
          <h2>Separate Channels</h2>
          <p>Visualize RGB channels separately</p>
        </Link>

        <Link to="/dip/ann-cnn" className="filter-card">
          <div className="filter-icon">🧠</div>
          <h2>ANN & CNN</h2>
          <p>Interactive visualization of Neural Networks with activation functions</p>
        </Link>
      </div>
    </div>
  );
}
