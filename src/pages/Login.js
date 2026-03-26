import { useState, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState('');
  const { setUser } = useContext(AuthContext);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await axios.post(
        'http://localhost:5000/api/auth/login',
        form,
        { withCredentials: true }
      );
      if (res.data.success) {
        setUser(res.data.user);
        window.location.href = '/';
      }
    } catch (err) {
      setError(
        err.response?.data?.message || 'Login failed. Please check your credentials.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .login-root {
          min-height: 100vh;
          display: flex;
          font-family: 'DM Sans', sans-serif;
          background: #f5f0e8;
          position: relative;
          overflow: hidden;
        }

        /* Left panel — illustrated side */
        .login-left {
          flex: 1;
          position: relative;
          background: #1a2e1a;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 56px 48px;
          overflow: hidden;
        }

        .login-left::before {
          content: '';
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 60% 50% at 30% 20%, rgba(76,140,60,0.35) 0%, transparent 70%),
            radial-gradient(ellipse 50% 60% at 80% 80%, rgba(120,180,50,0.2) 0%, transparent 70%);
        }

        /* SVG grain overlay */
        .grain {
          position: absolute;
          inset: 0;
          opacity: 0.06;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
          background-size: 200px;
        }

        /* Decorative circles */
        .deco-circle {
          position: absolute;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.08);
        }
        .deco-circle-1 { width: 420px; height: 420px; top: -100px; right: -80px; }
        .deco-circle-2 { width: 260px; height: 260px; top: 80px; right: 60px; }
        .deco-circle-3 { width: 600px; height: 600px; bottom: -200px; left: -180px; border-color: rgba(255,255,255,0.04); }

        /* Leaf/wheat SVG illustrations */
        .illustration {
          position: absolute;
          top: 60px;
          left: 50%;
          transform: translateX(-50%);
          opacity: 0.18;
        }

        .left-tagline {
          position: relative;
          z-index: 2;
        }

        .left-tagline .eyebrow {
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: #8ecf6e;
          margin-bottom: 16px;
        }

        .left-tagline h1 {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(36px, 4vw, 56px);
          font-weight: 300;
          line-height: 1.15;
          color: #f0ede6;
          margin-bottom: 20px;
        }

        .left-tagline h1 em {
          font-style: italic;
          color: #a8d98a;
        }

        .left-tagline p {
          font-size: 14px;
          font-weight: 300;
          color: rgba(240,237,230,0.55);
          line-height: 1.7;
          max-width: 300px;
        }

        /* Stat row */
        .stat-row {
          display: flex;
          gap: 40px;
          margin-top: 48px;
          position: relative;
          z-index: 2;
        }
        .stat-item .num {
          font-family: 'Cormorant Garamond', serif;
          font-size: 28px;
          font-weight: 600;
          color: #a8d98a;
        }
        .stat-item .label {
          font-size: 11px;
          color: rgba(240,237,230,0.4);
          letter-spacing: 1px;
          text-transform: uppercase;
          margin-top: 2px;
        }

        /* Right panel — form */
        .login-right {
          width: 480px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 48px 52px;
          position: relative;
          background: #f5f0e8;
        }

        .login-right::before {
          content: '';
          position: absolute;
          left: 0; top: 15%; bottom: 15%;
          width: 1px;
          background: linear-gradient(to bottom, transparent, #c8bfa8, transparent);
        }

        .form-inner {
          width: 100%;
          animation: fadeUp 0.6s ease both;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .form-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 48px;
        }
        .form-logo .logo-icon {
          width: 36px; height: 36px;
          background: #2a4a1e;
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          font-size: 18px;
        }
        .form-logo .logo-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 20px;
          font-weight: 600;
          color: #1a2e1a;
          letter-spacing: 0.5px;
        }

        .form-heading {
          font-family: 'Cormorant Garamond', serif;
          font-size: 38px;
          font-weight: 300;
          color: #1a2e1a;
          line-height: 1.2;
          margin-bottom: 8px;
        }
        .form-heading em { font-style: italic; color: #4a8a30; }

        .form-sub {
          font-size: 13px;
          color: #8a8070;
          margin-bottom: 40px;
          font-weight: 300;
        }

        /* Field */
        .field-group {
          position: relative;
          margin-bottom: 20px;
        }
        .field-label {
          display: block;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: #6a6055;
          margin-bottom: 8px;
          transition: color 0.2s;
        }
        .field-group.focused .field-label { color: #3a7020; }

        .field-input-wrap {
          position: relative;
        }
        .field-input-wrap .icon {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 15px;
          opacity: 0.4;
          pointer-events: none;
          transition: opacity 0.2s;
        }
        .field-group.focused .field-input-wrap .icon { opacity: 0.9; }

        .field-input {
          width: 100%;
          padding: 14px 16px 14px 44px;
          background: #ede8df;
          border: 1.5px solid transparent;
          border-radius: 12px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 400;
          color: #1a2e1a;
          outline: none;
          transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
        }
        .field-input::placeholder { color: #b0a898; }
        .field-input:focus {
          border-color: #5aaa30;
          background: #fff;
          box-shadow: 0 0 0 4px rgba(90,170,48,0.1);
        }

        /* Underline accent */
        .field-bar {
          position: absolute;
          bottom: 0; left: 12px; right: 12px;
          height: 2px;
          background: #5aaa30;
          border-radius: 2px;
          transform: scaleX(0);
          transition: transform 0.25s ease;
        }
        .field-group.focused .field-bar { transform: scaleX(1); }

        /* Error */
        .error-box {
          display: flex;
          align-items: center;
          gap: 10px;
          background: #fdf0f0;
          border: 1px solid #f5c5c5;
          border-radius: 10px;
          padding: 12px 16px;
          margin-bottom: 20px;
          font-size: 13px;
          color: #c0392b;
        }

        /* Submit */
        .submit-btn {
          width: 100%;
          padding: 16px;
          background: #2a4a1e;
          color: #e8f5e0;
          border: none;
          border-radius: 12px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 500;
          letter-spacing: 0.5px;
          cursor: pointer;
          transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
          position: relative;
          overflow: hidden;
          margin-top: 8px;
        }
        .submit-btn:not(:disabled):hover {
          background: #3a6a28;
          transform: translateY(-1px);
          box-shadow: 0 8px 24px rgba(42,74,30,0.25);
        }
        .submit-btn:not(:disabled):active { transform: translateY(0); }
        .submit-btn:disabled { opacity: 0.7; cursor: not-allowed; }

        /* Spinner */
        .spinner {
          display: inline-block;
          width: 14px; height: 14px;
          border: 2px solid rgba(232,245,224,0.3);
          border-top-color: #e8f5e0;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          margin-right: 8px;
          vertical-align: middle;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .divider {
          display: flex;
          align-items: center;
          gap: 14px;
          margin: 28px 0;
          color: #c0b8a8;
          font-size: 11px;
          letter-spacing: 1px;
        }
        .divider::before, .divider::after {
          content: ''; flex: 1; height: 1px; background: #d8d0c0;
        }

        .register-link {
          text-align: center;
          font-size: 13px;
          color: #8a8070;
        }
        .register-link a {
          color: #3a7020;
          font-weight: 500;
          text-decoration: none;
          border-bottom: 1px solid rgba(58,112,32,0.3);
          padding-bottom: 1px;
          transition: border-color 0.2s;
        }
        .register-link a:hover { border-color: #3a7020; }

        /* Responsive */
        @media (max-width: 768px) {
          .login-left { display: none; }
          .login-right { width: 100%; padding: 40px 28px; }
          .login-right::before { display: none; }
        }
      `}</style>

      <div className="login-root">
        {/* ── Left panel ── */}
        <div className="login-left">
          <div className="grain" />
          <div className="deco-circle deco-circle-1" />
          <div className="deco-circle deco-circle-2" />
          <div className="deco-circle deco-circle-3" />

          {/* Wheat SVG illustration */}
          <svg className="illustration" width="280" height="340" viewBox="0 0 280 340" fill="none" xmlns="http://www.w3.org/2000/svg">
            <line x1="140" y1="340" x2="140" y2="40" stroke="white" strokeWidth="2"/>
            {/* Wheat grains */}
            {[0,1,2,3,4,5].map(i => (
              <g key={i} transform={`translate(140, ${80 + i*38})`}>
                <ellipse cx="-18" cy="0" rx="14" ry="8" fill="white" transform="rotate(-35)" />
                <ellipse cx="18" cy="0" rx="14" ry="8" fill="white" transform="rotate(35)" />
              </g>
            ))}
            <ellipse cx="140" cy="40" rx="14" ry="26" fill="white" />
          </svg>

          <div className="left-tagline">
            <p className="eyebrow">Farmer's Portal</p>
            <h1>
              Where the <em>harvest</em><br/>
              meets the <em>future</em>
            </h1>
            <p>
              Manage your crops, connect with markets,
              and grow your farming business — all from one place.
            </p>
          </div>

          <div className="stat-row">
            <div className="stat-item">
              <div className="num">12K+</div>
              <div className="label">Farmers</div>
            </div>
            <div className="stat-item">
              <div className="num">98%</div>
              <div className="label">Satisfaction</div>
            </div>
            <div className="stat-item">
              <div className="num">40+</div>
              <div className="label">Districts</div>
            </div>
          </div>
        </div>

        {/* ── Right panel ── */}
        <div className="login-right">
          <div className="form-inner">
            <div className="form-logo">
              <div className="logo-icon">🌾</div>
              <span className="logo-name">KrishiConnect</span>
            </div>

            <h2 className="form-heading">
              Welcome <em>back</em>
            </h2>
            <p className="form-sub">Sign in to your farmer dashboard</p>

            {error && (
              <div className="error-box">
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className={`field-group${focused === 'email' ? ' focused' : ''}`}>
                <label className="field-label">Email Address</label>
                <div className="field-input-wrap">
                  <span className="icon">✉</span>
                  <input
                    type="email"
                    name="email"
                    className="field-input"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={handleChange}
                    onFocus={() => setFocused('email')}
                    onBlur={() => setFocused('')}
                    required
                  />
                  <div className="field-bar" />
                </div>
              </div>

              <div className={`field-group${focused === 'password' ? ' focused' : ''}`}>
                <label className="field-label">Password</label>
                <div className="field-input-wrap">
                  <span className="icon">🔑</span>
                  <input
                    type="password"
                    name="password"
                    className="field-input"
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={handleChange}
                    onFocus={() => setFocused('password')}
                    onBlur={() => setFocused('')}
                    required
                  />
                  <div className="field-bar" />
                </div>
              </div>

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading && <span className="spinner" />}
                {loading ? 'Signing in…' : 'Sign In'}
              </button>
            </form>

            <div className="divider">or</div>

            <p className="register-link">
              New to KrishiConnect?{' '}
              <Link to="/register">Create an account</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}