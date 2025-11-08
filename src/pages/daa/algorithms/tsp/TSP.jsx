// src/pages/daa/algorithms/tsp/TSP.jsx
import React, { useState } from "react";
import "./TSP.css";

export default function TSP() {
  const [numCities, setNumCities] = useState(4);
  const [distances, setDistances] = useState([
    [0, 10, 15, 20],
    [10, 0, 35, 25],
    [15, 35, 0, 30],
    [20, 25, 30, 0],
  ]);
  const [solution, setSolution] = useState(null);
  const [method, setMethod] = useState("branchBound");
  const [showExplanation, setShowExplanation] = useState(false);

  const updateDistance = (i, j, value) => {
    const newDistances = distances.map(row => [...row]);
    newDistances[i][j] = parseInt(value) || 0;
    newDistances[j][i] = parseInt(value) || 0;
    setDistances(newDistances);
  };

  const initializeDistances = (n) => {
    const newDistances = Array(n).fill(null).map(() => Array(n).fill(0));
    for (let i = 0; i < Math.min(n, distances.length); i++) {
      for (let j = 0; j < Math.min(n, distances.length); j++) {
        newDistances[i][j] = distances[i][j] || 0;
      }
    }
    setDistances(newDistances);
  };

  // Row reduction: subtract minimum from each row (excluding diagonal)
  const reduceRows = (matrix) => {
    const reduced = matrix.map(row => [...row]);
    const rowMins = [];
    let reductionCost = 0;

    for (let i = 0; i < reduced.length; i++) {
      // Find minimum in row (excluding diagonal and Infinity)
      const validValues = reduced[i].filter((val, idx) => idx !== i && val !== Infinity);
      const min = validValues.length > 0 ? Math.min(...validValues) : 0;
      
      if (min > 0) {
        rowMins.push(min);
        reductionCost += min;
        for (let j = 0; j < reduced[i].length; j++) {
          if (i !== j && reduced[i][j] !== Infinity) {
            reduced[i][j] -= min;
          }
        }
      } else {
        rowMins.push(0);
      }
    }

    return { matrix: reduced, rowMins, reductionCost };
  };

  // Column reduction: subtract minimum from each column (excluding diagonal)
  const reduceColumns = (matrix) => {
    const reduced = matrix.map(row => [...row]);
    const colMins = [];
    let reductionCost = 0;

    for (let j = 0; j < reduced[0].length; j++) {
      // Find minimum in column (excluding diagonal and Infinity)
      const col = reduced.map((row, idx) => idx !== j ? row[j] : Infinity);
      const validValues = col.filter(val => val !== Infinity);
      const min = validValues.length > 0 ? Math.min(...validValues) : 0;
      
      if (min > 0) {
        colMins.push(min);
        reductionCost += min;
        for (let i = 0; i < reduced.length; i++) {
          if (i !== j && reduced[i][j] !== Infinity) {
            reduced[i][j] -= min;
          }
        }
      } else {
        colMins.push(0);
      }
    }

    return { matrix: reduced, colMins, reductionCost };
  };

  // Brute Force
  const solveBruteForce = () => {
    const n = numCities;
    const startCity = 0;
    const otherCities = Array.from({ length: n - 1 }, (_, i) => i + 1);
    
    let minCost = Infinity;
    let bestPath = null;
    const allPaths = [];
    let iterations = 0;

    const permute = (arr, current = []) => {
      if (arr.length === 0) {
        iterations++;
        const path = [startCity, ...current, startCity];
        let cost = 0;
        for (let i = 0; i < path.length - 1; i++) {
          cost += distances[path[i]][path[i + 1]];
        }
        allPaths.push({ path: [...path], cost });
        if (cost < minCost) {
          minCost = cost;
          bestPath = [...path];
        }
        return;
      }
      for (let i = 0; i < arr.length; i++) {
        permute([...arr.slice(0, i), ...arr.slice(i + 1)], [...current, arr[i]]);
      }
    };

    permute(otherCities);

    return {
      method: "bruteForce",
      bestPath,
      minCost,
      allPaths: allPaths.slice(0, 20),
      totalPaths: allPaths.length,
      iterations,
    };
  };

  // Branch and Bound with matrix reduction
  const solveBranchBound = () => {
    const n = numCities;
    const startCity = 0;
    let minCost = Infinity;
    let bestPath = null;
    const reductionSteps = [];
    const exploredNodes = [];
    let nodesExplored = 0;
    let nodesPruned = 0;

    // Initial reduction
    const initialMatrix = distances.map(row => row.map(val => val));
    const rowReduction = reduceRows(initialMatrix);
    const colReduction = reduceColumns(rowReduction.matrix);
    const initialCost = rowReduction.reductionCost + colReduction.reductionCost;
    
    reductionSteps.push({
      step: "Initial",
      matrix: initialMatrix,
      rowReduction: rowReduction,
      colReduction: colReduction,
      totalCost: initialCost,
      description: "Initial cost matrix with row and column reduction"
    });

    const branchBound = (currentPath, visited, currentCost, costMatrix, stepNum) => {
      nodesExplored++;
      
      if (currentPath.length === n) {
        const returnCost = costMatrix[currentPath[currentPath.length - 1]][startCity];
        const totalCost = currentCost + returnCost;
        exploredNodes.push({
          path: [...currentPath, startCity],
          cost: totalCost,
          bound: totalCost,
          step: stepNum,
          status: "Complete"
        });
        if (totalCost < minCost) {
          minCost = totalCost;
          bestPath = [...currentPath, startCity];
        }
        return;
      }

      // For each unvisited city, create a branch
      for (let i = 0; i < n; i++) {
        if (!visited[i] && i !== startCity) {
          const fromCity = currentPath[currentPath.length - 1];
          const edgeCost = costMatrix[fromCity][i];
          
          // Create reduced matrix for this branch
          const branchMatrix = costMatrix.map(row => [...row]);
          // Set row and column to infinity (can't use these edges)
          for (let k = 0; k < n; k++) {
            branchMatrix[fromCity][k] = Infinity;
            branchMatrix[k][i] = Infinity;
          }
          branchMatrix[i][startCity] = Infinity; // Can't return to start until last

          // Reduce the matrix
          const rowRed = reduceRows(branchMatrix);
          const colRed = reduceColumns(rowRed.matrix);
          const reductionCost = rowRed.reductionCost + colRed.reductionCost;
          const bound = currentCost + edgeCost + reductionCost;

          const stepInfo = {
            step: `Step ${stepNum}`,
            from: fromCity,
            to: i,
            edgeCost: edgeCost,
            matrix: branchMatrix.map(row => [...row]),
            rowReduction: rowRed,
            colReduction: colRed,
            bound: bound,
            currentCost: currentCost,
            description: `Branch from City ${fromCity} to City ${i}`
          };
          reductionSteps.push(stepInfo);

          exploredNodes.push({
            path: [...currentPath, i],
            cost: currentCost + edgeCost,
            bound: bound,
            step: stepNum,
            status: bound >= minCost ? "Pruned" : "Explored"
          });

          if (bound < minCost) {
            branchBound([...currentPath, i], [...visited, i], currentCost + edgeCost + reductionCost, colRed.matrix, stepNum + 1);
          } else {
            nodesPruned++;
          }
        }
      }
    };

    const visited = new Array(n).fill(false);
    visited[startCity] = true;
    branchBound([startCity], visited, initialCost, colReduction.matrix, 1);

    return {
      method: "branchBound",
      bestPath,
      minCost,
      reductionSteps,
      exploredNodes: exploredNodes.slice(0, 30),
      nodesExplored,
      nodesPruned,
      initialCost,
    };
  };

  const handleSolve = () => {
    if (numCities > 4) {
      alert("Please use 4 or fewer cities for detailed matrix visualization");
      return;
    }
    if (method === "bruteForce") {
      const result = solveBruteForce();
      setSolution(result);
    } else {
      const result = solveBranchBound();
      setSolution(result);
    }
  };

  const renderMatrix = (matrix, title, rowMins = null, colMins = null) => {
    return (
      <div className="matrix-display">
        {title && <h4>{title}</h4>}
        <table className="reduction-matrix">
          <thead>
            <tr>
              <th></th>
              {Array.from({ length: matrix[0].length }, (_, j) => (
                <th key={j}>City {j}</th>
              ))}
              {rowMins && <th>Row Min</th>}
            </tr>
          </thead>
          <tbody>
            {matrix.map((row, i) => (
              <tr key={i}>
                <td className="row-label">City {i}</td>
                {row.map((val, j) => (
                  <td key={j} className={val === Infinity ? "inf-cell" : i === j ? "diagonal-cell" : ""}>
                    {val === Infinity ? "∞" : val}
                  </td>
                ))}
                {rowMins && (
                  <td className="min-cell">{rowMins[i] || "0"}</td>
                )}
              </tr>
            ))}
          </tbody>
          {colMins && (
            <tfoot>
              <tr>
                <td className="row-label">Col Min</td>
                {colMins.map((min, j) => (
                  <td key={j} className="min-cell">{min || "0"}</td>
                ))}
                <td className="total-cell">
                  {rowMins && colMins && 
                    `${rowMins.reduce((a, b) => a + b, 0)} + ${colMins.reduce((a, b) => a + b, 0)} = ${rowMins.reduce((a, b) => a + b, 0) + colMins.reduce((a, b) => a + b, 0)}`
                  }
                </td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    );
  };

  return (
    <div className="tsp-container">
      <div className="tsp-header">
        <h1>Traveling Salesman Problem (TSP)</h1>
        <p>Find the shortest route visiting all cities exactly once and returning to start</p>
      </div>

      <div className="tsp-content">
        <div className="input-section">
          <h2>Input</h2>
          
          <div className="city-count-input">
            <label>
              Number of Cities (max 4 for detailed visualization):
              <input
                type="number"
                min="3"
                max="4"
                value={numCities}
                onChange={(e) => {
                  const n = Math.min(4, Math.max(3, parseInt(e.target.value) || 3));
                  setNumCities(n);
                  initializeDistances(n);
                }}
              />
            </label>
          </div>

          <div className="distance-matrix">
            <h3>Distance Matrix</h3>
            <p className="matrix-note">Enter distances between cities (symmetric matrix)</p>
            <div className="matrix-container">
              <table className="distance-table">
                <thead>
                  <tr>
                    <th></th>
                    {Array.from({ length: numCities }, (_, i) => (
                      <th key={i}>City {i}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: numCities }, (_, i) => (
                    <tr key={i}>
                      <td className="row-label">City {i}</td>
                      {Array.from({ length: numCities }, (_, j) => (
                        <td key={j}>
                          <input
                            type="number"
                            min="0"
                            value={distances[i]?.[j] || 0}
                            onChange={(e) => updateDistance(i, j, e.target.value)}
                            disabled={i === j}
                            className="distance-input"
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="method-selector">
            <h3>Solution Method</h3>
            <label>
              <input
                type="radio"
                value="branchBound"
                checked={method === "branchBound"}
                onChange={(e) => setMethod(e.target.value)}
              />
              Branch and Bound (with Matrix Reduction)
            </label>
            <label>
              <input
                type="radio"
                value="bruteForce"
                checked={method === "bruteForce"}
                onChange={(e) => setMethod(e.target.value)}
              />
              Brute Force
            </label>
          </div>

          <button onClick={handleSolve} className="solve-btn">Solve TSP</button>
        </div>

        {solution && (
          <div className="solution-section">
            <h2>Solution</h2>

            <div className="solution-info">
              <p><strong>Method:</strong> {solution.method === "branchBound" ? "Branch and Bound" : "Brute Force"}</p>
              <p><strong>Optimal Path:</strong> {solution.bestPath?.map(c => `City ${c}`).join(" → ")}</p>
              <p><strong>Minimum Cost:</strong> {solution.minCost}</p>
              {solution.method === "branchBound" && (
                <>
                  <p><strong>Initial Lower Bound:</strong> {solution.initialCost}</p>
                  <p><strong>Nodes Explored:</strong> {solution.nodesExplored}</p>
                  <p><strong>Nodes Pruned:</strong> {solution.nodesPruned}</p>
                  <p><strong>Efficiency:</strong> {((solution.nodesPruned / (solution.nodesExplored + solution.nodesPruned)) * 100).toFixed(2)}% pruning rate</p>
                </>
              )}
              {solution.method === "bruteForce" && (
                <>
                  <p><strong>Total Paths Explored:</strong> {solution.totalPaths}</p>
                  <p><strong>Iterations:</strong> {solution.iterations}</p>
                </>
              )}
            </div>

            {solution.method === "branchBound" && solution.reductionSteps && (
              <div className="reduction-steps">
                <h3>Matrix Reduction Steps</h3>
                <p className="reduction-note">
                  Each step shows row reduction, column reduction, and the resulting lower bound.
                </p>
                    {solution.reductionSteps.map((step, idx) => (
                  <div key={idx} className="reduction-step">
                    <h4>{step.step}: {step.description}</h4>
                    {step.matrix && (
                      <>
                        <p><strong>Original Matrix:</strong></p>
                        {renderMatrix(step.matrix, null)}
                        {step.rowReduction && (
                          <>
                            <p><strong>After Row Reduction:</strong> (Subtract minimum from each row)</p>
                            {renderMatrix(step.rowReduction.matrix, null, step.rowReduction.rowMins)}
                            <p className="reduction-cost">Row reduction cost: <strong>{step.rowReduction.reductionCost}</strong></p>
                          </>
                        )}
                        {step.colReduction && (
                          <>
                            <p><strong>After Column Reduction:</strong> (Subtract minimum from each column)</p>
                            {renderMatrix(step.colReduction.matrix, null, step.rowReduction?.rowMins, step.colReduction.colMins)}
                            <p className="reduction-cost">Column reduction cost: <strong>{step.colReduction.reductionCost}</strong></p>
                            <p className="total-bound"><strong>Total Lower Bound: {step.bound || step.totalCost}</strong></p>
                          </>
                        )}
                        {step.edgeCost !== undefined && (
                          <p className="edge-info">Edge cost from City {step.from} to City {step.to}: <strong>{step.edgeCost}</strong></p>
                        )}
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}

            {solution.method === "branchBound" && solution.exploredNodes && (
              <div className="explored-nodes">
                <h3>Explored Nodes</h3>
                <div className="nodes-table-container">
                  <table className="nodes-table">
                    <thead>
                      <tr>
                        <th>Path</th>
                        <th>Cost</th>
                        <th>Bound</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {solution.exploredNodes.map((node, idx) => (
                        <tr key={idx} className={node.status === "Pruned" ? "pruned-node" : ""}>
                          <td>{node.path.map(c => c).join(" → ")}</td>
                          <td>{node.cost.toFixed(1)}</td>
                          <td>{node.bound.toFixed(1)}</td>
                          <td>{node.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {solution.method === "bruteForce" && solution.allPaths && (
              <div className="all-paths">
                <h3>All Explored Paths (Sample)</h3>
                <p className="paths-note">Showing first 20 paths. Total: {solution.totalPaths}</p>
                <div className="paths-table-container">
                  <table className="paths-table">
                    <thead>
                      <tr>
                        <th>Path</th>
                        <th>Cost</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {solution.allPaths.map((path, idx) => (
                        <tr key={idx} className={path.cost === solution.minCost ? "optimal-path" : ""}>
                          <td>{path.path.map(c => `City ${c}`).join(" → ")}</td>
                          <td>{path.cost}</td>
                          <td>{path.cost === solution.minCost ? "Optimal" : ""}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div className="explanation-section">
              <button 
                className="explanation-toggle"
                onClick={() => setShowExplanation(!showExplanation)}
              >
                {showExplanation ? "▼" : "▶"} Algorithm Explanation
              </button>
              {showExplanation && (
                <div className="explanation">
                  {solution.method === "branchBound" && (
                    <>
                      <h4>Branch and Bound with Matrix Reduction</h4>
                      <p>
                        This method uses cost matrix reduction to calculate lower bounds. At each step:
                      </p>
                      <ol>
                        <li><strong>Row Reduction:</strong> Subtract the minimum value from each row (except diagonal)</li>
                        <li><strong>Column Reduction:</strong> Subtract the minimum value from each column (except diagonal)</li>
                        <li><strong>Lower Bound:</strong> Sum of all reductions gives the minimum possible cost</li>
                        <li><strong>Branching:</strong> For each unvisited city, create a branch with updated matrix</li>
                        <li><strong>Pruning:</strong> If bound ≥ current best, prune that branch</li>
                      </ol>
                      <p><strong>Time Complexity:</strong> O(n!) worst case, but much better with pruning</p>
                    </>
                  )}
                  {solution.method === "bruteForce" && (
                    <>
                      <h4>Brute Force Method</h4>
                      <p>
                        Explores all (n-1)! permutations starting from city 0. Guaranteed to find optimal solution
                        but computationally expensive.
                      </p>
                      <p><strong>Time Complexity:</strong> O(n!)</p>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
