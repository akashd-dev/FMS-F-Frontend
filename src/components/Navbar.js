import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav
      className="d-flex justify-content-between align-items-center px-4 py-3"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        backdropFilter: 'blur(12px)',
        background: 'rgb(9, 235, 223)',
        borderBottom: '1px solid rgba(255,255,255,0.3)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        transition: 'all 0.3s ease'
      }}
    >
      {/* 🌾 Logo */}
      <h4
  className="fw-bold m-0"
  style={{
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
    transition: '0.3s'
  }}
  onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.08)')}
  onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
>
  {/* 🌾 Emoji */}
  <span style={{ fontSize: '24px', lineHeight: '1' }}>
    🌾
  </span>

  {/* Gradient Text */}
  <span
    style={{
      background: 'linear-gradient(135deg, #4caf50, #2e7d32)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent'
    }}
  >
    KrishiConnect
  </span>
</h4>

      {/* 👤 User Section */}
      <div className="d-flex align-items-center gap-3">

        {/* 🔔 Notification Icon */}
        <span
          style={{
            fontSize: '18px',
            cursor: 'pointer',
            transition: '0.3s'
          }}
          onMouseEnter={(e) => (e.target.style.transform = 'scale(1.2)')}
          onMouseLeave={(e) => (e.target.style.transform = 'scale(1)')}
        >
          🔔
        </span>

        {/* Avatar */}
        <div
          style={{
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #66bb6a, #2e7d32)',
            color: '#f5eded',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            transition: '0.3s',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'scale(1.1) rotate(5deg)';
            e.target.style.boxShadow = '0 6px 18px rgba(0,0,0,0.4)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'scale(1) rotate(0deg)';
            e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
          }}
        >
          {user?.name?.charAt(0).toUpperCase()}
        </div>

        {/* Username */}
        <span
          className="fw-semibold"
          style={{
            transition: '0.3s',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => (e.target.style.color = '#2e7d32')}
          onMouseLeave={(e) => (e.target.style.color = 'inherit')}
        >
          {user?.name}
        </span>

        {/* Logout Button */}
        <button
          onClick={logout}
          className="btn btn-sm"
          style={{
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #ef5350, #c62828)',
            color: '#fff',
            border: 'none',
            padding: '6px 16px',
            transition: '0.3s',
            boxShadow: '0 3px 10px rgba(198,40,40,0.3)'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-2px) scale(1.05)';
            e.target.style.boxShadow = '0 6px 18px rgba(198,40,40,0.5)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0) scale(1)';
            e.target.style.boxShadow = '0 3px 10px rgba(198,40,40,0.3)';
          }}
        >
          Logout
        </button>

      </div>
    </nav>
  );
}