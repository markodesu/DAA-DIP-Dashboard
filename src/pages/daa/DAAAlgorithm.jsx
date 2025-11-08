// src/pages/daa/DAAAlgorithm.jsx
import React, { useState, useEffect } from "react";

export default function DAAAlgorithm() {
  const [array, setArray] = useState([5, 3, 8, 4, 2]);
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);

  const bubbleSortSteps = (arr) => {
    const result = [];
    const a = [...arr];
    for (let i = 0; i < a.length - 1; i++) {
      for (let j = 0; j < a.length - i - 1; j++) {
        if (a[j] > a[j + 1]) {
          [a[j], a[j + 1]] = [a[j + 1], a[j]];
        }
        result.push([...a]); // save state after each comparison
      }
    }
    return result;
  };

  const startBubbleSort = () => {
    const sortedSteps = bubbleSortSteps(array);
    setSteps(sortedSteps);
    setCurrentStep(0);
  };

  useEffect(() => {
    if (steps.length === 0 || currentStep >= steps.length) return;
    const timer = setTimeout(() => {
      setCurrentStep((prev) => prev + 1);
    }, 500);
    return () => clearTimeout(timer);
  }, [currentStep, steps]);

  return (
    <div>
      <h2>Bubble Sort Visualization</h2>
      <div>
        {steps.length > 0
          ? steps[currentStep].map((num, idx) => (
              <span key={idx} style={{ margin: "5px" }}>{num}</span>
            ))
          : array.map((num, idx) => <span key={idx} style={{ margin: "5px" }}>{num}</span>)}
      </div>
      <button onClick={startBubbleSort}>Start Bubble Sort</button>
    </div>
  );
}
