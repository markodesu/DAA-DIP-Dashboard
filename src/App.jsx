import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import DAAHome from "./pages/daa/DAAHome";
import DIPHome from "./pages/dip/DIPHome";
import "./App.css";

export default function App() {
  return (
    <Router>
      <div className="app">
        <Sidebar />
        <div className="content">
          <Routes>
            <Route path="/" element={<Navigate to="/daa" />} />
            <Route path="/daa" element={<DAAHome />} />
            <Route path="/dip" element={<DIPHome />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}
