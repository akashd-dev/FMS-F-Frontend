import { useContext } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { AuthContext } from '../context/AuthContext';

export default function Profile() {
  const { user } = useContext(AuthContext);

  return (
    <div className="d-flex" style={{ background: '#f4f6f9', minHeight: '100vh' }}>
      <Sidebar />

      <div style={{ marginLeft: '260px', width: '100%' }}>
        <Navbar />

        <div className="container-fluid p-4">

          {/* 🌈 Profile Banner */}
          <div
            style={{
              background: 'linear-gradient(135deg, #43a047, #2e7d32)',
              borderRadius: '20px',
              padding: '40px 30px',
              color: '#fff',
              textAlign: 'center',
              marginBottom: '40px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
            }}
          >
            {/* Avatar */}
            <div
              style={{
                width: '90px',
                height: '90px',
                borderRadius: '50%',
                background: '#fff',
                color: '#2e7d32',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '36px',
                fontWeight: 'bold',
                margin: '0 auto 15px'
              }}
            >
              {user?.name?.charAt(0).toUpperCase()}
            </div>

            <h3 className="fw-bold">{user?.name}</h3>
            <p style={{ opacity: 0.9 }}>{user?.email}</p>
          </div>

          {/* 📋 Profile Info Cards */}
          <div className="row g-4 justify-content-center">

            {/* Name */}
            <div className="col-md-6 col-lg-4">
              <div className="p-4"
                style={{
                  borderRadius: '15px',
                  background: 'rgba(255,255,255,0.7)',
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 5px 20px rgba(0,0,0,0.1)',
                  transition: '0.3s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <h6 style={{ color: '#777' }}>👤 Full Name</h6>
                <h5 className="fw-bold">{user?.name}</h5>
              </div>
            </div>

            {/* Email */}
            <div className="col-md-6 col-lg-4">
              <div className="p-4"
                style={{
                  borderRadius: '15px',
                  background: 'rgba(255,255,255,0.7)',
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 5px 20px rgba(0,0,0,0.1)',
                  transition: '0.3s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <h6 style={{ color: '#777' }}>📧 Email</h6>
                <h5 className="fw-bold">{user?.email}</h5>
              </div>
            </div>

            {/* Phone */}
            <div className="col-md-6 col-lg-4">
              <div className="p-4"
                style={{
                  borderRadius: '15px',
                  background: 'rgba(255,255,255,0.7)',
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 5px 20px rgba(0,0,0,0.1)',
                  transition: '0.3s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <h6 style={{ color: '#777' }}>📱 Phone</h6>
                <h5 className="fw-bold">{user?.phone || 'Not Provided'}</h5>
              </div>
            </div>

            {/* Location */}
            <div className="col-md-6 col-lg-4">
              <div className="p-4"
                style={{
                  borderRadius: '15px',
                  background: 'rgba(255,255,255,0.7)',
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 5px 20px rgba(0,0,0,0.1)',
                  transition: '0.3s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <h6 style={{ color: '#777' }}>📍 Location</h6>
                <h5 className="fw-bold">{user?.location || 'Not Provided'}</h5>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}