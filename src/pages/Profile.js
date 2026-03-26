import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { AuthContext } from '../context/AuthContext';

export default function Profile() {
  const { user } = useContext(AuthContext);
  const [form, setForm] = useState({
    name: '',
    phone: '',
    location: ''
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        phone: user.phone || '',
        location: user.location || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Note: Backend doesn't have update profile yet, but you can extend it later
      setMessage('Profile updated successfully! (Demo)');
    } catch (err) {
      setMessage('Failed to update profile');
    }
  };

  return (
    <div className="d-flex">
      <Sidebar />
      <div style={{ marginLeft: '260px', width: '100%' }}>
        <Navbar />
        <div className="container mt-4">
          <div className="card p-5" style={{ maxWidth: '700px', margin: '0 auto' }}>
            <h3 className="text-success mb-4">👤 Farmer Profile</h3>

            {message && <div className="alert alert-success">{message}</div>}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Full Name</label>
                <input 
                  type="text" 
                  name="name" 
                  className="form-control" 
                  value={form.name} 
                  onChange={handleChange} 
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Email</label>
                <input 
                  type="email" 
                  className="form-control" 
                  value={user?.email || ''} 
                  disabled 
                />
                <small className="text-muted">Email cannot be changed</small>
              </div>

              <div className="mb-3">
                <label className="form-label">Phone Number</label>
                <input 
                  type="tel" 
                  name="phone" 
                  className="form-control" 
                  value={form.phone} 
                  onChange={handleChange} 
                />
              </div>

              <div className="mb-4">
                <label className="form-label">Location (City/Village)</label>
                <input 
                  type="text" 
                  name="location" 
                  className="form-control" 
                  value={form.location} 
                  onChange={handleChange} 
                />
              </div>

              <button type="submit" className="btn btn-primary px-5">Update Profile</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}