import { useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

export default function ProfitCalculator() {
  const [cost, setCost] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState(1);

  const profit = (price - cost) * quantity;

  return (
    <div className="d-flex">
      <Sidebar />
      <div style={{ marginLeft: '260px', width: '100%' }}>
        <Navbar />
        <div className="container mt-5">
          <div className="card p-5 mx-auto" style={{ maxWidth: '600px' }}>
            <h3 className="text-center text-success mb-4">💰 Real-time Profit / Loss Calculator</h3>
            
            <div className="mb-3">
              <label>Cost per kg (₹)</label>
              <input type="number" className="form-control" value={cost} onChange={(e) => setCost(Number(e.target.value))} />
            </div>
            <div className="mb-3">
              <label>Selling Price per kg (₹)</label>
              <input type="number" className="form-control" value={price} onChange={(e) => setPrice(Number(e.target.value))} />
            </div>
            <div className="mb-4">
              <label>Quantity (kg)</label>
              <input type="number" className="form-control" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} min="1" />
            </div>

            <div className="text-center p-4 bg-light rounded-3">
              <h4>Net Result</h4>
              <h2 className={profit >= 0 ? 'profit-positive' : 'profit-negative'}>
                {profit >= 0 ? 'Profit' : 'Loss'}: ₹{profit.toFixed(2)}
              </h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}