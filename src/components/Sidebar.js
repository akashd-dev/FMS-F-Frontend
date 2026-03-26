import { NavLink } from 'react-router-dom';

export default function Sidebar() {
  return (
    <div className="sidebar">
      <div className="p-4 text-center border-bottom">
        <h4 className="mb-0">Farmer Panel</h4>
      </div>
      <NavLink to="/" className="nav-link">🏠 Dashboard</NavLink>
      <NavLink to="/profile" className="nav-link">👤 Profile</NavLink>
      <NavLink to="/crops" className="nav-link">🌱 My Crops</NavLink>
      <NavLink to="/orders" className="nav-link">📦 Orders</NavLink>
      <NavLink to="/profit" className="nav-link">💰 Profit Calculator</NavLink>
      <NavLink to="/weather" className="nav-link">☀️ Weather</NavLink>
      <NavLink to="/chat" className="nav-link">💬 Chat with Buyers</NavLink>
    </div>
  );
}