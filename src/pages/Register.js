import { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function Register() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    location: '',
    role: 'farmer',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState('');
  const [step, setStep] = useState(1); // 2-step form

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', form);
      if (res.data.success) {
        setMessage(res.data.message || 'Registration successful! Redirecting to login…');
        setForm({ name: '', email: '', phone: '', password: '', location: '', role: form.role });
        setTimeout(() => { window.location.href = '/login'; }, 1500);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fields1 = [
    { name: 'name',     label: 'Full Name',          type: 'text',     icon: '👤', placeholder: 'Ravi Kumar' },
    { name: 'email',    label: 'Email Address',       type: 'email',    icon: '✉',  placeholder: 'you@example.com' },
    { name: 'phone',    label: 'Phone Number',        type: 'tel',      icon: '📱', placeholder: '+91 98765 43210' },
  ];
  const fields2 = [
    { name: 'location', label: 'City / Village',      type: 'text',     icon: '📍', placeholder: 'Nashik, Maharashtra' },
    { name: 'password', label: 'Create Password',     type: 'password', icon: '🔑', placeholder: 'Min. 8 characters' },
  ];

  const currentFields = step === 1 ? fields1 : fields2;

  const handleNext = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone) {
      setError('Please fill all fields before continuing.');
      return;
    }
    setError('');
    setStep(2);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .reg-root {
          min-height: 100vh;
          display: flex;
          font-family: 'DM Sans', sans-serif;
          background: #f5f0e8;
          overflow: hidden;
        }

        /* ── Left panel ── */
        .reg-left {
          flex: 1;
          position: relative;
          background: #1a2e1a;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 52px 48px;
          overflow: hidden;
        }

        .reg-left::before {
          content: '';
          position: absolute; inset: 0;
          background:
            radial-gradient(ellipse 55% 45% at 25% 15%, rgba(76,140,60,0.38) 0%, transparent 70%),
            radial-gradient(ellipse 45% 55% at 85% 85%, rgba(120,180,50,0.22) 0%, transparent 70%);
        }

        .grain {
          position: absolute; inset: 0;
          opacity: 0.055;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
          background-size: 200px;
        }

        .deco-ring {
          position: absolute;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.07);
        }
        .ring-1 { width: 500px; height: 500px; top: -160px; right: -120px; }
        .ring-2 { width: 300px; height: 300px; top: 60px;  right: 30px; }
        .ring-3 { width: 700px; height: 700px; bottom: -280px; left: -220px; border-color: rgba(255,255,255,0.03); }

        /* Top logo */
        .left-logo {
          display: flex; align-items: center; gap: 10px;
          position: relative; z-index: 2;
        }
        .left-logo .icon-box {
          width: 34px; height: 34px;
          background: rgba(168,217,138,0.18);
          border: 1px solid rgba(168,217,138,0.3);
          border-radius: 9px;
          display: flex; align-items: center; justify-content: center;
          font-size: 16px;
        }
        .left-logo .brand {
          font-family: 'Cormorant Garamond', serif;
          font-size: 18px; font-weight: 600;
          color: #f0ede6; letter-spacing: 0.5px;
        }

        /* Steps guide */
        .steps-guide {
          position: relative; z-index: 2;
        }
        .steps-guide .eyebrow {
          font-size: 10px; font-weight: 500;
          letter-spacing: 3px; text-transform: uppercase;
          color: #8ecf6e; margin-bottom: 18px;
        }
        .steps-guide h2 {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(32px, 3.5vw, 50px);
          font-weight: 300; line-height: 1.18;
          color: #f0ede6; margin-bottom: 18px;
        }
        .steps-guide h2 em { font-style: italic; color: #a8d98a; }
        .steps-guide p {
          font-size: 13px; font-weight: 300;
          color: rgba(240,237,230,0.5); line-height: 1.75;
          max-width: 290px;
        }

        /* Progress steps */
        .prog-steps {
          display: flex; gap: 0;
          margin-top: 44px;
        }
        .prog-step {
          display: flex; align-items: center; gap: 12px;
        }
        .prog-step + .prog-step::before {
          content: '';
          width: 36px; height: 1px;
          background: rgba(255,255,255,0.15);
          margin: 0 4px;
        }
        .step-dot {
          width: 28px; height: 28px;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 11px; font-weight: 500;
          transition: all 0.3s;
        }
        .step-dot.done  { background: #5aaa30; color: #fff; }
        .step-dot.active{ background: rgba(90,170,48,0.2); border: 1.5px solid #5aaa30; color: #a8d98a; }
        .step-dot.idle  { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12); color: rgba(255,255,255,0.3); }
        .step-label {
          font-size: 11px; letter-spacing: 0.5px;
          color: rgba(240,237,230,0.45);
        }
        .step-label.active-label { color: #a8d98a; }

        /* Bottom tip */
        .left-tip {
          position: relative; z-index: 2;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 14px;
          padding: 18px 20px;
          display: flex; gap: 14px; align-items: flex-start;
        }
        .tip-icon { font-size: 20px; margin-top: 1px; flex-shrink: 0; }
        .tip-text { font-size: 12px; color: rgba(240,237,230,0.5); line-height: 1.6; }
        .tip-text strong { color: rgba(240,237,230,0.8); font-weight: 500; display: block; margin-bottom: 3px; }

        /* ── Right panel ── */
        .reg-right {
          width: 500px; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          padding: 44px 52px;
          position: relative;
          background: #f5f0e8;
        }
        .reg-right::before {
          content: '';
          position: absolute; left: 0; top: 12%; bottom: 12%;
          width: 1px;
          background: linear-gradient(to bottom, transparent, #c8bfa8, transparent);
        }

        .form-inner {
          width: 100%;
          animation: fadeUp 0.55s cubic-bezier(0.22,1,0.36,1) both;
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .form-header { margin-bottom: 36px; }
        .form-header h3 {
          font-family: 'Cormorant Garamond', serif;
          font-size: 34px; font-weight: 300;
          color: #1a2e1a; line-height: 1.2; margin-bottom: 6px;
        }
        .form-header h3 em { font-style: italic; color: #4a8a30; }
        .form-header p { font-size: 13px; color: #8a8070; font-weight: 300; }

        /* Progress bar */
        .prog-bar-wrap {
          height: 3px;
          background: #ddd8ce;
          border-radius: 99px;
          margin-bottom: 32px;
          overflow: hidden;
        }
        .prog-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #5aaa30, #a8d98a);
          border-radius: 99px;
          transition: width 0.45s cubic-bezier(0.22,1,0.36,1);
        }

        /* Field */
        .field-group {
          position: relative; margin-bottom: 18px;
        }
        .field-label {
          display: block; font-size: 10.5px; font-weight: 500;
          letter-spacing: 1.5px; text-transform: uppercase;
          color: #6a6055; margin-bottom: 7px;
          transition: color 0.2s;
        }
        .field-group.focused .field-label { color: #3a7020; }

        .field-wrap { position: relative; }
        .field-icon {
          position: absolute; left: 15px; top: 50%;
          transform: translateY(-50%);
          font-size: 14px; opacity: 0.38; pointer-events: none;
          transition: opacity 0.2s;
        }
        .field-group.focused .field-icon { opacity: 0.85; }

        .field-input {
          width: 100%;
          padding: 13px 15px 13px 43px;
          background: #ede8df;
          border: 1.5px solid transparent;
          border-radius: 11px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px; color: #1a2e1a;
          outline: none;
          transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
        }
        .field-input::placeholder { color: #b0a898; }
        .field-input:focus {
          border-color: #5aaa30;
          background: #fff;
          box-shadow: 0 0 0 4px rgba(90,170,48,0.09);
        }

        /* Alerts */
        .alert-box {
          display: flex; align-items: flex-start; gap: 10px;
          border-radius: 10px; padding: 12px 15px;
          font-size: 13px; margin-bottom: 18px;
          animation: fadeUp 0.3s ease both;
        }
        .alert-box.success { background: #f0fae8; border: 1px solid #b8e8a0; color: #2a6010; }
        .alert-box.danger  { background: #fdf0f0; border: 1px solid #f5c5c5; color: #c0392b; }

        /* Buttons */
        .btn-row { display: flex; gap: 10px; margin-top: 6px; }

        .btn-back {
          flex: 0 0 auto;
          padding: 14px 20px;
          background: transparent;
          border: 1.5px solid #c8bfa8;
          border-radius: 11px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px; color: #6a6055;
          cursor: pointer;
          transition: border-color 0.2s, color 0.2s;
        }
        .btn-back:hover { border-color: #8a8070; color: #3a3028; }

        .btn-primary {
          flex: 1;
          padding: 14px;
          background: #2a4a1e;
          color: #e8f5e0;
          border: none; border-radius: 11px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px; font-weight: 500;
          cursor: pointer;
          transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
        }
        .btn-primary:not(:disabled):hover {
          background: #3a6a28;
          transform: translateY(-1px);
          box-shadow: 0 8px 24px rgba(42,74,30,0.25);
        }
        .btn-primary:not(:disabled):active { transform: translateY(0); }
        .btn-primary:disabled { opacity: 0.65; cursor: not-allowed; }

        .spinner {
          display: inline-block; width: 13px; height: 13px;
          border: 2px solid rgba(232,245,224,0.3);
          border-top-color: #e8f5e0;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          margin-right: 8px; vertical-align: middle;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .divider {
          display: flex; align-items: center; gap: 12px;
          margin: 24px 0; color: #c0b8a8;
          font-size: 11px; letter-spacing: 1px;
        }
        .divider::before, .divider::after {
          content: ''; flex: 1; height: 1px; background: #d8d0c0;
        }

        .login-link { text-align: center; font-size: 13px; color: #8a8070; }
        .login-link a {
          color: #3a7020; font-weight: 500;
          text-decoration: none;
          border-bottom: 1px solid rgba(58,112,32,0.3);
          padding-bottom: 1px;
          transition: border-color 0.2s;
        }
        .login-link a:hover { border-color: #3a7020; }

        @media (max-width: 768px) {
          .reg-left { display: none; }
          .reg-right { width: 100%; padding: 36px 24px; }
          .reg-right::before { display: none; }
        }
      `}</style>

      <div className="reg-root">

        {/* ── Left Panel ── */}
        <div className="reg-left">
          <div className="grain" />
          <div className="deco-ring ring-1" />
          <div className="deco-ring ring-2" />
          <div className="deco-ring ring-3" />

          {/* Logo */}
          <div className="left-logo">
            <div className="icon-box">🌾</div>
            <span className="brand">KrishiConnect</span>
          </div>

          {/* Main copy */}
          <div className="steps-guide">
            <p className="eyebrow">Farmer Registration</p>
            <h2>
              Join the <em>growing</em><br />
              community of<br />
              <em>smart</em> farmers
            </h2>
            <p>
              Connect with buyers, track your crops, and
              access government schemes — all from one
              powerful dashboard built for you.
            </p>

            {/* Step indicators */}
            <div className="prog-steps">
              <div className="prog-step">
                <div className={`step-dot ${step >= 1 ? (step > 1 ? 'done' : 'active') : 'idle'}`}>
                  {step > 1 ? '✓' : '1'}
                </div>
                <span className={`step-label ${step === 1 ? 'active-label' : ''}`}>Personal</span>
              </div>
              <div className="prog-step">
                <div className={`step-dot ${step === 2 ? 'active' : 'idle'}`}>2</div>
                <span className={`step-label ${step === 2 ? 'active-label' : ''}`}>Location & Security</span>
              </div>
            </div>
          </div>

          {/* Tip card */}
          <div className="left-tip">
            <div className="tip-icon">🔒</div>
            <div className="tip-text">
              <strong>Your data is safe with us</strong>
              We never share your personal information with third parties. Your farm data belongs only to you.
            </div>
          </div>
        </div>

        {/* ── Right Panel ── */}
        <div className="reg-right">
          <div className="form-inner" key={step}>

            <div className="form-header">
              <h3>
                {step === 1
                  ? <><em>Tell us</em> about yourself</>
                  : <>Almost <em>there!</em></>
                }
              </h3>
              <p>
                {step === 1
                  ? 'Step 1 of 2 — Basic information'
                  : 'Step 2 of 2 — Location & password'
                }
              </p>
            </div>

            {/* Progress bar */}
            <div className="prog-bar-wrap">
              <div className="prog-bar-fill" style={{ width: step === 1 ? '50%' : '100%' }} />
            </div>

            {/* Alerts */}
            {message && (
              <div className="alert-box success">
                <span>✅</span><span>{message}</span>
              </div>
            )}
            {error && (
              <div className="alert-box danger">
                <span>⚠️</span><span>{error}</span>
              </div>
            )}

            <form onSubmit={step === 1 ? handleNext : handleSubmit}>
              {currentFields.map(({ name, label, type, icon, placeholder }) => (
                <div
                  key={name}
                  className={`field-group${focused === name ? ' focused' : ''}`}
                >
                  <label className="field-label">{label}</label>
                  <div className="field-wrap">
                    <span className="field-icon">{icon}</span>
                    <input
                      type={type}
                      name={name}
                      className="field-input"
                      placeholder={placeholder}
                      value={form[name]}
                      onChange={handleChange}
                      onFocus={() => setFocused(name)}
                      onBlur={() => setFocused('')}
                      required
                    />
                  </div>
                </div>
              ))}

              <div className="btn-row">
                {step === 2 && (
                  <button
                    type="button"
                    className="btn-back"
                    onClick={() => { setStep(1); setError(''); }}
                  >
                    ← Back
                  </button>
                )}
                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading && <span className="spinner" />}
                  {step === 1 ? 'Continue →' : (loading ? 'Creating account…' : 'Create Account')}
                </button>
              </div>
            </form>

            <div className="divider">or</div>

            <p className="login-link">
              Already have an account?{' '}
              <Link to="/login">Sign in here</Link>
            </p>

          </div>
        </div>
      </div>
    </>
  );
}