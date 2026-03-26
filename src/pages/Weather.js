import { useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

export default function Weather() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
let res;
  const fetchWeather = async () => {
  if (!city.trim()) {
    setError('Please enter a city name');
    return;
  }

  setLoading(true);
  setError('');

  try {
    const res = await axios.get(
      `http://localhost:5000/api/weather?city=${encodeURIComponent(city)}`
    );

    if (res.data.success) {
      setWeather(res.data.weather);
    } else {
      setError(res.data.message || 'Failed to fetch weather');
    }

  } catch (err) {
    console.error(err);
    setError('Server error or API issue');
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="d-flex">
      <Sidebar />
      <div style={{ marginLeft: '260px', width: '100%' }}>
        <Navbar />
        <div className="container mt-4">
          <h3 className="mb-4">☀️ Real-time Weather Information</h3>

          <div className="card p-4 mb-5" style={{ maxWidth: '600px' }}>
            <div className="input-group mb-3">
              <input 
                type="text" 
                className="form-control" 
                placeholder="Enter your city (e.g. Jamshedpur)" 
                value={city} 
                onChange={(e) => setCity(e.target.value)} 
              />
              <button 
                className="btn btn-primary" 
                onClick={fetchWeather}
                disabled={loading}
              >
                {loading ? 'Fetching...' : 'Get Weather'}
              </button>
            </div>
            {error && <div className="alert alert-danger">{error}</div>}
          </div>

          {weather && (
            <div className="card p-5 text-center fade-in" style={{ maxWidth: '600px', margin: '0 auto' }}>
              <img 
                src={weather.icon} 
                alt="weather icon" 
                style={{ width: '120px', height: '120px' }} 
              />
              <h2 className="mt-3">{weather.city}</h2>
              <h1 className="display-4 text-success">{Math.round(weather.temperature)}°C</h1>
              <h5 className="text-capitalize">{weather.description}</h5>

              <div className="row mt-4 text-center">
                <div className="col-6">
                  <strong>Humidity</strong><br />
                  <span className="fs-4">{weather.humidity}%</span>
                </div>
                <div className="col-6">
                  <strong>Condition</strong><br />
                  <span className="fs-4">{weather.condition}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}