import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
        .kc-navbar {
          position: sticky; top: 0; z-index: 1000;
          display: flex; justify-content: space-between; align-items: center;
          padding: 0 36px; height: 70px;
          background: rgba(255,253,247,0.94);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(100,70,20,0.1);
          box-shadow: 0 2px 30px rgba(50,35,10,0.07);
          font-family: 'DM Sans', sans-serif;
        }
        .kc-logo {
          display: flex; align-items: center; gap: 11px;
          cursor: pointer; user-select: none;
          transition: transform 0.35s cubic-bezier(.34,1.56,.64,1);
          text-decoration: none;
        }
        .kc-logo:hover { transform: scale(1.05); }
        .kc-logo-icon {
          width: 40px; height: 40px;
          background: linear-gradient(145deg, #5a9e6f, #2d6a4f);
          border-radius: 50% 50% 50% 12%;
          display: flex; align-items: center; justify-content: center;
          font-size: 19px;
          box-shadow: 0 4px 16px rgba(45,106,79,0.38);
          transition: box-shadow 0.3s;
          flex-shrink: 0;
        }
        .kc-logo:hover .kc-logo-icon { box-shadow: 0 7px 22px rgba(45,106,79,0.52); }
        .kc-logo-text {
          font-family: 'Playfair Display', serif; font-weight: 700; font-size: 23px;
          letter-spacing: -0.4px;
          background: linear-gradient(135deg, #1b4332, #52b788);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        }
        .kc-nav-right { display: flex; align-items: center; gap: 16px; }
        .kc-notif {
          position: relative; width: 42px; height: 42px;
          border-radius: 13px; border: 1.5px solid rgba(90,158,111,0.2);
          background: transparent;
          display: flex; align-items: center; justify-content: center;
          font-size: 18px; cursor: pointer;
          transition: all 0.25s ease;
        }
        .kc-notif:hover {
          background: rgba(90,158,111,0.1);
          border-color: rgba(90,158,111,0.4);
          transform: translateY(-2px);
        }
        .kc-notif-dot {
          position: absolute; top: 7px; right: 8px;
          width: 7px; height: 7px;
          background: #e76f51; border-radius: 50%;
          border: 2px solid rgba(255,253,247,0.95);
        }
        .kc-user-pill {
          display: flex; align-items: center; gap: 10px;
          padding: 5px 16px 5px 5px; border-radius: 50px;
          border: 1.5px solid rgba(90,158,111,0.18);
          background: rgba(90,158,111,0.05);
          transition: all 0.25s ease; cursor: default;
        }
        .kc-user-pill:hover {
          background: rgba(90,158,111,0.1);
          border-color: rgba(90,158,111,0.35);
        }
        .kc-avatar {
          width: 36px; height: 36px; border-radius: 50%;
          background: linear-gradient(140deg, #52b788, #1b4332);
          display: flex; align-items: center; justify-content: center;
          color: #fff; font-family: 'Playfair Display', serif;
          font-size: 16px; font-weight: 600;
          box-shadow: 0 2px 10px rgba(27,67,50,0.32); flex-shrink: 0;
        }
        .kc-username { font-size: 14px; font-weight: 500; color: #2d3a2e; white-space: nowrap; }
        .kc-logout {
          padding: 9px 20px; border-radius: 12px;
          background: linear-gradient(135deg, #bf4342, #9b2226);
          color: #fff; border: none;
          font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500;
          letter-spacing: 0.2px; cursor: pointer;
          box-shadow: 0 3px 14px rgba(155,34,38,0.28);
          transition: all 0.28s cubic-bezier(.34,1.56,.64,1);
        }
        .kc-logout:hover { transform: translateY(-2px) scale(1.05); box-shadow: 0 6px 22px rgba(155,34,38,0.42); }
        .kc-logout:active { transform: scale(0.96); }
      `}</style>
      <nav className="kc-navbar">
        <div className="kc-logo">
          <div className="kc-logo-icon">🌿</div>
          <span className="kc-logo-text">KrishiConnect</span>
        </div>
        <div className="kc-nav-right">
          
          <div className="kc-user-pill">
            <div className="kc-avatar">{user?.name?.charAt(0).toUpperCase()}</div>
            <span className="kc-username">{user?.name}</span>
          </div>
          <button className="kc-logout" onClick={logout}>Sign out</button>
        </div>
      </nav>
    </>
  );
}