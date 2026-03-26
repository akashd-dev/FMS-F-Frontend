import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/orders/farmer', { 
        withCredentials: true 
      });
      setOrders(res.data.orders || []);
    } catch (err) {
      console.error("Failed to fetch orders", err);
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
          <h3 className="mb-4">📦 My Orders (Received from Buyers)</h3>

          {loading ? (
            <div className="text-center">Loading orders...</div>
          ) : orders.length === 0 ? (
            <div className="alert alert-info">No orders received yet.</div>
          ) : (
            <div className="row g-4">
              {orders.map((order) => (
                <div className="col-12" key={order._id}>
                  <div className="card p-4">
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <h5>{order.cropId?.name || 'Crop'}</h5>
                        <p className="mb-1">
                          Buyer: <strong>{order.buyerId?.name || 'Unknown Buyer'}</strong>
                        </p>
                        <p className="mb-1">
                          Quantity: <strong>{order.quantity} kg</strong>
                        </p>
                        <p className="mb-0 text-success">
                          Total: ₹{order.totalPrice}
                        </p>
                      </div>
                      <div className={`badge fs-6 ${order.status === 'pending' ? 'bg-warning' : 
                        order.status === 'confirmed' ? 'bg-success' : 'bg-info'}`}>
                        {order.status.toUpperCase()}
                      </div>
                    </div>
                    <small className="text-muted mt-2 d-block">
                      Ordered on: {new Date(order.createdAt).toLocaleDateString()}
                    </small>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}