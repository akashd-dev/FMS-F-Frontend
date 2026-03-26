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
    data.append('name', form.name);
    data.append('price', form.price);
    data.append('quantity', form.quantity);
    data.append('description', form.description);
    if (image) data.append('image', image);

    try {
      await axios.post('http://localhost:5000/api/crops/add', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true
      });
      setMessage('Crop added successfully!');
      setForm({ name: '', price: '', quantity: '', description: '' });
      setImage(null);
      setPreview(null);
      fetchCrops();
    } catch (err) {
      setMessage('Error adding crop');
    }
  };

  return (
    <div className="d-flex">
      <Sidebar />
      <div style={{ marginLeft: '260px', width: '100%' }}>
        <Navbar />
        <div className="container mt-4">
          <h3 className="mb-4">🌱 Manage My Crops</h3>

          {message && <div className="alert alert-success">{message}</div>}

          {/* Add Crop Form */}
          <div className="card p-4 mb-5">
            <h5>Add New Crop</h5>
            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-md-6">
                  <input type="text" className="form-control" placeholder="Crop Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                </div>
                <div className="col-md-3">
                  <input type="number" className="form-control" placeholder="Price (₹)" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
                </div>
                <div className="col-md-3">
                  <input type="number" className="form-control" placeholder="Quantity (kg)" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} required />
                </div>
              </div>
              <div className="mt-3">
                <textarea className="form-control" rows="3" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required></textarea>
              </div>
              <div className="mt-3">
                <input type="file" className="form-control" accept="image/*" onChange={handleImageChange} />
                {preview && <img src={preview} alt="preview" className="mt-3 crop-image" />}
              </div>
              <button type="submit" className="btn btn-primary mt-3">Add Crop</button>
            </form>
          </div>

          {/* My Crops List */}
          <h5>My Crops ({crops.length})</h5>
          <div className="row g-4">
            {crops.map((crop) => (
              <div className="col-md-6 col-lg-4" key={crop._id}>
                <div className="card h-100">
                  {crop.image && <img src={`http://localhost:5000${crop.image}`} alt={crop.name} className="crop-image" />}
                  <div className="card-body">
                    <h5 className="card-title">{crop.name}</h5>
                    <p className="text-success">₹{crop.price} / kg • {crop.quantity} kg</p>
                    <p className="card-text text-muted">{crop.description}</p>
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