const API_BASE_URL = 'http://localhost:8000';

// Generate a unique conversation ID for this session
const getConversationId = () => {
  let id = sessionStorage.getItem('conversation_id');
  if (!id) {
    id = `conv-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('conversation_id', id);
  }
  return id;
};

// Chat with AI
export const chat = async (message) => {
  try {
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        conversation_id: getConversationId(),
      }),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Chat error:', error);
    throw error;
  }
};

// Get business information
export const getBusinessInfo = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/business/info`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Business info error:', error);
    throw error;
  }
};

// Get available appointment slots
export const getAvailableSlots = async (date) => {
  try {
    const response = await fetch(`${API_BASE_URL}/appointments/available-slots`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ date }),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Available slots error:', error);
    throw error;
  }
};

// Book appointment
export const bookAppointment = async (appointmentData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/appointments/book`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(appointmentData),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Booking error:', error);
    throw error;
  }
};

// Health check
export const healthCheck = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    return await response.json();
  } catch (error) {
    console.error('Health check error:', error);
    return { status: 'unhealthy', error: error.message };
  }
};

