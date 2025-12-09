# API Documentation

## Base URL
```
http://localhost:8000
```

## Authentication
Currently, the API does not require authentication. In production, implement API key or JWT authentication.

---

## Endpoints

### 1. Health Check

**GET** `/health`

Check the health status of the API and its dependencies.

**Response:**
```json
{
  "status": "healthy",
  "vector_store": true,
  "calendar": true,
  "retell": true,
  "chatbot": true
}
```

---

### 2. Chat with AI Assistant

**POST** `/chat`

Send a message to the AI chatbot and receive a response.

**Request Body:**
```json
{
  "message": "What services do you offer?",
  "conversation_id": "optional-conversation-id"
}
```

**Response:**
```json
{
  "response": "We offer a variety of services including men's haircuts, beard trims, hot towel shaves, and more...",
  "booking_intent": {
    "wants_to_book": false,
    "service": null,
    "date": null,
    "time": null,
    "name": null
  },
  "context_used": true
}
```

**Example Request:**
```bash
curl -X POST "http://localhost:8000/chat" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What are your business hours?",
    "conversation_id": "user-123"
  }'
```

---

### 3. Book Appointment

**POST** `/appointments/book`

Book an appointment in the calendar.

**Request Body:**
```json
{
  "customer_name": "John Doe",
  "service": "Men's Haircut",
  "date_time": "2025-12-15T14:30:00",
  "customer_email": "john@example.com",
  "customer_phone": "+1234567890"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Appointment confirmed for December 15, 2025 at 02:30 PM",
  "appointment_id": "event-id-123",
  "link": "https://calendar.google.com/event?eid=..."
}
```

**Example Request:**
```bash
curl -X POST "http://localhost:8000/appointments/book" \
  -H "Content-Type: application/json" \
  -d '{
    "customer_name": "John Doe",
    "service": "Haircut and Beard Trim",
    "date_time": "2025-12-15T14:30:00",
    "customer_email": "john@example.com",
    "customer_phone": "+1234567890"
  }'
```

---

### 4. Get Available Slots

**POST** `/appointments/available-slots`

Get available appointment time slots for a specific date.

**Request Body:**
```json
{
  "date": "2025-12-15"
}
```

**Response:**
```json
{
  "date": "2025-12-15",
  "available_slots": [
    {
      "time": "2025-12-15T09:00:00",
      "display": "09:00 AM"
    },
    {
      "time": "2025-12-15T09:30:00",
      "display": "09:30 AM"
    }
  ]
}
```

**Example Request:**
```bash
curl -X POST "http://localhost:8000/appointments/available-slots" \
  -H "Content-Type: application/json" \
  -d '{
    "date": "2025-12-15"
  }'
```

---

### 5. Get Appointments

**GET** `/appointments`

Retrieve appointments within a date range.

**Query Parameters:**
- `start_date` (optional): Start date in YYYY-MM-DD format
- `end_date` (optional): End date in YYYY-MM-DD format

**Response:**
```json
{
  "appointments": [
    {
      "id": "event-id-123",
      "summary": "Men's Haircut - John Doe",
      "start": {
        "dateTime": "2025-12-15T14:30:00-08:00",
        "timeZone": "America/Los_Angeles"
      },
      "end": {
        "dateTime": "2025-12-15T15:00:00-08:00",
        "timeZone": "America/Los_Angeles"
      },
      "description": "Service: Men's Haircut\n\nCustomer: John Doe\nPhone: +1234567890"
    }
  ]
}
```

**Example Request:**
```bash
curl "http://localhost:8000/appointments?start_date=2025-12-15&end_date=2025-12-20"
```

---

### 6. Create Phone Call

**POST** `/phone/call`

Initiate an outbound phone call via Retell.ai.

**Request Body:**
```json
{
  "from_number": "+1234567890",
  "to_number": "+0987654321",
  "metadata": {
    "customer_name": "John Doe",
    "purpose": "appointment_reminder"
  }
}
```

**Response:**
```json
{
  "call_id": "call-123",
  "status": "initiated"
}
```

**Example Request:**
```bash
curl -X POST "http://localhost:8000/phone/call" \
  -H "Content-Type: application/json" \
  -d '{
    "from_number": "+1234567890",
    "to_number": "+0987654321",
    "metadata": {
      "customer_name": "John Doe"
    }
  }'
```

---

### 7. List Phone Calls

**GET** `/phone/calls`

List recent phone calls.

**Query Parameters:**
- `limit` (optional): Number of calls to return (default: 10)

**Response:**
```json
{
  "calls": [
    {
      "call_id": "call-123",
      "status": "ended",
      "from_number": "+1234567890",
      "to_number": "+0987654321",
      "start_timestamp": 1701945600
    }
  ]
}
```

**Example Request:**
```bash
curl "http://localhost:8000/phone/calls?limit=20"
```

---

### 8. Get Phone Call Details

