// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import DAAHome from "./pages/daa/DAAHome";
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

            {/* DIP Section */}
            <Route path="/dip" element={<DIPDashboard />} />

            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/daa" replace />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}
