// src/pages/daa/algorithms/arithmetic/Arithmetic.jsx
import React, { useState } from "react";
import "./Arithmetic.css";

export default function Arithmetic() {
  const [inputText, setInputText] = useState("hello");
  const [encoded, setEncoded] = useState(null);
  const [decoded, setDecoded] = useState(null);
  const [probabilities, setProbabilities] = useState(null);
  const [ranges, setRanges] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const calculateProbabilities = (text) => {
    const freq = {};
    for (const char of text) {
      freq[char] = (freq[char] || 0) + 1;
    }

    const probs = {};
    const total = text.length;
    for (const char in freq) {
      probs[char] = freq[char] / total;
    }

    return probs;
  };

  const buildRanges = (probs) => {
    const chars = Object.keys(probs).sort();
    const ranges = {};
    let low = 0;

    for (const char of chars) {
      ranges[char] = { low, high: low + probs[char] };
      low += probs[char];
    }

    return ranges;
  };

  const encode = () => {
    const probs = calculateProbabilities(inputText);
    const charRanges = buildRanges(probs);

    let low = 0;
    let high = 1;

    const steps = [];

    for (const char of inputText) {
      const range = high - low;
      const newLow = low + range * charRanges[char].low;
      const newHigh = low + range * charRanges[char].high;

      steps.push({
        char,
        low: low.toFixed(6),
        high: high.toFixed(6),
        range: range.toFixed(6),
        newLow: newLow.toFixed(6),
        newHigh: newHigh.toFixed(6),
      });

      low = newLow;
      high = newHigh;
    }

    const encodedValue = (low + high) / 2;

    setProbabilities(probs);
    setRanges(charRanges);
    setEncoded({ value: encodedValue, steps });
    setDecoded(null);
  };

  const decode = (encodedValue, charRanges, length) => {
    let value = encodedValue;
    let decodedText = "";

    const steps = [];

    for (let i = 0; i < length; i++) {
      for (const [char, range] of Object.entries(charRanges)) {
        if (value >= range.low && value < range.high) {
          decodedText += char;
          const rangeSize = range.high - range.low;
          value = (value - range.low) / rangeSize;

          steps.push({
            char,
            value: value.toFixed(6),
            range: `${range.low.toFixed(3)} - ${range.high.toFixed(3)}`,
          });
          break;
        }
      }
    }

    return { text: decodedText, steps };
  };

  const handleDecode = () => {
    if (encoded && ranges) {
      const result = decode(encoded.value, ranges, inputText.length);
      setDecoded(result);
    }
  };

  return (
    <div className="arithmetic-container">
      <div className="arithmetic-header">
        <h1>Arithmetic Encoding</h1>
        <p>Lossless data compression using probability-based encoding</p>
      </div>

      <div className="arithmetic-content">
        <div className="input-section">
          <h2>Input</h2>
          <div className="text-input">
            <label>
              Text to Encode:
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                rows="4"
                placeholder="Enter text to encode"
              />
            </label>
          </div>
          <button onClick={encode} className="encode-btn">Encode</button>
        </div>

        {encoded && (
          <div className="results-section">
            <h2>Results</h2>

            {probabilities && (
              <div className="probability-table">
                <h3>Character Probabilities</h3>
                <table>
                  <thead>
                    <tr>
                      <th>Character</th>
                      <th>Probability</th>
                      <th>Range</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ranges &&
                      Object.entries(ranges)
                        .sort((a, b) => a[1].low - b[1].low)
                        .map(([char, range]) => (
                          <tr key={char}>
                            <td>{char === " " ? "Space" : char}</td>
                            <td>{probabilities[char].toFixed(4)}</td>
                            <td className="range-cell">
                              [{range.low.toFixed(4)} - {range.high.toFixed(4)}]
                            </td>
                          </tr>
                        ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="encoding-steps">
              <h3>Encoding Steps</h3>
              <div className="steps-container">
                {encoded.steps.map((step, idx) => (
                  <div key={idx} className="step-card">
                    <div className="step-header">Step {idx + 1}: '{step.char}'</div>
                    <div className="step-details">
                      <div>Low: {step.low}</div>
                      <div>High: {step.high}</div>
                      <div>Range: {step.range}</div>
                      <div className="step-result">
                        New Range: [{step.newLow} - {step.newHigh}]
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="encoded-section">
              <h3>Encoded Value</h3>
              <div className="encoded-value">{encoded.value.toFixed(10)}</div>
            </div>

            <div className="decode-section">
              <button onClick={handleDecode} className="decode-btn">Decode</button>
              {decoded && (
                <div className="decoded-section">
                  <h3>Decoded Text: {decoded.text}</h3>
                  <div className="decoding-steps">
                    <h4>Decoding Steps</h4>
                    {decoded.steps.map((step, idx) => (
                      <div key={idx} className="step-card">
                        <div className="step-header">Step {idx + 1}: '{step.char}'</div>
                        <div className="step-details">
                          <div>Value: {step.value}</div>
                          <div>Range: {step.range}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="explanation-section">
              <button 
                className="explanation-toggle"
                onClick={() => setShowExplanation(!showExplanation)}
              >
                {showExplanation ? "▼" : "▶"} Algorithm Explanation
              </button>
              {showExplanation && (
                <div className="explanation">
                  <h4>Arithmetic Encoding Algorithm</h4>
                  <p>
                    Arithmetic Encoding maps a sequence of symbols to a single number in the range [0, 1).
                    Each symbol narrows the range based on its probability.
                  </p>
                  <p><strong>Encoding Process:</strong></p>
                  <ol>
                    <li>Calculate probability of each character</li>
                    <li>Build cumulative ranges for each character</li>
                    <li>Start with range [0, 1)</li>
                    <li>For each symbol, narrow the range:
                      <ul>
                        <li>newLow = low + (high - low) × charRange.low</li>
                        <li>newHigh = low + (high - low) × charRange.high</li>
                      </ul>
                    </li>
                    <li>Output any number in the final range</li>
                  </ol>
                  <p><strong>Decoding Process:</strong></p>
                  <ol>
                    <li>Start with encoded value and initial range [0, 1)</li>
                    <li>Determine which character's range contains the value</li>
                    <li>Output that character</li>
                    <li>Update range and value, repeat until all characters decoded</li>
                  </ol>
                  <p><strong>Time Complexity:</strong> O(n) where n is length of input</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

