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

export { GET_USERS };
