# 📡 LogFetch API Reference

Complete API documentation for LogFetch and its backend connection.

---

## Overview

LogFetch communicates with Live-TV backend via REST API. All requests go to:

```
{VITE_LOG_BACKEND_URL}/api/logs
```

Example:
```
https://live-tv-proxy-a9mg.onrender.com/api/logs?action=recent
```

---

## Authentication

✅ **No authentication required** — All endpoints are public read-only

---

## Endpoints

### 1. Get Recent Logs

**Request**
```http
GET /api/logs?action=recent
```

**Parameters**
- `action` (required): `recent`
- `limit` (optional): Number of logs (default: 100)

**Response** (200 OK)
```json
{
  "logs": [
    {
      "id": 1,
      "timestamp": "2024-01-15T10:30:45.123Z",
      "level": "INFO",
      "category": "jio-login",
      "message": "User logged in successfully",
      "data": {
        "userId": "user123",
        "sessionId": "sess-abc123"
      },
      "session_id": "device-xyz"
    },
    {
      "id": 2,
      "timestamp": "2024-01-15T10:31:00.456Z",
      "level": "ERROR",
      "category": "stream",
      "message": "Stream URL fetch failed",
      "data": {
        "error": "Network timeout",
        "url": "https://jio-api.com/..."
      },
      "session_id": "vercel"
    }
  ],
  "total": 2
}
```

---

### 2. Get Error Logs

**Request**
```http
GET /api/logs?action=errors
```

**Parameters**
- `action` (required): `errors`

**Response** (200 OK)
```json
{
  "logs": [
    {
      "level": "ERROR",
      "category": "stream",
      "message": "Failed to fetch stream URL",
      "timestamp": "2024-01-15T10:31:00Z"
    }
  ],
  "errorCount": 5,
  "warningCount": 12
}
```

---

### 3. Get Stream Issues

**Request**
```http
GET /api/logs?action=stream-issues
```

**Purpose**: Returns logs related to video streaming problems (yt-dlp, Jio API).

**Response** (200 OK)
```json
{
  "logs": [
    {
      "level": "ERROR",
      "category": "stream",
      "message": "yt-dlp: Unable to extract video info",
      "timestamp": "2024-01-15T10:35:12Z",
      "data": {
        "url": "https://www.youtube.com/watch?v=...",
        "error": "403 Forbidden"
      }
    },
    {
      "level": "WARN",
      "category": "jio-api",
      "message": "Retrying stream fetch (attempt 2/3)",
      "timestamp": "2024-01-15T10:35:20Z"
    }
  ],
  "totalStreamIssues": 3
}
```

---

### 4. Get Android Logs

**Request**
```http
GET /api/logs?action=android
```

**Purpose**: Returns only logs from Android app (mobile).

**Response** (200 OK)
```json
{
  "logs": [
    {
      "level": "ERROR",
      "category": "video-playback",
      "message": "HLS player: Network error on segment fetch",
      "timestamp": "2024-01-15T10:40:00Z",
      "session_id": "device-12345",
      "data": {
        "segment": "segment-5.ts",
        "statusCode": 404
      }
    },
    {
      "level": "INFO",
      "category": "jio-login",
      "message": "OTP verification successful",
      "timestamp": "2024-01-15T10:42:30Z",
      "session_id": "device-12345"
    }
  ],
  "androidLogCount": 45
}
```

---

### 5. Get Summary Stats

**Request**
```http
GET /api/logs?action=summary
```

**Purpose**: Returns counts by level and category.

**Response** (200 OK)
```json
{
  "summary": {
    "total": 342,
    "byLevel": {
      "ERROR": 15,
      "WARN": 28,
      "INFO": 245,
      "DEBUG": 45,
      "SUCCESS": 9
    },
    "byCategory": {
      "jio-login": 50,
      "stream": 120,
      "android": 95,
      "video-playback": 65,
      "channel-manager": 12
    },
    "bySource": {
      "vercel": 180,
      "android": 95,
      "logfetch": 67
    }
  },
  "lastUpdate": "2024-01-15T10:45:30Z"
}
```

---

### 6. Filter Logs by Category

**Request**
```http
GET /api/logs?action=filter&category=jio-login
```

**Parameters**
- `action` (required): `filter`
- `category` (required): Log category to filter by
- `level` (optional): Filter by level too

**Supported Categories**
- `jio-login` — Jio TV authentication
- `jio-api` — Jio API calls
- `stream` — Stream URL fetching
- `video-playback` — Video player events
- `android-crash` — App crashes
- `channel-manager` — Channel management
- `youtube` — yt-dlp related

