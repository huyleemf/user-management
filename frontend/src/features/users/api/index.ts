import { apolloClient } from "@/apollo-client";
import type { User } from "./types";
import { GET_MANAGERS, GET_MEMBERS, GET_USERS } from "./queries";

async function fetchUsers(role?: string): Promise<User[]> {
  const { data } = await apolloClient.query<{ users: User[] }>({
    query: GET_USERS,
    fetchPolicy: "no-cache",
    variables: { role },
  });
  return data?.users || [];
}
async function fetchManagers(): Promise<Partial<User>[]> {
  const { data } = await apolloClient.query<{ users: Partial<User>[] }>({
    query: GET_MANAGERS,
    fetchPolicy: "no-cache",
  });
  return data?.users || [];
}
async function fetchMembers(): Promise<Partial<User>[]> {
  const { data } = await apolloClient.query<{ users: Partial<User>[] }>({
    query: GET_MEMBERS,
    fetchPolicy: "no-cache",
  });
  return data?.users || [];
}

export { fetchUsers, fetchMembers, fetchManagers };
