import { useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const css = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
.kc-page { display:flex; background:#f7f5ef; min-height:100vh; font-family:'DM Sans',sans-serif; }
.kc-main { margin-left:260px; width:100%; }
.kc-content { padding:36px 40px; max-width:800px; }
.kc-hero {
  position:relative; overflow:hidden;
  background:linear-gradient(130deg,#1a3a5c 0%,#1e6091 55%,#2980b9 100%);
  border-radius:22px; padding:36px 44px; margin-bottom:36px;
  box-shadow:0 10px 36px rgba(26,58,92,0.32);
}
.kc-hero::after { content:'₹'; position:absolute; right:40px; top:50%; transform:translateY(-50%); font-size:80px; opacity:0.15; user-select:none; font-family:'Playfair Display',serif; }
.kc-hdr-tag { display:inline-block; background:rgba(255,255,255,0.12); border:1px solid rgba(255,255,255,0.18); border-radius:20px; padding:4px 13px; font-size:11.5px; font-weight:500; color:rgba(255,255,255,0.8); letter-spacing:0.6px; margin-bottom:14px; }
.kc-hero h2 { font-family:'Playfair Display',serif; font-size:28px; font-weight:700; color:#fff; margin:0 0 8px; }
.kc-hero p { color:rgba(255,255,255,0.6); font-size:14px; font-weight:300; margin:0; }
.kc-calc-card { background:#fff; border-radius:20px; padding:40px 44px; box-shadow:0 4px 24px rgba(0,0,0,0.07); border:1px solid rgba(0,0,0,0.04); }
.kc-calc-title { font-family:'Playfair Display',serif; font-size:20px; font-weight:600; color:#1b2e1f; margin-bottom:30px; }
.kc-field { display:flex; flex-direction:column; gap:7px; margin-bottom:20px; }
.kc-lbl { font-size:11.5px; font-weight:600; letter-spacing:0.7px; text-transform:uppercase; color:#5a7a60; }
.kc-inp {
  padding:14px 18px; border:1.5px solid #e0ddd4; border-radius:13px;
  font-family:'DM Sans',sans-serif; font-size:16px; color:#2d3a2e;
  background:#fdfcf9; outline:none; transition:all 0.22s ease;
}
.kc-inp:focus { border-color:#2980b9; background:#fff; box-shadow:0 0 0 4px rgba(41,128,185,0.1); }
.kc-inp::placeholder { color:#b5b0a3; font-weight:300; }
.kc-divider { height:1px; background:#f0ece2; margin:28px 0; }
.kc-result {
  border-radius:18px; padding:32px 36px; text-align:center;
  transition:all 0.4s ease;
}
.kc-result.profit { background:linear-gradient(135deg,#d8f3dc,#b7e4c7); }
.kc-result.loss   { background:linear-gradient(135deg,#ffe5e5,#ffcdd2); }
.kc-result.neutral{ background:#f7f5ef; }
.kc-result-label { font-size:12px; font-weight:600; letter-spacing:1px; text-transform:uppercase; color:#7a8a7d; margin-bottom:10px; }
.kc-result-amount { font-family:'Playfair Display',serif; font-size:48px; font-weight:700; line-height:1; margin-bottom:8px; }
.kc-result.profit .kc-result-amount { color:#1b4332; }
.kc-result.loss   .kc-result-amount { color:#9b2226; }
.kc-result.neutral .kc-result-amount { color:#7a8a7d; }
.kc-result-type { font-size:14px; font-weight:500; }
.kc-result.profit .kc-result-type { color:#2d6a4f; }
.kc-result.loss   .kc-result-type { color:#bf4342; }
.kc-result.neutral .kc-result-type { color:#9aaa9d; }
.kc-breakdown { margin-top:24px; display:grid; grid-template-columns:repeat(3,1fr); gap:14px; }
.kc-bk-item { background:rgba(255,255,255,0.6); border-radius:12px; padding:14px 16px; text-align:center; }
.kc-bk-label { font-size:11px; font-weight:600; letter-spacing:0.7px; text-transform:uppercase; color:#8a9a8d; margin-bottom:6px; }
.kc-bk-val { font-family:'Playfair Display',serif; font-size:20px; font-weight:600; color:#1b2e1f; }
`;

export default function ProfitCalculator() {
  const [cost, setCost] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');

  const hasValues = cost !== '' && price !== '' && quantity !== '';
  const profit = hasValues ? (Number(price) - Number(cost)) * Number(quantity) : 0;
  const resultClass = !hasValues ? 'neutral' : profit > 0 ? 'profit' : profit < 0 ? 'loss' : 'neutral';
  const resultLabel = !hasValues ? 'Enter values above' : profit > 0 ? '🎉 Profit' : profit < 0 ? '📉 Loss' : '⚖ Break Even';

  return (
    <>
      <style>{css}</style>
      <div className="kc-page">
        <Sidebar />
        <div className="kc-main">
          <Navbar />
          <div className="kc-content">

            <div className="kc-hero">
              <span className="kc-hdr-tag">📊 Tools</span>
              <h2>Profit Calculator</h2>
              <p>Estimate your earnings before selling your crops</p>
            </div>

            <div className="kc-calc-card">
              <div className="kc-calc-title">Enter Crop Details</div>

              <div className="kc-field">
                <label className="kc-lbl">Cost Price (₹ per kg)</label>
                <input type="number" className="kc-inp" placeholder="e.g. 20" value={cost} onChange={e=>setCost(e.target.value)} min="0" />
              </div>
              <div className="kc-field">
                <label className="kc-lbl">Selling Price (₹ per kg)</label>
                <input type="number" className="kc-inp" placeholder="e.g. 35" value={price} onChange={e=>setPrice(e.target.value)} min="0" />
              </div>
              <div className="kc-field">
                <label className="kc-lbl">Quantity (kg)</label>
                <input type="number" className="kc-inp" placeholder="e.g. 100" value={quantity} onChange={e=>setQuantity(e.target.value)} min="1" />
              </div>

              <div className="kc-divider" />

              <div className={`kc-result ${resultClass}`}>
                <div className="kc-result-label">Net Result</div>
                <div className="kc-result-amount">
                  {hasValues ? `₹${Math.abs(profit).toLocaleString('en-IN')}` : '—'}
                </div>
                <div className="kc-result-type">{resultLabel}</div>

                {hasValues && (
                  <div className="kc-breakdown">
                    <div className="kc-bk-item">
                      <div className="kc-bk-label">Total Cost</div>
                      <div className="kc-bk-val">₹{(Number(cost)*Number(quantity)).toLocaleString()}</div>
                    </div>
                    <div className="kc-bk-item">
                      <div className="kc-bk-label">Total Revenue</div>
                      <div className="kc-bk-val">₹{(Number(price)*Number(quantity)).toLocaleString()}</div>
                    </div>
                    <div className="kc-bk-item">
                      <div className="kc-bk-label">Per kg {profit >= 0 ? 'Profit' : 'Loss'}</div>
                      <div className="kc-bk-val">₹{Math.abs(Number(price)-Number(cost)).toFixed(2)}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}