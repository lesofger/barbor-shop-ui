import React, { useState, useEffect, useRef } from 'react';
import ChatInterface from './components/ChatInterface';
import BusinessInfo from './components/BusinessInfo';
import AppointmentBooking from './components/AppointmentBooking';
import { getBusinessInfo, healthCheck } from './api';
import './styles.css';

function App() {
  const [businessInfo, setBusinessInfo] = useState(null);
  const [activeTab, setActiveTab] = useState('chat');
  const [apiStatus, setApiStatus] = useState('checking');
  const [showBooking, setShowBooking] = useState(false);

  useEffect(() => {
    // Check API health
    healthCheck().then(status => {
      if (status.status === 'healthy') {
        setApiStatus('online');
      } else {
        setApiStatus('offline');
      }
    });

    // Load business info
    getBusinessInfo()
      .then(data => setBusinessInfo(data))
      .catch(err => {
        console.error('Failed to load business info:', err);
        // Set default info if API fails
        setBusinessInfo({
          name: 'Mandatory Barber Lounge',
          contact: {
            phone: '(213) 536-5099',
            address: '1400 S Figueroa St, Suite 101, Los Angeles, California, 90015'
          }
        });
      });
  }, []);

  const handleBookingIntent = () => {
    setShowBooking(true);
    setActiveTab('booking');
  };

  return (
    <div className="app">
      <header className="header">
        <div className="container">
          <div className="header-content">
            <div className="logo-section">
              <h1 className="logo">Mandatory Barber Lounge</h1>
              <p className="tagline">Where Quality Grooming is Mandatory!</p>
            </div>
            <div className="status-indicator">
              <span className={`status-dot ${apiStatus}`}></span>
              <span className="status-text">
                {apiStatus === 'online' ? 'AI Assistant Online' : 
                 apiStatus === 'offline' ? 'AI Assistant Offline' : 'Checking...'}
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="main-content">
        <div className="container">
          <div className="content-grid">
            <aside className="sidebar">
              <BusinessInfo businessInfo={businessInfo} />
            </aside>

            <div className="main-panel">
              <div className="tabs">
                <button
                  className={`tab ${activeTab === 'chat' ? 'active' : ''}`}
                  onClick={() => setActiveTab('chat')}
                >
                  💬 Chat with AI
                </button>
                <button
                  className={`tab ${activeTab === 'booking' ? 'active' : ''}`}
                  onClick={() => setActiveTab('booking')}
                >
                  📅 Book Appointment
                </button>
              </div>

              <div className="tab-content">
                {activeTab === 'chat' && (
                  <ChatInterface onBookingIntent={handleBookingIntent} />
                )}
                {activeTab === 'booking' && (
                  <AppointmentBooking businessInfo={businessInfo} />
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="footer">
        <div className="container">
          <p>&copy; 2025 Mandatory Barber Lounge. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;

