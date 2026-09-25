# SkillBridge Frontend Integration Guide

This guide explains how the existing React frontend interacts with the Spring Boot backend services.

---

## 1. Base URLs Matrix

| Module | Base URL |
| :--- | :--- |
| **Auth Service** | `http://localhost:8081` |
| **Profile Service** | `http://localhost:8082` |
| **Career Service** | `http://localhost:8083` |
| **Skill Service** | `http://localhost:8084` |
| **Evidence Service** | `http://localhost:8085` |
| **Assessment Service** | `http://localhost:8086` |
| **Learning Service** | `http://localhost:8087` |
| **Project Service** | `http://localhost:8088` |
| **Job Service** | `http://localhost:8089` |
| **Portfolio Service** | `http://localhost:8090` |
| **Notification Service** | `http://localhost:8091` |
| **Analytics Service** | `http://localhost:8092` |
| **Career Readiness Engine** | `http://localhost:8093` |
| **Unified Single Server (Optional)** | `http://localhost:8080` |

---

## 2. JWT Authentication Header

All private API requests require the JWT Token stored upon login/register in `localStorage` under `skillbridge_auth_token`:

```http
Authorization: Bearer <token>
```

Example request in Axios / Fetch:

```javascript
axios.get('http://localhost:8093/api/readiness', {
  headers: {
    Authorization: `Bearer ${localStorage.getItem('skillbridge_auth_token')}`
  }
});
```

---

## 3. Switching from Frontend Mock Data to Backend APIs

In the existing frontend `.env` or `apiClient.js`:

Change:
```env
VITE_USE_MOCK_DATA=false
VITE_API_BASE_URL=http://localhost:8080
```
*(Or set individual service URLs for independent microservice operation).*

---

## 4. CORS Configuration

The backend is configured with permissive CORS settings supporting local development origins:
- `http://localhost:5173`
- `http://localhost:3000`
- `http://127.0.0.1:5173`

Configurable via environment variable:
```env
FRONTEND_URL=http://localhost:5173
```

---

## 5. Standard JSON Response Contract

All backend responses wrap payload data inside a standard envelope:

**Success Response (HTTP 200 OK):**
```json
{
  "success": true,
  "data": {
    "studentName": "Sankari Ganeshan",
    "competencyCoverage": 67
  },
  "message": "Request successful"
}
```

**Error Response (HTTP 400 / 401 / 404 / 500):**
```json
{
  "success": false,
  "data": null,
  "message": "Invalid credentials",
  "errorCode": "INVALID_CREDENTIALS"
}
```
