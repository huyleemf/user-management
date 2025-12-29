# 🚀 GraphQL API Guide - User Service

Complete guide for using the User Service GraphQL API.

## 📍 API Endpoint

**Base URL:** `http://localhost:4000/users`

**GraphQL Playground:** Open the URL in your browser to access the interactive playground

---

## 🔑 Authentication

This service uses **JWT (JSON Web Tokens)** for authentication:

- **Access Token**: Valid for 30 minutes
- **Refresh Token**: Valid for 1 day (stored in httpOnly cookie)

### Authentication Flow

1. **Login** → Receive access token + refresh token (in cookie)
2. **Use access token** in requests (typically in Authorization header)
3. **Renew token** when access token expires using refresh token

---

## 📋 Table of Contents

- [Queries](#-queries)
  - [Get Users by Role](#1-get-users-by-role)
  - [Get Single User](#2-get-single-user)
  - [Get Teams for User](#3-get-teams-for-user)
  - [Get Team Details](#4-get-team-details)
  - [Get My Teams (Leader)](#5-get-my-teams-where-im-leader)
- [Mutations](#-mutations)
  - [Create User (Register)](#1-create-user-register)
  - [Update User](#2-update-user)
  - [Login](#3-login)
  - [Renew Token](#4-renew-token)
- [Types & Enums](#-types--enums)
- [Error Handling](#-error-handling)

---

## 🔍 Queries

### 1. Get Users by Role

Retrieve all users filtered by their role (MANAGER or MEMBER).

**Query:**
```graphql
query GetManagers {
  users(role: MANAGER) {
    userId
    username
    email
    role
    createdAt
  }
}
```

**Variables Example:**
```json
{
  "role": "MEMBER"
}
```

**Response:**
```json
{
  "data": {
    "users": [
      {
        "userId": "550e8400-e29b-41d4-a716-446655440000",
        "username": "John Doe",
        "email": "john@example.com",
        "role": "MANAGER",
        "createdAt": "2025-12-29T10:30:00.000Z"
      },
      {
        "userId": "550e8400-e29b-41d4-a716-446655440001",
        "username": "Jane Smith",
        "email": "jane@example.com",
        "role": "MANAGER",
        "createdAt": "2025-12-29T11:00:00.000Z"
      }
    ]
  }
}
```

---

### 2. Get Single User

Retrieve details for a specific user by their ID.

**Query:**
```graphql
query GetUser($userId: ID!) {
  user(userId: $userId) {
    userId
    username
    email
    role
    createdAt
  }
}
```

**Variables:**
```json
{
  "userId": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Response:**
```json
{
  "data": {
    "user": {
      "userId": "550e8400-e29b-41d4-a716-446655440000",
      "username": "John Doe",
      "email": "john@example.com",
      "role": "MANAGER",
      "createdAt": "2025-12-29T10:30:00.000Z"
    }
  }
}
```

---

### 3. Get Teams for User

Get all teams that a specific user belongs to (with roster count).

**Query:**
```graphql
query GetUserTeams($userId: ID!) {
  teams(userId: $userId) {
    teamId
    teamName
    rosterCount
  }
}
```

**Variables:**
```json
{
  "userId": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Response:**
```json
{
  "data": {
    "teams": [
      {
        "teamId": "1",
        "teamName": "Engineering Team",
        "rosterCount": 8
      },
      {
        "teamId": "5",
        "teamName": "Product Team",
        "rosterCount": 6
      }
    ]
  }
}
```

---

### 4. Get Team Details

Get comprehensive details about a specific team including all managers and members.

**Query:**
```graphql
query GetTeamDetails($teamId: ID!) {
  team(teamId: $teamId) {
    teamId
    teamName
    totalManagers
    totalMembers
    managers {
      managerId
      managerName
    }
    members {
      memberId
      memberName
    }
  }
}
```

**Variables:**
```json
{
  "teamId": "1"
}
```

**Response:**
```json
{
  "data": {
    "team": {
      "teamId": "1",
      "teamName": "Engineering Team",
      "totalManagers": 2,
      "totalMembers": 6,
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
  }
}
```

---

### 5. Get My Teams (Where I'm Leader)

Get all teams where the specified user is marked as a leader.

**Query:**
```graphql
query GetMyLeaderTeams($userId: ID!) {
  myTeams(userId: $userId) {
    teamId
    teamName
  }
}
```

**Variables:**
```json
{
  "userId": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Response:**
```json
{
  "data": {
    "myTeams": [
      {
        "teamId": "1",
        "teamName": "Engineering Team"
      },
      {
        "teamId": "3",
        "teamName": "DevOps Team"
      }
    ]
  }
}
```

---

## ✏️ Mutations

### 1. Create User (Register)

Register a new user in the system.

**Mutation:**
```graphql
mutation CreateUser($input: CreateUserInput!) {
  createUser(input: $input) {
    code
    success
    message
    errors
    user {
      userId
      username
      email
      role
      createdAt
    }
  }
}
```

**Variables:**
```json
{
  "input": {
    "username": "Alice Johnson",
    "email": "alice@example.com",
    "password": "SecurePass123!",
    "role": "MEMBER"
  }
}
```

**Success Response:**
```json
{
  "data": {
    "createUser": {
      "code": "200",
      "success": true,
      "message": "Welcome on board Alice Johnson^^",
      "errors": null,
      "user": {
        "userId": "550e8400-e29b-41d4-a716-446655440020",
        "username": "Alice Johnson",
        "email": "alice@example.com",
        "role": "MEMBER",
        "createdAt": "2025-12-29T15:00:00.000Z"
      }
    }
  }
}
```

**Error Response (Invalid Password):**
```json
{
  "data": {
    "createUser": {
      "code": "400",
      "success": false,
      "message": null,
      "errors": [
        "Password should have 1 lowercase letter, 1 uppercase letter, 1 number, 1 special character and be at least 8 characters long"
      ],
      "user": null
    }
  }
}
```

**Password Requirements:**
- Minimum 8 characters
- At least 1 lowercase letter
- At least 1 uppercase letter
- At least 1 number
- At least 1 special character (!@#$%^&*()...)

**Valid Password Examples:**
- `Hello01@`
- `SecurePass123!`
- `MyP@ssw0rd`

---

### 2. Update User

Update an existing user's profile information.

**Mutation:**
```graphql
mutation UpdateUser($userId: ID!, $username: String!, $email: String!) {
  updateUser(userId: $userId, username: $username, email: $email) {
    code
    success
    message
    errors
  }
}
```

**Variables:**
```json
{
  "userId": "550e8400-e29b-41d4-a716-446655440020",
  "username": "Alice Cooper",
  "email": "alice.cooper@example.com"
}
```

**Response:**
```json
{
  "data": {
    "updateUser": {
      "code": "200",
      "success": true,
      "message": "Updated Alice Cooper's profile",
      "errors": null
    }
  }
}
```

---

### 3. Login

Authenticate a user and receive access/refresh tokens.

**Mutation:**
```graphql
mutation Login($input: UserInput!) {
  login(input: $input) {
    code
    success
    message
    errors
    accessToken
    user {
      userId
      username
      email
      role
    }
  }
}
```

**Variables:**
```json
{
  "input": {
    "email": "john@example.com",
    "password": "Hello01@"
  }
}
```

**Success Response:**
```json
{
  "data": {
    "login": {
      "code": "200",
      "success": true,
      "message": "Good to see you, John Doe",
      "errors": null,
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "user": {
        "userId": "550e8400-e29b-41d4-a716-446655440000",
        "username": "John Doe",
        "email": "john@example.com",
        "role": "MANAGER"
      }
    }
  }
}
```

**Notes:**
- Refresh token is automatically set as an httpOnly cookie
- Access token expires in 30 minutes
- Refresh token expires in 1 day

**Error Responses:**

*User doesn't exist:*
```json
{
  "data": {
    "login": {
      "code": "400",
      "success": false,
      "message": "This user does not exist.",
      "errors": null,
      "accessToken": null,
      "user": null
    }
  }
}
```

*Invalid password:*
```json
{
  "data": {
    "login": {
      "code": "400",
      "success": false,
      "message": "Invalid credentials",
      "errors": null,
      "accessToken": null,
      "user": null
    }
  }
}
```

---

### 4. Renew Token

Refresh an expired access token using the refresh token stored in cookies.

**Mutation:**
```graphql
mutation RenewToken($userId: ID!) {
  renewToken(userId: $userId) {
    code
    success
    message
    errors
    accessToken
  }
}
```

**Variables:**
```json
{
  "userId": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Success Response:**
```json
{
  "data": {
    "renewToken": {
      "code": "200",
      "success": true,
      "message": "Token renewed",
      "errors": null,
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
}
```

**Error Response (No refresh token):**
```json
{
  "data": {
    "renewToken": {
      "code": "401",
      "success": false,
      "message": "Invalid refresh token",
      "errors": null,
      "accessToken": null
    }
  }
}
```

**Error Response (Invalid userId):**
```json
{
  "data": {
    "renewToken": {
      "code": "401",
      "success": false,
      "message": "Not allowed to perform this action",
      "errors": null,
      "accessToken": null
    }
  }
}
```

---

## 📝 Types & Enums

### UserType Enum

```graphql
enum UserType {
  MANAGER
  MEMBER
}
```

### User Type

```graphql
type User {
  userId: ID!
  username: String!
  email: String!
  role: UserType!
  createdAt: DateTime
}
```

### Team Type

```graphql
type Team {
  teamId: ID!
  teamName: String!
  managers: [Manager!]!
  members: [Member]
  totalManagers: Int!
  totalMembers: Int
  rosterCount: Int!
}
```

### Response Types

All mutations implement the `MutationResponse` interface:

```graphql
interface MutationResponse {
  code: String!        # HTTP status code (200, 400, 401, 403, 500)
  success: Boolean!    # Operation success status
  message: String      # Human-readable message
  errors: [String]     # Array of error messages (if any)
}
```

---

## ⚠️ Error Handling

### Common Status Codes

| Code | Meaning | Example |
|------|---------|---------|
| `200` | Success | User created, logged in successfully |
| `400` | Bad Request | Invalid input, validation errors |
| `401` | Unauthorized | Invalid credentials, missing token |
| `403` | Forbidden | Token verification failed |
| `500` | Server Error | Database connection issues |

### Error Response Format

```json
{
  "data": {
    "mutationName": {
      "code": "400",
      "success": false,
      "message": "Operation failed",
      "errors": [
        "Specific error message 1",
        "Specific error message 2"
      ]
    }
  }
}
```

---

## 🧪 Testing with GraphQL Playground

1. **Start the server:**
   ```bash
   yarn start
   ```

2. **Open GraphQL Playground:**
   Navigate to `http://localhost:4000/users` in your browser

3. **Test a query:**
   - Copy a query from this guide
   - Paste into the left panel
   - Click the play button (▶️)
   - View results in the right panel

4. **Use variables:**
   - Click "QUERY VARIABLES" at the bottom
   - Add JSON variables
   - Reference them in your query with `$variableName`

5. **View schema:**
   - Click "DOCS" on the right
   - Explore all available types and operations

---

## 💡 Tips & Best Practices

### 1. Always Request What You Need

GraphQL allows you to request exactly the fields you need:

```graphql
# ✅ Good - Only request needed fields
query GetUser($userId: ID!) {
  user(userId: $userId) {
    username
    email
  }
}

# ❌ Over-fetching - Requesting unnecessary data
query GetUser($userId: ID!) {
  user(userId: $userId) {
    userId
    username
    email
    role
    createdAt
  }
}
```

### 2. Use Fragments for Repeated Fields

```graphql
fragment UserFields on User {
  userId
  username
  email
  role
}

query GetManagers {
  users(role: MANAGER) {
    ...UserFields
  }
}

query GetUser($userId: ID!) {
  user(userId: $userId) {
    ...UserFields
  }
}
```

### 3. Handle Errors Gracefully

Always check the `success` field before using data:

```javascript
const response = await client.mutate({ mutation: LOGIN });

if (response.data.login.success) {
  // Store access token
  const token = response.data.login.accessToken;
  localStorage.setItem('accessToken', token);
} else {
  // Show error message
  console.error(response.data.login.message);
}
```

### 4. Use Aliases for Multiple Queries

```graphql
query GetManagersAndMembers {
  managers: users(role: MANAGER) {
    userId
    username
  }
  members: users(role: MEMBER) {
    userId
    username
  }
}
```

---

## 🔗 Related Documentation

- **[SEEDING.md](./SEEDING.md)** - How to populate the database with test data
- **[DATABASE_SETUP.md](../DATABASE_SETUP.md)** - PostgreSQL setup guide
- **Schema Definition:** [src/schema/schema.graphql](./src/schema/schema.graphql)
- **Resolvers:** [src/resolvers/resolvers.js](./src/resolvers/resolvers.js)

---

## 📞 Quick Reference

### Default Test Credentials (After Seeding)

- **Email:** Any email from seeded data
- **Password:** `Hello01@`

### Service Information

- **Port:** 4000
- **Endpoint:** `/users`
- **GraphQL Playground:** `http://localhost:4000/users`
- **CORS:** Allowed origin `http://localhost:5173`

### Token Lifetimes

- **Access Token:** 30 minutes
- **Refresh Token:** 1 day

---

**Happy Coding! 🚀**
