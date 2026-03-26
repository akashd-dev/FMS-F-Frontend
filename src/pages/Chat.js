import { useState, useEffect, useRef, useContext } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { AuthContext } from '../context/AuthContext';

const socket = io('http://localhost:5000', { withCredentials: true });

export default function Chat() {
  const { user } = useContext(AuthContext);
  const [buyers, setBuyers] = useState([]);           // For demo - you can extend to fetch real buyers
  const [selectedBuyer, setSelectedBuyer] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  // Demo buyers (In production, fetch from backend or show only buyers who ordered from you)
  useEffect(() => {
    setBuyers([
      { _id: 'demo1', name: 'Rahul Sharma', location: 'Jamshedpur' },
      { _id: 'demo2', name: 'Priya Singh', location: 'Ranchi' },
    ]);
  }, []);

  useEffect(() => {
    if (!selectedBuyer) return;

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
        console.error("Failed to load chat history");
      }
    };

    fetchHistory();

    socket.on('receiveMessage', (msg) => {
      setMessages(prev => [...prev, msg]);
    });

    return () => socket.off('receiveMessage');
  }, [selectedBuyer, user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedBuyer) return;

    const messageData = {
      senderId: user.id,
      receiverId: selectedBuyer._id,
      message: newMessage.trim()
    };

    socket.emit('sendMessage', messageData);
    setMessages(prev => [...prev, { ...messageData, createdAt: new Date() }]);
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
            {/* Buyers List */}
            <div className="col-md-4">
              <div className="card h-100">
                <div className="card-header bg-success text-white">
                  <strong>Buyers</strong>
                </div>
                <div className="list-group list-group-flush">
                  {buyers.map(buyer => (
                    <button
                      key={buyer._id}
                      className={`list-group-item list-group-item-action ${selectedBuyer?._id === buyer._id ? 'active' : ''}`}
                      onClick={() => setSelectedBuyer(buyer)}
                    >
                      <strong>{buyer.name}</strong><br />
                      <small>{buyer.location}</small>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Chat Window */}
            <div className="col-md-8">
              {selectedBuyer ? (
                <div className="card h-100" style={{ minHeight: '600px' }}>
                  <div className="card-header bg-success text-white d-flex align-items-center">
                    <strong>Chat with {selectedBuyer.name}</strong>
                  </div>

                  <div className="card-body overflow-auto" style={{ height: '480px' }}>
                    {messages.map((msg, index) => (
                      <div 
                        key={index}
                        className={`mb-3 ${msg.senderId === user.id ? 'text-end' : ''}`}
                      >
                        <div 
                          className={`d-inline-block p-3 rounded-3 ${msg.senderId === user.id 
                            ? 'bg-success text-white' 
                            : 'bg-light'}`}
                        >
                          {msg.message}
                        </div>
                        <small className="text-muted d-block mt-1">
                          {new Date(msg.createdAt).toLocaleTimeString()}
                        </small>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>

                  <div className="card-footer">
                    <div className="input-group">
                      <input 
                        type="text" 
                        className="form-control" 
                        placeholder="Type your message..." 
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      />
                      <button className="btn btn-primary" onClick={sendMessage}>Send</button>
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