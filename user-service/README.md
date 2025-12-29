# User Service 👥

GraphQL-based microservice for user authentication and management in the Personnel Management System.

## 🎯 Overview

This service provides:
- ✅ User registration and authentication (JWT-based)
- ✅ User profile management
- ✅ Team membership queries
- ✅ Role-based access (MANAGER / MEMBER)
- ✅ Token management (access & refresh tokens)

**Tech Stack:**
- **Apollo Server** - GraphQL server
- **Express.js** - Web framework
- **Sequelize** - PostgreSQL ORM
- **JWT** - Authentication
- **bcrypt** - Password hashing

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
yarn install
```

### 2. Configure Environment
Ensure your `.env` file is set up in the project root:
```env
NODE_ENV=development
DB_HOST=localhost
DB_USER=postgres
DB_PASS=191102
DB_NAME=personnel
DB_DIALECT=postgres
ACCESS_TOKEN_SECRET=IDontKnowHowButTheyFoundMe
REFRESH_TOKEN_SECRET=ArcticMonkeys
```

### 3. Start PostgreSQL
See [DATABASE_SETUP.md](../DATABASE_SETUP.md) for detailed instructions.

**Quick option with Docker:**
```bash
cd ..
docker compose up -d
```

### 4. Seed Database (Optional)
Populate with test data:
```bash
yarn seed
```

See [SEEDING.md](./SEEDING.md) for details.

### 5. Start the Service
```bash
yarn start
```

### 6. Access GraphQL Playground
Open in browser: **http://localhost:4000/users**

---

## 📚 Documentation

- **[GRAPHQL_GUIDE.md](./GRAPHQL_GUIDE.md)** - Complete GraphQL API documentation
- **[SEEDING.md](./SEEDING.md)** - Database seeding guide
- **[DATABASE_SETUP.md](../DATABASE_SETUP.md)** - PostgreSQL setup with Docker

---

## 📋 Available Scripts

```bash
# Start development server with hot reload
yarn start

# Seed database (safe - checks if data exists)
yarn seed

# Fresh seed (⚠️ WARNING: drops all tables first)
yarn seed:fresh
```

---

## 🔍 GraphQL API

### Endpoint
**Base URL:** `http://localhost:4000/users`

### Quick Examples

**Get all managers:**
```graphql
query {
  users(role: MANAGER) {
    userId
    username
    email
  }
}
```

**Login:**
```graphql
mutation {
  login(input: {
    email: "john@example.com"
    password: "Hello01@"
  }) {
    success
    accessToken
    user {
      userId
      username
      role
    }
  }
}
```

**Create new user:**
```graphql
mutation {
  createUser(input: {
    username: "New User"
    email: "newuser@example.com"
    password: "SecurePass123!"
    role: MEMBER
  }) {
    success
    message
    user {
      userId
      username
    }
  }
}
```

👉 **See [GRAPHQL_GUIDE.md](./GRAPHQL_GUIDE.md) for complete API documentation**

---

## 🗄️ Database Schema

### Tables

**Users**
- `userId` (UUID, PK)
- `username` (String)
- `email` (String, unique)
- `password` (String, hashed)
- `role` (Enum: MANAGER | MEMBER)
- `createdAt`, `updatedAt`

**Teams**
- `teamId` (Integer, PK, auto-increment)
- `teamName` (String, unique)
- `createdAt`, `updatedAt`

**Rosters** (Join Table)
- `rosterId` (Integer, PK, auto-increment)
- `teamId` (FK → Teams)
- `userId` (FK → Users)
- `isLeader` (Boolean)

### Relationships
- **User ↔ Team**: Many-to-Many (through Roster)
- **User → Rosters**: One-to-Many
- **Team → Rosters**: One-to-Many

---

## 🔐 Authentication

### JWT Tokens

- **Access Token**: 30 minutes validity
- **Refresh Token**: 1 day validity (stored in httpOnly cookie)

### Flow

1. User logs in → Receives access token + refresh token
2. Client stores access token
3. Include access token in requests (Authorization header)
4. When expired, use refresh token to get new access token

### Password Requirements

