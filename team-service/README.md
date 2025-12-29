# Team Service 🌐

RESTful API microservice for team management operations in the Personnel Management System.

## 🎯 Overview

This service provides:
- ✅ Team creation and deletion
- ✅ Add/Remove team members and managers
- ✅ Team roster management
- ✅ Role-based authorization (Manager/Leader)
- ✅ JWT-based authentication

**Tech Stack:**
- **Express.js** - Web framework
- **Knex.js** - SQL query builder
- **PostgreSQL** - Database
- **Joi** - Request validation
- **JWT** - Authentication
- **Morgan** - HTTP request logger

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
yarn install
```

### 2. Configure Environment
Ensure your `.env` file is set up in the project root (same as user-service).

### 3. Run Migrations
```bash
cd src/config
npx knex migrate:latest
```

### 4. Seed Database (Optional)
```bash
npx knex seed:run
```

### 5. Start the Service
```bash
yarn start
```

The service will be available at: **http://localhost:5000**

---

## 📚 Documentation

- **[API_GUIDE.md](./API_GUIDE.md)** - Complete REST API documentation with examples
- **[DATABASE_SETUP.md](../DATABASE_SETUP.md)** - PostgreSQL setup guide

---

## 📋 Available Scripts

```bash
# Start development server with hot reload
yarn start

# Run database migrations
cd src/config && npx knex migrate:latest

# Rollback last migration
cd src/config && npx knex migrate:rollback

# Seed database
cd src/config && npx knex seed:run
```

---

## 🔍 REST API

### Base URL
**http://localhost:5000/teams**

### Quick Examples

**Create a team:**
```bash
curl -X POST http://localhost:5000/teams \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "teamName": "Engineering Team",
    "managers": [],
    "members": []
  }'
```

**Get team details:**
```bash
curl -X GET http://localhost:5000/teams/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Add member:**
```bash
curl -X POST http://localhost:5000/teams/1/members \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "memberId": "550e8400-e29b-41d4-a716-446655440010",
    "memberName": "Alice"
  }'
```

👉 **See [API_GUIDE.md](./API_GUIDE.md) for complete API documentation**

---

## 🗄️ Database Schema

### Tables

**Teams**
- `teamId` (Integer, PK, auto-increment)
- `teamName` (String, unique)
- `createdAt`, `updatedAt`

**Users** (shared with user-service)
- `userId` (UUID, PK)
- `username`, `email`, `password`, `role`
- `createdAt`, `updatedAt`

**Rosters** (Join Table)
- `rosterId` (Integer, PK, auto-increment)
- `teamId` (FK → Teams)
- `userId` (FK → Users)
- `isLeader` (Boolean) - Marks team leader

### Migrations

Located in `src/config/migrations/`:
- `20250428023054_users.js` - Users table
- `20250428032441_teams.js` - Teams table
- `20250428032803_rosters.js` - Rosters table

---

## 🔐 Authentication & Authorization

### Authentication
All endpoints require JWT authentication via Bearer token:
```http
Authorization: Bearer <access_token>
```

### Authorization Levels

1. **MANAGER Role**: Required for all team operations
2. **Team Leader**: Required for:
   - Adding/removing managers
   - Deleting teams
3. **Team Member**: Can view team details if member of the team

### Token Refresh
- Expired access tokens are automatically refreshed using refresh token from cookies
- New access token returned in `Authorization` header

---

## 📁 Project Structure

```
team-service/
├── server.js                    # Entry point, Express setup
├── package.json                 # Dependencies & scripts
├── API_GUIDE.md                 # Complete API documentation
└── src/
    ├── config/
    │   ├── knexfile.js          # Knex configuration
    │   ├── knexInstance.js      # Knex instance
    │   ├── migrations/          # Database migrations
    │   │   ├── 20250428023054_users.js
    │   │   ├── 20250428032441_teams.js
    │   │   └── 20250428032803_rosters.js
    │   └── seeds/               # Database seeders
    │       └── usersSeeder.js
    ├── controllers/
    │   └── teamController.js    # Business logic for team operations
    ├── middleware/
    │   ├── authenMiddleware.js  # JWT authentication
    │   ├── authorMiddleware.js  # Role-based authorization
    │   └── errorMiddleware.js   # Error handling
    ├── routes/
    │   └── teamRoutes.js        # Route definitions
    ├── schemas/
    │   └── joiSchemas.js        # Request validation schemas
    └── utils/
        ├── checkExistence.js    # Check user/team existence
        ├── generateTokens.js    # JWT token generation
        ├── getInfo.js           # Get user/team info
        ├── hashPassword.js      # Password hashing
        ├── processArray.js      # Process member/manager arrays
        └── processRequestBody.js # Validate request body
```

---

## 🛠️ Development

### Running in Development Mode

```bash
yarn start
```

Uses `nodemon` for hot-reloading and `morgan` for HTTP request logging.

### Database Migrations

**Create new migration:**
```bash
cd src/config
npx knex migrate:make migration_name
```

