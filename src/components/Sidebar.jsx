import { Link } from "react-router-dom";
import "./Sidebar.css";

export default function Sidebar() {
  return (
    <div className="sidebar">
      <h2>DAA + DIP Dashboard</h2>
      <nav>
        <div className="nav-section">
          <h3>DAA - Algorithms</h3>
          <ul>
            <li><Link to="/daa">Home</Link></li>
            <li><Link to="/daa/knapsack">0/1 Knapsack</Link></li>
            <li><Link to="/daa/huffman">Huffman Coding</Link></li>
            <li><Link to="/daa/arithmetic">Arithmetic Encoding</Link></li>
            <li><Link to="/daa/coin-changing">Coin Changing</Link></li>
            <li><Link to="/daa/tsp">TSP (Branch & Bound)</Link></li>
          </ul>
        </div>

        <div className="nav-section">
          <h3>DIP - Image Filters</h3>
          <ul>
            <li><Link to="/dip">Home</Link></li>
            <li><Link to="/dip/grayscale">Grayscale</Link></li>
            <li><Link to="/dip/negative">Negative</Link></li>
            <li><Link to="/dip/histogram">Histogram Equalization</Link></li>
            <li><Link to="/dip/brightness-contrast">Brightness & Contrast</Link></li>
            <li><Link to="/dip/blur">Blur</Link></li>
            <li><Link to="/dip/edge-detection">Edge Detection</Link></li>
            <li><Link to="/dip/threshold">Threshold</Link></li>
            <li><Link to="/dip/sharpen">Sharpen</Link></li>
            <li><Link to="/dip/convolution">Convolution</Link></li>
            <li><Link to="/dip/channels">Separate Channels</Link></li>
            <li><Link to="/dip/ann-cnn">ANN & CNN</Link></li>
          </ul>
        </div>
      </nav>
    </div>
  );
}
