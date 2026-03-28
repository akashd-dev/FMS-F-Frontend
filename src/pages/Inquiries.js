import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

export default function Inquiries() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      setError('');
      
      const res = await axios.get('http://localhost:5000/api/inquiries/farmer', { 
        withCredentials: true 
      });

      if (res.data.success) {
        setInquiries(res.data.inquiries || []);
      } else {
        setError(res.data.message || "Failed to load inquiries");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Could not load inquiries. Please check if you are logged in.");
    } finally {
      setLoading(false);
    }
  };

  const sendReply = async (inquiryId) => {
    const replyMsg = prompt("Write your reply to the buyer:");
    if (!replyMsg || !replyMsg.trim()) return;

    try {
      const res = await axios.post('http://localhost:5000/api/inquiries/reply', {
        inquiryId,
        message: replyMsg.trim()
      }, { withCredentials: true });

      if (res.data.success) {
        alert("Reply sent successfully!");
        fetchInquiries(); // Refresh list
      }
    } catch (err) {
      alert("Failed to send reply");
    }
  };

  return (
    <div className="d-flex">
      <Sidebar />
      <div style={{ marginLeft: '260px', width: '100%' }}>
        <Navbar />

        <div className="container mt-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h3>📥 Inquiries from Buyers</h3>
            <button className="btn btn-outline-success" onClick={fetchInquiries}>
              Refresh
            </button>
          </div>

          {loading && <p className="text-center">Loading inquiries...</p>}
          {error && <div className="alert alert-danger">{error}</div>}

          {!loading && inquiries.length === 0 && !error && (
            <div className="card p-5 text-center">
              <h5>No inquiries received yet</h5>
              <p className="text-muted">When buyers send inquiries on your crops, they will appear here.</p>
            </div>
          )}

          <div className="row g-3">
            {inquiries.map((inq) => (
              <div className="col-12" key={inq._id}>
                <div className="card">
                  <div className="card-header d-flex justify-content-between bg-light">
                    <strong>Crop: {inq.cropId?.name || 'Unknown Crop'}</strong>
                    <span className={`badge ${inq.status === 'pending' ? 'bg-warning' : 'bg-success'}`}>
                      {inq.status}
                    </span>
                  </div>

                  <div className="card-body">
                    <p><strong>Buyer:</strong> {inq.buyerId?.name || 'Unknown Buyer'}</p>
                    <p><strong>Inquiry:</strong> {inq.message}</p>

                    {inq.replies && inq.replies.length > 0 && (
                      <div className="mt-3">
                        <strong>Replies:</strong>
                        {inq.replies.map((reply, i) => (
                          <div key={i} className="mt-2 p-2 border-start border-primary ps-3">
                            <small className="text-muted">
                              {new Date(reply.createdAt).toLocaleString()}
                            </small>
                            <p className="mb-0">{reply.message}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    <button 
                      className="btn btn-success mt-3"
                      onClick={() => sendReply(inq._id)}
                    >
                      Reply to Buyer
                    </button>
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