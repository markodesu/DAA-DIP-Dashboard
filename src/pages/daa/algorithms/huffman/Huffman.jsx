// src/pages/daa/algorithms/huffman/Huffman.jsx
import React, { useState } from "react";
import "./Huffman.css";

class HuffmanNode {
  constructor(char, freq, left = null, right = null) {
    this.char = char;
    this.freq = freq;
    this.left = left;
    this.right = right;
  }
}

export default function Huffman() {
  const [inputText, setInputText] = useState("hello world");
  const [encoded, setEncoded] = useState(null);
  const [decoded, setDecoded] = useState(null);
  const [tree, setTree] = useState(null);
  const [codes, setCodes] = useState(null);
  const [mergeSteps, setMergeSteps] = useState([]);

  const buildHuffmanTree = (frequencies) => {
    const nodes = Object.entries(frequencies).map(
      ([char, freq]) => new HuffmanNode(char, freq)
    );
    const steps = [];
    const nodeToLabel = new Map(); // Map nodes to their labels
    let stepNumber = 1;

    // Initialize labels for character nodes
    nodes.forEach(node => {
      if (node.char !== null) {
        nodeToLabel.set(node, `'${node.char}'`);
      }
    });

    while (nodes.length > 1) {
      nodes.sort((a, b) => a.freq - b.freq);
      const left = nodes.shift();
      const right = nodes.shift();
      const sum = left.freq + right.freq;
      
      // Get labels for left and right nodes
      const leftLabel = nodeToLabel.get(left) || `M${stepNumber - 1}`;
      const rightLabel = nodeToLabel.get(right) || `M${stepNumber - 1}`;
      
      const merged = new HuffmanNode(null, sum, left, right);
      const mergedLabel = `M${stepNumber}`;
      nodeToLabel.set(merged, mergedLabel);
      
      steps.push({
        step: stepNumber,
        left: { label: leftLabel, freq: left.freq },
        right: { label: rightLabel, freq: right.freq },
        sum: sum,
        assignment: `Left=0, Right=1`,
        mergedLabel: mergedLabel
      });
      
      nodes.push(merged);
      stepNumber++;
    }

    setMergeSteps(steps);
    return nodes[0];
  };

  const generateCodes = (node, code = "", codeMap = {}) => {
    if (node.char !== null) {
      codeMap[node.char] = code || "0";
      return codeMap;
    }
    if (node.left) generateCodes(node.left, code + "0", codeMap);
    if (node.right) generateCodes(node.right, code + "1", codeMap);
    return codeMap;
  };

  const encode = () => {
    const frequencies = {};
    for (const char of inputText) {
      frequencies[char] = (frequencies[char] || 0) + 1;
    }

    const tree = buildHuffmanTree(frequencies);
    const codeMap = generateCodes(tree);
    const encodedText = inputText.split("").map((char) => codeMap[char]).join("");

    setTree(tree);
    setCodes(codeMap);
    setEncoded(encodedText);
    setDecoded(null);
  };

  const decode = (encodedText, codeMap) => {
    const reverseMap = {};
    for (const [char, code] of Object.entries(codeMap)) {
      reverseMap[code] = char;
    }

    let decodedText = "";
    let currentCode = "";
    for (const bit of encodedText) {
      currentCode += bit;
      if (reverseMap[currentCode]) {
        decodedText += reverseMap[currentCode];
        currentCode = "";
      }
    }

    return decodedText;
  };

  const handleDecode = () => {
    if (encoded && codes) {
      const result = decode(encoded, codes);
      setDecoded(result);
    }
  };

  return (
    <div className="huffman-container">
      <div className="huffman-header">
        <h1>Huffman Coding</h1>
        <p>Lossless data compression using frequency-based encoding</p>
      </div>

      <div className="huffman-content">
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

            <div className="frequency-table">
              <h3>Character Frequencies</h3>
              <table>
                <thead>
                  <tr>
                    <th>Character</th>
                    <th>Frequency</th>
                    <th>Huffman Code</th>
                  </tr>
                </thead>
                <tbody>
                  {codes &&
                    Object.entries(codes)
                      .sort((a, b) => {
                        const freqA = inputText.split(a[0]).length - 1;
                        const freqB = inputText.split(b[0]).length - 1;
                        return freqB - freqA;
                      })
                      .map(([char, code]) => (
                        <tr key={char}>
                          <td>{char === " " ? "Space" : char}</td>
                          <td>{inputText.split(char).length - 1}</td>
                          <td className="code-cell">{code}</td>
                        </tr>
                      ))}
                </tbody>
              </table>
            </div>

            {mergeSteps.length > 0 && (
              <div className="merge-steps-table">
                <h3>Step-by-Step Merging Process</h3>
                <p className="merge-explanation">
                  Starting from the two lowest probabilities, merge them and assign 0 to left, 1 to right.
                  Continue until all nodes are merged into a single tree.
                </p>
                <table className="merge-table">
                  <thead>
                    <tr>
                      <th>Step</th>
                      <th>Left Node</th>
                      <th>Right Node</th>
                      <th>Sum (New Probability)</th>
                      <th>Code Assignment</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mergeSteps.map((step, idx) => (
                      <tr key={step.step} className={idx === mergeSteps.length - 1 ? "final-step" : ""}>
                        <td className="step-number">{step.step}</td>
                        <td>{step.left.label} (freq: {step.left.freq})</td>
                        <td>{step.right.label} (freq: {step.right.freq})</td>
                        <td className="sum-cell"><strong>{step.sum}</strong> → {step.mergedLabel}</td>
                        <td className="assignment-cell">{step.assignment}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="code-building-explanation">
                  <h4>How Codes are Built (Bottom-Up):</h4>
                  <ol>
                    <li>Start from the <strong>last step</strong> (final merge) - assign 0 to left, 1 to right</li>
                    <li>Work backwards: if a node was merged in a previous step, prepend its code</li>
                    <li>Continue until all characters have their complete codes</li>
                    <li>More frequent characters end up with shorter codes</li>
                  </ol>
                </div>
              </div>
            )}

            <div className="encoded-section">
              <h3>Encoded Text</h3>
              <div className="encoded-text">{encoded}</div>
              <p className="stats">
                Original: {inputText.length * 8} bits | Encoded: {encoded.length} bits | 
                Compression: {((1 - encoded.length / (inputText.length * 8)) * 100).toFixed(2)}%
              </p>
            </div>

            <div className="decode-section">
              <button onClick={handleDecode} className="decode-btn">Decode</button>
              {decoded && (
                <div className="decoded-text">
                  <h3>Decoded Text</h3>
                  <p>{decoded}</p>
                </div>
              )}
            </div>

            <div className="explanation">
              <h3>Explanation</h3>
              <p>
                Huffman Coding assigns variable-length codes to characters based on their frequency.
                More frequent characters get shorter codes. The algorithm builds a binary tree where
                characters are leaves, and the path from root to leaf gives the code.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

