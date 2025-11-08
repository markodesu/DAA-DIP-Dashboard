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

  const buildHuffmanTree = (frequencies) => {
    const nodes = Object.entries(frequencies).map(
      ([char, freq]) => new HuffmanNode(char, freq)
    );

    while (nodes.length > 1) {
      nodes.sort((a, b) => a.freq - b.freq);
      const left = nodes.shift();
      const right = nodes.shift();
      const merged = new HuffmanNode(null, left.freq + right.freq, left, right);
      nodes.push(merged);
    }

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

