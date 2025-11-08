// src/pages/daa/algorithms/coinChanging/CoinChanging.jsx
import React, { useState } from "react";
import "./CoinChanging.css";

export default function CoinChanging() {
  const [coins, setCoins] = useState([1, 5, 10, 25]);
  const [amount, setAmount] = useState(30);
  const [solution, setSolution] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const addCoin = () => {
    setCoins([...coins, 0]);
  };

  const removeCoin = (index) => {
    setCoins(coins.filter((_, i) => i !== index));
  };

  const updateCoin = (index, value) => {
    const newCoins = [...coins];
    newCoins[index] = parseInt(value) || 0;
    setCoins(newCoins);
  };

  const solveDP = () => {
    const sortedCoins = [...coins].filter(c => c > 0).sort((a, b) => a - b);
    const n = sortedCoins.length;
    
    // Build 2D DP table: dp[i][j] = min coins needed for amount j using first i coins
    const dp = Array(n + 1).fill(null).map(() => Array(amount + 1).fill(Infinity));
    const parent = Array(amount + 1).fill(-1);
    
    // Base case: 0 coins needed for amount 0
    for (let i = 0; i <= n; i++) {
      dp[i][0] = 0;
    }

    // Build DP table
    for (let i = 1; i <= n; i++) {
      const coin = sortedCoins[i - 1];
      for (let j = 0; j <= amount; j++) {
        // Don't use current coin
        dp[i][j] = dp[i - 1][j];
        
        // Use current coin if possible
        if (coin <= j && dp[i][j - coin] + 1 < dp[i][j]) {
          dp[i][j] = dp[i][j - coin] + 1;
          if (j === amount) {
            parent[j] = coin;
          }
        }
      }
    }

    // Find coin combination using backtracking
    const combination = [];
    let current = amount;
    let coinIdx = n;
    
    while (current > 0 && coinIdx > 0) {
      const coin = sortedCoins[coinIdx - 1];
      // Check if this coin was used
      if (coin <= current && dp[coinIdx][current] === dp[coinIdx][current - coin] + 1) {
        combination.push(coin);
        current -= coin;
      } else {
        coinIdx--;
      }
    }

    return {
      dp,
      combination,
      minCoins: dp[n][amount] === Infinity ? -1 : dp[n][amount],
      sortedCoins,
    };
  };

  const handleSolve = () => {
    const result = solveDP();
    setSolution(result);
  };

  return (
    <div className="coin-changing-container">
      <div className="coin-changing-header">
        <h1>Coin Changing Problem</h1>
        <p>Find minimum number of coins to make a given amount</p>
      </div>

      <div className="coin-changing-content">
        <div className="input-section">
          <h2>Input</h2>
          <div className="amount-input">
            <label>
              Amount: <input type="number" value={amount} onChange={(e) => setAmount(parseInt(e.target.value) || 0)} min="1" />
            </label>
          </div>

          <div className="coins-input">
            <h3>Available Coins</h3>
            {coins.map((coin, index) => (
              <div key={index} className="coin-input-row">
                <span>Coin {index + 1}:</span>
                <input
                  type="number"
                  placeholder="Value"
                  value={coin}
                  onChange={(e) => updateCoin(index, e.target.value)}
                  min="1"
                />
                {coins.length > 1 && (
                  <button onClick={() => removeCoin(index)} className="remove-btn">Remove</button>
                )}
              </div>
            ))}
            <button onClick={addCoin} className="add-btn">Add Coin</button>
          </div>

          <button onClick={handleSolve} className="solve-btn">Solve</button>
        </div>

        {solution && (
          <div className="solution-section">
            <h2>Solution</h2>

            <div className="solution-info">
              <p><strong>Minimum Coins:</strong> {solution.minCoins === -1 ? "Not Possible" : solution.minCoins}</p>
              <p><strong>Coin Combination:</strong> {solution.combination.length > 0 ? solution.combination.join(", ") : "None"}</p>
            </div>

            <div className="dp-table-container">
              <h3>DP Table</h3>
              <p className="table-explanation">
                Rows represent coins, columns represent amounts. Each cell shows minimum coins needed for that amount using coins up to that row.
              </p>
              <table className="dp-table">
                <thead>
                  <tr>
                    <th>Coin/Amount</th>
                    {Array.from({ length: amount + 1 }, (_, i) => (
                      <th key={i}>{i}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="row-label">0 (no coins)</td>
                    {solution.dp[0].map((value, i) => (
                      <td
                        key={i}
                        className={
                          value === Infinity ? "impossible-cell" : i === 0 ? "base-cell" : ""
                        }
                      >
                        {value === Infinity ? "∞" : value}
                      </td>
                    ))}
                  </tr>
                  {solution.sortedCoins.map((coin, coinIdx) => (
                    <tr key={coin}>
                      <td className="row-label">Coin {coin}</td>
                      {solution.dp[coinIdx + 1].map((value, i) => (
                        <td
                          key={i}
                          className={
                            value !== Infinity && i === amount && coinIdx === solution.sortedCoins.length - 1
                              ? "solution-cell"
                              : value === Infinity
                              ? "impossible-cell"
                              : i === 0
                              ? "base-cell"
                              : ""
                          }
                        >
                          {value === Infinity ? "∞" : value}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
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
                  <h4>Dynamic Programming Approach</h4>
                  <p>
                    The DP approach builds a 2D table where dp[i][j] represents the minimum
                    number of coins needed to make amount j using the first i coins.
                  </p>
                  <p><strong>Recurrence Relation:</strong></p>
                  <p className="formula">dp[i][j] = min(dp[i-1][j], dp[i][j-coin] + 1)</p>
                  <p><strong>Base Cases:</strong></p>
                  <ul>
                    <li>dp[i][0] = 0 for all i (0 coins needed for amount 0)</li>
                    <li>dp[0][j] = ∞ for j > 0 (impossible with no coins)</li>
                  </ul>
                  <p><strong>Algorithm:</strong></p>
                  <ol>
                    <li>For each coin and each amount, decide whether to use the coin</li>
                    <li>If coin ≤ amount: dp[i][j] = min(not using coin, using coin)</li>
                    <li>If coin > amount: dp[i][j] = dp[i-1][j] (can't use coin)</li>
                  </ol>
                  <p><strong>Time Complexity:</strong> O(n × m) where n is number of coins and m is amount</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


