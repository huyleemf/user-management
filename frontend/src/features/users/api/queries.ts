import { gql } from "@apollo/client";

const GET_USERS = gql`
  query GetUsers($role: UserType!) {
    users(role: $role) {
      userId
      username
      email
      role
      createdAt
    }
  }
`;

const GET_MANAGERS = gql`
  query GetManagers {
    users(role: MANAGER) {
      userId
      username
      email
    }
  }
`;

const GET_MEMBERS = gql`
  query GetMembers {
    users(role: MEMBER) {
      userId
      username
      email
    }
  }
`;

const GET_USER_TEAM = gql`
  query GetUserTeams($userId: ID!) {
    teams(userId: $userId) {
      teamId
      teamName
      rosterCount
    }
  }
`;
export { GET_USERS, GET_MANAGERS, GET_MEMBERS, GET_USER_TEAM };