**Run migrations:**
```bash
npx knex migrate:latest
```

**Rollback:**
```bash
npx knex migrate:rollback
```

### Database Seeding

**Run seeders:**
```bash
cd src/config
npx knex seed:run
```

Creates 50 Members and 50 Managers with password `Hello01@`.

---

## 📡 API Endpoints

### Teams

| Method | Endpoint | Auth Level | Description |
|--------|----------|------------|-------------|
| `POST` | `/teams` | Manager | Create new team |
| `GET` | `/teams/:teamId` | Team Member | Get team details |
| `DELETE` | `/teams/:teamId` | Team Leader | Delete team |

### Members

| Method | Endpoint | Auth Level | Description |
|--------|----------|------------|-------------|
| `POST` | `/teams/:teamId/members` | Manager | Add member |
| `DELETE` | `/teams/:teamId/members/:memberId` | Manager | Remove member |

### Managers

| Method | Endpoint | Auth Level | Description |
|--------|----------|------------|-------------|
| `POST` | `/teams/:teamId/managers` | Team Leader | Add manager |
| `DELETE` | `/teams/:teamId/managers/:managerId` | Team Leader | Remove manager |

👉 **Full documentation: [API_GUIDE.md](./API_GUIDE.md)**

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
PORT=5000
HOST=localhost
```

### CORS Configuration

Default allowed origin: `http://localhost:5173` (frontend)

Modify in `server.js`:
```javascript
const allowedOrigins = ["http://localhost:5173"];
```

---

## 🐛 Troubleshooting

### Database Connection Issues

**Error:** Connection refused

**Solution:**
1. Ensure PostgreSQL is running
2. Check database credentials in `.env`
3. Verify database exists

### Migration Errors

**Error:** Migration table not found

**Solution:**
```bash
cd src/config
npx knex migrate:latest
```

### Authentication Errors

**Error:** `Not Authorized. Invalid access token.`

**Solution:**
1. Ensure you've logged in via user-service
2. Include `Authorization: Bearer <token>` header
3. Check token hasn't expired

### Authorization Errors

**Error:** `Access to this route is not permitted for a member.`

**Solution:**
- Only users with MANAGER role can perform team operations
- Login with a manager account

**Error:** `Only the Lead Manager may perform this action.`

**Solution:**
- Operation requires team leader privileges
- Must be the user who created the team (isLeader: true)

---

## 🧪 Testing

### Manual Testing with cURL

See [API_GUIDE.md](./API_GUIDE.md) for complete cURL examples.

### Testing Workflow

1. **Login** (user-service):
   ```bash
   # Get access token
   curl -X POST http://localhost:4000/users \
     -H "Content-Type: application/json" \
     -d '{"query": "mutation { login(input: { email: \"manager@test.com\", password: \"Hello01@\" }) { accessToken } }"}'
   ```

2. **Create Team**:
   ```bash
   curl -X POST http://localhost:5000/teams \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"teamName": "Test Team", "managers": [], "members": []}'
   ```

3. **Get Team**:
   ```bash
   curl -X GET http://localhost:5000/teams/1 \
     -H "Authorization: Bearer YOUR_TOKEN"
   ```

---

## 🔄 Integration with User Service

### Service Communication

The team-service:
- ✅ Uses the same PostgreSQL database as user-service
- ✅ Shares the Users table
- ✅ Validates JWT tokens issued by user-service
- ✅ Checks user roles and permissions

### Workflow

1. User logs in via **user-service** (GraphQL)
2. Receives access token + refresh token
3. Uses access token to make requests to **team-service** (REST)
4. Team-service validates token and user permissions
5. Returns team data or performs operations

---

## 📊 Business Rules

### Team Creation
- ✅ Team names must be unique
- ✅ Creator becomes team leader (isLeader: true)
- ✅ Only managers can create teams
- ✅ Members and managers arrays are optional

### Team Leadership
- ✅ One leader per team
- ✅ Leader cannot be removed
- ✅ Only leader can add/remove managers
- ✅ Only leader can delete team

### Team Membership
- ✅ User can belong to multiple teams
- ✅ Cannot add same user twice to a team
- ✅ User must exist in Users table
- ✅ Managers can add/remove members

---

## 🤝 Contributing

When making changes:

1. Update controllers in `src/controllers/`
2. Update validation schemas in `src/schemas/joiSchemas.js`
3. Update routes in `src/routes/teamRoutes.js`
4. Update documentation in `API_GUIDE.md`
5. Test all endpoints

---

## 📄 License

ISC

---

## 🔗 Related Services

This is part of the Personnel Management System:

- **user-service** - User authentication & GraphQL API
- **team-service** (this) - Team operations & REST API
- **frontend** - React-based user interface

---

**Need Help?**
- 📖 [REST API Guide](./API_GUIDE.md)
- 🔐 [User Service GraphQL Guide](../user-service/GRAPHQL_GUIDE.md)
- 🐘 [PostgreSQL Setup](../DATABASE_SETUP.md)

**Happy Coding! 🚀**
