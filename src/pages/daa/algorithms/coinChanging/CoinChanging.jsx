// src/pages/daa/algorithms/coinChanging/CoinChanging.jsx
import React, { useState } from "react";
import "./CoinChanging.css";

export default function CoinChanging() {
  const [coins, setCoins] = useState([1, 5, 10, 25]);
  const [amount, setAmount] = useState(30);
  const [solution, setSolution] = useState(null);

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
    const dp = Array(amount + 1).fill(Infinity);
    const parent = Array(amount + 1).fill(-1);
    dp[0] = 0;

    // Build DP table
    for (let i = 1; i <= amount; i++) {
      for (const coin of sortedCoins) {
        if (coin <= i && dp[i - coin] + 1 < dp[i]) {
          dp[i] = dp[i - coin] + 1;
          parent[i] = coin;
        }
      }
    }

    // Find coin combination
    const combination = [];
    let current = amount;
    while (current > 0 && parent[current] !== -1) {
      combination.push(parent[current]);
      current -= parent[current];
    }

    return {
      dp,
      combination,
      minCoins: dp[amount] === Infinity ? -1 : dp[amount],
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
              <table className="dp-table">
                <thead>
                  <tr>
                    <th>Amount</th>
                    {Array.from({ length: amount + 1 }, (_, i) => (
                      <th key={i}>{i}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="row-label">Min Coins</td>
                    {solution.dp.map((value, i) => (
                      <td
                        key={i}
                        className={
                          value !== Infinity && i === amount
                            ? "solution-cell"
                            : value === Infinity
                            ? "impossible-cell"
                            : ""
                        }
                      >
                        {value === Infinity ? "∞" : value}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="explanation">
              <h3>Explanation</h3>
              <p>
                The Dynamic Programming approach builds a table where dp[i] represents the minimum
                number of coins needed to make amount i. For each amount, we try all coins and choose
                the one that minimizes the total count.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