**GET** `/phone/calls/{call_id}`

Get details of a specific phone call.

**Response:**
```json
{
  "call_id": "call-123",
  "status": "ended",
  "from_number": "+1234567890",
  "to_number": "+0987654321",
  "start_timestamp": 1701945600,
  "end_timestamp": 1701945900,
  "duration": 300
}
```

**Example Request:**
```bash
curl "http://localhost:8000/phone/calls/call-123"
```

---

### 9. List Agents

**GET** `/phone/agents`

List all Retell.ai agents.

**Response:**
```json
{
  "agents": [
    {
      "agent_id": "agent-123",
      "agent_name": "Barbershop Assistant",
      "status": "active"
    }
  ]
}
```

**Example Request:**
```bash
curl "http://localhost:8000/phone/agents"
```

---

### 10. Get Agent Details

**GET** `/phone/agents/{agent_id}`

Get details of a specific agent.

**Response:**
```json
{
  "agent_id": "agent-123",
  "agent_name": "Barbershop Assistant",
  "status": "active",
  "llm_websocket_url": "wss://..."
}
```

**Example Request:**
```bash
curl "http://localhost:8000/phone/agents/agent-123"
```

---

### 11. Retell.ai Webhook

**POST** `/phone/webhook`

Handle webhook events from Retell.ai.

**Request Body:**
```json
{
  "event": "call_started",
  "call_id": "call-123",
  "timestamp": "2025-12-07T10:00:00Z"
}
```

**Response:**
```json
{
  "status": "ok"
}
```

---

### 12. Refresh Scraped Data

**POST** `/scrape/refresh`

Refresh the website data by re-scraping all pages. This runs in the background.

**Response:**
```json
{
  "message": "Scraping started in background"
}
```

**Example Request:**
```bash
curl -X POST "http://localhost:8000/scrape/refresh"
```

---

### 13. Get Business Information

**GET** `/business/info`

Get business information extracted from the website.

**Response:**
```json
{
  "name": "Mandatory Barber Lounge",
  "url": "https://mandatorybarberlounge.com",
  "description": "Premium barbershop in Los Angeles...",
  "contact": {
    "phone": "(213) 536-5099",
    "address": "1400 S Figueroa St, Suite 101, Los Angeles, California, 90015"
  },
  "services": [],
  "hours": {},
  "location": "1400 S Figueroa St, Suite 101, Los Angeles, California, 90015"
}
```

**Example Request:**
```bash
curl "http://localhost:8000/business/info"
```

---

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "detail": "Invalid date format: ..."
}
```

### 500 Internal Server Error
```json
{
  "detail": "Error message..."
}
```

### 503 Service Unavailable
```json
{
  "detail": "Chatbot not initialized"
}
```

---

## Frontend Integration Examples

### JavaScript/TypeScript

```typescript
const API_BASE_URL = 'http://localhost:8000';

// Chat with AI
async function chat(message: string, conversationId?: string) {
  const response = await fetch(`${API_BASE_URL}/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message,
      conversation_id: conversationId,
    }),
  });
  return await response.json();
}

// Book appointment
async function bookAppointment(data: {
  customer_name: string;
  service: string;
  date_time: string;
  customer_email?: string;
  customer_phone?: string;
}) {
  const response = await fetch(`${API_BASE_URL}/appointments/book`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return await response.json();
}

// Get available slots
async function getAvailableSlots(date: string) {
  const response = await fetch(`${API_BASE_URL}/appointments/available-slots`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ date }),
  });
  return await response.json();
}
```

### Python

```python
import requests

API_BASE_URL = "http://localhost:8000"

# Chat with AI
def chat(message: str, conversation_id: str = None):
    response = requests.post(
        f"{API_BASE_URL}/chat",
        json={
            "message": message,
            "conversation_id": conversation_id
        }
    )
    return response.json()

# Book appointment
def book_appointment(customer_name: str, service: str, date_time: str, 
                    customer_email: str = None, customer_phone: str = None):
    response = requests.post(
        f"{API_BASE_URL}/appointments/book",
        json={
            "customer_name": customer_name,
            "service": service,
            "date_time": date_time,
            "customer_email": customer_email,
            "customer_phone": customer_phone
        }
    )
    return response.json()
```

---

## Interactive API Documentation

FastAPI automatically generates interactive API documentation:

- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

You can test all endpoints directly from these interfaces.

---

## Rate Limiting

Currently, there is no rate limiting implemented. In production, consider implementing:
- Rate limiting per IP address
- Rate limiting per API key
- Request throttling

---

## WebSocket Support (Future Enhancement)

For real-time chat, consider implementing WebSocket support:

```python
@app.websocket("/ws/chat")
async def websocket_chat(websocket: WebSocket):
    await websocket.accept()
    while True:
        data = await websocket.receive_text()
        # Process message and send response
        await websocket.send_text(response)
```

