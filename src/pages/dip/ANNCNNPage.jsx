// src/pages/dip/ANNCNNPage.jsx
import React, { useState, useEffect, useRef, useMemo } from "react";
import { Link } from "react-router-dom";
import "./ANNCNNPage.css";

// Activation functions
const sigmoid = (x) => 1 / (1 + Math.exp(-x));
const relu = (x) => Math.max(0, x);
const tanh = (x) => Math.tanh(x);
const softmax = (arr) => {
  const max = Math.max(...arr);
  const exp = arr.map(x => Math.exp(x - max));
  const sum = exp.reduce((a, b) => a + b, 0);
  return exp.map(x => x / sum);
};

// Neural Network Visualization Component
const NeuralNetworkVisualization = ({ layers, weights, activations, selectedNode, onNodeSelect, algorithm }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, width, height);

    const layerSpacing = width / (layers.length + 1);
    const nodeRadius = 20;
    const nodeSpacing = 40;

    // Draw connections
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1;
    for (let l = 0; l < layers.length - 1; l++) {
      const layer1Nodes = layers[l];
      const layer2Nodes = layers[l + 1];
      const x1 = (l + 1) * layerSpacing;
      const x2 = (l + 2) * layerSpacing;

      for (let i = 0; i < layer1Nodes.length; i++) {
        const y1 = (height / 2) - ((layer1Nodes.length - 1) * nodeSpacing) / 2 + i * nodeSpacing;
        for (let j = 0; j < layer2Nodes.length; j++) {
          const y2 = (height / 2) - ((layer2Nodes.length - 1) * nodeSpacing) / 2 + j * nodeSpacing;
          
          // Highlight selected connection
          if (selectedNode && selectedNode.layer === l && selectedNode.node === i) {
            ctx.strokeStyle = '#667eea';
            ctx.lineWidth = 2;
          } else {
            ctx.strokeStyle = '#cbd5e1';
            ctx.lineWidth = 1;
          }
          
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();
        }
      }
    }

    // Draw nodes
    layers.forEach((layer, layerIdx) => {
      const x = (layerIdx + 1) * layerSpacing;
      const yStart = (height / 2) - ((layer.length - 1) * nodeSpacing) / 2;

      layer.forEach((node, nodeIdx) => {
        const y = yStart + nodeIdx * nodeSpacing;
        const isSelected = selectedNode && selectedNode.layer === layerIdx && selectedNode.node === nodeIdx;
        
        // Get activation value safely
        const activationValue = activations && activations[layerIdx] && activations[layerIdx][nodeIdx] !== undefined 
          ? activations[layerIdx][nodeIdx] 
          : (layerIdx === 0 ? 0 : 0);
        
        // Node circle
        ctx.beginPath();
        ctx.arc(x, y, nodeRadius, 0, 2 * Math.PI);
        ctx.fillStyle = isSelected ? '#667eea' : (activationValue > 0 ? '#10b981' : '#e2e8f0');
        ctx.fill();
        ctx.strokeStyle = isSelected ? '#764ba2' : '#94a3b8';
        ctx.lineWidth = isSelected ? 3 : 2;
        ctx.stroke();

        // Node value
        ctx.fillStyle = isSelected ? 'white' : '#1e293b';
        ctx.font = 'bold 12px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const value = activationValue;
        ctx.fillText(value.toFixed(2), x, y);

        // Layer label
        if (nodeIdx === 0) {
          ctx.fillStyle = '#64748b';
          ctx.font = '14px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(
            layerIdx === 0 ? 'Input' : 
            layerIdx === layers.length - 1 ? 'Output' : 
            `Hidden ${layerIdx}`,
            x,
            y - nodeRadius - 15
          );
        }
      });
    });
  }, [layers, weights, activations, selectedNode]);

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={400}
      className="neural-network-canvas"
      onClick={(e) => {
        if (!canvasRef.current) return;
        const rect = canvasRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        // Simple click detection (can be improved)
        const layerSpacing = 800 / (layers.length + 1);
        const nodeSpacing = 40;
        const nodeRadius = 20;
        
        for (let l = 0; l < layers.length; l++) {
          const layerX = (l + 1) * layerSpacing;
          if (Math.abs(x - layerX) < nodeRadius + 10) {
            const yStart = 200 - ((layers[l].length - 1) * nodeSpacing) / 2;
            for (let n = 0; n < layers[l].length; n++) {
              const nodeY = yStart + n * nodeSpacing;
              if (Math.abs(y - nodeY) < nodeRadius + 10) {
                onNodeSelect({ layer: l, node: n });
                return;
              }
            }
          }
        }
      }}
    />
  );
};

