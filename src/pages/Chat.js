import { useState, useEffect, useRef, useContext } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { AuthContext } from '../context/AuthContext';

const socket = io('http://localhost:5000', { withCredentials: true });

export default function Chat() {
  const { user } = useContext(AuthContext);
  
  const [buyers, setBuyers] = useState([]);
  const [selectedBuyer, setSelectedBuyer] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  // Fetch buyers
  useEffect(() => {
    const fetchBuyers = async () => {
      if (!user?.id) return;
      try {
        setLoading(true);
        const res = await axios.get('http://localhost:5000/api/orders/farmer', { withCredentials: true });
        const orders = res.data.orders || [];
        const unique = [];
        const seen = new Set();

        orders.forEach(order => {
          if (order.buyerId && !seen.has(order.buyerId._id)) {
            seen.add(order.buyerId._id);
            unique.push({
              _id: order.buyerId._id,
              name: order.buyerId.name || 'Unknown',
              location: order.buyerId.location || ''
            });
          }
        });
        setBuyers(unique);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBuyers();
  }, [user]);

  // Real-time Chat Logic
  useEffect(() => {
    if (!selectedBuyer || !user?.id) return;

    // Join room
    socket.emit('joinChat', { senderId: user.id, receiverId: selectedBuyer._id });

    // Load history
    const loadHistory = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/messages/chat/${selectedBuyer._id}`, { withCredentials: true });
        setMessages(res.data.messages || []);
      } catch (e) { }
    };
    loadHistory();

    // Receive message from other user
    socket.on('receiveMessage', (msg) => {
      setMessages(prev => [...prev, msg]);
    });

    return () => socket.off('receiveMessage');
  }, [selectedBuyer, user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedBuyer || !user?.id) return;

    const data = {
      senderId: user.id,
      receiverId: selectedBuyer._id,
      message: newMessage.trim()
    };

    socket.emit('sendMessage', data);

    // Show instantly on my screen
    setMessages(prev => [...prev, { ...data, createdAt: new Date() }]);
    setNewMessage('');
  };

  return (
    <div className="d-flex">
      <Sidebar />
      <div style={{ marginLeft: '260px', width: '100%' }}>
        <Navbar />
        <div className="container mt-4">
          <h3 className="mb-4">💬 Real-time Chat with Buyers</h3>

          <div className="row">
            <div className="col-md-4">
              <div className="card h-100">
                <div className="card-header bg-success text-white">
                  <strong>Buyers Who Ordered From You</strong>
                </div>
                <div className="list-group list-group-flush">
                  {loading ? <div className="p-4 text-center">Loading...</div> : buyers.length === 0 ? (
                    <div className="p-5 text-center text-muted">No buyers yet</div>
                  ) : (
                    buyers.map(b => (
                      <button
                        key={b._id}
                        className={`list-group-item list-group-item-action ${selectedBuyer?._id === b._id ? 'active' : ''}`}
                        onClick={() => setSelectedBuyer(b)}
                      >
                        <strong>{b.name}</strong>
                        {b.location && <small className="d-block">📍 {b.location}</small>}
                      </button>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="col-md-8">
              {selectedBuyer ? (
                <div className="card" style={{ minHeight: '620px' }}>
                  <div className="card-header bg-success text-white">
                    Chat with {selectedBuyer.name}
                  </div>
                  <div className="card-body overflow-auto" style={{ height: '480px' }}>
                    {messages.map((m, i) => (
                      <div key={i} className={`mb-3 ${m.senderId === user.id ? 'text-end' : ''}`}>
                        <div className={`d-inline-block p-3 rounded-3 ${m.senderId === user.id ? 'bg-success text-white' : 'bg-light'}`}>
                          {m.message}
                        </div>
                        <small className="text-muted d-block mt-1">
                          {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </small>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                  <div className="card-footer p-3">
                    <div className="input-group">
                      <input 
                        type="text" 
                        className="form-control" 
                        value={newMessage}
                        placeholder="Type message..."
                        onChange={e => setNewMessage(e.target.value)}
                        onKeyPress={e => e.key === 'Enter' && sendMessage()}
                      />
                      <button className="btn btn-success" onClick={sendMessage}>Send</button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="card h-100 d-flex align-items-center justify-content-center text-muted" style={{ minHeight: '500px' }}>
                  Select a buyer to start chatting
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}