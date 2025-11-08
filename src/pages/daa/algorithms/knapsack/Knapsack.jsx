// src/pages/daa/algorithms/knapsack/Knapsack.jsx
import React, { useState } from "react";
import "./Knapsack.css";

export default function Knapsack() {
  const [items, setItems] = useState([{ weight: 10, value: 60 }, { weight: 20, value: 100 }, { weight: 30, value: 120 }]);
  const [capacity, setCapacity] = useState(50);
  const [solution, setSolution] = useState(null);
  const [viewMode, setViewMode] = useState("table"); // "table", "greedy", "tree"

  const addItem = () => {
    setItems([...items, { weight: 0, value: 0 }]);
  };

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = parseInt(value) || 0;
    setItems(newItems);
  };

  // Dynamic Programming Solution
  const solveDP = () => {
    const n = items.length;
    const dp = Array(n + 1)
      .fill(null)
      .map(() => Array(capacity + 1).fill(0));

    // Build DP table
    for (let i = 1; i <= n; i++) {
      for (let w = 0; w <= capacity; w++) {
        if (items[i - 1].weight <= w) {
          dp[i][w] = Math.max(
            dp[i - 1][w],
            dp[i - 1][w - items[i - 1].weight] + items[i - 1].value
          );
        } else {
          dp[i][w] = dp[i - 1][w];
        }
      }
    }

    // Find selected items
    const selected = [];
    let w = capacity;
    for (let i = n; i > 0 && w > 0; i--) {
      if (dp[i][w] !== dp[i - 1][w]) {
        selected.push(i - 1);
        w -= items[i - 1].weight;
      }
    }

    return { dp, selected, maxValue: dp[n][capacity] };
  };

  // Greedy Solution (by value/weight ratio)
  const solveGreedy = () => {
    const itemsWithRatio = items.map((item, index) => ({
      ...item,
      index,
      ratio: item.value / item.weight,
    }));
    itemsWithRatio.sort((a, b) => b.ratio - a.ratio);

    let remainingCapacity = capacity;
    const selected = [];
    let totalValue = 0;

    for (const item of itemsWithRatio) {
      if (item.weight <= remainingCapacity) {
        selected.push(item.index);
        totalValue += item.value;
        remainingCapacity -= item.weight;
      }
    }

    return { selected, totalValue, sortedItems: itemsWithRatio };
  };

  const handleSolve = () => {
    if (viewMode === "greedy") {
      const greedyResult = solveGreedy();
      setSolution({ type: "greedy", ...greedyResult });
    } else {
      const dpResult = solveDP();
      setSolution({ type: "dp", ...dpResult });
    }
  };

  const dpResult = solution?.type === "dp" ? solution : null;
  const greedyResult = solution?.type === "greedy" ? solution : null;

  return (
    <div className="knapsack-container">
      <div className="knapsack-header">
        <h1>0/1 Knapsack Problem</h1>
        <p>Select items to maximize value without exceeding capacity</p>
      </div>

      <div className="knapsack-content">
        {/* Input Section */}
        <div className="input-section">
          <h2>Input</h2>
          <div className="capacity-input">
            <label>
              Capacity: <input type="number" value={capacity} onChange={(e) => setCapacity(parseInt(e.target.value) || 0)} min="1" />
            </label>
          </div>

          <div className="items-input">
            <h3>Items (Weight, Value)</h3>
            {items.map((item, index) => (
              <div key={index} className="item-input-row">
                <span>Item {index + 1}:</span>
                <input
                  type="number"
                  placeholder="Weight"
                  value={item.weight}
                  onChange={(e) => updateItem(index, "weight", e.target.value)}
                  min="0"
                />
                <input
                  type="number"
                  placeholder="Value"
                  value={item.value}
                  onChange={(e) => updateItem(index, "value", e.target.value)}
                  min="0"
                />
                {items.length > 1 && (
                  <button onClick={() => removeItem(index)} className="remove-btn">Remove</button>
                )}
              </div>
            ))}
            <button onClick={addItem} className="add-btn">Add Item</button>
          </div>

          <div className="view-mode-selector">
            <label>
              <input
                type="radio"
                value="table"
                checked={viewMode === "table"}
                onChange={(e) => setViewMode(e.target.value)}
              />
              Dynamic Programming
            </label>
            <label>
              <input
                type="radio"
                value="greedy"
                checked={viewMode === "greedy"}
                onChange={(e) => setViewMode(e.target.value)}
              />
              Greedy Approach
            </label>
            <label>
              <input
                type="radio"
                value="tree"
                checked={viewMode === "tree"}
                onChange={(e) => setViewMode(e.target.value)}
              />
              Tree Visualization
            </label>
          </div>

          <button onClick={handleSolve} className="solve-btn">Solve</button>
        </div>

        {/* Solution Section */}
        {solution && (
          <div className="solution-section">
            <h2>Solution</h2>

            {viewMode === "table" && dpResult && (
              <div className="dp-solution">
                <div className="solution-info">
                  <p><strong>Maximum Value:</strong> {dpResult.maxValue}</p>
                  <p><strong>Selected Items:</strong> {dpResult.selected.map(i => `Item ${i + 1}`).join(", ") || "None"}</p>
                </div>

                <div className="dp-table-container">
                  <h3>DP Table</h3>
                  <table className="dp-table">
                    <thead>
                      <tr>
                        <th>Item/Capacity</th>
                        {Array.from({ length: capacity + 1 }, (_, i) => (
                          <th key={i}>{i}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {dpResult.dp.map((row, i) => (
                        <tr key={i}>
                          <td className="row-label">{i === 0 ? "0" : `Item ${i}`}</td>
                          {row.map((cell, j) => (
                            <td
                              key={j}
                              className={
                                i > 0 &&
                                j > 0 &&
                                dpResult.selected.includes(i - 1) &&
                                j === capacity - dpResult.dp.slice(i).reduce((sum, r, idx) => {
                                  if (idx === 0) return 0;
                                  if (dpResult.selected.includes(i - 1 + idx - 1)) {
                                    return sum + items[i - 1 + idx - 1]?.weight || 0;
                                  }
                                  return sum;
                                }, 0)
                                  ? "selected-cell"
                                  : ""
                              }
                            >
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="explanation">
                  <h3>Explanation</h3>
                  <p>
                    The Dynamic Programming approach builds a table where dp[i][w] represents the maximum value
                    achievable with the first i items and capacity w. For each item, we decide whether to include it
                    (if it fits) or exclude it, choosing the option that gives maximum value.
                  </p>
                </div>
              </div>
            )}

            {viewMode === "greedy" && greedyResult && (
              <div className="greedy-solution">
                <div className="solution-info">
                  <p><strong>Total Value (Greedy):</strong> {greedyResult.totalValue}</p>
                  <p><strong>Selected Items:</strong> {greedyResult.selected.map(i => `Item ${i + 1}`).join(", ") || "None"}</p>
                </div>

                <div className="greedy-steps">
                  <h3>Greedy Steps (sorted by value/weight ratio)</h3>
                  <ol>
                    {greedyResult.sortedItems.map((item, idx) => (
                      <li key={idx}>
                        Item {item.index + 1}: Weight={item.weight}, Value={item.value}, Ratio={item.ratio.toFixed(2)}
                        {greedyResult.selected.includes(item.index) && " ✓ Selected"}
                      </li>
                    ))}
                  </ol>
                </div>

                <div className="explanation">
                  <h3>Explanation</h3>
                  <p>
                    The Greedy approach sorts items by their value-to-weight ratio and selects items in that order
                    until the capacity is exhausted. This is faster but may not give the optimal solution.
                  </p>
                </div>
              </div>
            )}

            {viewMode === "tree" && dpResult && (
              <div className="tree-solution">
                <div className="tree-visualization">
                  <h3>Decision Tree</h3>
                  <p className="tree-note">
                    The tree shows all possible combinations. Each node represents a decision (include/exclude an item).
                    The optimal path is highlighted.
                  </p>
                  <div className="tree-container">
                    <TreeVisualization items={items} capacity={capacity} solution={dpResult} />
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

// Tree Visualization Component
function TreeVisualization({ items, capacity, solution }) {
  const renderTree = (itemIndex, remainingCapacity, path = []) => {
    if (itemIndex >= items.length) {
      return null;
    }

    const item = items[itemIndex];
    const includeValue = item.weight <= remainingCapacity
      ? solution.dp[itemIndex + 1][remainingCapacity - item.weight] + item.value
      : -1;
    const excludeValue = solution.dp[itemIndex + 1][remainingCapacity];

    return (
      <div key={itemIndex} className="tree-node">
        <div className="node-content">
          <div>Item {itemIndex + 1}</div>
          <div className="node-info">W:{item.weight} V:{item.value}</div>
          <div className="node-capacity">Cap: {remainingCapacity}</div>
        </div>
        <div className="tree-branches">
          {item.weight <= remainingCapacity && (
            <div className="tree-branch">
              <div className="branch-label">Include</div>
              {renderTree(itemIndex + 1, remainingCapacity - item.weight, [...path, itemIndex])}
            </div>
          )}
          <div className="tree-branch">
            <div className="branch-label">Exclude</div>
            {renderTree(itemIndex + 1, remainingCapacity, path)}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="tree-wrapper">
      {renderTree(0, capacity)}
    </div>
  );
}