export default function ANNCNNPage() {
  const [activeTab, setActiveTab] = useState('ann');
  const [selectedNode, setSelectedNode] = useState(null);

  // ANN State
  const [annLayers] = useState([3, 4, 4, 2]); // Input, Hidden1, Hidden2, Output
  const [annInputs, setAnnInputs] = useState([1.0, 0.5, 0.8]);
  const [annWeights] = useState([
    [[0.5, 0.3, 0.2, 0.1], [0.4, 0.6, 0.3, 0.2], [0.2, 0.4, 0.5, 0.3]],
    [[0.3, 0.2, 0.4, 0.1], [0.5, 0.3, 0.2, 0.4], [0.2, 0.5, 0.3, 0.2], [0.4, 0.2, 0.3, 0.5]],
    [[0.6, 0.4], [0.3, 0.7], [0.5, 0.3], [0.2, 0.8]]
  ]);
  const [annActivations, setAnnActivations] = useState([]);
  const [annActivationType, setAnnActivationType] = useState('sigmoid');

  // CNN State
  const [cnnInputSize] = useState(8); // 8x8 input
  const [cnnFilters] = useState(2);
  const [cnnFilterSize] = useState(3);
  const [cnnInput, setCnnInput] = useState(() => {
    const arr = [];
    for (let i = 0; i < 64; i++) {
      arr.push(Math.random() > 0.5 ? 1 : 0);
    }
    return arr;
  });

  // Compute ANN forward pass
  const computeANN = () => {
    const activations = [];
    let current = [...annInputs];

    activations.push([...current]);

    for (let l = 0; l < annWeights.length; l++) {
      const layerWeights = annWeights[l];
      const nextLayer = [];

      for (let j = 0; j < layerWeights[0].length; j++) {
        let sum = 0;
        for (let i = 0; i < current.length; i++) {
          sum += current[i] * layerWeights[i][j];
        }

        let activated;
        switch (annActivationType) {
          case 'sigmoid':
            activated = sigmoid(sum);
            break;
          case 'relu':
            activated = relu(sum);
            break;
          case 'tanh':
            activated = tanh(sum);
            break;
          default:
            activated = sigmoid(sum);
        }

        nextLayer.push(activated);
      }

      // Apply softmax to output layer
      if (l === annWeights.length - 1) {
        const softmaxValues = softmax(nextLayer);
        current = softmaxValues;
      } else {
        current = nextLayer;
      }

      activations.push([...current]);
    }

    setAnnActivations(activations);
  };

  // Compute CNN forward pass (memoized)
  const cnnFeatureMaps = useMemo(() => {
    // Simplified CNN computation
    const inputMatrix = [];
    for (let i = 0; i < cnnInputSize; i++) {
      inputMatrix.push(cnnInput.slice(i * cnnInputSize, (i + 1) * cnnInputSize));
    }

    const outputSize = cnnInputSize - cnnFilterSize + 1;
    const featureMaps = [];
    
    // Use fixed random seed for consistent results (in real CNN, these would be learned weights)
    const filterWeights = [
      [[0.5, 0.3, 0.2], [0.4, 0.6, 0.3], [0.2, 0.4, 0.5]],
      [[0.3, 0.2, 0.4], [0.5, 0.3, 0.2], [0.2, 0.5, 0.3]]
    ];

    for (let f = 0; f < cnnFilters; f++) {
      const featureMap = [];
      for (let i = 0; i < outputSize; i++) {
        const row = [];
        for (let j = 0; j < outputSize; j++) {
          let sum = 0;
          for (let fi = 0; fi < cnnFilterSize; fi++) {
            for (let fj = 0; fj < cnnFilterSize; fj++) {
              sum += inputMatrix[i + fi][j + fj] * filterWeights[f][fi][fj];
            }
          }
          row.push(relu(sum));
        }
        featureMap.push(row);
      }
      featureMaps.push(featureMap);
    }

    return featureMaps;
  }, [cnnInput, cnnInputSize, cnnFilterSize, cnnFilters]);

  useEffect(() => {
    computeANN();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [annActivationType, annInputs]);

  const getNodeValue = (layerIdx, nodeIdx) => {
    if (layerIdx === 0) {
      return annInputs[nodeIdx];
    }
    return annActivations[layerIdx]?.[nodeIdx] ?? 0;
  };

  const getCalculationForNode = (layerIdx, nodeIdx) => {
    if (layerIdx === 0) return `Input: ${annInputs[nodeIdx].toFixed(3)}`;

    const prevLayer = layerIdx === 1 ? annInputs : annActivations[layerIdx - 1];
    const weights = annWeights[layerIdx - 1];
    
    let calculation = `z = `;
    const terms = [];
    for (let i = 0; i < prevLayer.length; i++) {
      terms.push(`${prevLayer[i].toFixed(3)} × ${weights[i][nodeIdx].toFixed(3)}`);
    }
    calculation += terms.join(' + ');
    
    const sum = prevLayer.reduce((acc, val, i) => acc + val * weights[i][nodeIdx], 0);
    calculation += ` = ${sum.toFixed(3)}\n`;
    
    if (layerIdx === annLayers.length - 1) {
      calculation += `Softmax: e^${sum.toFixed(3)} / Σ(e^z) = ${annActivations[layerIdx]?.[nodeIdx].toFixed(3)}`;
    } else {
      const activationFunc = annActivationType === 'sigmoid' ? 'σ' : annActivationType === 'relu' ? 'ReLU' : 'tanh';
      calculation += `${activationFunc}(${sum.toFixed(3)}) = ${annActivations[layerIdx]?.[nodeIdx].toFixed(3)}`;
    }
    
    return calculation;
  };

  const regenerateCNNInput = () => {
    const newInput = [];
    for (let i = 0; i < 64; i++) {
      newInput.push(Math.random() > 0.5 ? 1 : 0);
    }
    setCnnInput(newInput);
  };

  return (
    <div className="ann-cnn-page">
      <div className="ann-cnn-header">
        <Link to="/dip" className="back-link">← Back to DIP Home</Link>
        <h1>Neural Networks: ANN & CNN</h1>
        <p>Interactive visualization of Artificial Neural Networks and Convolutional Neural Networks</p>
      </div>

      <div className="tabs">
        <button
          className={`tab ${activeTab === 'ann' ? 'active' : ''}`}
          onClick={() => setActiveTab('ann')}
        >
          Artificial Neural Network (ANN)
        </button>
        <button
          className={`tab ${activeTab === 'cnn' ? 'active' : ''}`}
          onClick={() => setActiveTab('cnn')}
        >
          Convolutional Neural Network (CNN)
        </button>
      </div>

      {activeTab === 'ann' && (
        <div className="ann-section">
          <div className="controls-panel">
            <div className="control-group">
              <h3>Input Values</h3>
              {annInputs.map((val, idx) => (
                <label key={idx}>
                  Input {idx + 1}:
                  <input
                    type="number"
                    step="0.1"
                    value={val}
                    onChange={(e) => {
                      const newInputs = [...annInputs];
                      newInputs[idx] = parseFloat(e.target.value) || 0;
                      setAnnInputs(newInputs);
                    }}
                  />
                </label>
              ))}
            </div>

            <div className="control-group">
              <h3>Activation Function</h3>
              <select
                value={annActivationType}
                onChange={(e) => setAnnActivationType(e.target.value)}
              >
                <option value="sigmoid">Sigmoid</option>
                <option value="relu">ReLU</option>
                <option value="tanh">Tanh</option>
              </select>
            </div>
          </div>

          <div className="visualization-panel">
            <h2>Neural Network Architecture</h2>
            <NeuralNetworkVisualization
              layers={annLayers.map(size => Array(size).fill(0))}
              weights={annWeights}
              activations={annActivations}
              selectedNode={selectedNode}
              onNodeSelect={setSelectedNode}
              algorithm="ann"
            />

            {selectedNode && (
              <div className="calculation-panel">
                <h3>Node Calculation</h3>
                <div className="calculation-box">
                  <pre>{getCalculationForNode(selectedNode.layer, selectedNode.node)}</pre>
                </div>
              </div>
            )}
          </div>

          <div className="formulas-panel">
            <h2>Activation Functions & Formulas</h2>
            
            <div className="formula-section">
              <h3>Sigmoid</h3>
              <div className="formula-box">
                <p className="formula">σ(x) = 1 / (1 + e^(-x))</p>
                <p className="formula-desc">Output range: (0, 1)</p>
                <div className="example">
                  <p>Example: σ(2) = {sigmoid(2).toFixed(4)}</p>
                  <p>Example: σ(-1) = {sigmoid(-1).toFixed(4)}</p>
                </div>
              </div>
            </div>

            <div className="formula-section">
              <h3>ReLU (Rectified Linear Unit)</h3>
              <div className="formula-box">
                <p className="formula">ReLU(x) = max(0, x)</p>
                <p className="formula-desc">Output range: [0, ∞)</p>
                <div className="example">
                  <p>Example: ReLU(3) = {relu(3).toFixed(4)}</p>
                  <p>Example: ReLU(-2) = {relu(-2).toFixed(4)}</p>
                </div>
              </div>
            </div>

            <div className="formula-section">
              <h3>Tanh (Hyperbolic Tangent)</h3>
              <div className="formula-box">
                <p className="formula">tanh(x) = (e^x - e^(-x)) / (e^x + e^(-x))</p>
                <p className="formula-desc">Output range: (-1, 1)</p>
                <div className="example">
                  <p>Example: tanh(1) = {tanh(1).toFixed(4)}</p>
                  <p>Example: tanh(-0.5) = {tanh(-0.5).toFixed(4)}</p>
                </div>
              </div>
            </div>

            <div className="formula-section">
              <h3>Softmax</h3>
              <div className="formula-box">
                <p className="formula">softmax(x_i) = e^(x_i) / Σ(e^(x_j))</p>
                <p className="formula-desc">Output: Probability distribution (sum = 1)</p>
                <div className="example">
                  <p>Example: softmax([2, 1, 0.1]) = [{softmax([2, 1, 0.1]).map(v => v.toFixed(4)).join(', ')}]</p>
                  <p>Sum: {softmax([2, 1, 0.1]).reduce((a, b) => a + b, 0).toFixed(4)}</p>
                </div>
              </div>
            </div>

            <div className="formula-section">
              <h3>Forward Propagation Formula</h3>
              <div className="formula-box">
                <p className="formula-alt">For each layer l:</p>
                <p className="formula">z^[l] = W^[l] · a^[l-1] + b^[l]</p>
                <p className="formula">a^[l] = g(z^[l])</p>
                <p className="formula-desc">
                  Where W is weight matrix, a is activation, b is bias, and g is activation function
                </p>
              </div>
            </div>
          </div>

          <div className="layer-details">
            <h2>Layer-by-Layer Activations</h2>
            {annActivations.map((layer, idx) => (
              <div key={idx} className="layer-box">
                <h3>{idx === 0 ? 'Input Layer' : idx === annActivations.length - 1 ? 'Output Layer' : `Hidden Layer ${idx}`}</h3>
                <div className="activation-values">
                  {layer.map((val, nodeIdx) => (
                    <div key={nodeIdx} className="activation-node">
                      <span className="node-label">Node {nodeIdx + 1}</span>
                      <span className="node-value">{val.toFixed(4)}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'cnn' && (
        <div className="cnn-section">
          <div className="cnn-explanation">
            <h2>Convolutional Neural Network (CNN)</h2>
            <p>
              CNNs use convolutional layers to detect features in images. Each filter scans the input
              and produces a feature map through convolution operations.
            </p>
          </div>

          <div className="cnn-visualization">
            <div className="input-matrix">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3>Input Matrix (8×8)</h3>
                <button onClick={regenerateCNNInput} className="regenerate-btn">
                  Regenerate Input
                </button>
              </div>
              <div className="matrix-grid">
                {Array.from({ length: 64 }).map((_, i) => (
                  <div
                    key={i}
                    className={`matrix-cell ${cnnInput[i] > 0.5 ? 'active' : ''}`}
                    style={{ opacity: cnnInput[i] }}
                  >
                    {cnnInput[i].toFixed(1)}
                  </div>
                ))}
              </div>
            </div>

            <div className="feature-maps">
              <h3>Feature Maps (After Convolution + ReLU)</h3>
              {cnnFeatureMaps.map((featureMap, fIdx) => (
                <div key={fIdx} className="feature-map">
                  <h4>Filter {fIdx + 1}</h4>
                  <div className="matrix-grid small">
                    {featureMap.flat().map((val, i) => (
                      <div
                        key={i}
                        className={`matrix-cell ${val > 0 ? 'active' : ''}`}
                        style={{ opacity: Math.min(val / 5, 1) }}
                      >
                        {val.toFixed(2)}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="cnn-formulas">
            <h2>CNN Formulas & Operations</h2>

            <div className="formula-section">
              <h3>Convolution Operation</h3>
              <div className="formula-box">
                <p className="formula">(I * K)[i,j] = Σ(m=0 to M-1) Σ(n=0 to N-1) I[i+m, j+n] × K[m, n]</p>
                <p className="formula-desc">
                  Where I is input, K is kernel/filter, and * denotes convolution
                </p>
              </div>
            </div>

            <div className="formula-section">
              <h3>Feature Map Size</h3>
              <div className="formula-box">
                <p className="formula">Output Size = (Input Size - Filter Size + 2×Padding) / Stride + 1</p>
                <p className="formula-desc">
                  In our example: (8 - 3 + 0) / 1 + 1 = 6×6
                </p>
              </div>
            </div>

            <div className="formula-section">
              <h3>ReLU Activation</h3>
              <div className="formula-box">
                <p className="formula">ReLU(x) = max(0, x)</p>
                <p className="formula-desc">
                  Applied element-wise to feature maps to introduce non-linearity
                </p>
              </div>
            </div>

            <div className="formula-section">
              <h3>Pooling (Max Pooling)</h3>
              <div className="formula-box">
                <p className="formula">Pool[i,j] = max(Region[i×stride : (i+1)×stride, j×stride : (j+1)×stride])</p>
                <p className="formula-desc">
                  Reduces spatial dimensions and provides translation invariance
                </p>
              </div>
            </div>
          </div>

          <div className="cnn-architecture">
            <h2>CNN Architecture Overview</h2>
            <div className="architecture-diagram">
              <div className="arch-layer">
                <div className="arch-box">Input Layer<br/>(8×8)</div>
                <div className="arch-arrow">→</div>
                <div className="arch-box">Convolution<br/>(3×3 filters)</div>
                <div className="arch-arrow">→</div>
                <div className="arch-box">ReLU<br/>Activation</div>
                <div className="arch-arrow">→</div>
                <div className="arch-box">Feature Maps<br/>(6×6 each)</div>
                <div className="arch-arrow">→</div>
                <div className="arch-box">Pooling<br/>(Optional)</div>
                <div className="arch-arrow">→</div>
                <div className="arch-box">Fully Connected<br/>Layers</div>
                <div className="arch-arrow">→</div>
                <div className="arch-box">Output<br/>(Classification)</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