- Minimum 8 characters
- 1 lowercase letter
- 1 uppercase letter
- 1 number
- 1 special character (!@#$%^&*...)

**Valid examples:** `Hello01@`, `SecurePass123!`, `MyP@ssw0rd`

---

## 📁 Project Structure

```
user-service/
├── server.js                 # Entry point, Apollo Server setup
├── package.json              # Dependencies & scripts
├── GRAPHQL_GUIDE.md          # API documentation
├── SEEDING.md                # Database seeding guide
└── src/
    ├── config/
    │   ├── postgres.db.js    # Database configuration
    │   └── sequelize.js      # Sequelize initialization
    ├── models/
    │   ├── userModel.js      # User model & associations
    │   ├── teamModel.js      # Team model & associations
    │   └── rosterModel.js    # Roster (join table) model
    ├── resolvers/
    │   └── resolvers.js      # GraphQL resolvers
    ├── schema/
    │   └── schema.graphql    # GraphQL schema definitions
    ├── seeds/
    │   ├── seedSafe.js       # Safe seeder (checks existing data)
    │   └── seed.js           # Fresh seeder (drops tables)
    └── utils/
        ├── generateTokens.js # JWT token generation
        └── hashPassword.js   # Password hashing utility
```

---

## 🛠️ Development

### Running in Development Mode

The service uses `nodemon` for hot-reloading:
```bash
yarn start
```

Changes to `.js` files will automatically restart the server.

### Database Sync

In development mode, Sequelize automatically syncs the database schema on startup:
- Creates tables if they don't exist
- Does NOT alter existing tables (safe mode)

To force a fresh schema:
```bash
yarn seed:fresh
```

---

## 🧪 Testing

### Test with GraphQL Playground

1. Start the service: `yarn start`
2. Open: http://localhost:4000/users
3. Use the interactive playground to test queries/mutations

### Test Credentials (After Seeding)

- **Email:** Any email from seeded users
- **Password:** `Hello01@` (for all seeded users)

### Manual Testing

```bash
# Check if service is running
curl http://localhost:4000/users

# Should return GraphQL Playground HTML
```

---

## ⚙️ Configuration

### Environment Variables

Required in `.env` file (project root):

```env
# Environment
NODE_ENV=development

# Database
DB_HOST=localhost
DB_USER=postgres
DB_PASS=191102
DB_NAME=personnel
DB_DIALECT=postgres

# JWT Secrets
ACCESS_TOKEN_SECRET=IDontKnowHowButTheyFoundMe
REFRESH_TOKEN_SECRET=ArcticMonkeys

# Server (optional)
PORT=4000
HOST=localhost
```

### CORS Configuration

Default allowed origin: `http://localhost:5173` (frontend)

To modify, edit `server.js`:
```javascript
const allowedOrigins = ["http://localhost:5173"];
```

---

## 🐛 Troubleshooting

### Database Connection Issues

**Error:** `ConnectionRefusedError`

**Solution:**
1. Ensure PostgreSQL is running
2. Check database credentials in `.env`
3. Verify database exists: `CREATE DATABASE personnel;`

See [DATABASE_SETUP.md](../DATABASE_SETUP.md) for detailed setup.

### Seed Fails with Validation Errors

**Error:** Password validation fails

**Cause:** Seeded passwords don't meet requirements

**Solution:** Check `src/seeds/seedSafe.js` - default password is `Hello01@` which meets all requirements.

### Port Already in Use

**Error:** `EADDRINUSE: address already in use :::4000`

**Solution:**
```bash
# Find process using port 4000
lsof -i :4000

# Kill the process
kill -9 <PID>
```

### Token Verification Fails

**Error:** `Invalid refresh token`

**Cause:** Cookie not being sent

**Solution:** Ensure requests include cookies (credentials: 'include')

---

## 📊 Default Seeded Data

After running `yarn seed`:

- **50 Members** (role: MEMBER)
- **20 Managers** (role: MANAGER)
- **10 Teams** with random names
- **Rosters** assigning users to teams:
  - 2-3 managers per team (first is leader)
  - 3-7 members per team

All users have password: `Hello01@`

---

## 🔗 Related Services

This is part of the Personnel Management System:

- **user-service** (this) - User authentication & management
- **team-service** - Team operations & roster management
- **frontend** - React-based user interface

---

## 📝 API Summary

### Queries (5)
- `users(role)` - Get all users by role
- `user(userId)` - Get single user
- `teams(userId)` - Get user's teams
- `team(teamId)` - Get team details
- `myTeams(userId)` - Get teams where user is leader

### Mutations (4)
- `createUser(input)` - Register new user
- `updateUser(userId, username, email)` - Update user profile
- `login(input)` - Authenticate user
- `renewToken(userId)` - Refresh access token

👉 **Full documentation: [GRAPHQL_GUIDE.md](./GRAPHQL_GUIDE.md)**

---

## 🤝 Contributing

When making changes:

1. Update GraphQL schema in `src/schema/schema.graphql`
2. Implement resolvers in `src/resolvers/resolvers.js`
3. Update models if changing database structure
4. Update documentation in `GRAPHQL_GUIDE.md`
5. Test with GraphQL Playground

---

## 📄 License

ISC

---

**Need Help?**
- 📖 [GraphQL API Guide](./GRAPHQL_GUIDE.md)
- 🌱 [Database Seeding Guide](./SEEDING.md)
- 🐘 [PostgreSQL Setup](../DATABASE_SETUP.md)

**Happy Coding! 🚀**
