import { gql } from "@apollo/client";

const LOGIN = gql`
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
`;

export { LOGIN };
