# 🚀 REST API Guide - Team Service

Complete guide for using the Team Service REST API.

## 📍 API Endpoint

**Base URL:** `http://localhost:5000/teams`

---

## 🔑 Authentication & Authorization

### Authentication
All endpoints require JWT authentication via **Bearer token** in the Authorization header.

```http
Authorization: Bearer <access_token>
```

### Authorization Levels

1. **MANAGER Role Required**: All team operations
2. **Team Leader Only**: 
   - Add/Remove managers
   - Delete team
3. **Team Member**: View team details (if member of the team)

### Token Refresh Flow

If your access token expires:
1. Request will automatically check for refresh token in cookies
2. New access token will be returned in the `Authorization` response header
3. Update your stored access token

---

## 📋 Table of Contents

- [Authentication](#-authentication--authorization)
- [Endpoints](#-endpoints)
  - [Create Team](#1-create-team)
  - [Get Team Details](#2-get-team-details)
  - [Delete Team](#3-delete-team)
  - [Add Member](#4-add-member-to-team)
  - [Remove Member](#5-remove-member-from-team)
  - [Add Manager](#6-add-manager-to-team)
  - [Remove Manager](#7-remove-manager-from-team)
- [Request/Response Examples](#-requestresponse-examples)
- [Error Handling](#-error-handling)
- [Validation Rules](#-validation-rules)

---

## 📡 Endpoints

### 1. Create Team

Create a new team with managers and members.

**Endpoint:** `POST /teams`

**Authorization:** Manager role required

**Request Headers:**
```http
Content-Type: application/json
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "teamName": "Engineering Team",
  "managers": [
    {
      "managerId": "550e8400-e29b-41d4-a716-446655440000",
      "managerName": "John Doe"
    },
    {
      "managerId": "550e8400-e29b-41d4-a716-446655440001",
      "managerName": "Jane Smith"
    }
  ],
  "members": [
    {
      "memberId": "550e8400-e29b-41d4-a716-446655440010",
      "memberName": "Alice Johnson"
    },
    {
      "memberId": "550e8400-e29b-41d4-a716-446655440011",
      "memberName": "Bob Wilson"
    }
  ]
}
```

**Success Response:** `201 Created`
```json
{
  "teamId": 1,
  "teamName": "Engineering Team",
  "managers": [
    {
      "managerId": "550e8400-e29b-41d4-a716-446655440000",
      "managerName": "John Doe"
    },
    {
      "managerId": "550e8400-e29b-41d4-a716-446655440001",
      "managerName": "Jane Smith"
    }
  ],
  "members": [
    {
      "memberId": "550e8400-e29b-41d4-a716-446655440010",
      "memberName": "Alice Johnson"
    },
    {
      "memberId": "550e8400-e29b-41d4-a716-446655440011",
      "memberName": "Bob Wilson"
    }
  ]
}
```

**Error Response:** `400 Bad Request`
```json
{
  "error": "This team already exists."
}
```

**Notes:**
- The authenticated user (creator) is automatically added as the **team leader**
- Team leader has `isLeader: true` in the Rosters table
- Team names must be unique
- Managers and members arrays are optional

**cURL Example:**
```bash
curl -X POST http://localhost:5000/teams \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "teamName": "Engineering Team",
    "managers": [
      {
        "managerId": "550e8400-e29b-41d4-a716-446655440000",
        "managerName": "John Doe"
      }
    ],
    "members": [
      {
        "memberId": "550e8400-e29b-41d4-a716-446655440010",
        "memberName": "Alice Johnson"
      }
    ]
  }'
```

---

### 2. Get Team Details

Retrieve comprehensive details about a specific team.

**Endpoint:** `GET /teams/:teamId`

**Authorization:** Must be a member of the team

**Request Headers:**
```http
Authorization: Bearer <access_token>
```

**URL Parameters:**
- `teamId` (integer) - The team ID

**Success Response:** `200 OK`
```json
{
  "teamId": 1,
  "teamName": "Engineering Team",
  "teamLeader": {
    "userId": "550e8400-e29b-41d4-a716-446655440002",
    "username": "Sarah Connor"
  },
  "managers": [
    {
      "managerId": "550e8400-e29b-41d4-a716-446655440000",
      "managerName": "John Doe"
    },
    {
      "managerId": "550e8400-e29b-41d4-a716-446655440001",
      "managerName": "Jane Smith"
    }
  ],
  "members": [
    {
      "memberId": "550e8400-e29b-41d4-a716-446655440010",
      "memberName": "Alice Johnson"
    },
    {
      "memberId": "550e8400-e29b-41d4-a716-446655440011",
      "memberName": "Bob Wilson"
    }
  ]
}
```

**Error Responses:**

*Not a team member:* `400 Bad Request`
```json
{
  "error": "You are not allowed to view this team."
}
```

*Team not found:* `400 Bad Request`
```json
{
  "error": "Team is not found."
}
```

**cURL Example:**
```bash
curl -X GET http://localhost:5000/teams/1 \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

### 3. Delete Team

Remove a team and all its roster entries.

**Endpoint:** `DELETE /teams/:teamId`

**Authorization:** Team leader only

**Request Headers:**
```http
Authorization: Bearer <access_token>
```

**URL Parameters:**
- `teamId` (integer) - The team ID

**Success Response:** `204 No Content`

**Error Response:** `403 Forbidden`
```json
{
  "error": "Only the Lead Manager may perform this action."
}
```

**Notes:**
- Only the team leader (user with `isLeader: true`) can delete the team
- Deleting a team cascades and removes all roster entries
- This action is irreversible

**cURL Example:**
```bash
curl -X DELETE http://localhost:5000/teams/1 \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

### 4. Add Member to Team

Add a new member to an existing team.

**Endpoint:** `POST /teams/:teamId/members`

**Authorization:** Manager role required

**Request Headers:**
```http
Content-Type: application/json
Authorization: Bearer <access_token>
```

**URL Parameters:**
- `teamId` (integer) - The team ID

**Request Body:**
```json
{
  "memberId": "550e8400-e29b-41d4-a716-446655440020",
  "memberName": "Charlie Brown"
}
```

**Success Response:** `201 Created`
```json
{
  "teamId": "1",
  "memberId": "550e8400-e29b-41d4-a716-446655440020",
  "memberName": "Charlie Brown"
}
```

**Error Responses:**

*Invalid UUID format:* `400 Bad Request`
```json
{
  "error": "\"memberId\" must be a valid GUID"
}
```

*User doesn't exist:* `400 Bad Request`
```json
{
  "error": "This user does not exist."
}
```

*User already in team:* `400 Bad Request`
```json
{
  "error": "This user already exists in this team."
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:5000/teams/1/members \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "memberId": "550e8400-e29b-41d4-a716-446655440020",
    "memberName": "Charlie Brown"
  }'
```

---

### 5. Remove Member from Team

Remove a member from a team.

**Endpoint:** `DELETE /teams/:teamId/members/:memberId`

**Authorization:** Manager role required

**Request Headers:**
```http
Authorization: Bearer <access_token>
```

**URL Parameters:**
- `teamId` (integer) - The team ID
- `memberId` (UUID) - The member's user ID

**Success Response:** `204 No Content`

**Error Responses:**

*Member not in team:* `400 Bad Request`
```json
{
  "error": "This member does not exist in the team."
}
```

**cURL Example:**
```bash
curl -X DELETE http://localhost:5000/teams/1/members/550e8400-e29b-41d4-a716-446655440020 \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

### 6. Add Manager to Team

Add a new manager to an existing team.

**Endpoint:** `POST /teams/:teamId/managers`

**Authorization:** Team leader only

**Request Headers:**
```http
Content-Type: application/json
Authorization: Bearer <access_token>
```

**URL Parameters:**
- `teamId` (integer) - The team ID

**Request Body:**
```json
{
  "managerId": "550e8400-e29b-41d4-a716-446655440030",
  "managerName": "David Lee"
}
```

**Success Response:** `201 Created`
```json
{
  "teamId": "1",
  "managerId": "550e8400-e29b-41d4-a716-446655440030",
  "managerName": "David Lee"
}
```

**Error Responses:**

*Not team leader:* `403 Forbidden`
```json
{
  "error": "Only the Lead Manager may perform this action."
}
```

*Manager already in team:* `400 Bad Request`
```json
{
  "error": "This user already exists in this team."
}
```

**Notes:**
- Only the team leader can add managers
- New managers do NOT have leader status (`isLeader: false`)

**cURL Example:**
```bash
curl -X POST http://localhost:5000/teams/1/managers \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "managerId": "550e8400-e29b-41d4-a716-446655440030",
    "managerName": "David Lee"
  }'
```

---

### 7. Remove Manager from Team

Remove a manager from a team.

**Endpoint:** `DELETE /teams/:teamId/managers/:managerId`

**Authorization:** Team leader only

**Request Headers:**
```http
Authorization: Bearer <access_token>
```

**URL Parameters:**
- `teamId` (integer) - The team ID
- `managerId` (UUID) - The manager's user ID

**Success Response:** `204 No Content`

**Error Responses:**

*Trying to remove leader:* `400 Bad Request`
```json
{
  "error": "Leader can't be removed from a team."
}
```

*Not team leader:* `403 Forbidden`
```json
{
  "error": "Only the Lead Manager may perform this action."
}
```

*Manager not in team:* `400 Bad Request`
```json
{
  "error": "This manager does not exist in the team."
}
```

**Notes:**
- Team leader cannot be removed
- Only the team leader can remove other managers

**cURL Example:**
```bash
curl -X DELETE http://localhost:5000/teams/1/managers/550e8400-e29b-41d4-a716-446655440030 \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## 📝 Request/Response Examples

### Example 1: Creating a Complete Team

**Request:**
```http
POST /teams HTTP/1.1
Host: localhost:5000
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

{
  "teamName": "Product Development",
  "managers": [
    {
      "managerId": "a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d",
      "managerName": "Emily Davis"
    }
  ],
  "members": [
    {
      "memberId": "b2c3d4e5-f6a7-5b6c-9d0e-1f2a3b4c5d6e",
      "memberName": "Frank Miller"
    },
    {
      "memberId": "c3d4e5f6-a7b8-6c7d-0e1f-2a3b4c5d6e7f",
      "memberName": "Grace Lee"
    }
  ]
}
```

**Response:**
```http
HTTP/1.1 201 Created
Content-Type: application/json

{
  "teamId": 5,
  "teamName": "Product Development",
  "managers": [
    {
      "managerId": "a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d",
      "managerName": "Emily Davis"
    }
  ],
  "members": [
    {
      "memberId": "b2c3d4e5-f6a7-5b6c-9d0e-1f2a3b4c5d6e",
      "memberName": "Frank Miller"
    },
    {
      "memberId": "c3d4e5f6-a7b8-6c7d-0e1f-2a3b4c5d6e7f",
      "memberName": "Grace Lee"
    }
  ]
}
```

### Example 2: Getting Team Details

**Request:**
```http
GET /teams/5 HTTP/1.1
Host: localhost:5000
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response:**
```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "teamId": 5,
  "teamName": "Product Development",
  "teamLeader": {
    "userId": "9a8b7c6d-5e4f-3a2b-1c0d-9e8f7a6b5c4d",
    "username": "Sarah Connor"
  },
  "managers": [
    {
      "managerId": "a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d",
      "managerName": "Emily Davis"
    }
  ],
  "members": [
    {
      "memberId": "b2c3d4e5-f6a7-5b6c-9d0e-1f2a3b4c5d6e",
      "memberName": "Frank Miller"
    },
    {
      "memberId": "c3d4e5f6-a7b8-6c7d-0e1f-2a3b4c5d6e7f",
      "memberName": "Grace Lee"
    }
  ]
}
```

---

## ⚠️ Error Handling

### Error Response Format

All errors follow this structure:

```json
{
  "error": "Error message describing what went wrong"
}
```

### Common HTTP Status Codes

| Code | Status | Description |
|------|--------|-------------|
| `200` | OK | Request successful |
| `201` | Created | Resource created successfully |
| `204` | No Content | Resource deleted successfully |
| `400` | Bad Request | Invalid input or business logic error |
| `401` | Unauthorized | Missing or invalid access token |
| `403` | Forbidden | Insufficient permissions |
| `500` | Internal Server Error | Server-side error |

### Common Error Scenarios

#### 1. Authentication Errors

**Missing Token:**
```http
401 Unauthorized
{
  "error": "Not Authorized. Invalid access token."
}
```

**Expired Access Token (Auto-Refreshed):**
```http
200 OK
Authorization: Bearer <new_access_token>
```
*Server automatically issues new access token using refresh token from cookies*

**Expired Refresh Token:**
```http
403 Forbidden
{
  "error": "Refresh token expired. Please log in."
}
```

#### 2. Authorization Errors

**Not a Manager:**
```http
403 Forbidden
{
  "error": "Access to this route is not permitted for a member."
}
```

**Not Team Leader:**
```http
403 Forbidden
{
  "error": "Only the Lead Manager may perform this action."
}
```

#### 3. Validation Errors

**Invalid UUID:**
```http
400 Bad Request
{
  "error": "\"managerId\" must be a valid GUID"
}
```

**Missing Required Field:**
```http
400 Bad Request
{
  "error": "\"teamName\" is required"
}
```

**Empty Team Name:**
```http
400 Bad Request
{
  "error": "\"teamName\" is not allowed to be empty"
}
```

#### 4. Business Logic Errors

**Duplicate Team:**
```http
400 Bad Request
{
  "error": "This team already exists."
}
```

**User Not in Team:**
```http
400 Bad Request
{
  "error": "You are not allowed to view this team."
}
```

**User Already in Team:**
```http
400 Bad Request
{
  "error": "This user already exists in this team."
}
```

**Removing Team Leader:**
```http
400 Bad Request
{
  "error": "Leader can't be removed from a team."
}
```

---

## ✅ Validation Rules

### Team Creation

**teamName:**
- Type: `string`
- Required: `true`
- Min length: `1`
- Trimmed: `true`
- Must be unique

**managers (array):**
- Type: `array of objects`
- Required: `false`
- Each object contains:
  - `managerId` (string, UUID v4/v5, required)
  - `managerName` (string, required)

**members (array):**
- Type: `array of objects`
- Required: `false`
- Each object contains:
  - `memberId` (string, UUID v4/v5, required)
  - `memberName` (string, required)

### Adding Member/Manager

**memberId / managerId:**
- Type: `string`
- Format: UUID v4 or v5
- Required: `true`
- Example: `550e8400-e29b-41d4-a716-446655440000`

**memberName / managerName:**
- Type: `string`
- Required: `true`

---

## 🔐 Security & Best Practices

### 1. Token Management

**Store Tokens Securely:**
```javascript
// ✅ Good - Store in memory or httpOnly cookies
let accessToken = '';

// ❌ Bad - Don't store in localStorage (XSS risk)
localStorage.setItem('token', accessToken);
```

**Include Token in Requests:**
```javascript
fetch('http://localhost:5000/teams', {
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  }
});
```

**Handle Token Refresh:**
```javascript
const response = await fetch('http://localhost:5000/teams/1', {
  headers: {
    'Authorization': `Bearer ${accessToken}`,
  },
  credentials: 'include' // Include cookies for refresh token
});

// Check for new access token in response header
const newToken = response.headers.get('Authorization');
if (newToken) {
  accessToken = newToken.replace('Bearer ', '');
}
```

### 2. Input Validation

**Always validate UUIDs:**
```javascript
const isValidUUID = (uuid) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[4-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};
```

**Sanitize team names:**
```javascript
const teamName = userInput.trim();
if (!teamName || teamName.length === 0) {
  throw new Error('Team name cannot be empty');
}
```

### 3. Error Handling

**Always check response status:**
```javascript
const response = await fetch('http://localhost:5000/teams', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(teamData)
});

if (!response.ok) {
  const error = await response.json();
  throw new Error(error.error);
}

const data = await response.json();
```

### 4. Role-Based Access

**Check user role before showing UI:**
```javascript
if (user.role === 'MANAGER') {
  // Show manager-only features
  showCreateTeamButton();
  showAddMemberButton();
} else {
  // Member view only
  showViewOnlyMode();
}
```

---

## 💡 Tips & Examples

### JavaScript/Fetch Example

```javascript
// Create a team
async function createTeam(accessToken, teamData) {
  try {
    const response = await fetch('http://localhost:5000/teams', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(teamData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to create team:', error.message);
    throw error;
  }
}

// Usage
const newTeam = await createTeam(token, {
  teamName: 'Innovation Team',
  managers: [{ managerId: 'uuid-here', managerName: 'John' }],
  members: [{ memberId: 'uuid-here', memberName: 'Alice' }]
});
```

### Axios Example

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000',
  withCredentials: true, // Include cookies
});

// Add interceptor for token
api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token refresh
api.interceptors.response.use(
  (response) => {
    const newToken = response.headers['authorization'];
    if (newToken) {
      saveAccessToken(newToken.replace('Bearer ', ''));
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Create team
const createTeam = async (teamData) => {
  const response = await api.post('/teams', teamData);
  return response.data;
};

// Get team
const getTeam = async (teamId) => {
  const response = await api.get(`/teams/${teamId}`);
  return response.data;
};

// Add member
const addMember = async (teamId, memberData) => {
  const response = await api.post(`/teams/${teamId}/members`, memberData);
  return response.data;
};
```

---

## 🧪 Testing with cURL

### Complete Workflow Example

```bash
# 1. Login (via user-service)
curl -X POST http://localhost:4000/users \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation { login(input: { email: \"manager@test.com\", password: \"Hello01@\" }) { accessToken } }"
  }'

# Save the accessToken from response
TOKEN="your_access_token_here"

# 2. Create a team
curl -X POST http://localhost:5000/teams \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "teamName": "DevOps Team",
    "managers": [],
    "members": []
  }'

# 3. Get team details
curl -X GET http://localhost:5000/teams/1 \
  -H "Authorization: Bearer $TOKEN"

# 4. Add a member
curl -X POST http://localhost:5000/teams/1/members \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "memberId": "550e8400-e29b-41d4-a716-446655440010",
    "memberName": "New Member"
  }'

# 5. Remove a member
curl -X DELETE http://localhost:5000/teams/1/members/550e8400-e29b-41d4-a716-446655440010 \
  -H "Authorization: Bearer $TOKEN"
```

---

## 📊 Quick Reference

### Endpoints Summary

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/teams` | Manager | Create team |
| `GET` | `/teams/:teamId` | Team member | Get team details |
| `DELETE` | `/teams/:teamId` | Team leader | Delete team |
| `POST` | `/teams/:teamId/members` | Manager | Add member |
| `DELETE` | `/teams/:teamId/members/:memberId` | Manager | Remove member |
| `POST` | `/teams/:teamId/managers` | Team leader | Add manager |
| `DELETE` | `/teams/:teamId/managers/:managerId` | Team leader | Remove manager |

### Service Information

- **Port:** 5000
- **Base Path:** `/teams`
- **CORS:** Allowed origin `http://localhost:5173`
- **Environment:** Development mode with Morgan logging

### Default Test Data

After seeding the database:
- **50 Members** + **20 Managers** created
- All users have password: `Hello01@`
- Login via user-service to get access token

---

## 🔗 Related Documentation

- **User Service GraphQL API**: `../user-service/GRAPHQL_GUIDE.md`
- **Database Setup**: `../DATABASE_SETUP.md`
- **Schema Definitions**: `src/schemas/joiSchemas.js`
- **Controllers**: `src/controllers/teamController.js`

---

**Happy Coding! 🚀**
