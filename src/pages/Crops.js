import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const css = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
.kc-page { display:flex; background:#f7f5ef; min-height:100vh; font-family:'DM Sans',sans-serif; }
.kc-main { margin-left:260px; width:100%; }
.kc-content { padding:36px 40px; max-width:1200px; }

.kc-crops-header {
  position:relative; overflow:hidden;
  background:linear-gradient(130deg,#1b4332 0%,#2d6a4f 55%,#52b788 100%);
  border-radius:22px; padding:36px 44px; margin-bottom:30px;
  box-shadow:0 10px 36px rgba(27,67,50,0.3);
}
.kc-crops-header::after {
  content:'🌱'; position:absolute; right:40px; top:50%; transform:translateY(-50%);
  font-size:72px; opacity:0.15; user-select:none;
}
.kc-hdr-tag {
  display:inline-block;
  background:rgba(255,255,255,0.12); border:1px solid rgba(255,255,255,0.18);
  border-radius:20px; padding:4px 13px;
  font-size:11.5px; font-weight:500; color:rgba(255,255,255,0.8);
  letter-spacing:0.6px; margin-bottom:14px;
}
.kc-crops-header h2 {
  font-family:'Playfair Display',serif; font-size:28px; font-weight:700;
  color:#fff; margin:0 0 8px; letter-spacing:-0.3px;
}
.kc-crops-header p { color:rgba(255,255,255,0.6); font-size:14px; font-weight:300; margin:0; }

.kc-toast {
  display:flex; align-items:center; gap:10px;
  padding:14px 20px; border-radius:14px; font-size:14px; font-weight:500;
  margin-bottom:24px; animation:kcSlideD 0.3s ease;
}
@keyframes kcSlideD { from{opacity:0;transform:translateY(-10px)} to{opacity:1;transform:translateY(0)} }
.kc-toast.success { background:#d8f3dc; color:#1b4332; border:1px solid #b7e4c7; }
.kc-toast.error   { background:#fff0f0; color:#9b2226; border:1px solid #fbc4c4; }

.kc-form-card {
  background:#fff; border-radius:20px; padding:36px;
  margin-bottom:40px; box-shadow:0 4px 24px rgba(0,0,0,0.07);
  border:1px solid rgba(0,0,0,0.04);
}
.kc-form-title {
  font-family:'Playfair Display',serif; font-size:20px; font-weight:600;
  color:#1b2e1f; margin-bottom:26px; display:flex; align-items:center; gap:10px;
}
.kc-form-grid { display:grid; grid-template-columns:2fr 1fr 1fr; gap:16px; margin-bottom:16px; }
.kc-field { display:flex; flex-direction:column; gap:6px; }
.kc-lbl { font-size:11.5px; font-weight:600; letter-spacing:0.7px; text-transform:uppercase; color:#5a7a60; }
.kc-inp {
  padding:13px 16px; border:1.5px solid #e0ddd4; border-radius:12px;
  font-family:'DM Sans',sans-serif; font-size:14px; color:#2d3a2e;
  background:#fdfcf9; transition:all 0.22s ease; outline:none;
}
.kc-inp:focus { border-color:#52b788; background:#fff; box-shadow:0 0 0 4px rgba(82,183,136,0.1); }
.kc-inp::placeholder { color:#b5b0a3; font-weight:300; }
.kc-textarea {
  padding:13px 16px; border:1.5px solid #e0ddd4; border-radius:12px;
  font-family:'DM Sans',sans-serif; font-size:14px; color:#2d3a2e;
  background:#fdfcf9; resize:vertical; min-height:96px; outline:none;
  transition:all 0.22s ease; width:100%; box-sizing:border-box; margin-bottom:16px;
}
.kc-textarea:focus { border-color:#52b788; background:#fff; box-shadow:0 0 0 4px rgba(82,183,136,0.1); }
.kc-file-zone {
  border:2px dashed #d0ccbf; border-radius:14px; padding:20px 24px;
  background:#fdfcf9; display:flex; align-items:center; gap:18px;
  transition:all 0.22s ease; margin-bottom:20px; position:relative; cursor:pointer;
}
.kc-file-zone:hover { border-color:#52b788; background:rgba(82,183,136,0.04); }
.kc-file-inp { position:absolute; inset:0; opacity:0; cursor:pointer; }
.kc-file-icon { font-size:28px; flex-shrink:0; }
.kc-file-txt { font-size:14px; color:#7a8a7d; }
.kc-file-txt strong { color:#2d6a4f; }
.kc-preview { width:80px; height:80px; object-fit:cover; border-radius:12px; box-shadow:0 4px 14px rgba(0,0,0,0.15); border:2px solid #fff; flex-shrink:0; }
.kc-submit {
  padding:13px 32px; border-radius:13px;
  background:linear-gradient(135deg,#40916c,#1b4332);
  color:#fff; border:none; font-family:'DM Sans',sans-serif;
  font-size:15px; font-weight:500; cursor:pointer; letter-spacing:0.2px;
  box-shadow:0 4px 18px rgba(27,67,50,0.3);
  transition:all 0.28s cubic-bezier(.34,1.56,.64,1);
}
.kc-submit:hover { transform:translateY(-3px); box-shadow:0 8px 26px rgba(27,67,50,0.42); }
.kc-submit:active { transform:scale(0.97); }
.kc-submit:disabled { opacity:0.7; cursor:not-allowed; }

.kc-sec-head { display:flex; align-items:center; justify-content:space-between; margin-bottom:22px; }
.kc-sec-title { font-family:'Playfair Display',serif; font-size:22px; font-weight:600; color:#1b2e1f; }
.kc-count { background:#d8f3dc; color:#1b4332; border-radius:20px; padding:4px 13px; font-size:13px; font-weight:600; }

.kc-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(300px,1fr)); gap:22px; }
.kc-card {
  background:#fff; border-radius:18px; overflow:hidden;
  box-shadow:0 4px 20px rgba(0,0,0,0.08); border:1px solid rgba(0,0,0,0.04);
  transition:all 0.3s cubic-bezier(.34,1.56,.64,1);
  animation:kcFadeUp 0.4s ease both; animation-delay:var(--d);
}
@keyframes kcFadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
.kc-card:hover { transform:translateY(-7px); box-shadow:0 16px 40px rgba(0,0,0,0.14); }
.kc-img-wrap { position:relative; height:200px; overflow:hidden; background:linear-gradient(135deg,#d8f3dc,#b7e4c7); }
.kc-card-img { width:100%; height:100%; object-fit:cover; transition:transform 0.5s ease; }
.kc-card:hover .kc-card-img { transform:scale(1.06); }
.kc-no-img { width:100%; height:100%; display:flex; align-items:center; justify-content:center; font-size:56px; }
.kc-card-body { padding:20px 22px; }
.kc-card-name { font-family:'Playfair Display',serif; font-size:19px; font-weight:600; color:#1b2e1f; margin-bottom:10px; }
.kc-price-badge { display:inline-flex; align-items:center; gap:4px; background:#d8f3dc; color:#1b4332; border-radius:8px; padding:4px 11px; font-size:14px; font-weight:600; margin-bottom:10px; }
.kc-card-meta { font-size:13px; color:#7a8a7d; margin-bottom:8px; }
.kc-card-desc { font-size:13px; color:#8a9489; line-height:1.6; font-weight:300; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }
.kc-empty { text-align:center; padding:60px 40px; background:#fff; border-radius:20px; border:2px dashed #d8e8da; }
.kc-empty-icon { font-size:52px; margin-bottom:14px; }
.kc-empty-title { font-family:'Playfair Display',serif; font-size:20px; color:#4a5e4d; margin-bottom:8px; }
.kc-empty-sub { font-size:14px; color:#8a9a8d; font-weight:300; }
`;

export default function Crops() {
  const [crops, setCrops] = useState([]);
  const [form, setForm] = useState({ name:'', price:'', quantity:'', description:'' });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState({ text:'', type:'' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { fetchCrops(); }, []);

  const fetchCrops = async () => {
    const res = await axios.get('http://localhost:5000/api/crops/my', { withCredentials:true });
    setCrops(res.data.crops || []);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setSubmitting(true);
    const data = new FormData();
    Object.keys(form).forEach(k => data.append(k, form[k]));
    if (image) data.append('image', image);
    try {
      await axios.post('http://localhost:5000/api/crops/add', data, {
        headers:{ 'Content-Type':'multipart/form-data' }, withCredentials:true
      });
      setMessage({ text:'Crop added successfully!', type:'success' });
      setForm({ name:'', price:'', quantity:'', description:'' });
      setImage(null); setPreview(null);
      fetchCrops();
    } catch { setMessage({ text:'Error adding crop. Please try again.', type:'error' }); }
    finally {
      setSubmitting(false);
      setTimeout(() => setMessage({ text:'', type:'' }), 4000);
    }
  };

  return (
    <>
      <style>{css}</style>
      <div className="kc-page">
        <Sidebar />
        <div className="kc-main">
          <Navbar />
          <div className="kc-content">

            <div className="kc-crops-header">
              <span className="kc-hdr-tag">🌾 Crop Management</span>
              <h2>Manage My Crops</h2>
              <p>Add, track and showcase your harvest to buyers</p>
            </div>

            {message.text && (
              <div className={`kc-toast ${message.type}`}>
                {message.type === 'success' ? '✓' : '⚠'} {message.text}
              </div>
            )}

            <div className="kc-form-card">
              <div className="kc-form-title"><span>＋</span> Add New Crop</div>
              <form onSubmit={handleSubmit}>
                <div className="kc-form-grid">
                  <div className="kc-field">
                    <label className="kc-lbl">Crop Name</label>
                    <input type="text" className="kc-inp" placeholder="e.g. Basmati Rice" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required />
                  </div>
                  <div className="kc-field">
                    <label className="kc-lbl">Price (₹/kg)</label>
                    <input type="number" className="kc-inp" placeholder="0.00" value={form.price} onChange={e=>setForm({...form,price:e.target.value})} required />
                  </div>
                  <div className="kc-field">
                    <label className="kc-lbl">Quantity (kg)</label>
                    <input type="number" className="kc-inp" placeholder="0" value={form.quantity} onChange={e=>setForm({...form,quantity:e.target.value})} required />
                  </div>
                </div>
                <div className="kc-field">
                  <label className="kc-lbl" style={{marginBottom:'6px'}}>Description</label>
                  <textarea className="kc-textarea" placeholder="Describe your crop — variety, quality, harvest date…" value={form.description} onChange={e=>setForm({...form,description:e.target.value})} required rows={3} />
                </div>
                <div className="kc-file-zone">
                  <input type="file" className="kc-file-inp" onChange={handleImageChange} accept="image/*" />
                  {preview ? <img src={preview} alt="preview" className="kc-preview" /> : <div className="kc-file-icon">🖼</div>}
                  <div className="kc-file-txt"><strong>Click to upload</strong> a crop photo<br /><span style={{fontSize:'12px'}}>PNG, JPG up to 10 MB</span></div>
                </div>
                <button type="submit" className="kc-submit" disabled={submitting}>
                  {submitting ? '⏳ Adding…' : '✓ Add Crop'}
                </button>
              </form>
            </div>

            <div className="kc-sec-head">
              <span className="kc-sec-title">My Listed Crops</span>
              <span className="kc-count">{crops.length} crops</span>
            </div>

            {crops.length === 0 ? (
              <div className="kc-empty">
                <div className="kc-empty-icon">🌱</div>
                <div className="kc-empty-title">No crops listed yet</div>
                <div className="kc-empty-sub">Use the form above to add your first crop</div>
              </div>
            ) : (
              <div className="kc-grid">
                {crops.map((crop, i) => (
                  <div className="kc-card" key={crop._id} style={{'--d':`${i*0.06}s`}}>
                    <div className="kc-img-wrap">
                      {crop.image
                        ? <img src={`http://localhost:5000${crop.image}`} alt={crop.name} className="kc-card-img" />
                        : <div className="kc-no-img">🌾</div>
                      }
                    </div>
                    <div className="kc-card-body">
                      <div className="kc-card-name">{crop.name}</div>
                      <div className="kc-price-badge">₹{crop.price} / kg</div>
                      <div className="kc-card-meta">📦 {crop.quantity} kg available</div>
                      <p className="kc-card-desc">{crop.description}</p>
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