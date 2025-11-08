import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="sidebar">
      <h2>DAA + DIP Dashboard</h2>
      <nav>
        <ul>
          <li><Link to="/daa">Design & Analysis of Algorithms</Link></li>
          <li><Link to="/dip">Digital Image Processing</Link></li>
        </ul>
      </nav>
    </div>
  );
}
