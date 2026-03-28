import { useContext } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { AuthContext } from '../context/AuthContext';

const css = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
.kc-page { display:flex; background:#f7f5ef; min-height:100vh; font-family:'DM Sans',sans-serif; }
.kc-main { margin-left:260px; width:100%; }
.kc-content { padding:36px 40px; max-width:900px; }
.kc-profile-hero {
  position:relative; overflow:hidden;
  background:linear-gradient(130deg,#1b4332 0%,#2d6a4f 55%,#40916c 100%);
  border-radius:22px; padding:44px; margin-bottom:36px;
  box-shadow:0 12px 40px rgba(27,67,50,0.32);
  display:flex; align-items:center; gap:32px;
}
.kc-profile-hero::before {
  content:''; position:absolute; top:-60px; right:-60px;
  width:260px; height:260px;
  background:radial-gradient(circle,rgba(255,255,255,0.08) 0%,transparent 65%);
  border-radius:50%; pointer-events:none;
}
.kc-avatar-wrap {
  position:relative; flex-shrink:0;
}
.kc-avatar-ring {
  width:90px; height:90px; border-radius:50%;
  background:rgba(255,255,255,0.15);
  display:flex; align-items:center; justify-content:center;
  border:3px solid rgba(255,255,255,0.25);
  box-shadow:0 8px 24px rgba(0,0,0,0.2);
}
.kc-avatar-letter {
  width:78px; height:78px; border-radius:50%;
  background:linear-gradient(145deg,rgba(255,255,255,0.9),rgba(255,255,255,0.75));
  display:flex; align-items:center; justify-content:center;
  font-family:'Playfair Display',serif; font-size:34px; font-weight:700;
  color:#1b4332;
}
.kc-profile-info { flex:1; }
.kc-profile-name { font-family:'Playfair Display',serif; font-size:30px; font-weight:700; color:#fff; margin:0 0 6px; letter-spacing:-0.4px; }
.kc-profile-email { font-size:15px; color:rgba(255,255,255,0.65); font-weight:300; margin:0 0 14px; }
.kc-profile-tag { display:inline-flex; align-items:center; gap:6px; background:rgba(255,255,255,0.12); border:1px solid rgba(255,255,255,0.2); border-radius:20px; padding:5px 14px; font-size:12px; color:rgba(255,255,255,0.8); font-weight:500; letter-spacing:0.4px; }
.kc-fields-title { font-family:'Playfair Display',serif; font-size:20px; font-weight:600; color:#1b2e1f; margin-bottom:22px; }
.kc-fields-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:18px; }
.kc-field-card {
  background:#fff; border-radius:16px; padding:22px 24px;
  box-shadow:0 3px 18px rgba(0,0,0,0.07); border:1px solid rgba(0,0,0,0.04);
  transition:all 0.28s cubic-bezier(.34,1.56,.64,1);
  animation:kcFadeUp 0.4s ease both; animation-delay:var(--d);
}
@keyframes kcFadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
.kc-field-card:hover { transform:translateY(-5px); box-shadow:0 10px 30px rgba(0,0,0,0.12); }
.kc-field-lbl { display:flex; align-items:center; gap:7px; font-size:11.5px; font-weight:600; letter-spacing:0.8px; text-transform:uppercase; color:#8a9a8d; margin-bottom:8px; }
.kc-field-val { font-family:'Playfair Display',serif; font-size:19px; font-weight:600; color:#1b2e1f; }
.kc-field-empty { font-family:'Playfair Display',serif; font-size:17px; font-weight:400; color:#b5b0a3; font-style:italic; }
.kc-edit-btn {
  margin-top:30px; padding:12px 28px; border-radius:13px;
  background:linear-gradient(135deg,#40916c,#1b4332);
  color:#fff; border:none; font-family:'DM Sans',sans-serif;
  font-size:15px; font-weight:500; cursor:pointer; letter-spacing:0.2px;
  box-shadow:0 4px 18px rgba(27,67,50,0.3);
  transition:all 0.28s cubic-bezier(.34,1.56,.64,1);
}
.kc-edit-btn:hover { transform:translateY(-3px); box-shadow:0 8px 26px rgba(27,67,50,0.42); }
.kc-edit-btn:active { transform:scale(0.97); }
`;

const fields = (user) => [
  { icon: '👤', label: 'Full Name',   value: user?.name,     delay: '0.05s' },
  { icon: '📧', label: 'Email',       value: user?.email,    delay: '0.1s'  },
  { icon: '📱', label: 'Phone',       value: user?.phone,    delay: '0.15s' },
  { icon: '📍', label: 'Location',    value: user?.location, delay: '0.2s'  },
];

export default function Profile() {
  const { user } = useContext(AuthContext);

  return (
    <>
      <style>{css}</style>
      <div className="kc-page">
        <Sidebar />
        <div className="kc-main">
          <Navbar />
          <div className="kc-content">

            {/* Hero */}
            <div className="kc-profile-hero">
              <div className="kc-avatar-wrap">
                <div className="kc-avatar-ring">
                  <div className="kc-avatar-letter">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                </div>
              </div>
              <div className="kc-profile-info">
                <div className="kc-profile-name">{user?.name}</div>
                <div className="kc-profile-email">{user?.email}</div>
                <span className="kc-profile-tag">🌾 Farmer Account</span>
              </div>
            </div>

            {/* Fields */}
            <div className="kc-fields-title">Profile Information</div>
            <div className="kc-fields-grid">
              {fields(user).map((f) => (
                <div key={f.label} className="kc-field-card" style={{'--d': f.delay}}>
                  <div className="kc-field-lbl">
                    <span>{f.icon}</span> {f.label}
                  </div>
                  {f.value
                    ? <div className="kc-field-val">{f.value}</div>
                    : <div className="kc-field-empty">Not provided</div>
                  }
                </div>
              ))}
            </div>

            <button className="kc-edit-btn">✎ Edit Profile</button>

          </div>
        </div>
      </div>
    </>
  );
}