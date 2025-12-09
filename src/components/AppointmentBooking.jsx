import React, { useState } from 'react';
import { getAvailableSlots, bookAppointment } from '../api';

function AppointmentBooking({ businessInfo }) {
  const [formData, setFormData] = useState({
    customer_name: '',
    service: 'Men\'s Haircut',
    date: '',
    time: '',
    customer_email: '',
    customer_phone: ''
  });
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [bookingStatus, setBookingStatus] = useState(null);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const services = [
    "Men's Haircut",
    "Beard Trim",
    "Hot Towel Shave",
    "Haircut and Beard Trim",
    "Haircut and Shave",
    "Full Service"
  ];

  const handleDateChange = async (e) => {
    const date = e.target.value;
    setFormData(prev => ({ ...prev, date, time: '' }));
    setAvailableSlots([]);

    if (date) {
      setLoadingSlots(true);
      try {
        const response = await getAvailableSlots(date);
        setAvailableSlots(response.available_slots || []);
      } catch (error) {
        console.error('Error fetching slots:', error);
        setAvailableSlots([]);
      } finally {
        setLoadingSlots(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setBookingStatus(null);

    // Combine date and time
    const dateTime = `${formData.date}T${formData.time}`;

    try {
      const result = await bookAppointment({
        customer_name: formData.customer_name,
        service: formData.service,
        date_time: dateTime,
        customer_email: formData.customer_email || undefined,
        customer_phone: formData.customer_phone || undefined
      });

      setBookingStatus({
        type: 'success',
        message: result.message || 'Appointment booked successfully!',
        appointmentId: result.appointment_id,
        link: result.link
      });

      // Reset form
      setFormData({
        customer_name: '',
        service: 'Men\'s Haircut',
        date: '',
        time: '',
        customer_email: '',
        customer_phone: ''
      });
      setAvailableSlots([]);
    } catch (error) {
      setBookingStatus({
        type: 'error',
        message: error.message || 'Failed to book appointment. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  return (
    <div className="appointment-booking">
      <h2>Book Your Appointment</h2>
      <p className="booking-subtitle">Fill out the form below to schedule your visit</p>

      {bookingStatus && (
        <div className={`booking-status ${bookingStatus.type}`}>
          <p>{bookingStatus.message}</p>
          {bookingStatus.link && (
            <a href={bookingStatus.link} target="_blank" rel="noopener noreferrer" className="calendar-link">
              Add to Google Calendar
            </a>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="booking-form">
        <div className="form-group">
          <label htmlFor="customer_name">Full Name *</label>
          <input
            type="text"
            id="customer_name"
            required
            value={formData.customer_name}
            onChange={(e) => setFormData(prev => ({ ...prev, customer_name: e.target.value }))}
            placeholder="John Doe"
          />
        </div>

        <div className="form-group">
          <label htmlFor="service">Service *</label>
          <select
            id="service"
            required
            value={formData.service}
            onChange={(e) => setFormData(prev => ({ ...prev, service: e.target.value }))}
          >
            {services.map(service => (
              <option key={service} value={service}>{service}</option>
            ))}
          </select>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="date">Date *</label>
            <input
              type="date"
              id="date"
              required
              min={getMinDate()}
              value={formData.date}
              onChange={handleDateChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="time">Time *</label>
            {loadingSlots ? (
              <div className="loading-slots">Loading available times...</div>
            ) : availableSlots.length > 0 ? (
              <select
                id="time"
                required
                value={formData.time}
                onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
              >
                <option value="">Select a time</option>
                {availableSlots.map(slot => (
                  <option key={slot.time} value={slot.time.split('T')[1]}>
                    {slot.display}
                  </option>
                ))}
              </select>
            ) : formData.date ? (
              <select id="time" disabled>
                <option value="">No slots available</option>
              </select>
            ) : (
              <select id="time" disabled>
                <option value="">Select date first</option>
              </select>
            )}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="customer_email">Email</label>
          <input
            type="email"
            id="customer_email"
            value={formData.customer_email}
            onChange={(e) => setFormData(prev => ({ ...prev, customer_email: e.target.value }))}
            placeholder="john@example.com"
          />
        </div>

        <div className="form-group">
          <label htmlFor="customer_phone">Phone Number</label>
          <input
            type="tel"
            id="customer_phone"
            value={formData.customer_phone}
            onChange={(e) => setFormData(prev => ({ ...prev, customer_phone: e.target.value }))}
            placeholder="+1234567890"
          />
        </div>

        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? 'Booking...' : 'Book Appointment'}
        </button>
      </form>
    </div>
  );
}

export default AppointmentBooking;

