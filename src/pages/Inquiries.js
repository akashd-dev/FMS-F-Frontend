import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const css = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
.kc-page { display:flex; background:#f7f5ef; min-height:100vh; font-family:'DM Sans',sans-serif; }
.kc-main { margin-left:260px; width:100%; }
.kc-content { padding:36px 40px; max-width:1000px; }
.kc-hero {
  position:relative; overflow:hidden;
  background:linear-gradient(130deg,#4a1942 0%,#7b3a72 55%,#9c5490 100%);
  border-radius:22px; padding:36px 44px; margin-bottom:32px;
  box-shadow:0 10px 36px rgba(74,25,66,0.3);
}
.kc-hero::after { content:'✉'; position:absolute; right:44px; top:50%; transform:translateY(-50%); font-size:72px; opacity:0.15; user-select:none; }
.kc-hdr-tag { display:inline-block; background:rgba(255,255,255,0.12); border:1px solid rgba(255,255,255,0.18); border-radius:20px; padding:4px 13px; font-size:11.5px; font-weight:500; color:rgba(255,255,255,0.8); letter-spacing:0.6px; margin-bottom:14px; }
.kc-hero h2 { font-family:'Playfair Display',serif; font-size:28px; font-weight:700; color:#fff; margin:0 0 8px; }
.kc-hero p { color:rgba(255,255,255,0.6); font-size:14px; font-weight:300; margin:0; }
.kc-toolbar { display:flex; align-items:center; justify-content:space-between; margin-bottom:22px; }
.kc-title { font-family:'Playfair Display',serif; font-size:22px; font-weight:600; color:#1b2e1f; }
.kc-refresh { padding:9px 18px; border-radius:12px; border:1.5px solid rgba(155,84,144,0.3); background:transparent; font-family:'DM Sans',sans-serif; font-size:13px; font-weight:500; color:#7b3a72; cursor:pointer; transition:all 0.22s ease; }
.kc-refresh:hover { background:rgba(155,84,144,0.07); border-color:rgba(155,84,144,0.5); transform:translateY(-2px); }
.kc-inq-list { display:flex; flex-direction:column; gap:18px; }
.kc-inq-card {
  background:#fff; border-radius:18px; overflow:hidden;
  box-shadow:0 3px 20px rgba(0,0,0,0.07); border:1px solid rgba(0,0,0,0.04);
  transition:all 0.28s cubic-bezier(.34,1.56,.64,1);
  animation:kcFadeUp 0.4s ease both; animation-delay:var(--d);
}
@keyframes kcFadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
.kc-inq-card:hover { transform:translateY(-4px); box-shadow:0 10px 32px rgba(0,0,0,0.12); }
.kc-inq-head {
  display:flex; align-items:center; justify-content:space-between;
  padding:16px 24px; background:#faf9f7; border-bottom:1px solid #f0ece2;
}
.kc-inq-crop { font-family:'Playfair Display',serif; font-size:16px; font-weight:600; color:#1b2e1f; }
.kc-badge { padding:4px 12px; border-radius:20px; font-size:11.5px; font-weight:600; letter-spacing:0.4px; text-transform:uppercase; }
.kc-badge.pending  { background:#fff3e0; color:#e65100; }
.kc-badge.replied  { background:#e8f5e9; color:#1b5e20; }
.kc-inq-body { padding:20px 24px; }
.kc-inq-buyer { font-size:13px; color:#7a8a7d; margin-bottom:12px; display:flex; align-items:center; gap:6px; }
.kc-inq-buyer strong { color:#2d3a2e; font-weight:500; }
.kc-inq-msg { font-size:15px; color:#3a4a3d; line-height:1.65; font-style:italic; padding-left:14px; border-left:3px solid #d8f3dc; margin-bottom:18px; }
.kc-replies { margin-bottom:18px; }
.kc-replies-title { font-size:12px; font-weight:600; letter-spacing:0.7px; text-transform:uppercase; color:#8a9a8d; margin-bottom:10px; }
.kc-reply-item { background:#f7f5ef; border-radius:10px; padding:12px 16px; margin-bottom:8px; }
.kc-reply-date { font-size:11.5px; color:#aab5ad; margin-bottom:4px; }
.kc-reply-msg { font-size:14px; color:#4a5a4d; }
.kc-reply-btn {
  padding:10px 22px; border-radius:12px;
  background:linear-gradient(135deg,#7b3a72,#4a1942);
  color:#fff; border:none; font-family:'DM Sans',sans-serif;
  font-size:14px; font-weight:500; cursor:pointer; letter-spacing:0.2px;
  box-shadow:0 4px 16px rgba(74,25,66,0.28);
  transition:all 0.28s cubic-bezier(.34,1.56,.64,1);
}
.kc-reply-btn:hover { transform:translateY(-2px); box-shadow:0 7px 22px rgba(74,25,66,0.42); }
.kc-reply-btn:active { transform:scale(0.97); }
.kc-loading { display:flex; flex-direction:column; align-items:center; padding:80px 0; gap:18px; }
.kc-spinner { width:40px; height:40px; border:3px solid rgba(155,84,144,0.2); border-top-color:#9c5490; border-radius:50%; animation:kcSpin 0.8s linear infinite; }
@keyframes kcSpin { to{transform:rotate(360deg)} }
.kc-loading-txt { font-size:14px; color:#7a8a7d; font-weight:300; }
.kc-err { background:#fff0f0; border:1px solid #fbc4c4; color:#9b2226; border-radius:14px; padding:16px 22px; font-size:14px; margin-bottom:24px; }
.kc-empty { text-align:center; padding:60px 40px; background:#fff; border-radius:20px; border:2px dashed #e8d8ea; }
.kc-empty-icon { font-size:52px; margin-bottom:14px; }
.kc-empty-title { font-family:'Playfair Display',serif; font-size:20px; color:#5e4a60; margin-bottom:8px; }
.kc-empty-sub { font-size:14px; color:#9a8a9d; font-weight:300; }
`;

export default function Inquiries() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [replyInputs, setReplyInputs] = useState({});

  useEffect(() => { fetchInquiries(); }, []);

  const fetchInquiries = async () => {
    try {
      setLoading(true); setError('');
      const res = await axios.get('http://localhost:5000/api/inquiries/farmer', { withCredentials:true });
      if (res.data.success) setInquiries(res.data.inquiries || []);
      else setError(res.data.message || 'Failed to load inquiries');
    } catch { setError('Could not load inquiries. Please check if you are logged in.'); }
    finally { setLoading(false); }
  };

  const sendReply = async (inquiryId) => {
    const msg = replyInputs[inquiryId]?.trim();
    if (!msg) return;
    try {
      const res = await axios.post('http://localhost:5000/api/inquiries/reply', { inquiryId, message: msg }, { withCredentials:true });
      if (res.data.success) {
        setReplyInputs(prev => ({ ...prev, [inquiryId]: '' }));
        fetchInquiries();
      }
    } catch { alert('Failed to send reply'); }
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
              <span className="kc-hdr-tag">📥 Inquiries</span>
              <h2>Buyer Inquiries</h2>
              <p>Questions and messages from buyers about your crops</p>
            </div>

            <div className="kc-toolbar">
              <span className="kc-title">All Inquiries ({inquiries.length})</span>
              <button className="kc-refresh" onClick={fetchInquiries}>↻ Refresh</button>
            </div>

            {error && <div className="kc-err">⚠ {error}</div>}

            {loading ? (
              <div className="kc-loading">
                <div className="kc-spinner" />
                <span className="kc-loading-txt">Loading inquiries…</span>
              </div>
            ) : inquiries.length === 0 && !error ? (
              <div className="kc-empty">
                <div className="kc-empty-icon">📬</div>
                <div className="kc-empty-title">No inquiries yet</div>
                <div className="kc-empty-sub">When buyers ask about your crops, their messages will appear here</div>
              </div>
            ) : (
              <div className="kc-inq-list">
                {inquiries.map((inq, i) => (
                  <div className="kc-inq-card" key={inq._id} style={{'--d':`${i*0.06}s`}}>
                    <div className="kc-inq-head">
                      <span className="kc-inq-crop">🌱 {inq.cropId?.name || 'Unknown Crop'}</span>
                      <span className={`kc-badge ${inq.status}`}>{inq.status}</span>
                    </div>
                    <div className="kc-inq-body">
                      <div className="kc-inq-buyer">👤 Buyer: <strong>{inq.buyerId?.name || 'Unknown'}</strong></div>
                      <div className="kc-inq-msg">"{inq.message}"</div>

                      {inq.replies?.length > 0 && (
                        <div className="kc-replies">
                          <div className="kc-replies-title">Your Replies</div>
                          {inq.replies.map((reply, j) => (
                            <div key={j} className="kc-reply-item">
                              <div className="kc-reply-date">{new Date(reply.createdAt).toLocaleString('en-IN')}</div>
                              <div className="kc-reply-msg">{reply.message}</div>
                            </div>
                          ))}
                        </div>
                      )}

                      <div style={{ display:'flex', gap:'10px' }}>
                        <input
                          type="text"
                          placeholder="Type your reply…"
                          value={replyInputs[inq._id] || ''}
                          onChange={e => setReplyInputs(prev => ({ ...prev, [inq._id]: e.target.value }))}
                          onKeyDown={e => e.key === 'Enter' && sendReply(inq._id)}
                          style={{
                            flex:1, padding:'10px 16px', border:'1.5px solid #e0ddd4',
                            borderRadius:'12px', fontFamily:'DM Sans,sans-serif',
                            fontSize:'14px', outline:'none', background:'#fdfcf9',
                            transition:'border-color 0.2s',
                          }}
                          onFocus={e => e.target.style.borderColor = '#9c5490'}
                          onBlur={e => e.target.style.borderColor = '#e0ddd4'}
                        />
                        <button className="kc-reply-btn" onClick={() => sendReply(inq._id)}>
                          Send ↗
                        </button>
                      </div>
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