# 🎓 Frontend Integration Exercises

Hands-on exercises for integrating User Service (GraphQL) and Team Service (REST API) in your React application.

## 📋 Prerequisites

Before starting these exercises:
- ✅ PostgreSQL database running (via Docker or local)
- ✅ User Service running on `http://localhost:4000`
- ✅ Team Service running on `http://localhost:5000`
- ✅ Database seeded with test data

**Check services are running:**
```bash
# Terminal 1 - User Service
cd user-service && yarn start

# Terminal 2 - Team Service
cd team-service && yarn start

```

---

## 📚 Table of Contents

- [Exercise 1: User Authentication](#exercise-1-user-authentication)
- [Exercise 2: Display User Lists](#exercise-2-display-user-lists)
- [Exercise 3: Create Team Form](#exercise-3-create-team-form)
- [Exercise 4: Team Details Page](#exercise-4-team-details-page)
- [Exercise 5: Add/Remove Members](#exercise-5-addremove-members)
- [Exercise 6: Team Management Dashboard](#exercise-6-team-management-dashboard)
- [Exercise 7: Role-Based Features](#exercise-7-role-based-features)

---

## Exercise 1: User Authentication

### 🎯 Objective
Create a complete authentication flow with login, token management, and logout functionality.

### � APIs Used

**User Service (GraphQL) - `http://localhost:4000/users`**

```graphql
# Login Mutation
mutation Login($email: String!, $password: String!) {
  login(input: { email: $email, password: $password }) {
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

**Example Variables:**
```json
{
  "email": "manager1@example.com",
  "password": "Hello01@"
}
```

### �📝 Requirements

1. **Login Form**
   - Email and password inputs with validation
   - Show error messages for invalid credentials
   - Loading state during authentication
   - Success message after login

2. **Token Management**
   - Store access token in sessionStorage/localStorage/...
   - Store refresh token as httpOnly cookie (automatic)
   - Store user info in Redux state

3. **Logout Functionality**
   - Clear tokens from storage
   - Clear user from Redux state
   - Redirect to login page

### 💡 Tasks

**Task 1.1: Create GraphQL Login Mutation**

**Hints:**
- Import `GraphQLClient` from 'graphql-request'
- Create a client instance with the GraphQL endpoint from environment variables
- Set `credentials: 'include'` to handle cookies for refresh tokens
- Write a LOGIN_MUTATION GraphQL string that requests: code, success, message, accessToken, and user fields
- Create a `loginUser` async function that uses `graphqlClient.request()`

**Task 1.2: Create Login Component**

**Hints:**
- Use redux action to handle this flow.

**Task 1.3: Implement Logout**

**Hints:**
- Create a `logout()` action creator
- Clear access token from sessionStorage/localStorage/...
- Return action with type 'LOGOUT' to clear Redux state
- Consider clearing any other stored user data

### ✅ Acceptance Criteria

- [ ] User can login with valid credentials
- [ ] Access token is stored in sessionStorage/localStorage/...
- [ ] User info is stored in Redux state
- [ ] Error messages display for invalid credentials
- [ ] Loading state shows during authentication
- [ ] User can logout and tokens are cleared
- [ ] After logout, user is redirected to login page

### 📚 Resources

- User Service GraphQL Guide: `user-service/GRAPHQL_GUIDE.md` (Login Mutation section)

---

## Exercise 2: Display User Lists

### 🎯 Objective
Fetch and display lists of managers and members with filtering and search capabilities.

### � APIs Used

**User Service (GraphQL) - `http://localhost:4000/users`**

```graphql
# Get Users by Role Query
query GetUsers($role: UserType!) {
  users(role: $role) {
    userId
    username
    email
    role
    createdAt
  }
}
```

**Example Variables for Managers:**
```json
{
  "role": "MANAGER"
}
```

**Example Variables for Members:**
```json
{
  "role": "MEMBER"
}
```

### �📝 Requirements

1. **Managers Page**
   - Fetch all managers from GraphQL API
   - Display in a table using TanStack Table
   - Show: username, email, createdAt,...
   - Loading and error states

2. **Members Page**
   - Fetch all members from GraphQL API
   - Display in a table/grid using TanStack Table
   - Show: username, email, createdAt,...
   - Loading and error states

3. **Search/Filter**
   - Search by username or email (client-side)
   - Sort by name or date

### 💡 Tasks

**Task 2.1: Create GraphQL Queries**

**Hints:**
- Write a GET_USERS_QUERY that accepts a `$role` variable of type `UserType!`
- Request fields: userId, username, email, role, createdAt
- Create `fetchUsers(role)` async function
- Use `graphqlClient.request()` with the query and variables
- Return the users array from the response

**Task 2.2: Create UserList Component**

**Task 2.3: Create Pages**

### ✅ Acceptance Criteria

- [ ] Managers page displays all managers
- [ ] Members page displays all members
- [ ] Loading state shows while fetching
- [ ] Error state shows if fetch fails
- [ ] Search filters users by username/email
- [ ] Data displays username, email, and creation date
- [ ] Dates are formatted nicely (use toLocaleDateString)


### 📚 Resources

- User Service GraphQL Guide: `user-service/GRAPHQL_GUIDE.md` (Queries section)

---

## Exercise 3: Create Team Form

### 🎯 Objective
Create a form to create new teams by selecting managers and members from existing users.

### � APIs Used

**1. User Service (GraphQL) - Fetch Available Users**

```graphql
# Get Managers
query GetManagers {
  users(role: MANAGER) {
    userId
    username
    email
  }
}

# Get Members
query GetMembers {
  users(role: MEMBER) {
    userId
    username
    email
  }
}
```

**2. Team Service (REST) - Create Team**

```http
POST http://localhost:5000/teams
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "teamName": "Engineering Team",
  "managers": [
    {
      "managerId": "uuid-here",
      "managerName": "John Doe"
    }
  ],
  "members": [
    {
      "memberId": "uuid-here",
      "memberName": "Jane Smith"
    }
  ]
}
```

**Response:**
```json
{
  "message": "Team created successfully",
  "team": {
    "teamId": "uuid",
    "teamName": "Engineering Team",
    "teamLeader": { "userId": "uuid", "username": "CurrentUser" },
    "managers": [...],
    "members": [...],
    "createdAt": "2025-12-29T..."
  }
}
```

### �📝 Requirements

1. **Form Fields**
   - Team name input (required, min 1 char)
   - Multi-select for managers (fetch from GraphQL)
   - Multi-select for members (fetch from GraphQL)
   - Submit button (disabled if invalid)

2. **Data Flow**
   - Fetch managers list from User Service (GraphQL)
   - Fetch members list from User Service (GraphQL)
   - Submit to Team Service (REST)
   - Handle success/error responses

3. **Validation**
   - Team name is required
   - At least show available users to select
   - Show validation errors

### 💡 Tasks

**Task 3.1: Create Team API Functions**

**Hints:** Create React query to CRUD team APIs


**Task 3.2: Create Team Form Component**

**Task 3.3: Add to Teams Page**


### ✅ Acceptance Criteria

- [ ] Form fetches and displays available managers
- [ ] Form fetches and displays available members
- [ ] User can enter team name
- [ ] User can select multiple managers
- [ ] User can select multiple members
- [ ] Form validates team name is not empty
- [ ] Submit creates team via REST API
- [ ] Success message/redirect after creation
- [ ] Error messages display properly
- [ ] Current user (logged in manager) is filtered from selection
- [ ] Loading states during fetch and submit

### 💡 Tips

- Consider using react-hook-form or formik/yup/zod for form validation
- Show loading spinner during user fetch and form submit
- Use toast notifications (react-toastify) for success/error messages

### 📚 Resources

- Team Service API Guide: `team-service/API_GUIDE.md` (Create Team section)
- User Service GraphQL Guide: `user-service/GRAPHQL_GUIDE.md`

---

## Exercise 4: Team Details Page

### 🎯 Objective
Display comprehensive team information including team leader, managers, and members.

### 🔌 APIs Used

**1. User Service (GraphQL) - Get User's Teams**

```graphql
query GetUserTeams($userId: ID!) {
  teams(userId: $userId) {
    teamId
    teamName
    rosterCount
  }
}
```

**Example Variables:**
```json
{
  "userId": "current-user-id"
}
```

**2. Team Service (REST) - Get Team Details**

```http
GET http://localhost:5000/teams/{teamId}
Authorization: Bearer {accessToken}
```

**Response:**
```json
{
  "team": {
    "teamId": "uuid",
    "teamName": "Engineering Team",
    "teamLeader": {
      "userId": "uuid",
      "username": "John Doe"
    },
    "managers": [
      {
        "managerId": "uuid",
        "managerName": "Jane Smith"
      }
    ],
    "members": [
      {
        "memberId": "uuid",
        "memberName": "Bob Johnson"
      }
    ],
    "createdAt": "2025-12-29T..."
  }
}
```

### 📝 Requirements

1. **Team Information Display**
   - Team name and ID
   - Team leader info
   - List of managers with names
   - List of members with names
   - Total counts

2. **User Details Enhancement**
   - For each user, show role badge
   - Highlight team leader
   - Show member status (manager/member)

3. **Navigation**
   - Access from teams list
   - Back button to teams list
   - Handle non-existent team IDs

### 💡 Tasks

**Task 4.1: Create Team Details Component**

**Hints:**
- Use `useParams()` to get teamId from URL
- Call REST API `getTeam(teamId)`
- Handle error responses: 400 for unauthorized, 404 for not found
- Display: team name, team leader with badge, managers list, members list
- Add back button using `useNavigate()`
- Show counts for managers and members
- Handle loading and error states

**Task 4.2: Create Team Card Component**

**Task 4.3: Fetch User's Teams**

**Task 4.4: Update Teams Page**

```

### ✅ Acceptance Criteria

- [ ] Teams page shows all teams user belongs to
- [ ] Clicking a team navigates to team details
- [ ] Team details shows team name, leader, managers, members
- [ ] Shows correct counts for managers and members
- [ ] Team leader is visually distinguished
- [ ] Back button returns to teams list
- [ ] Loading states during data fetch
- [ ] Error handling for unauthorized access
- [ ] Error handling for non-existent teams

### 📚 Resources

- Team Service API Guide: `team-service/API_GUIDE.md` (Get Team Details)

```

## Exercise 5: Add/Remove Members

### 🎯 Objective
Implement functionality to add and remove members/managers from a team with proper authorization checks.

### � APIs Used

**1. User Service (GraphQL) - Get Available Users**

```graphql
# Get all members (for add member modal)
query GetMembers {
  users(role: MEMBER) {
    userId
    username
    email
  }
}

# Get all managers (for add manager modal)
query GetManagers {
  users(role: MANAGER) {
    userId
    username
    email
  }
}

**2. Team Service (REST) - Add Member**

```http
POST http://localhost:5000/teams/{teamId}/members
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "memberId": "uuid-here",
  "memberName": "John Doe"
}
```

**3. Team Service (REST) - Remove Member**

```http
DELETE http://localhost:5000/teams/{teamId}/members/{memberId}
Authorization: Bearer {accessToken}
```

**4. Team Service (REST) - Add Manager**

```http
POST http://localhost:5000/teams/{teamId}/managers
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "managerId": "uuid-here",
  "managerName": "Jane Smith"
}
```

**5. Team Service (REST) - Remove Manager**

```http
DELETE http://localhost:5000/teams/{teamId}/managers/{managerId}
Authorization: Bearer {accessToken}
```

### �📝 Requirements

1. **Add Member Feature**
   - Button to add member (managers only)
   - Modal/form to select member
   - Exclude users already in team
   - Update UI after successful add

2. **Remove Member Feature**
   - Remove button next to each member (managers only)
   - Confirmation dialog
   - Update UI after successful remove
   - Cannot remove team leader

3. **Add/Remove Managers**
   - Similar functionality for managers
   - Only team leader can add/remove managers
   - Cannot remove team leader

### 💡 Tasks

**Task 5.1: Create Add Member Modal**

**Hints:**
- Create modal overlay with:
  - Select dropdown showing username and email
  - Add button (disabled if no user selected or loading)
  - Cancel button
  - Error message display

**Task 5.2: Create Remove Confirmation Dialog**

**Hints:**
- Show title, message text, and action buttons
- Two buttons: "Cancel" and "Confirm"
- Disable both buttons while loading is true
- Change confirm text to "Removing..." during loading
- Use Tailwind for styling

**Task 5.3: Update Team Details with Actions**

### ✅ Acceptance Criteria

- [ ] Managers can see "Add Member" button
- [ ] Team leaders can see "Add Manager" button
- [ ] Add member modal shows only users not in team
- [ ] Add manager modal shows only managers not in team
- [ ] Successfully adding member updates the UI
- [ ] Managers can remove members
- [ ] Team leader can remove managers (except themselves)
- [ ] Confirmation dialog appears before removal
- [ ] UI updates after successful removal
- [ ] Error messages display for failures
- [ ] Loading states during operations
- [ ] Cannot remove team leader


---

## Exercise 6: Team Management Dashboard

### 🎯 Objective
Create a comprehensive dashboard showing team statistics, recent activity, and quick actions.

### � APIs Used

**1. User Service (GraphQL) - Get User's Teams**

```graphql
query GetUserTeams($userId: ID!) {
  teams(userId: $userId) {
    teamId
    teamName
    rosterCount
    createdAt
  }
}
```

**2. Team Service (REST) - Get Detailed Team Info (Optional)**

```http
GET http://localhost:5000/teams/{teamId}
Authorization: Bearer {accessToken}
```

**Note:** You can fetch all team details to calculate:
- Total teams count
- Teams where user is leader
- Total members managed (sum of all roster members)
- Largest team (team with most members)
- Average team size

**Example Flow:**
1. Fetch all teams using GraphQL
2. For detailed stats, optionally fetch each team's full details via REST
3. Calculate statistics from the combined data

### �📝 Requirements

1. **Dashboard Overview**
   - Total teams count
   - Teams where user is leader
   - Total members managed
   - Recent teams

2. **Team Statistics**
   - Largest team (most members)
   - Teams by role (leader vs member)
   - Average team size

3. **Quick Actions**
   - Create new team (managers only)
   - View team details
   - Quick add member to team

### 💡 Tasks

**Task 6.1: Create Dashboard Component**

**Hints:**
- Get current user from Redux
- Use useState for: teams array, stats object, loading, error
- In `loadDashboardData()`:
  - Fetch all user's teams using GraphQL `fetchUserTeams(userId)`
  - Optionally: fetch detailed info for each team using REST API
  - Calculate statistics from the data
- Create `calculateStats(teams)` helper:
  - totalTeams: teams.length
  - teamsAsLeader: filter where team.teamLeader.userId === user.userId
  - totalMembersManaged: sum of all members and managers across teams
  - largestTeam: use Array.reduce() to find team with most people
  - averageTeamSize: total people / number of teams
- Display stats in grid of cards
- Show loading spinner during fetch
- Handle empty state (no teams)

**Task 6.2: Create Stats Card Component**

**Hints:**
- Use Tailwind CSS for card styling
- Card structure:
  - Icon (emoji or SVG) in colored circle
  - Title text
  - Large value number
  - Optional subtitle or trend
- Make clickable if onClick is provided
- Add hover effects for better UX
- Use gradient backgrounds for visual appeal

**Task 6.3: Add Quick Actions**

**Hints:**
- Add "Quick Actions" section to Dashboard
- Show action buttons:
  - "Create New Team" (only for MANAGER role)
  - "View All Teams"
  - "View All Managers" (only for MANAGER role)
- Use React Router's `useNavigate()` for navigation
- Group actions logically (team actions, user actions)

### ✅ Acceptance Criteria

- [ ] Dashboard shows total teams count
- [ ] Shows teams where user is leader
- [ ] Calculates total members managed
- [ ] Shows largest team information
- [ ] Calculates average team size
- [ ] Quick links to team details
- [ ] Loading state while fetching data
- [ ] Handles case when user has no teams
- [ ] Statistics update when teams change

---

## Exercise 7: Role-Based Features

### 🎯 Objective
Implement proper role-based UI rendering and authorization checks.


**Key Data Points:**
- `user.role` - from Redux state (MANAGER or MEMBER)
- `team.teamLeader.userId` - from team details API
- Compare `user.userId === team.teamLeader.userId` for leadership check

### �📝 Requirements

1. **Conditional Rendering**
   - Show/hide features based on user role
   - Show/hide features based on team leadership
   - Disable buttons for unauthorized actions

2. **Authorization Checks**
   - Verify user role before showing actions
   - Check team leadership for manager actions
   - Display appropriate error messages

3. **UI Indicators**
   - Role badges (MANAGER/MEMBER)
   - Leader badge
   - Disabled state styling

### 💡 Tasks

**Create useAuthorization Hook**

Create `useAuthorization`:

**Hints:**
- Return helper functions and booleans:
  - `isManager`: boolean check if user.role === 'MANAGER'
  - `isMember`: boolean check if user.role === 'MEMBER'
  - ...
- Use this hook in components to simplify authorization logic
- Example: `const { isManager, canAddMember } = useAuthorization();`
  
```

### ✅ Acceptance Criteria

- [ ] Manager role sees create team button
- [ ] Member role doesn't see create team button
- [ ] Team leader sees add/remove manager buttons
- [ ] Non-leader managers don't see manager management
- [ ] Role badges display correctly
- [ ] Leader badge highlights team leader
- [ ] Unauthorized actions show appropriate messages
- [ ] Disabled states are visually clear
- [ ] useAuthorization hook works correctly


