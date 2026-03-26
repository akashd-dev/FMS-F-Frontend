import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

export default function Crops() {
  const [crops, setCrops] = useState([]);
  const [form, setForm] = useState({ name: '', price: '', quantity: '', description: '' });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchCrops();
  }, []);

  const fetchCrops = async () => {
    const res = await axios.get('http://localhost:5000/api/crops/my', { withCredentials: true });
    setCrops(res.data.crops);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(form).forEach(key => data.append(key, form[key]));
    if (image) data.append('image', image);

    try {
      await axios.post('http://localhost:5000/api/crops/add', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true
      });
      setMessage('✅ Crop added successfully!');
      setForm({ name: '', price: '', quantity: '', description: '' });
      setImage(null);
      setPreview(null);
      fetchCrops();
    } catch {
      setMessage('❌ Error adding crop');
    }
  };

  return (
    <div className="d-flex" style={{ background: '#f4f6f9' }}>
      <Sidebar />

      <div style={{ marginLeft: '260px', width: '100%' }}>
        <Navbar />

        <div className="container-fluid p-4">

          {/* 🌾 Header */}
          <div
            style={{
              padding: '20px',
              borderRadius: '15px',
              background: 'linear-gradient(135deg, #43a047, #2e7d32)',
              color: '#fff',
              marginBottom: '25px'
            }}
          >
            <h3 className="fw-bold">🌱 Manage My Crops</h3>
            <p className="mb-0">Add and track your crops easily</p>
          </div>

          {message && (
            <div className="alert alert-info text-center fw-semibold">
              {message}
            </div>
          )}

          {/* 🧊 Add Crop Form */}
          <div
            style={{
              padding: '25px',
              borderRadius: '15px',
              background: 'rgba(255,255,255,0.6)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 5px 20px rgba(0,0,0,0.1)',
              marginBottom: '40px'
            }}
          >
            <h5 className="mb-3">➕ Add New Crop</h5>

            <form onSubmit={handleSubmit}>
              <div className="row g-3">

                <div className="col-md-6">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="🌱 Crop Name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                    style={{ borderRadius: '10px', padding: '12px' }}
                  />
                </div>

                <div className="col-md-3">
                  <input
                    type="number"
                    className="form-control"
                    placeholder="💰 Price (₹)"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    required
                    style={{ borderRadius: '10px', padding: '12px' }}
                  />
                </div>

                <div className="col-md-3">
                  <input
                    type="number"
                    className="form-control"
                    placeholder="📦 Quantity (kg)"
                    value={form.quantity}
                    onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                    required
                    style={{ borderRadius: '10px', padding: '12px' }}
                  />
                </div>

              </div>

              <div className="mt-3">
                <textarea
                  className="form-control"
                  rows="3"
                  placeholder="📝 Description"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  required
                  style={{ borderRadius: '10px', padding: '12px' }}
                />
              </div>

              <div className="mt-3">
                <input
                  type="file"
                  className="form-control"
                  onChange={handleImageChange}
                />

                {preview && (
                  <img
                    src={preview}
                    alt="preview"
                    style={{
                      marginTop: '15px',
                      width: '120px',
                      borderRadius: '10px',
                      boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
                    }}
                  />
                )}
              </div>

              <button
                type="submit"
                className="btn mt-3"
                style={{
                  background: 'linear-gradient(135deg, #4caf50, #2e7d32)',
                  color: '#fff',
                  borderRadius: '10px',
                  padding: '10px 20px'
                }}
              >
                Add Crop
              </button>
            </form>
          </div>

          {/* 📦 Crop Cards */}
          <h5 className="mb-3">My Crops ({crops.length})</h5>

          <div className="row g-4">
            {crops.map((crop) => (
              <div className="col-md-6 col-lg-4" key={crop._id}>
                <div
                  style={{
                    borderRadius: '15px',
                    overflow: 'hidden',
                    background: '#fff',
                    boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
                    transition: '0.3s',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 5px 15px rgba(0,0,0,0.1)';
                  }}
                >
                  {crop.image && (
                    <img
                      src={`http://localhost:5000${crop.image}`}
                      alt={crop.name}
                      style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                    />
                  )}

                  <div style={{ padding: '15px' }}>
                    <h5>{crop.name}</h5>
                    <p style={{ color: '#2e7d32', fontWeight: 'bold' }}>
                      ₹{crop.price} / kg
                    </p>
                    <p style={{ fontSize: '14px' }}>
                      📦 {crop.quantity} kg
                    </p>
                    <p style={{ color: '#777', fontSize: '14px' }}>
                      {crop.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}