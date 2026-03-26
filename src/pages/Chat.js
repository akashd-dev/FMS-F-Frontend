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

  // Fetch only buyers who have ordered from this farmer
  useEffect(() => {
    const fetchMyBuyers = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const res = await axios.get('http://localhost:5000/api/orders/farmer', { 
          withCredentials: true 
        });

        const orders = res.data.orders || [];

        // Get unique buyers from orders
        const uniqueBuyers = [];
        const buyerMap = new Map();

        orders.forEach(order => {
          if (order.buyerId && !buyerMap.has(order.buyerId._id)) {
            buyerMap.set(order.buyerId._id, {
              _id: order.buyerId._id,
              name: order.buyerId.name,
              location: order.buyerId.location || 'Unknown'
            });
            uniqueBuyers.push(buyerMap.get(order.buyerId._id));
          }
        });

        setBuyers(uniqueBuyers);
      } catch (err) {
        console.error("Failed to fetch buyers:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyBuyers();
  }, [user]);

  // Join room and load chat history when buyer is selected
  useEffect(() => {
    if (!selectedBuyer || !user) return;

    socket.emit('joinChat', { 
      senderId: user.id, 
      receiverId: selectedBuyer._id 
    });

    const fetchHistory = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/messages/chat/${selectedBuyer._id}`, 
          { withCredentials: true }
        );
        setMessages(res.data.messages || []);
      } catch (err) {
        console.error("Failed to load chat history", err);
      }
    };

    fetchHistory();

    // Listen for incoming messages
    socket.on('receiveMessage', (msg) => {
      setMessages(prev => [...prev, msg]);
    });

    return () => socket.off('receiveMessage');
  }, [selectedBuyer, user]);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedBuyer || !user) return;

    const messageData = {
      senderId: user.id,
      receiverId: selectedBuyer._id,
      message: newMessage.trim()
    };

    socket.emit('sendMessage', messageData);

    // Optimistically add message to UI
    setMessages(prev => [...prev, { 
      ...messageData, 
      createdAt: new Date() 
    }]);

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
            {/* Buyers List - Only those who ordered from you */}
            <div className="col-md-4">
              <div className="card h-100">
                <div className="card-header bg-success text-white">
                  <strong>Buyers Who Ordered From You</strong>
                </div>
                <div className="list-group list-group-flush">
                  {loading ? (
                    <div className="p-3 text-center text-muted">Loading buyers...</div>
                  ) : buyers.length === 0 ? (
                    <div className="p-4 text-center text-muted">
                      No buyers have ordered from you yet.<br />
                      <small>Orders will appear here automatically.</small>
                    </div>
                  ) : (
                    buyers.map(buyer => (
                      <button
                        key={buyer._id}
                        className={`list-group-item list-group-item-action ${selectedBuyer?._id === buyer._id ? 'active' : ''}`}
                        onClick={() => setSelectedBuyer(buyer)}
                      >
                        <strong>{buyer.name}</strong><br />
                        <small className="text-muted">📍 {buyer.location}</small>
                      </button>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Chat Window */}
            <div className="col-md-8">
              {selectedBuyer ? (
                <div className="card h-100" style={{ minHeight: '620px' }}>
                  <div className="card-header bg-success text-white d-flex align-items-center">
                    <strong>Chat with {selectedBuyer.name}</strong>
                  </div>

                  <div className="card-body overflow-auto" style={{ height: '480px' }}>
                    {messages.length === 0 ? (
                      <p className="text-center text-muted mt-5">
                        No messages yet. Say hello to start the conversation!
                      </p>
                    ) : (
                      messages.map((msg, index) => (
                        <div 
                          key={index}
                          className={`mb-3 ${msg.senderId === user.id ? 'text-end' : ''}`}
                        >
                          <div 
                            className={`d-inline-block p-3 rounded-3 ${
                              msg.senderId === user.id 
                                ? 'bg-success text-white' 
                                : 'bg-light border'
                            }`}
                          >
                            {msg.message}
                          </div>
                          <small className="text-muted d-block mt-1">
                            {new Date(msg.createdAt).toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </small>
                        </div>
                      ))
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  <div className="card-footer p-3">
                    <div className="input-group">
                      <input 
                        type="text" 
                        className="form-control" 
                        placeholder="Type your message..." 
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      />
                      <button className="btn btn-success" onClick={sendMessage}>
                        Send
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="card h-100 d-flex align-items-center justify-content-center text-muted" 
                     style={{ minHeight: '500px' }}>
                  Select a buyer from the left to start chatting
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}