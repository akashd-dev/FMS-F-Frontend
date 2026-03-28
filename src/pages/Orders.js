import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const css = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
.kc-page { display:flex; background:#f7f5ef; min-height:100vh; font-family:'DM Sans',sans-serif; }
.kc-main { margin-left:260px; width:100%; }
.kc-content { padding:36px 40px; max-width:1100px; }
.kc-hero {
  position:relative; overflow:hidden;
  background:linear-gradient(130deg,#1a3a5c 0%,#2d5f8a 55%,#3d80af 100%);
  border-radius:22px; padding:36px 44px; margin-bottom:32px;
  box-shadow:0 10px 36px rgba(26,58,92,0.3);
}
.kc-hero::after { content:'📦'; position:absolute; right:40px; top:50%; transform:translateY(-50%); font-size:72px; opacity:0.15; user-select:none; }
.kc-hero-tag { display:inline-block; background:rgba(255,255,255,0.12); border:1px solid rgba(255,255,255,0.18); border-radius:20px; padding:4px 13px; font-size:11.5px; font-weight:500; color:rgba(255,255,255,0.8); letter-spacing:0.6px; margin-bottom:14px; }
.kc-hero h2 { font-family:'Playfair Display',serif; font-size:28px; font-weight:700; color:#fff; margin:0 0 8px; letter-spacing:-0.3px; }
.kc-hero p { color:rgba(255,255,255,0.6); font-size:14px; font-weight:300; margin:0; }
.kc-toolbar { display:flex; align-items:center; justify-content:space-between; margin-bottom:22px; }
.kc-orders-title { font-family:'Playfair Display',serif; font-size:22px; font-weight:600; color:#1b2e1f; }
.kc-refresh {
  padding:9px 18px; border-radius:12px; border:1.5px solid rgba(82,183,136,0.3);
  background:transparent; font-family:'DM Sans',sans-serif; font-size:13px; font-weight:500;
  color:#2d6a4f; cursor:pointer; transition:all 0.22s ease;
}
.kc-refresh:hover { background:rgba(82,183,136,0.08); border-color:rgba(82,183,136,0.5); transform:translateY(-2px); }
.kc-orders-list { display:flex; flex-direction:column; gap:16px; }
.kc-order-card {
  background:#fff; border-radius:18px; padding:24px 28px;
  box-shadow:0 3px 20px rgba(0,0,0,0.07); border:1px solid rgba(0,0,0,0.04);
  display:flex; justify-content:space-between; align-items:flex-start; gap:20px;
  transition:all 0.28s cubic-bezier(.34,1.56,.64,1);
  animation:kcFadeUp 0.4s ease both; animation-delay:var(--d);
}
@keyframes kcFadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
.kc-order-card:hover { transform:translateY(-4px); box-shadow:0 10px 32px rgba(0,0,0,0.12); }
.kc-order-left { flex:1; }
.kc-order-crop { font-family:'Playfair Display',serif; font-size:18px; font-weight:600; color:#1b2e1f; margin-bottom:10px; }
.kc-order-row { display:flex; align-items:center; gap:6px; font-size:14px; color:#5a6a5d; margin-bottom:6px; }
.kc-order-row strong { color:#2d3a2e; font-weight:500; }
.kc-order-price { font-family:'Playfair Display',serif; font-size:20px; font-weight:600; color:#1b4332; margin-top:10px; }
.kc-order-date { font-size:12px; color:#9aaa9d; margin-top:8px; }
.kc-badge {
  flex-shrink:0; padding:6px 14px; border-radius:20px;
  font-size:12px; font-weight:600; letter-spacing:0.5px; text-transform:uppercase;
}
.kc-badge.pending  { background:#fff3e0; color:#e65100; }
.kc-badge.confirmed{ background:#e8f5e9; color:#1b5e20; }
.kc-badge.delivered{ background:#e3f2fd; color:#0d47a1; }
.kc-badge.cancelled{ background:#fce4ec; color:#880e4f; }
.kc-loading { display:flex; flex-direction:column; align-items:center; padding:80px 0; gap:18px; }
.kc-spinner { width:40px; height:40px; border:3px solid rgba(82,183,136,0.2); border-top-color:#52b788; border-radius:50%; animation:kcSpin 0.8s linear infinite; }
@keyframes kcSpin { to{transform:rotate(360deg)} }
.kc-loading-txt { font-size:14px; color:#7a8a7d; font-weight:300; }
.kc-empty { text-align:center; padding:60px 40px; background:#fff; border-radius:20px; border:2px dashed #d8e8da; }
.kc-empty-icon { font-size:52px; margin-bottom:14px; }
.kc-empty-title { font-family:'Playfair Display',serif; font-size:20px; color:#4a5e4d; margin-bottom:8px; }
.kc-empty-sub { font-size:14px; color:#8a9a8d; font-weight:300; }
`;

const statusClass = (s) => {
  if (s === 'pending') return 'pending';
  if (s === 'confirmed') return 'confirmed';
  if (s === 'delivered') return 'delivered';
  return 'cancelled';
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/orders/farmer', { withCredentials:true });
      setOrders(res.data.orders || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  return (
    <>
      <style>{css}</style>
      <div className="kc-page">
        <Sidebar />
        <div className="kc-main">
          <Navbar />
          <div className="kc-content">

            <div className="kc-hero">
              <span className="kc-hero-tag">📦 Order Management</span>
              <h2>Orders from Buyers</h2>
              <p>Review and track every purchase made on your crops</p>
            </div>

            <div className="kc-toolbar">
              <span className="kc-orders-title">All Orders ({orders.length})</span>
              <button className="kc-refresh" onClick={fetchOrders}>↻ Refresh</button>
            </div>

            {loading ? (
              <div className="kc-loading">
                <div className="kc-spinner" />
                <span className="kc-loading-txt">Fetching orders…</span>
              </div>
            ) : orders.length === 0 ? (
              <div className="kc-empty">
                <div className="kc-empty-icon">📭</div>
                <div className="kc-empty-title">No orders yet</div>
                <div className="kc-empty-sub">When buyers purchase your crops, orders will appear here</div>
              </div>
            ) : (
              <div className="kc-orders-list">
                {orders.map((order, i) => (
                  <div className="kc-order-card" key={order._id} style={{'--d':`${i*0.05}s`}}>
                    <div className="kc-order-left">
                      <div className="kc-order-crop">{order.cropId?.name || 'Crop'}</div>
                      <div className="kc-order-row">👤 Buyer: <strong>{order.buyerId?.name || 'Unknown'}</strong></div>
                      <div className="kc-order-row">📦 Quantity: <strong>{order.quantity} kg</strong></div>
                      <div className="kc-order-price">₹{order.totalPrice?.toLocaleString()}</div>
                      <div className="kc-order-date">Ordered on {new Date(order.createdAt).toLocaleDateString('en-IN', { day:'numeric', month:'long', year:'numeric' })}</div>
                    </div>
                    <div className={`kc-badge ${statusClass(order.status)}`}>
                      {order.status}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}