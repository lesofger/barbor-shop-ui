import React from 'react';

function BusinessInfo({ businessInfo }) {
  if (!businessInfo) {
    return (
      <div className="business-info">
        <div className="info-card">
          <h3>Loading...</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="business-info">
      <div className="info-card">
        <h3>📍 Location</h3>
        <p>{businessInfo.contact?.address || businessInfo.location || '1400 S Figueroa St, Suite 101, Los Angeles, California, 90015'}</p>
      </div>

      <div className="info-card">
        <h3>📞 Contact</h3>
        <p>
          <a href={`tel:${businessInfo.contact?.phone || '(213) 536-5099'}`}>
            {businessInfo.contact?.phone || '(213) 536-5099'}
          </a>
        </p>
      </div>

      {businessInfo.description && (
        <div className="info-card">
          <h3>About Us</h3>
          <p>{businessInfo.description}</p>
        </div>
      )}

      <div className="info-card highlight">
        <h3>✨ Why Choose Us?</h3>
        <ul>
          <li>Decades of Experience</li>
          <li>Detailed Grooming</li>
          <li>Relaxing Atmosphere</li>
          <li>Walk-ins Welcome</li>
          <li>Complimentary Parking</li>
        </ul>
      </div>
    </div>
  );
}

export default BusinessInfo;

