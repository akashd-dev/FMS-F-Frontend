import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

/* ─── animated counter hook ─────────────────────────────────────────────── */
function useCountUp(target, duration = 1200) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!target) return setValue(0);
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(ease * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration]);
  return value;
}

/* ─── ring progress component ───────────────────────────────────────────── */
function Ring({ pct, color, size = 80, stroke = 7 }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const dash = circ * Math.min(pct / 100, 1);
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke="rgba(255,255,255,0.07)" strokeWidth={stroke} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke={color} strokeWidth={stroke}
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
        style={{ transition: 'stroke-dasharray 1.2s cubic-bezier(0.16,1,0.3,1)' }} />
    </svg>
  );
}

/* ─── main component ─────────────────────────────────────────────────────── */
export default function ProfitCalculator() {
  const [todayOrders, setTodayOrders] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState('');

  useEffect(() => { fetchTodayOrders(); }, []);

  const fetchTodayOrders = async () => {
    try {
      setLoading(true);
      const res    = await axios.get('http://localhost:5000/api/orders/farmer', { withCredentials: true });
      const orders = res.data.orders || [];
      const today  = new Date().toISOString().split('T')[0];
      setTodayOrders(
        orders.filter(o => {
          const d = new Date(o.createdAt).toISOString().split('T')[0];
          return d === today && (o.status === 'confirmed' || o.status === 'delivered');
        })
      );
    } catch (err) {
      console.error(err);
      setError("Failed to load today's orders");
    } finally {
      setLoading(false);
    }
  };

  const totalRevenue  = todayOrders.reduce((s, o) => s + o.totalPrice, 0);
  const totalQuantity = todayOrders.reduce((s, o) => s + o.quantity,   0);
  const estimatedCost = Math.round(totalRevenue * 0.6);
  const netProfit     = totalRevenue - estimatedCost;
  const profitPct     = totalRevenue ? Math.round((netProfit / totalRevenue) * 100) : 0;

  const animRevenue   = useCountUp(totalRevenue);
  const animProfit    = useCountUp(netProfit);
  const animCost      = useCountUp(estimatedCost);
  const animQty       = useCountUp(totalQuantity);

  const fmt = n => '₹' + n.toLocaleString('en-IN');

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,600;1,9..144,300&family=Outfit:wght@300;400;500;600&display=swap');

        /* ── base ── */
        .pp { background: #ebf5ed; min-height: 100vh; font-family: 'Outfit', sans-serif; color: #e8f0e9; }
        .pp-wrap { margin-left: 260px; padding: 36px 40px; }

        /* ── header band ── */
        .pp-header {
          position: relative;
          overflow: hidden;
          border-radius: 20px;
          background: linear-gradient(135deg, #14351a 0%, #1e4d26 50%, #163d1d 100%);
          border: 1px solid rgba(74,183,90,0.18);
          padding: 32px 36px;
          margin-bottom: 28px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .pp-header::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse 60% 80% at 80% 50%, rgba(74,183,90,0.08) 0%, transparent 70%);
          pointer-events: none;
        }
        .pp-header-text h1 {
          font-family: 'Fraunces', serif;
          font-size: 28px;
          font-weight: 600;
          color: #c8f0ca;
          letter-spacing: -0.3px;
          margin: 0 0 6px;
        }
        .pp-header-text p {
          font-size: 14px;
          color: rgba(200,240,202,0.55);
          margin: 0;
          font-weight: 300;
        }
        .pp-header-date {
          text-align: right;
          font-size: 13px;
          color: rgba(200,240,202,0.45);
          font-weight: 300;
        }
        .pp-header-date strong {
          display: block;
          font-family: 'Fraunces', serif;
          font-size: 20px;
          color: #a8dba9;
          font-weight: 300;
          margin-top: 2px;
        }

        /* ── profit hero ── */
        .pp-hero {
          display: grid;
          grid-template-columns: 1fr 200px;
          gap: 20px;
          margin-bottom: 20px;
        }
        .pp-net {
          background: linear-gradient(145deg, #112916 0%, #1a3d20 100%);
          border: 1px solid rgba(74,183,90,0.2);
          border-radius: 18px;
          padding: 28px 32px;
          display: flex;
          align-items: center;
          gap: 28px;
        }
        .pp-net-ring { flex-shrink: 0; position: relative; }
        .pp-net-ring-pct {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          font-weight: 500;
          color: #6fcf72;
        }
        .pp-net-info { flex: 1; }
        .pp-net-label {
          font-size: 12px;
          font-weight: 500;
          color: rgba(200,240,202,0.45);
          letter-spacing: 1.2px;
          text-transform: uppercase;
          margin-bottom: 8px;
        }
        .pp-net-amount {
          font-family: 'Fraunces', serif;
          font-size: 48px;
          font-weight: 600;
          color: #7de87f;
          line-height: 1;
          letter-spacing: -1px;
        }
        .pp-net-amount.loss { color: #f28b82; }
        .pp-net-sub {
          font-size: 13px;
          color: rgba(200,240,202,0.4);
          margin-top: 8px;
          font-weight: 300;
        }

        .pp-orders-count {
          background: linear-gradient(145deg, #1a2e1c 0%, #223d25 100%);
          border: 1px solid rgba(74,183,90,0.15);
          border-radius: 18px;
          padding: 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
        }
        .pp-orders-count .oc-num {
          font-family: 'Fraunces', serif;
          font-size: 52px;
          font-weight: 300;
          color: #a3d9a5;
          line-height: 1;
        }
        .pp-orders-count .oc-label {
          font-size: 12px;
          color: rgba(200,240,202,0.4);
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-top: 8px;
          font-weight: 500;
        }

        /* ── stats row ── */
        .pp-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
          margin-bottom: 28px;
        }
        .pp-stat {
          background: #111f13;
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 14px;
          padding: 20px 22px;
          position: relative;
          overflow: hidden;
          transition: border-color 0.2s, transform 0.2s;
          cursor: default;
        }
        .pp-stat:hover {
          border-color: rgba(74,183,90,0.3);
          transform: translateY(-2px);
        }
        .pp-stat::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 2px;
          border-radius: 0 0 14px 14px;
        }
        .pp-stat.s-revenue::after { background: linear-gradient(90deg, #4ab756, transparent); }
        .pp-stat.s-cost::after    { background: linear-gradient(90deg, #f0a500, transparent); }
        .pp-stat.s-qty::after     { background: linear-gradient(90deg, #4ab8c8, transparent); }
        .pp-stat-icon {
          font-size: 18px;
          margin-bottom: 12px;
          display: block;
        }
        .pp-stat-label {
          font-size: 11px;
          color: rgba(200,240,202,0.35);
          text-transform: uppercase;
          letter-spacing: 1px;
          font-weight: 500;
          margin-bottom: 6px;
        }
        .pp-stat-value {
          font-family: 'Fraunces', serif;
          font-size: 28px;
          font-weight: 300;
          letter-spacing: -0.5px;
        }
        .pp-stat.s-revenue .pp-stat-value { color: #7de87f; }
        .pp-stat.s-cost    .pp-stat-value { color: #f6c850; }
        .pp-stat.s-qty     .pp-stat-value { color: #6ecfdc; }
        .pp-stat-note {
          font-size: 11px;
          color: rgba(200,240,202,0.3);
          margin-top: 4px;
          font-weight: 300;
        }

        /* ── table ── */
        .pp-table-wrap {
          background: #111f13;
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 18px;
          overflow: hidden;
        }
        .pp-table-head {
          padding: 18px 24px 14px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .pp-table-head h5 {
          font-size: 15px;
          font-weight: 500;
          color: #c8f0ca;
          margin: 0;
        }
        .pp-table-head span {
          font-size: 12px;
          color: rgba(200,240,202,0.35);
          background: rgba(74,183,90,0.08);
          border: 1px solid rgba(74,183,90,0.15);
          padding: 3px 10px;
          border-radius: 20px;
        }
        .pp-table { width: 100%; border-collapse: collapse; }
        .pp-table thead tr { background: rgba(74,183,90,0.04); }
        .pp-table thead th {
          padding: 10px 22px;
          font-size: 11px;
          font-weight: 500;
          color: rgba(200,240,202,0.35);
          text-align: left;
          text-transform: uppercase;
          letter-spacing: 1px;
          white-space: nowrap;
        }
        .pp-table thead th:last-child { text-align: right; }
        .pp-table tbody tr {
          border-top: 1px solid rgba(255,255,255,0.04);
          transition: background 0.15s;
        }
        .pp-table tbody tr:hover { background: rgba(74,183,90,0.05); }
        .pp-table tbody td {
          padding: 14px 22px;
          font-size: 13px;
          color: rgba(232,240,233,0.75);
          vertical-align: middle;
        }
        .pp-table tbody td:last-child { text-align: right; }
        .td-id {
          font-family: 'Outfit', monospace;
          font-size: 12px;
          color: rgba(200,240,202,0.35) !important;
          letter-spacing: 0.5px;
        }
        .td-crop { color: #d4f0d5 !important; font-weight: 500; }
        .td-revenue {
          font-family: 'Fraunces', serif;
          font-size: 15px !important;
          color: #7de87f !important;
          font-weight: 300;
        }
        .badge-status {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 3px 10px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.3px;
        }
        .badge-confirmed {
          background: rgba(240,165,0,0.12);
          border: 1px solid rgba(240,165,0,0.25);
          color: #f6c850;
        }
        .badge-delivered {
          background: rgba(74,183,90,0.12);
          border: 1px solid rgba(74,183,90,0.25);
          color: #7de87f;
        }
        .badge-dot {
          width: 5px; height: 5px;
          border-radius: 50%;
          display: inline-block;
        }
        .badge-confirmed .badge-dot { background: #f6c850; }
        .badge-delivered .badge-dot { background: #7de87f; }

        /* ── states ── */
        .pp-loading {
          display: flex; flex-direction: column; align-items: center;
          justify-content: center; padding: 80px 0; gap: 16px;
        }
        .pp-spinner {
          width: 36px; height: 36px;
          border: 2px solid rgba(74,183,90,0.15);
          border-top-color: #4ab756;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .pp-loading p { font-size: 14px; color: rgba(200,240,202,0.35); font-weight: 300; }
        .pp-empty {
          display: flex; flex-direction: column; align-items: center;
          justify-content: center; padding: 64px 24px; text-align: center;
        }
        .pp-empty-icon {
          font-size: 40px; margin-bottom: 16px;
          opacity: 0.4;
        }
        .pp-empty h5 { font-size: 16px; color: rgba(200,240,202,0.55); margin-bottom: 8px; font-weight: 400; }
        .pp-empty p  { font-size: 13px; color: rgba(200,240,202,0.25); font-weight: 300; }
        .pp-error {
          background: rgba(242,139,130,0.08);
          border: 1px solid rgba(242,139,130,0.2);
          border-radius: 12px;
          padding: 14px 18px;
          color: #f28b82;
          font-size: 13px;
          margin-bottom: 20px;
        }

        /* ── reveal animation ── */
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .pp-hero      { animation: fadeUp 0.5s ease both; }
        .pp-stats     { animation: fadeUp 0.5s 0.1s ease both; }
        .pp-table-wrap{ animation: fadeUp 0.5s 0.2s ease both; }
      `}</style>

      <div className="pp">
        <Sidebar />
        <div className="pp-wrap">
          <Navbar />

          {/* ── header ── */}
          <div className="pp-header">
            <div className="pp-header-text">
              <h1>Today's Profit Summary</h1>
              <p>Based on confirmed &amp; delivered orders only</p>
            </div>
            <div className="pp-header-date">
              Today
              <strong>{new Date().toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}</strong>
            </div>
          </div>

          {loading ? (
            <div className="pp-loading">
              <div className="pp-spinner" />
              <p>Loading today's orders…</p>
            </div>
          ) : error ? (
            <div className="pp-error">⚠ {error}</div>
          ) : todayOrders.length === 0 ? (
            <div className="pp-table-wrap">
              <div className="pp-empty">
                <div className="pp-empty-icon">🌾</div>
                <h5>No accepted orders today</h5>
                <p>Confirmed and delivered orders will appear here with profit breakdown.</p>
              </div>
            </div>
          ) : (
            <>
              {/* ── net profit + order count ── */}
              <div className="pp-hero">
                <div className="pp-net">
                  <div className="pp-net-ring">
                    <Ring pct={profitPct} color="#4ab756" size={88} stroke={7} />
                    <div className="pp-net-ring-pct">{profitPct}%</div>
                  </div>
                  <div className="pp-net-info">
                    <div className="pp-net-label">Net Profit Today</div>
                    <div className={`pp-net-amount${netProfit < 0 ? ' loss' : ''}`}>
                      {fmt(animProfit)}
                    </div>
                    <div className="pp-net-sub">
                      {profitPct}% margin · {todayOrders.length} orders processed
                    </div>
                  </div>
                </div>

                <div className="pp-orders-count">
                  <div className="oc-num">{todayOrders.length}</div>
                  <div className="oc-label">Orders today</div>
                </div>
              </div>

              {/* ── stat cards ── */}
              <div className="pp-stats">
                <div className="pp-stat s-revenue">
                  <span className="pp-stat-icon">💹</span>
                  <div className="pp-stat-label">Total Revenue</div>
                  <div className="pp-stat-value">{fmt(animRevenue)}</div>
                  <div className="pp-stat-note">Gross from all orders</div>
                </div>
                <div className="pp-stat s-cost">
                  <span className="pp-stat-icon">📦</span>
                  <div className="pp-stat-label">Estimated Cost</div>
                  <div className="pp-stat-value">{fmt(animCost)}</div>
                  <div className="pp-stat-note">Approx 60% of revenue</div>
                </div>
                <div className="pp-stat s-qty">
                  <span className="pp-stat-icon">⚖️</span>
                  <div className="pp-stat-label">Total Quantity</div>
                  <div className="pp-stat-value">{animQty} kg</div>
                  <div className="pp-stat-note">Across all crops</div>
                </div>
              </div>

              {/* ── orders table ── */}
              <div className="pp-table-wrap">
                <div className="pp-table-head">
                  <h5>Order Breakdown</h5>
                  <span>{todayOrders.length} entries</span>
                </div>
                <table className="pp-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Crop</th>
                      <th>Buyer</th>
                      <th>Qty</th>
                      <th>Status</th>
                      <th>Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {todayOrders.map(order => (
                      <tr key={order._id}>
                        <td className="td-id">#{order._id.slice(-6).toUpperCase()}</td>
                        <td className="td-crop">{order.cropId?.name || '—'}</td>
                        <td>{order.buyerId?.name || '—'}</td>
                        <td>{order.quantity} kg</td>
                        <td>
                          <span className={`badge-status badge-${order.status}`}>
                            <span className="badge-dot" />
                            {order.status}
                          </span>
                        </td>
                        <td className="td-revenue">{fmt(order.totalPrice)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}