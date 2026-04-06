import { NavLink } from 'react-router-dom';

const navItems = [
  { to: '/',          icon: '⌂',  label: 'Dashboard',         end: true },
  { to: '/profile',   icon: '◉',  label: 'Profile' },
  { to: '/crops',     icon: '🌱', label: 'My Crops' },
  { to: '/orders',    icon: '▦',  label: 'Orders' },
  { to: '/profit',    icon: '₹',  label: 'Profit Manager' },
  { to: '/weather',   icon: '☁',  label: 'Weather' },
  { to: '/inquiries', icon: '✉',  label: 'Inquiries' },
];

export default function Sidebar() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
        .kc-sidebar {
          width: 260px; height: 100vh; position: fixed; top: 0; left: 0;
          display: flex; flex-direction: column; justify-content: space-between;
          background: linear-gradient(175deg, #0d2818 0%, #1b4332 50%, #0a1f13 100%);
          border-right: 1px solid rgba(82,183,136,0.1);
          box-shadow: 4px 0 40px rgba(0,0,0,0.3);
          z-index: 999; overflow: hidden;
          font-family: 'DM Sans', sans-serif;
        }
        .kc-sidebar::before {
          content: ''; position: absolute; top: -60px; right: -60px;
          width: 220px; height: 220px;
          background: radial-gradient(circle, rgba(82,183,136,0.12) 0%, transparent 70%);
          border-radius: 50%; pointer-events: none;
        }
        .kc-sidebar::after {
          content: ''; position: absolute; bottom: -40px; left: -40px;
          width: 160px; height: 160px;
          background: radial-gradient(circle, rgba(82,183,136,0.08) 0%, transparent 70%);
          border-radius: 50%; pointer-events: none;
        }
        .kc-sb-head {
          padding: 26px 20px 22px;
          border-bottom: 1px solid rgba(82,183,136,0.1);
          display: flex; align-items: center; gap: 12px;
        }
        .kc-sb-logo {
          width: 42px; height: 42px;
          background: linear-gradient(145deg, #52b788, #2d6a4f);
          border-radius: 50% 50% 50% 12%;
          display: flex; align-items: center; justify-content: center;
          font-size: 20px;
          box-shadow: 0 4px 16px rgba(82,183,136,0.3);
          flex-shrink: 0;
        }
        .kc-sb-brand-name {
          font-family: 'Playfair Display', serif; font-size: 17px; font-weight: 700;
          color: #d8f3dc; letter-spacing: -0.2px; line-height: 1.2;
        }
        .kc-sb-brand-sub {
          font-size: 10.5px; font-weight: 400; color: rgba(216,243,220,0.4);
          letter-spacing: 0.9px; text-transform: uppercase; margin-top: 2px;
        }
        .kc-nav { flex: 1; padding: 20px 14px; overflow-y: auto; }
        .kc-nav::-webkit-scrollbar { width: 0; }
        .kc-nav-sec-label {
          font-size: 10px; font-weight: 600; letter-spacing: 1.4px;
          text-transform: uppercase; color: rgba(216,243,220,0.28);
          padding: 0 10px; margin-bottom: 8px; display: block;
        }
        .kc-link {
          display: flex; align-items: center; gap: 13px;
          padding: 11px 14px; border-radius: 12px;
          text-decoration: none; color: rgba(216,243,220,0.55);
          font-size: 14px; font-weight: 400;
          transition: all 0.22s ease; margin-bottom: 3px;
          border-left: 3px solid transparent;
        }
        .kc-link:hover { background: rgba(82,183,136,0.1); color: #d8f3dc; padding-left: 18px; }
        .kc-link.active {
          background: linear-gradient(120deg, rgba(82,183,136,0.22), rgba(82,183,136,0.08));
          color: #b7e4c7; font-weight: 500;
          border-left-color: #52b788; padding-left: 11px;
          box-shadow: 0 2px 12px rgba(82,183,136,0.1);
        }
        .kc-link-icon { font-size: 16px; width: 22px; text-align: center; flex-shrink: 0; }
        .kc-divider { height: 1px; background: rgba(82,183,136,0.08); margin: 10px 10px; }
        .kc-sb-foot { padding: 18px 20px; border-top: 1px solid rgba(82,183,136,0.1); }
        .kc-foot-badge {
          display: flex; align-items: center; gap: 9px; padding: 10px 14px;
          background: rgba(82,183,136,0.06); border-radius: 12px;
          border: 1px solid rgba(82,183,136,0.1);
        }
        .kc-foot-dot {
          width: 7px; height: 7px; background: #52b788; border-radius: 50%;
          box-shadow: 0 0 0 3px rgba(82,183,136,0.2);
          animation: kc-pulse 2.4s ease-in-out infinite; flex-shrink: 0;
        }
        @keyframes kc-pulse {
          0%,100% { box-shadow: 0 0 0 3px rgba(82,183,136,0.2); }
          50% { box-shadow: 0 0 0 6px rgba(82,183,136,0.07); }
        }
        .kc-foot-text { font-size: 12px; color: rgba(216,243,220,0.38); font-weight: 300; }
      `}</style>

      <aside className="kc-sidebar">
        <div className="kc-sb-head">
          <div className="kc-sb-logo">🌾</div>
          <div>
            <div className="kc-sb-brand-name">KrishiConnect</div>
            <div className="kc-sb-brand-sub">Farmer Panel</div>
          </div>
        </div>

        <div className="kc-nav">
          <span className="kc-nav-sec-label">Main Menu</span>
          {navItems.map((item, i) => (
            <div key={item.to}>
              <NavLink
                to={item.to}
                end={item.end}
                className={({ isActive }) => `kc-link${isActive ? ' active' : ''}`}
              >
                <span className="kc-link-icon">{item.icon}</span>
                {item.label}
              </NavLink>
              {(i === 1 || i === 3) && <div className="kc-divider" />}
            </div>
          ))}
        </div>

        <div className="kc-sb-foot">
          <div className="kc-foot-badge">
            <span className="kc-foot-dot" />
            <span className="kc-foot-text">Smart Farming System v2.0</span>
          </div>
        </div>
      </aside>
    </>
  );
}