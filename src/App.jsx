// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import DAAHome from "./pages/daa/DAAHome";
import Knapsack from "./pages/daa/algorithms/knapsack/Knapsack";
import Huffman from "./pages/daa/algorithms/huffman/Huffman";
import Arithmetic from "./pages/daa/algorithms/arithmetic/Arithmetic";
import CoinChanging from "./pages/daa/algorithms/coinChanging/CoinChanging";
import TSP from "./pages/daa/algorithms/tsp/TSP";
import DIPHome from "./pages/dip/DIPHome";
import GrayscalePage from "./pages/dip/filters/GrayscalePage";
import NegativePage from "./pages/dip/filters/NegativePage";
import HistogramPage from "./pages/dip/filters/HistogramPage";
import BrightnessContrastPage from "./pages/dip/filters/BrightnessContrastPage";
import EdgeDetectionPage from "./pages/dip/filters/EdgeDetectionPage";
import ConvolutionPage from "./pages/dip/filters/ConvolutionPage";
import BlurPage from "./pages/dip/filters/BlurPage";
import ThresholdPage from "./pages/dip/filters/ThresholdPage";
import SharpenPage from "./pages/dip/filters/SharpenPage";
import ChannelsPage from "./pages/dip/filters/ChannelsPage";
import DIPDashboard from "./pages/dip/DIPDashboard";
import "./App.css";

export default function App() {
  return (
    <Router>
      <div className="app">
        <Sidebar />
        <div className="content">
          <Routes>
            {/* Default redirect to /daa */}
            <Route path="/" element={<Navigate to="/daa" replace />} />

            {/* DAA Section */}
            <Route path="/daa" element={<DAAHome />} />
            <Route path="/daa/knapsack" element={<Knapsack />} />
            <Route path="/daa/huffman" element={<Huffman />} />
            <Route path="/daa/arithmetic" element={<Arithmetic />} />
            <Route path="/daa/coin-changing" element={<CoinChanging />} />
            <Route path="/daa/tsp" element={<TSP />} />

            {/* DIP Section */}
            <Route path="/dip" element={<DIPHome />} />
            <Route path="/dip/dashboard" element={<DIPDashboard />} />
            <Route path="/dip/grayscale" element={<GrayscalePage />} />
            <Route path="/dip/negative" element={<NegativePage />} />
            <Route path="/dip/histogram" element={<HistogramPage />} />
            <Route path="/dip/brightness-contrast" element={<BrightnessContrastPage />} />
            <Route path="/dip/edge-detection" element={<EdgeDetectionPage />} />
            <Route path="/dip/convolution" element={<ConvolutionPage />} />
            <Route path="/dip/blur" element={<BlurPage />} />
            <Route path="/dip/threshold" element={<ThresholdPage />} />
            <Route path="/dip/sharpen" element={<SharpenPage />} />
            <Route path="/dip/channels" element={<ChannelsPage />} />

            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/daa" replace />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}
