import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { AuthContext } from '../context/AuthContext';

const css = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,400&display=swap');
.kc-page { display:flex; background:#f7f5ef; min-height:100vh; font-family:'DM Sans',sans-serif; }
.kc-main { margin-left:260px; width:100%; }
.kc-content { padding:36px 40px; max-width:1200px; }

.kc-hero {
  position:relative; overflow:hidden;
  background:linear-gradient(130deg,#1b4332 0%,#2d6a4f 55%,#40916c 100%);
  border-radius:22px; padding:38px 44px; margin-bottom:34px;
  box-shadow:0 12px 40px rgba(27,67,50,0.32);
}
.kc-hero::before {
  content:''; position:absolute; top:-50px; right:-50px;
  width:280px; height:280px;
  background:radial-gradient(circle,rgba(255,255,255,0.07) 0%,transparent 65%);
  border-radius:50%; pointer-events:none;
}
.kc-hero-tag {
  display:inline-flex; align-items:center; gap:6px;
  background:rgba(255,255,255,0.12); border:1px solid rgba(255,255,255,0.18);
  border-radius:20px; padding:4px 13px;
  font-size:12px; font-weight:500; color:rgba(255,255,255,0.8);
  letter-spacing:0.5px; margin-bottom:14px;
}
.kc-hero-title {
  font-family:'Playfair Display',serif; font-size:30px; font-weight:700;
  color:#fff; margin:0 0 10px; letter-spacing:-0.4px;
}
.kc-hero-sub { font-size:14px; font-weight:300; color:rgba(255,255,255,0.6); margin:0; }
.kc-hero-deco {
  position:absolute; right:44px; top:50%; transform:translateY(-50%);
  font-size:80px; opacity:0.15; user-select:none;
}

.kc-stats { display:grid; grid-template-columns:repeat(3,1fr); gap:20px; margin-bottom:34px; }

.kc-stat {
  position:relative; overflow:hidden;
  border-radius:18px; padding:28px 26px;
  box-shadow:0 6px 24px rgba(0,0,0,0.12);
  transition:transform 0.3s cubic-bezier(.34,1.56,.64,1),box-shadow 0.3s;
  cursor:default; animation:kcFadeUp 0.5s ease both;
  animation-delay:var(--d);
}
@keyframes kcFadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
.kc-stat:hover { transform:translateY(-6px); box-shadow:0 14px 36px rgba(0,0,0,0.18); }
.kc-stat-icon { font-size:28px; margin-bottom:16px; line-height:1; }
.kc-stat-lbl {
  font-size:11px; font-weight:600; letter-spacing:0.9px; text-transform:uppercase;
  color:rgba(255,255,255,0.6); margin-bottom:6px;
}
.kc-stat-val {
  font-family:'Playfair Display',serif; font-size:36px; font-weight:700;
  color:#fff; line-height:1; margin-bottom:6px;
}
.kc-stat-sub { font-size:12px; color:rgba(255,255,255,0.5); font-weight:300; }
.kc-stat-glow {
  position:absolute; bottom:-30px; right:-30px;
  width:110px; height:110px; background:rgba(255,255,255,0.08);
  border-radius:50%; pointer-events:none;
}

.kc-panels { display:grid; grid-template-columns:1fr 1fr; gap:20px; }
.kc-panel {
  background:#fff; border-radius:18px; padding:28px;
  box-shadow:0 3px 20px rgba(0,0,0,0.06); border:1px solid rgba(0,0,0,0.04);
}
.kc-panel-title {
  font-family:'Playfair Display',serif; font-size:18px; font-weight:600;
  color:#1b2e1f; margin-bottom:20px;
}
.kc-act-item {
  display:flex; align-items:center; gap:14px;
  padding:12px 0; border-bottom:1px solid #f0ece2;
}
.kc-act-item:last-child { border-bottom:none; }
.kc-act-dot { width:8px; height:8px; border-radius:50%; background:#52b788; flex-shrink:0; }
.kc-act-text { font-size:14px; color:#4a5240; font-weight:400; }

.kc-tip-panel {
  background:linear-gradient(135deg,#1b4332,#2d6a4f);
  border-radius:18px; padding:28px;
  box-shadow:0 6px 24px rgba(27,67,50,0.28);
  display:flex; flex-direction:column; justify-content:center;
  position:relative; overflow:hidden;
}
.kc-tip-panel::after {
  content:'💡'; position:absolute; right:24px; bottom:20px;
  font-size:60px; opacity:0.12;
}
.kc-tip-lbl {
  font-size:10.5px; font-weight:600; letter-spacing:1.2px; text-transform:uppercase;
  color:rgba(184,230,196,0.55); margin-bottom:12px;
}
.kc-tip-txt {
  font-family:'Playfair Display',serif; font-size:20px; font-weight:500;
  color:#d8f3dc; line-height:1.55; font-style:italic;
}

.kc-loading { display:flex; flex-direction:column; align-items:center; padding:80px 0; gap:18px; }
.kc-spinner {
  width:40px; height:40px;
  border:3px solid rgba(82,183,136,0.2); border-top-color:#52b788;
  border-radius:50%; animation:kcSpin 0.8s linear infinite;
}
@keyframes kcSpin { to{transform:rotate(360deg)} }
.kc-loading-txt { font-size:14px; color:#7a8a7d; font-weight:300; }
.kc-err {
  background:#fff5f5; border:1px solid #fbc4c4; color:#9b2226;
  border-radius:14px; padding:16px 22px; font-size:14px; margin-bottom:24px;
}
`;

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({ totalCrops: 0, pendingOrders: 0, totalProfit: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => { fetchStats(); }, []);

  const fetchStats = async () => {
    try {
      setLoading(true); setError('');
      const cropsRes = await axios.get('http://localhost:5000/api/crops/my', { withCredentials: true });
      const totalCrops = cropsRes.data.crops?.length || 0;
      const ordersRes = await axios.get('http://localhost:5000/api/orders/farmer', { withCredentials: true });
      const orders = ordersRes.data.orders || [];
      const pendingOrders = orders.filter(o => o.status === 'pending').length;
      const totalProfit = orders.filter(o => ['delivered','confirmed'].includes(o.status)).reduce((s,o)=>s+o.totalPrice,0);
      setStats({ totalCrops, pendingOrders, totalProfit });
    } catch { setError('Failed to load dashboard data.'); }
    finally { setLoading(false); }
  };

  const statCards = [
    { icon:'🌱', lbl:'My Crops',       val:stats.totalCrops,                        sub:'Total crops listed',            bg:'linear-gradient(140deg,#40916c,#1b4332)', d:'0.05s' },
    { icon:'📦', lbl:'Pending Orders', val:stats.pendingOrders,                      sub:'Awaiting confirmation',         bg:'linear-gradient(140deg,#e9701a,#ae4a0b)', d:'0.12s' },
    { icon:'₹',  lbl:'Total Profit',   val:`₹${stats.totalProfit.toLocaleString()}`, sub:'From confirmed/delivered orders',bg:'linear-gradient(140deg,#287ca8,#1a4f70)', d:'0.2s'  },
  ];

  return (
    <>
      <style>{css}</style>
      <div className="kc-page">
        <Sidebar />
        <div className="kc-main">
          <Navbar />
          <div className="kc-content">

            <div className="kc-hero">
              <span className="kc-hero-tag">🌾 Farmer Dashboard</span>
              <h2 className="kc-hero-title">Welcome back, {user?.name} 👋</h2>
              <p className="kc-hero-sub">Manage your farm efficiently from one place</p>
              <span className="kc-hero-deco">🚜</span>
            </div>

            {error && <div className="kc-err">⚠ {error}</div>}

            {loading ? (
              <div className="kc-loading">
                <div className="kc-spinner" />
                <span className="kc-loading-txt">Loading your farm data…</span>
              </div>
            ) : (
              <>
                <div className="kc-stats">
                  {statCards.map(s => (
                    <div key={s.lbl} className="kc-stat" style={{ background: s.bg, '--d': s.d }}>
                      <div className="kc-stat-icon">{s.icon}</div>
                      <div className="kc-stat-lbl">{s.lbl}</div>
                      <div className="kc-stat-val">{s.val}</div>
                      <div className="kc-stat-sub">{s.sub}</div>
                      <div className="kc-stat-glow" />
                    </div>
                  ))}
                </div>

                <div className="kc-panels">
                  <div className="kc-panel">
                    <div className="kc-panel-title">Recent Activity</div>
                    <div className="kc-act-item"><span className="kc-act-dot" /><span className="kc-act-text">{stats.totalCrops} crops currently listed</span></div>
                    <div className="kc-act-item"><span className="kc-act-dot" style={{background:'#e9701a'}} /><span className="kc-act-text">{stats.pendingOrders} orders awaiting your action</span></div>
                    <div className="kc-act-item"><span className="kc-act-dot" style={{background:'#287ca8'}} /><span className="kc-act-text">₹{stats.totalProfit.toLocaleString()} earned so far</span></div>
                  </div>
                  <div className="kc-tip-panel">
                    <div className="kc-tip-lbl">Quick Tip</div>
                    <div className="kc-tip-txt">"Regularly update your crop prices and availability to attract more buyers and grow your earnings."</div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}