**Response** (200 OK)
```json
{
  "logs": [
    {
      "category": "jio-login",
      "level": "SUCCESS",
      "message": "User phone: +91 ***7890",
      "timestamp": "2024-01-15T10:30:00Z"
    },
    {
      "category": "jio-login",
      "level": "ERROR",
      "message": "OTP verification failed: Invalid OTP",
      "timestamp": "2024-01-15T10:35:00Z"
    }
  ],
  "filteredCount": 2
}
```

---

### 7. Filter by Level

**Request**
```http
GET /api/logs?action=filter&level=ERROR
```

**Parameters**
- `action` (required): `filter`
- `level` (required): ERROR, WARN, INFO, DEBUG, or SUCCESS

**Response** (200 OK)
```json
{
  "logs": [
    {
      "level": "ERROR",
      "message": "...",
      "category": "jio-api"
    }
  ],
  "filteredCount": 15
}
```

---

### 8. Send Log from App

**Request**
```http
POST /api/logs?action=send
Content-Type: application/json

{
  "level": "ERROR",
  "category": "video-playback",
  "message": "Playback failed",
  "data": {
    "url": "https://stream.m3u8",
    "errorCode": "NETWORK_ERROR"
  },
  "session_id": "device-12345"
}
```

**Parameters**
- `action` (required): `send`

**Request Body**
```json
{
  "level": "ERROR|WARN|INFO|DEBUG|SUCCESS",
  "category": "string",
  "message": "string",
  "data": "object (optional)",
  "session_id": "string (device ID or session ID)"
}
```

**Response** (201 Created)
```json
{
  "success": true,
  "logId": 12345,
  "timestamp": "2024-01-15T10:45:30Z"
}
```

**Uses in LogFetch**:
- Android app sends errors: `new LogSender().sendError(category, message, data)`
- Web backend sends logs: `logger.info(category, message, data)`

---

### 9. Clear Old Logs

**Request**
```http
DELETE /api/logs?action=cleanup
```

**Purpose**: Delete logs older than 7 days (automatically called).

**Response** (200 OK)
```json
{
  "success": true,
  "deletedCount": 127
}
```

---

## Error Responses

### 400 Bad Request

```json
{
  "error": "Missing required parameter: action",
  "code": "INVALID_REQUEST"
}
```

### 404 Not Found

```json
{
  "error": "Action not found",
  "code": "NOT_FOUND"
}
```

### 500 Internal Server Error

```json
{
  "error": "Database connection failed",
  "code": "SERVER_ERROR"
}
```

---

## Usage Examples

### JavaScript (Axios - Used by LogFetch)

```javascript
import axios from 'axios';

const API_BASE = 'https://live-tv-proxy-a9mg.onrender.com/api/logs';

// Get recent logs
async function getRecentLogs() {
  const response = await axios.get(`${API_BASE}?action=recent&limit=50`);
  return response.data.logs;
}

// Get errors only
async function getErrors() {
  const response = await axios.get(`${API_BASE}?action=errors`);
  return response.data.logs;
}

// Filter by category
async function getLoginLogs() {
  const response = await axios.get(`${API_BASE}?action=filter&category=jio-login`);
  return response.data.logs;
}

// Send log from app
async function sendLog(level, category, message, data) {
  const response = await axios.post(`${API_BASE}?action=send`, {
    level,
    category,
    message,
    data,
    session_id: 'device-id-12345'
  });
  return response.data;
}
```

### JavaScript (Fetch API)

```javascript
// Get recent logs
const response = await fetch('https://live-tv-proxy-a9mg.onrender.com/api/logs?action=recent');
const data = await response.json();
console.log(data.logs);
```

### cURL (Command Line)

```bash
# Get recent logs
curl https://live-tv-proxy-a9mg.onrender.com/api/logs?action=recent

# Get errors
curl https://live-tv-proxy-a9mg.onrender.com/api/logs?action=errors

# Get Android logs
curl https://live-tv-proxy-a9mg.onrender.com/api/logs?action=android

# Get summary
curl https://live-tv-proxy-a9mg.onrender.com/api/logs?action=summary

# Filter by category
curl "https://live-tv-proxy-a9mg.onrender.com/api/logs?action=filter&category=jio-login"

# Send log
curl -X POST https://live-tv-proxy-a9mg.onrender.com/api/logs?action=send \
  -H "Content-Type: application/json" \
  -d '{
    "level": "ERROR",
    "category": "test",
    "message": "Test error",
    "session_id": "test-session"
  }'
```

