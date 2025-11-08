// src/pages/daa/DAAHome.jsx
import { Link } from "react-router-dom";
import "./DAAHome.css";

export default function DAAHome() {
  return (
    <div className="daa-home">
      <div className="daa-header">
        <h1>Design and Analysis of Algorithms</h1>
        <p className="daa-subtitle">Explore algorithm visualizations and complexity analysis</p>
      </div>

      <div className="algorithms-grid">
        <Link to="/daa/knapsack" className="algorithm-card">
          <div className="algorithm-icon">🎒</div>
          <h2>0/1 Knapsack Problem</h2>
          <p>Greedy approach, Dynamic Programming table, and tree visualization</p>
        </Link>

        <Link to="/daa/huffman" className="algorithm-card">
          <div className="algorithm-icon">📊</div>
          <h2>Huffman Coding</h2>
          <p>Encoding and decoding with frequency-based compression</p>
        </Link>

        <Link to="/daa/arithmetic" className="algorithm-card">
          <div className="algorithm-icon">🔢</div>
          <h2>Arithmetic Encoding</h2>
          <p>Encoding and decoding with probability-based compression</p>
        </Link>

        <Link to="/daa/coin-changing" className="algorithm-card">
          <div className="algorithm-icon">🪙</div>
          <h2>Coin Changing Problem</h2>
          <p>Dynamic Programming solution with table and tree visualization</p>
        </Link>
      </div>
    </div>
  );
}
