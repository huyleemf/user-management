# 🐘 PostgreSQL Database Setup with Docker

This guide will help you set up PostgreSQL for the Personnel Management System using Docker.

## 📋 Database Configuration

Based on your `.env` file:
- **Host:** localhost
- **Port:** 5432
- **User:** postgres
- **Password:** 191102
- **Database:** personnel
- **Dialect:** postgres

---

## 🚀 Quick Start

### 1. Start PostgreSQL with Docker

```bash
# From the project root directory
cd ../personnel-management

# Start PostgreSQL in detached mode
docker-compose up -d

# Check if container is running
docker-compose ps
```

Expected output:
```
NAME                      STATUS              PORTS
personnel-postgres-db     Up 10 seconds       0.0.0.0:5432->5432/tcp
```

### 2. Verify Database Connection

```bash
# Check if PostgreSQL is ready
docker-compose exec postgres pg_isready -U postgres -d personnel

# Should output: /var/run/postgresql:5432 - accepting connections
```

### 3. Seed the Database

```bash
cd user-service
yarn seed
```

---

## 🛠️ Common Docker Commands

### Start/Stop Database

```bash
# Start database
docker-compose up -d

# Stop database (keeps data)
docker-compose stop

# Stop and remove container (keeps data in volume)
docker-compose down

# Stop and REMOVE ALL DATA (⚠️ WARNING)
docker-compose down -v
```

### View Logs

```bash
# View all logs
docker-compose logs

# Follow logs in real-time
docker-compose logs -f

# View only postgres logs
docker-compose logs postgres
```

### Check Status

```bash
# List running containers
docker-compose ps

# Check container health
docker ps --filter name=personnel-postgres-db --format "table {{.Names}}\t{{.Status}}"
```

---

## 🔍 Access PostgreSQL

### Option 1: Using psql from Docker Container

```bash
# Connect to psql inside the container
docker-compose exec postgres psql -U postgres -d personnel

# Inside psql:
\l              # List all databases
\dt             # List all tables
\d "Users"      # Describe Users table
\d "Teams"      # Describe Teams table
\d "Rosters"    # Describe Rosters table
\q              # Quit
```

### Option 2: Using psql from Host (if installed)

```bash
psql -h localhost -p 5432 -U postgres -d personnel
# Password: 191102
```

### Option 3: Using GUI Tools

Connect with tools like:
- **pgAdmin**: http://localhost:5432
- **DBeaver**
- **TablePlus**
- **DataGrip**

**Connection settings:**
```
Host: localhost
Port: 5432
Database: personnel
Username: postgres
Password: 191102
```

---

## 📊 Useful SQL Queries

Once connected to psql, you can run:

```sql
-- Count all users
SELECT role, COUNT(*) FROM "Users" GROUP BY role;

-- View all teams
SELECT * FROM "Teams";

-- View roster composition
SELECT 
    t."teamName",
    u.username,
    u.role,
    r."isLeader"
FROM "Rosters" r
JOIN "Teams" t ON r."teamId" = t."teamId"
JOIN "Users" u ON r."userId" = u."userId"
ORDER BY t."teamName", u.role;

-- Count members per team
SELECT 
    t."teamName",
    COUNT(*) as member_count
FROM "Rosters" r
JOIN "Teams" t ON r."teamId" = t."teamId"
GROUP BY t."teamName";
```

---

## 🔧 Troubleshooting

### Port 5432 Already in Use

```bash
# Check what's using port 5432
lsof -i :5432

# If another PostgreSQL is running, stop it:
brew services stop postgresql
# or
pg_ctl stop
```

### Container Won't Start

```bash
# Check logs for errors
docker-compose logs postgres

# Remove and recreate container
docker-compose down
docker-compose up -d
```

### Can't Connect from Host

```bash
# Ensure container is running
docker-compose ps

# Check if port is exposed
docker port personnel-postgres-db

# Test connection
docker-compose exec postgres pg_isready
```

### Reset Everything (⚠️ Deletes All Data)

```bash
# Stop and remove containers, networks, and volumes
docker-compose down -v

# Remove postgres data volume
docker volume rm personnel-management_postgres_data

# Start fresh
docker-compose up -d
cd user-service
yarn seed
```

---

## 📦 Data Persistence

Your data is stored in a Docker volume named `personnel-management_postgres_data`. This means:

✅ Data persists when you stop the container
✅ Data persists when you restart your computer
✅ Data is only deleted if you run `docker-compose down -v`

To backup your data:

```bash
# Create backup
docker-compose exec postgres pg_dump -U postgres personnel > backup.sql

# Restore from backup
docker-compose exec -T postgres psql -U postgres personnel < backup.sql
```

---

## 🎯 Next Steps

1. **Start PostgreSQL**: `docker-compose up -d`
2. **Seed Database**: `cd user-service && yarn seed`
3. **Start User Service**: `yarn start`
4. **Test GraphQL**: Open http://localhost:4000/users

---

## 📝 Environment Variables

Your `.env` file is already configured correctly:

```env
NODE_ENV = development
DB_HOST = localhost
DB_USER = postgres
DB_PASS = 191102
DB_NAME = personnel
DB_DIALECT = postgres
```

No changes needed! ✅