### Python

```python
import requests

API_URL = 'https://live-tv-proxy-a9mg.onrender.com/api/logs'

# Get recent logs
response = requests.get(f'{API_URL}?action=recent')
logs = response.json()['logs']

# Send log
requests.post(
    f'{API_URL}?action=send',
    json={
        'level': 'ERROR',
        'category': 'python-app',
        'message': 'Test error from Python',
        'session_id': 'python-client'
    }
)
```

### Kotlin (Android)

```kotlin
import okhttp3.OkHttpClient
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.RequestBody.Companion.toRequestBody
import okhttp3.Request
import org.json.JSONObject

val client = OkHttpClient()

fun sendLog(level: String, category: String, message: String) {
    val body = JSONObject().apply {
        put("level", level)
        put("category", category)
        put("message", message)
        put("session_id", "device-abc123")
    }.toString().toRequestBody("application/json".toMediaType())

    val request = Request.Builder()
        .url("https://live-tv-proxy-a9mg.onrender.com/api/logs?action=send")
        .post(body)
        .build()

    client.newCall(request).execute().use { response ->
        println(response.body?.string())
    }
}
```

---

## Rate Limiting

❌ No rate limiting currently. Use responsibly.

**Recommended practice**:
- Wait 5+ seconds between fetches to avoid UI thrashing
- Batch up multiple logs before sending
- Don't poll more than every 1 second

---

## Timestamps

All timestamps in **ISO 8601 format** with UTC timezone:
```
2024-01-15T10:45:30.123Z
```

---

## Data Types

| Field | Type | Example |
|-------|------|---------|
| id | number | 12345 |
| timestamp | string (ISO 8601) | "2024-01-15T10:45:30Z" |
| level | string | "ERROR", "WARN", "INFO", "DEBUG", "SUCCESS" |
| category | string | "jio-login", "stream", "android-crash" |
| message | string | "User logged in successfully" |
| data | object | `{ "userId": "abc", "error": "timeout" }` |
| session_id | string | "device-12345" or "vercel" or "logfetch" |

---

## Common Log Categories

| Category | Source | Purpose |
|----------|--------|---------|
| `jio-login` | Backend + Android | Authentication attempts |
| `jio-api` | Backend | Jio TV API calls |
| `stream` | Backend | Stream URL fetching |
| `video-playback` | Android | Video player events |
| `android-crash` | Android | App crashes |
| `channel-manager` | Android | Channel operations |
| `youtube` | Backend | yt-dlp operations |
| `epg` | Backend | EPG synchronization |

---

## Common Log Levels

| Level | Emoji | Purpose | Color |
|-------|-------|---------|-------|
| ERROR | ❌ | Critical failures | Red |
| WARN | ⚠️ | Warnings, recoverable errors | Yellow |
| INFO | ℹ️ | General information | Blue |
| DEBUG | 🔍 | Debugging details | Gray |
| SUCCESS | ✅ | Successful operations | Green |

---

## WebSocket (Future)

Currently uses HTTP polling (5s intervals). WebSocket support is planned.

For now, LogFetch polls the API every 5 seconds for real-time updates.

---

## CORS

✅ **CORS enabled** — LogFetch can fetch from any origin

Headers returned:
```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type
```

---

## Best Practices

1. **Always specify `action` parameter** — Required for all requests
2. **Use pagination** — Limit results with `get recent&limit=50`
3. **Cache responses** — Store in localStorage for offline browsing
4. **Filter early** — Use `action=filter` vs. getting all logs
5. **Batch sends** — Log 10 events, then POST once
6. **Handle errors** — Implement retry logic for network failures

---

## Debugging API

### Test Backend Connectivity

```bash
# Basic connectivity test
curl https://live-tv-proxy-a9mg.onrender.com/api/logs?action=summary

# If this works, backend is reachable
# If timeout/error, backend is down
```

### Check Response Format

```bash
# Get formatted JSON
curl https://live-tv-proxy-a9mg.onrender.com/api/logs?action=recent | json_pp
```

### Debug in LogFetch UI

1. Open DevTools (F12)
2. Network tab
3. Filter by "logs"
4. Click request to see:
   - Request URL
   - Response status
   - Response body

---

## Support

- **API not responsive?** Check [Live-TV status](https://github.com/MindMatrix-07/Live-TV)
- **Wrong data?** See [Troubleshooting](README.md#troubleshooting)
- **Feature request?** Open [GitHub issue](https://github.com/MindMatrix-07/Logfetch/issues)

---

**Last Updated**: 2024-01-15
