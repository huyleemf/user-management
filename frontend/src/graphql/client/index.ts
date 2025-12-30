import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

export const apolloClient = new ApolloClient({
  link: new HttpLink({
    uri: import.meta.env.USER_SERVICE_API_URL,
    credentials: "include",
  }),
  cache: new InMemoryCache(),
});
