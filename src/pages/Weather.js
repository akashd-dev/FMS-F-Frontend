import { useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const css = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
.kc-page { display:flex; background:#f7f5ef; min-height:100vh; font-family:'DM Sans',sans-serif; }
.kc-main { margin-left:260px; width:100%; }
.kc-content { padding:36px 40px; max-width:800px; }
.kc-hero {
  position:relative; overflow:hidden;
  background:linear-gradient(130deg,#0a3d62 0%,#1565c0 55%,#1976d2 100%);
  border-radius:22px; padding:36px 44px; margin-bottom:36px;
  box-shadow:0 10px 36px rgba(10,61,98,0.35);
}
.kc-hero::after { content:'☀'; position:absolute; right:44px; top:50%; transform:translateY(-50%); font-size:72px; opacity:0.15; user-select:none; }
.kc-hdr-tag { display:inline-block; background:rgba(255,255,255,0.12); border:1px solid rgba(255,255,255,0.18); border-radius:20px; padding:4px 13px; font-size:11.5px; font-weight:500; color:rgba(255,255,255,0.8); letter-spacing:0.6px; margin-bottom:14px; }
.kc-hero h2 { font-family:'Playfair Display',serif; font-size:28px; font-weight:700; color:#fff; margin:0 0 8px; }
.kc-hero p { color:rgba(255,255,255,0.6); font-size:14px; font-weight:300; margin:0; }
.kc-search-card { background:#fff; border-radius:20px; padding:32px 36px; box-shadow:0 4px 24px rgba(0,0,0,0.07); border:1px solid rgba(0,0,0,0.04); margin-bottom:24px; }
.kc-search-title { font-family:'Playfair Display',serif; font-size:18px; font-weight:600; color:#1b2e1f; margin-bottom:20px; }
.kc-search-row { display:flex; gap:12px; }
.kc-inp {
  flex:1; padding:13px 18px; border:1.5px solid #e0ddd4; border-radius:13px;
  font-family:'DM Sans',sans-serif; font-size:15px; color:#2d3a2e;
  background:#fdfcf9; outline:none; transition:all 0.22s ease;
}
.kc-inp:focus { border-color:#1565c0; background:#fff; box-shadow:0 0 0 4px rgba(21,101,192,0.1); }
.kc-inp::placeholder { color:#b5b0a3; font-weight:300; }
.kc-search-btn {
  padding:13px 28px; border-radius:13px;
  background:linear-gradient(135deg,#1565c0,#0a3d62);
  color:#fff; border:none; font-family:'DM Sans',sans-serif;
  font-size:15px; font-weight:500; cursor:pointer; white-space:nowrap;
  box-shadow:0 4px 16px rgba(21,101,192,0.3);
  transition:all 0.28s cubic-bezier(.34,1.56,.64,1);
}
.kc-search-btn:hover { transform:translateY(-2px); box-shadow:0 7px 22px rgba(21,101,192,0.42); }
.kc-search-btn:active { transform:scale(0.97); }
.kc-search-btn:disabled { opacity:0.65; cursor:not-allowed; transform:none; }
.kc-err { background:#fff0f0; border:1px solid #fbc4c4; color:#9b2226; border-radius:14px; padding:14px 20px; font-size:14px; margin-top:14px; }
.kc-weather-card {
  background:#fff; border-radius:20px; overflow:hidden;
  box-shadow:0 6px 28px rgba(0,0,0,0.1); border:1px solid rgba(0,0,0,0.04);
  animation:kcFadeUp 0.4s ease both;
}
@keyframes kcFadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
.kc-weather-banner {
  background:linear-gradient(135deg,#1565c0,#1976d2);
  padding:36px; text-align:center;
}
.kc-weather-icon { width:100px; height:100px; object-fit:contain; margin:0 auto 10px; display:block; filter:drop-shadow(0 4px 12px rgba(0,0,0,0.2)); }
.kc-weather-city { font-family:'Playfair Display',serif; font-size:26px; font-weight:700; color:#fff; margin-bottom:6px; }
.kc-weather-temp { font-family:'Playfair Display',serif; font-size:64px; font-weight:700; color:#fff; line-height:1; margin-bottom:8px; }
.kc-weather-desc { font-size:16px; color:rgba(255,255,255,0.75); text-transform:capitalize; font-weight:300; }
.kc-weather-body { padding:28px 32px; }
.kc-weather-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:14px; }
.kc-w-item { background:#f7f5ef; border-radius:14px; padding:16px 18px; text-align:center; }
.kc-w-label { font-size:11px; font-weight:600; letter-spacing:0.8px; text-transform:uppercase; color:#8a9a8d; margin-bottom:8px; }
.kc-w-value { font-family:'Playfair Display',serif; font-size:22px; font-weight:600; color:#1b2e1f; }
.kc-loading { display:flex; flex-direction:column; align-items:center; padding:40px 0; gap:14px; }
.kc-spinner { width:36px; height:36px; border:3px solid rgba(21,101,192,0.2); border-top-color:#1565c0; border-radius:50%; animation:kcSpin 0.8s linear infinite; }
@keyframes kcSpin { to{transform:rotate(360deg)} }
.kc-loading-txt { font-size:14px; color:#7a8a7d; font-weight:300; }
`;

export default function Weather() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchWeather = async () => {
    if (!city.trim()) { setError('Please enter a city name'); return; }
    setLoading(true); setError(''); setWeather(null);
    try {
      const res = await axios.get(`http://localhost:5000/api/weather?city=${encodeURIComponent(city)}`);
      if (res.data.success) setWeather(res.data.weather);
      else setError(res.data.message || 'Failed to fetch weather');
    } catch { setError('Server error or API issue'); }
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
              <span className="kc-hdr-tag">☀ Forecast</span>
              <h2>Real-time Weather</h2>
              <p>Check current conditions to plan your farming activities</p>
            </div>

            <div className="kc-search-card">
              <div className="kc-search-title">Search by City</div>
              <div className="kc-search-row">
                <input
                  type="text"
                  className="kc-inp"
                  placeholder="Enter city name (e.g. Jamshedpur)"
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && fetchWeather()}
                />
                <button className="kc-search-btn" onClick={fetchWeather} disabled={loading}>
                  {loading ? 'Fetching…' : '🔍 Get Weather'}
                </button>
              </div>
              {error && <div className="kc-err">⚠ {error}</div>}
            </div>

            {loading && (
              <div className="kc-loading">
                <div className="kc-spinner" />
                <span className="kc-loading-txt">Fetching weather data…</span>
              </div>
            )}

            {weather && !loading && (
              <div className="kc-weather-card">
                <div className="kc-weather-banner">
                  <img src={weather.icon} alt="weather" className="kc-weather-icon" />
                  <div className="kc-weather-city">{weather.city}</div>
                  <div className="kc-weather-temp">{Math.round(weather.temperature)}°C</div>
                  <div className="kc-weather-desc">{weather.description}</div>
                </div>
                <div className="kc-weather-body">
                  <div className="kc-weather-grid">
                    <div className="kc-w-item">
                      <div className="kc-w-label">💧 Humidity</div>
                      <div className="kc-w-value">{weather.humidity}%</div>
                    </div>
                    <div className="kc-w-item">
                      <div className="kc-w-label">🌤 Condition</div>
                      <div className="kc-w-value" style={{fontSize:'18px'}}>{weather.condition}</div>
                    </div>
                    <div className="kc-w-item">
                      <div className="kc-w-label">🌡 Feels Like</div>
                      <div className="kc-w-value">{Math.round(weather.temperature)}°C</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </>
  );
}