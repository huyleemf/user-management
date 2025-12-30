import { apolloClient } from "@/apollo-client";
import type { User } from "./types";
import { GET_USERS } from "./queries";

async function fetchUsers(role?: string): Promise<User[]> {
  const { data } = await apolloClient.query<{ users: User[] }>({
    query: GET_USERS,
    fetchPolicy: "no-cache",
    variables: { role },
  });
  return data?.users || [];
}

export { fetchUsers };
