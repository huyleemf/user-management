# User Service - Data Seeding Guide

## 🎯 Quick Start

### Option 1: Run Seed Script (Recommended)

```bash
# Safe seed (checks if data exists first)
yarn seed

# Fresh seed (⚠️ WARNING: Drops all tables and recreates)
yarn seed:fresh
```

### What Gets Created:
- **50 Members** with role: MEMBER
- **20 Managers** with role: MANAGER
- **10 Teams** with random company names
- **Rosters** that assign users to teams:
  - Each team gets 2-3 managers (first one is leader)
  - Each team gets 3-7 members

### Default Credentials:
- **Email**: Generated randomly (check console output)
- **Password**: `Hello01@` (for ALL users)

---

## 📝 Option 2: Manual Creation via GraphQL

1. Start the service:
```bash
yarn start
```

2. Open GraphQL Playground: http://localhost:4000/users

3. Create users manually:

```graphql
mutation CreateManager {
  createUser(input: {
    username: "John Doe"
    email: "john@example.com"
    password: "Password123!"
    role: MANAGER
  }) {
    code
    success
    message
    user {
      userId
      username
      email
      role
    }
  }
}
```

---

## 🔍 Verify Data via GraphQL Queries

### Get all managers:
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

### Get all members:
```graphql
query GetMembers {
  users(role: MEMBER) {
    userId
    username
    email
    role
    createdAt
  }
}
```

### Test login:
```graphql
mutation Login {
  login(input: {
    email: "john@example.com"
    password: "Hello01@"
  }) {
    code
    success
    message
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

---

## 🗄️ Database Info

- **Tables**: Users, Teams, Rosters
- **ORM**: Sequelize with PostgreSQL
- **Auto-sync**: Enabled in development mode (creates tables if not exist)

---

## 🔧 Troubleshooting

### If seed fails with "Data already exists":
```bash
# Use fresh seed to reset (WARNING: deletes all data)
yarn seed:fresh
```

### If you get database connection errors:
1. Check your `.env` file has correct database credentials
2. Ensure PostgreSQL is running
3. Verify database exists

### Password validation requirements:
- At least 8 characters
- 1 lowercase letter
- 1 uppercase letter
- 1 number
- 1 special character (!@#$%^&*()...)

Example valid passwords: `Hello01@`, `Password123!`, `Test1234#`
