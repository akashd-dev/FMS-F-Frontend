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
    role: 'farmer'   // Fixed for farmer panel
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setMessage('');
  setError('');

  try {
    const res = await axios.post('http://localhost:5000/api/auth/register', form);

    if (res.data.success) {
      setMessage(res.data.message || 'Registration successful! Redirecting to login...');
      // Clear form
      setForm({
        name: '',
        email: '',
        phone: '',
        password: '',
        location: '',
        role: form.role   // keep 'farmer' or 'buyer'
      });
      // Auto redirect after success
      setTimeout(() => {
        window.location.href = '/login';
      }, 1500);
    }
  } catch (err) {
    // ✅ Improved error handling - show exact message from backend
    const errorMsg = err.response?.data?.message || err.message || 'Registration failed. Please try again.';
    setError(errorMsg);
    console.error("Registration Error:", err.response?.data); // Check console for details
  }
};

  return (
    <div className="container d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
      <div className="card p-5 shadow" style={{ maxWidth: '480px', width: '100%' }}>
        <h2 className="text-center text-success mb-4">🌾 Farmer Registration</h2>

        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Full Name</label>
            <input 
              type="text" 
              name="name" 
              className="form-control" 
              value={form.name} 
              onChange={handleChange} 
              required 
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Email Address</label>
            <input 
              type="email" 
              name="email" 
              className="form-control" 
              value={form.email} 
              onChange={handleChange} 
              required 
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Phone Number</label>
            <input 
              type="tel" 
              name="phone" 
              className="form-control" 
              value={form.phone} 
              onChange={handleChange} 
              required 
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Location (City/Village)</label>
            <input 
              type="text" 
              name="location" 
              className="form-control" 
              value={form.location} 
              onChange={handleChange} 
              required 
            />
          </div>

          <div className="mb-4">
            <label className="form-label">Password</label>
            <input 
              type="password" 
              name="password" 
              className="form-control" 
              value={form.password} 
              onChange={handleChange} 
              required 
            />
          </div>

          <button type="submit" className="btn btn-primary w-100 py-3 mb-3">
            Register as Farmer
          </button>

          <div className="text-center">
            Already have an account? <Link to="/login" className="text-success fw-bold">Login here</Link>
          </div>
        </form>
      </div>
    </div>
  );
}