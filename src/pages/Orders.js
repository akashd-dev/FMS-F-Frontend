import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/orders/farmer', {
        withCredentials: true
      });
      setOrders(res.data.orders || []);
    } catch (err) {
      console.error("Failed to fetch orders", err);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    setProcessingId(orderId);
    try {
      await axios.put(`http://localhost:5000/api/orders/${orderId}/status`, {
        status: newStatus
      }, { withCredentials: true });
      setOrders(prev => prev.map(order =>
        order._id === orderId ? { ...order, status: newStatus } : order
      ));
    } catch (err) {
      console.error(err);
      alert("Failed to update order status");
    } finally {
      setProcessingId(null);
    }
  };

  const statusConfig = {
    pending:   { label: 'Pending',   color: '#b45309', bg: '#fef3c7', dot: '#f59e0b' },
    confirmed: { label: 'Confirmed', color: '#065f46', bg: '#d1fae5', dot: '#10b981' },
    delivered: { label: 'Delivered', color: '#1e40af', bg: '#dbeafe', dot: '#3b82f6' },
    cancelled: { label: 'Cancelled', color: '#7f1d1d', bg: '#fee2e2', dot: '#ef4444' },
  };

  const getStatus = (s) => statusConfig[s] || { label: s, color: '#374151', bg: '#f3f4f6', dot: '#9ca3af' };

  const filteredOrders = filter === 'all' ? orders : orders.filter(o => o.status === filter);
  const counts = { all: orders.length, pending: 0, confirmed: 0, delivered: 0, cancelled: 0 };
  orders.forEach(o => { if (counts[o.status] !== undefined) counts[o.status]++; });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Syne:wght@400;500;600;700&display=swap');

        :root {
          --cream: #faf8f4;
          --ink: #1a1a18;
          --green-deep: #1b4332;
          --green-mid: #2d6a4f;
          --green-light: #52b788;
          --gold: #b5883e;
          --stone: #e8e4dc;
          --muted: #78726a;
          --card-bg: #ffffff;
          --border: #e2ddd6;
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .orders-root {
          background: var(--cream);
          min-height: 100vh;
          font-family: 'Syne', sans-serif;
          color: var(--ink);
        }

        .orders-wrap {
          margin-left: 260px;
          padding: 0 48px 64px;
        }

        /* ── Hero ── */
        .hero-band {
          position: relative;
          background: var(--green-deep);
          border-radius: 0 0 32px 32px;
          padding: 48px 48px 56px;
          margin: 0 0 0 -48px;
          width: calc(100% + 96px);
          overflow: hidden;
          margin-bottom: 40px;
        }

        .hero-band::before {
          content: '';
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 60% 80% at 90% 50%, rgba(82,183,136,0.18) 0%, transparent 70%),
            radial-gradient(ellipse 40% 60% at 10% 80%, rgba(181,136,62,0.12) 0%, transparent 60%);
        }

        .hero-label {
          font-family: 'Syne', sans-serif;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--green-light);
          margin-bottom: 10px;
          position: relative;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .hero-label::before {
          content: '';
          display: block;
          width: 28px;
          height: 1px;
          background: var(--green-light);
        }

        .hero-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 700;
          color: #ffffff;
          line-height: 1.1;
          position: relative;
        }

        .hero-title span {
          color: var(--green-light);
        }

        .hero-sub {
          font-size: 13.5px;
          color: rgba(255,255,255,0.5);
          margin-top: 8px;
          position: relative;
          font-weight: 400;
        }

        .hero-stats {
          position: absolute;
          right: 48px;
          top: 50%;
          transform: translateY(-50%);
          display: flex;
          gap: 32px;
        }

        .stat-item {
          text-align: center;
          position: relative;
        }

        .stat-item::before {
          content: '';
          position: absolute;
          left: -16px;
          top: 10%;
          height: 80%;
          width: 1px;
          background: rgba(255,255,255,0.1);
        }

        .stat-item:first-child::before { display: none; }

        .stat-num {
          font-family: 'Cormorant Garamond', serif;
          font-size: 2.4rem;
          font-weight: 700;
          color: #fff;
          line-height: 1;
        }

        .stat-lbl {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.4);
          margin-top: 4px;
        }

        /* ── Filter Tabs ── */
        .filter-row {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 28px;
        }

        .filter-tab {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 7px 16px;
          border-radius: 100px;
          border: 1.5px solid var(--border);
          background: transparent;
          font-family: 'Syne', sans-serif;
          font-size: 12.5px;
          font-weight: 600;
          color: var(--muted);
          cursor: pointer;
          transition: all 0.18s;
          letter-spacing: 0.02em;
        }

        .filter-tab:hover {
          border-color: var(--green-mid);
          color: var(--green-mid);
        }

        .filter-tab.active {
          background: var(--green-deep);
          border-color: var(--green-deep);
          color: #fff;
        }

        .tab-count {
          background: rgba(255,255,255,0.2);
          color: inherit;
          font-size: 10px;
          font-weight: 700;
          padding: 1px 7px;
          border-radius: 30px;
          line-height: 1.6;
        }

        .filter-tab:not(.active) .tab-count {
          background: var(--stone);
          color: var(--muted);
        }

        /* ── Order Cards ── */
        .orders-grid {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .order-card {
          background: var(--card-bg);
          border: 1.5px solid var(--border);
          border-radius: 20px;
          padding: 0;
          overflow: hidden;
          transition: all 0.22s cubic-bezier(0.4,0,0.2,1);
          animation: slideUp 0.35s ease both;
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .order-card:hover {
          border-color: var(--green-light);
          box-shadow: 0 8px 40px rgba(45,106,79,0.1);
          transform: translateY(-2px);
        }

        .card-accent {
          height: 3px;
          background: linear-gradient(90deg, var(--green-deep), var(--green-light));
        }

        .card-body {
          padding: 24px 28px;
        }

        .card-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 16px;
        }

        .crop-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.45rem;
          font-weight: 700;
          color: var(--ink);
          line-height: 1.2;
          margin-bottom: 12px;
        }

        .meta-row {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
          align-items: center;
        }

        .meta-chip {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 12.5px;
          font-weight: 500;
          color: var(--muted);
        }

        .meta-chip svg {
          opacity: 0.6;
        }

        .meta-chip strong {
          color: var(--ink);
          font-weight: 600;
        }

        .meta-sep {
          width: 3px;
          height: 3px;
          border-radius: 50%;
          background: var(--border);
        }

        .price-tag {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.6rem;
          font-weight: 700;
          color: var(--green-deep);
          letter-spacing: -0.01em;
          line-height: 1;
        }

        .price-sub {
          font-family: 'Syne', sans-serif;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--muted);
          margin-top: 3px;
        }

        .right-col {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 8px;
          flex-shrink: 0;
        }

        .status-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 5px 12px;
          border-radius: 100px;
          font-size: 11.5px;
          font-weight: 700;
          letter-spacing: 0.04em;
        }

        .status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
        }

        .date-lbl {
          font-size: 11px;
          color: var(--muted);
          font-weight: 500;
          letter-spacing: 0.04em;
        }

        /* ── Divider ── */
        .card-divider {
          height: 1px;
          background: var(--border);
          margin: 0 28px;
        }

        /* ── Actions ── */
        .card-actions {
          padding: 16px 28px 20px;
          display: flex;
          gap: 10px;
        }

        .btn-accept, .btn-reject {
          flex: 1;
          padding: 11px 20px;
          border-radius: 12px;
          border: none;
          font-family: 'Syne', sans-serif;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.18s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          letter-spacing: 0.03em;
        }

        .btn-accept {
          background: var(--green-deep);
          color: #fff;
        }

        .btn-accept:hover:not(:disabled) {
          background: var(--green-mid);
          transform: translateY(-1px);
          box-shadow: 0 4px 20px rgba(27,67,50,0.3);
        }

        .btn-reject {
          background: #fff1f2;
          color: #be123c;
          border: 1.5px solid #fecdd3;
        }

        .btn-reject:hover:not(:disabled) {
          background: #ffe4e6;
          border-color: #fda4af;
          transform: translateY(-1px);
        }

        .btn-accept:disabled, .btn-reject:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* ── Confirmed Banner ── */
        .confirmed-banner {
          margin: 0 28px 16px;
          padding: 10px 16px;
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 600;
          color: #166534;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        /* ── Empty / Loading ── */
        .state-box {
          background: var(--card-bg);
          border: 1.5px solid var(--border);
          border-radius: 24px;
          padding: 80px 40px;
          text-align: center;
        }

        .state-icon {
          width: 64px;
          height: 64px;
          background: var(--stone);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
          font-size: 26px;
        }

        .state-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--ink);
          margin-bottom: 8px;
        }

        .state-sub {
          font-size: 13.5px;
          color: var(--muted);
          max-width: 320px;
          margin: 0 auto;
          line-height: 1.6;
        }

        /* ── Spinner ── */
        .spin-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 14px;
          padding: 80px 0;
        }

        .spin-ring {
          width: 40px;
          height: 40px;
          border: 3px solid var(--stone);
          border-top-color: var(--green-mid);
          border-radius: 50%;
          animation: spin 0.75s linear infinite;
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        .spin-label {
          font-size: 13px;
          color: var(--muted);
          font-weight: 500;
          letter-spacing: 0.05em;
        }

        @media (max-width: 900px) {
          .orders-wrap { margin-left: 0; padding: 0 20px 48px; }
          .hero-band { margin-left: -20px; width: calc(100% + 40px); padding: 36px 24px 44px; }
          .hero-stats { position: static; transform: none; margin-top: 28px; }
        }
      `}</style>

      <div className="orders-root">
        <Sidebar />
        <div className="orders-wrap">
          <Navbar />

          {/* Hero */}
          <div className="hero-band">
            <div className="hero-label">Farm Dashboard</div>
            <h1 className="hero-title">Incoming <span>Orders</span></h1>
            <p className="hero-sub">Review and manage purchase requests from buyers</p>
            <div className="hero-stats">
              {[
                { num: counts.all,       lbl: 'Total'     },
                { num: counts.pending,   lbl: 'Pending'   },
                { num: counts.confirmed, lbl: 'Confirmed' },
                { num: counts.delivered, lbl: 'Delivered' },
              ].map(s => (
                <div key={s.lbl} className="stat-item">
                  <div className="stat-num">{s.num}</div>
                  <div className="stat-lbl">{s.lbl}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="filter-row">
            {['all', 'pending', 'confirmed', 'delivered', 'cancelled'].map(f => (
              <button
                key={f}
                className={`filter-tab ${filter === f ? 'active' : ''}`}
                onClick={() => setFilter(f)}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
                <span className="tab-count">{counts[f] ?? orders.filter(o => o.status === f).length}</span>
              </button>
            ))}
          </div>

          {/* Content */}
          {loading ? (
            <div className="spin-wrap">
              <div className="spin-ring" />
              <span className="spin-label">Loading your orders…</span>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="state-box">
              <div className="state-icon">🌾</div>
              <div className="state-title">No orders here</div>
              <p className="state-sub">
                {filter === 'all'
                  ? 'When buyers place orders on your crops, they will appear here.'
                  : `No ${filter} orders at the moment.`}
              </p>
            </div>
          ) : (
            <div className="orders-grid">
              {filteredOrders.map((order, i) => {
                const st = getStatus(order.status);
                return (
                  <div
                    key={order._id}
                    className="order-card"
                    style={{ animationDelay: `${i * 0.06}s` }}
                  >
                    <div className="card-accent" />
                    <div className="card-body">
                      <div className="card-top">
                        <div style={{ flex: 1 }}>
                          <div className="crop-name">{order.cropId?.name || 'Unknown Crop'}</div>
                          <div className="meta-row">
                            <span className="meta-chip">
                              {/* Person icon for buyer name */}
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                              <strong>{order.buyerId?.name || 'Unknown Buyer'}</strong>
                            </span>
                            <span className="meta-sep" />
                            <span className="meta-chip">
                              {/* Location pin icon for buyer location */}
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                              <strong>{order.buyerId?.location || 'N/A'}</strong>
                            </span>
                            <span className="meta-chip">
                              {/* Phone icon for buyer phone */}
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.6 3.35 2 2 0 0 1 3.57 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.54a16 16 0 0 0 6.29 6.29l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                              <strong>{order.buyerId?.phone || 'N/A'}</strong>
                            </span>
                            <span className="meta-sep" />
                            <span className="meta-chip">
                              {/* Package / weight icon for quantity */}
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
                              {order.quantity} kg
                            </span>
                            <span className="meta-sep" />
                            <span className="meta-chip">
                              {/* Calendar icon for date */}
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                              {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </span>
                          </div>
                        </div>

                        <div className="right-col">
                          <div
                            className="status-pill"
                            style={{ background: st.bg, color: st.color }}
                          >
                            <span className="status-dot" style={{ background: st.dot }} />
                            {st.label}
                          </div>
                          <div className="price-tag">₹{order.totalPrice}</div>
                          <div className="price-sub">Total Amount</div>
                        </div>
                      </div>
                    </div>

                    {order.status === 'confirmed' && (
                      <>
                        <div className="card-divider" />
                        <div className="confirmed-banner">
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                          Order confirmed — please prepare for delivery.
                        </div>
                      </>
                    )}

                    {order.status === 'pending' && (
                      <>
                        <div className="card-divider" />
                        <div className="card-actions">
                          <button
                            className="btn-accept"
                            onClick={() => updateOrderStatus(order._id, 'confirmed')}
                            disabled={processingId === order._id}
                          >
                            {processingId === order._id ? (
                              <><span className="spin-ring" style={{ width: 14, height: 14, borderWidth: 2 }} /> Processing…</>
                            ) : (
                              <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg> Accept Order</>
                            )}
                          </button>
                          <button
                            className="btn-reject"
                            onClick={() => updateOrderStatus(order._id, 'cancelled')}
                            disabled={processingId === order._id}
                          >
                            {processingId === order._id ? 'Processing…' : (
                              <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg> Reject</>
                            )}
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}