import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { AuthContext } from '../context/AuthContext';

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  
  const [stats, setStats] = useState({
    totalCrops: 0,
    pendingOrders: 0,
    totalProfit: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      setError('');

      // 1. Get My Crops Count
      const cropsRes = await axios.get('http://localhost:5000/api/crops/my', { 
        withCredentials: true 
      });
      const totalCrops = cropsRes.data.crops?.length || 0;

      // 2. Get Orders for Farmer
      const ordersRes = await axios.get('http://localhost:5000/api/orders/farmer', { 
        withCredentials: true 
      });
      const orders = ordersRes.data.orders || [];

      const pendingOrders = orders.filter(order => order.status === 'pending').length;

      // 3. Calculate Profit (Simple: sum of totalPrice for 'delivered' or 'confirmed' orders)
      const deliveredOrders = orders.filter(order => 
        order.status === 'delivered' || order.status === 'confirmed'
      );
      const totalProfit = deliveredOrders.reduce((sum, order) => sum + order.totalPrice, 0);

      setStats({
        totalCrops,
        pendingOrders,
        totalProfit
      });

    } catch (err) {
      console.error(err);
      setError("Failed to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex" style={{ background: '#f5f7fa', minHeight: '100vh' }}>
      <Sidebar />

      <div style={{ marginLeft: '260px', width: '100%' }}>
        <Navbar />

        <div className="container-fluid p-4">

          {/* Header Banner */}
          <div
            className="p-4 mb-4 text-white"
            style={{
              borderRadius: '15px',
              background: 'linear-gradient(135deg, #43a047, #2e7d32)',
              boxShadow: '0 8px 20px rgba(0,0,0,0.15)'
            }}
          >
            <h2 className="fw-bold">Welcome back, {user?.name} 👋</h2>
            <p className="mb-0 opacity-75">
              Manage your farm efficiently from one place 🌾
            </p>
          </div>

          {error && <div className="alert alert-danger">{error}</div>}

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-success" role="status"></div>
              <p className="mt-3">Loading your farm data...</p>
            </div>
          ) : (
            <>
              {/* Real Stats Cards */}
              <div className="row g-4">

                {/* My Crops */}
                <div className="col-md-4">
                  <div
                    className="p-4 text-white"
                    style={{
                      borderRadius: '15px',
                      background: 'linear-gradient(135deg, #66bb6a, #388e3c)',
                      transition: '0.3s',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    <h6 className="mb-2">🌱 My Crops</h6>
                    <h2 className="fw-bold">{stats.totalCrops}</h2>
                    <small>Total crops listed</small>
                  </div>
                </div>

                {/* Pending Orders */}
                <div className="col-md-4">
                  <div
                    className="p-4 text-white"
                    style={{
                      borderRadius: '15px',
                      background: 'linear-gradient(135deg, #ffa726, #fb8c00)',
                      transition: '0.3s',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    <h6 className="mb-2">📦 Pending Orders</h6>
                    <h2 className="fw-bold">{stats.pendingOrders}</h2>
                    <small>Orders awaiting confirmation</small>
                  </div>
                </div>

                {/* Today's / Total Profit */}
                <div className="col-md-4">
                  <div
                    className="p-4 text-white"
                    style={{
                      borderRadius: '15px',
                      background: 'linear-gradient(135deg, #26c6da, #00838f)',
                      transition: '0.3s',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    <h6 className="mb-2">💰 Total Profit</h6>
                    <h2 className="fw-bold">₹{stats.totalProfit.toLocaleString()}</h2>
                    <small>From confirmed/delivered orders</small>
                  </div>
                </div>

              </div>

              {/* Recent Activity Section (You can enhance this later with real logs) */}
              <div className="row mt-5 g-4">
                <div className="col-md-6">
                  <div className="p-4 bg-white" style={{ borderRadius: '15px', boxShadow: '0 5px 15px rgba(0,0,0,0.08)' }}>
                    <h5 className="mb-3">📊 Recent Activity</h5>
                    <ul className="list-unstyled text-muted">
                      <li className="mb-2">• {stats.totalCrops} crops are currently listed</li>
                      <li className="mb-2">• {stats.pendingOrders} orders are pending</li>
                      <li>• Total earnings so far: ₹{stats.totalProfit.toLocaleString()}</li>
                    </ul>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="p-4 text-white" style={{ borderRadius: '15px', background: 'linear-gradient(135deg, #8e24aa, #5e35b1)' }}>
                    <h5>💡 Quick Tip</h5>
                    <p className="mb-0">
                      Regularly update your crop prices and availability to get more orders from buyers.
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}