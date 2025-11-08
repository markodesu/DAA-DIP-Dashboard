// src/pages/daa/MergeSort.jsx
import React, { useState, useEffect } from "react";

export default function MergeSort() {
  const [array, setArray] = useState([38, 27, 43, 3, 9, 82, 10]);
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);

  // Helper function to generate merge sort steps
  const mergeSortSteps = (arr) => {
    const result = [];

    const merge = (left, right) => {
      const merged = [];
      let i = 0,
        j = 0;

      while (i < left.length && j < right.length) {
        if (left[i] < right[j]) {
          merged.push(left[i]);
          i++;
        } else {
          merged.push(right[j]);
          j++;
        }
        result.push([...merged, ...left.slice(i), ...right.slice(j)]);
      }

      while (i < left.length) {
        merged.push(left[i]);
        i++;
        result.push([...merged, ...right.slice(j)]);
      }

      while (j < right.length) {
        merged.push(right[j]);
        j++;
        result.push([...merged, ...left.slice(i)]);
      }

      return merged;
    };

    const mergeSortRecursive = (arr) => {
      if (arr.length <= 1) return arr;
      const mid = Math.floor(arr.length / 2);
      const left = mergeSortRecursive(arr.slice(0, mid));
      const right = mergeSortRecursive(arr.slice(mid));
      return merge(left, right);
    };

    mergeSortRecursive(arr);
    return result;
  };

  const startMergeSort = () => {
    const sortedSteps = mergeSortSteps(array);
    setSteps(sortedSteps);
    setCurrentStep(0);
  };

  // Animate steps
  useEffect(() => {
    if (steps.length === 0 || currentStep >= steps.length) return;
    const timer = setTimeout(() => setCurrentStep((prev) => prev + 1), 500);
    return () => clearTimeout(timer);
  }, [currentStep, steps]);

  return (
    <div>
      <h2>Merge Sort Visualization</h2>
      <div>
        {steps.length > 0
          ? steps[currentStep].map((num, idx) => (
              <span key={idx} style={{ margin: "5px" }}>
                {num}
              </span>
            ))
          : array.map((num, idx) => (
              <span key={idx} style={{ margin: "5px" }}>
                {num}
              </span>
