import { NavLink } from 'react-router-dom';

export default function Sidebar() {
  const linkStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 20px',
    margin: '6px 10px',
    borderRadius: '10px',
    textDecoration: 'none',
    color: '#333',
    fontWeight: '500',
    transition: '0.3s',
  };

  const activeStyle = {
    background: 'linear-gradient(135deg, #4caf50, #2e7d32)',
    color: '#fff',
    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
  };

  return (
    <div
      style={{
        width: '260px',
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        backdropFilter: 'blur(12px)',
        background: 'background: linear-gradient(180deg, #2e7d32, #1b5e20);',
        borderRight: '1px solid rgba(255,255,255,0.2)',
        boxShadow: '2px 0 20px rgba(0,0,0,0.1)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}
    >
      {/* 🌾 Header */}
      <div>
        <div
          style={{
            padding: '20px',
            textAlign: 'center',
            borderBottom: '1px solid rgba(255,255,255,0.2)'
          }}
        >
          <h4 style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
  
  <span style={{ fontSize: '24px' }}>🌾</span>

  <span
    style={{
      background: 'linear-gradient(135deg, #4caf50, #2e7d32)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent'
    }}
  >
    Farmer Panel
  </span>

</h4>
        </div>

        {/* 🔗 Links */}
        <div style={{ marginTop: '15px' }}>

          <NavLink
            to="/"
            style={({ isActive }) => ({
              ...linkStyle,
              ...(isActive ? activeStyle : {})
            })}
            onMouseEnter={(e) => {
              if (!e.currentTarget.classList.contains('active'))
                e.currentTarget.style.transform = 'translateX(5px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateX(0)';
            }}
          >
            🏠 Dashboard
          </NavLink>

          <NavLink to="/profile" style={({ isActive }) => ({ ...linkStyle, ...(isActive ? activeStyle : {}) })}>
            👤 Profile
          </NavLink>

          <NavLink to="/crops" style={({ isActive }) => ({ ...linkStyle, ...(isActive ? activeStyle : {}) })}>
            🌱 My Crops
          </NavLink>

          <NavLink to="/orders" style={({ isActive }) => ({ ...linkStyle, ...(isActive ? activeStyle : {}) })}>
            📦 Orders
          </NavLink>

          <NavLink to="/profit" style={({ isActive }) => ({ ...linkStyle, ...(isActive ? activeStyle : {}) })}>
            💰 Profit Calculator
          </NavLink>

          <NavLink to="/weather" style={({ isActive }) => ({ ...linkStyle, ...(isActive ? activeStyle : {}) })}>
            ☀️ Weather
          </NavLink>

          <NavLink to="/chat" style={({ isActive }) => ({ ...linkStyle, ...(isActive ? activeStyle : {}) })}>
            💬 Chat with Buyers
          </NavLink>

        </div>
      </div>

      {/* 👇 Footer */}
      <div
        style={{
          padding: '15px',
          textAlign: 'center',
          fontSize: '14px',
          opacity: 0.7
        }}
      >
        🚜 Smart Farming System
      </div>
    </div>
  );
}