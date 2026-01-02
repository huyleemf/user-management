import { apolloClient } from "@/apollo-client";
import type { User } from "./types";
import { GET_MANAGERS, GET_MEMBERS, GET_USERS } from "./queries";
import { enqueueSnackbar } from "notistack";

async function fetchUsers(role?: string): Promise<User[]> {
  try {
    const { data } = await apolloClient.query<{ users: User[] }>({
      query: GET_USERS,
      fetchPolicy: "no-cache",
      variables: { role },
    });
    return data?.users || [];
  } catch (error) {
    enqueueSnackbar(error + "", { variant: "error" });
    console.error(error);
    return Promise.reject(error);
  }
}
async function fetchManagers(): Promise<Partial<User>[]> {
  try {
    const { data } = await apolloClient.query<{ users: Partial<User>[] }>({
      query: GET_MANAGERS,
      fetchPolicy: "no-cache",
    });
    return data?.users || [];
  } catch (error) {
    console.error(error);
    enqueueSnackbar(error + "", { variant: "error" });
    return Promise.reject(error);
  }
}
async function fetchMembers(): Promise<Partial<User>[]> {
  try {
    const { data } = await apolloClient.query<{ users: Partial<User>[] }>({
      query: GET_MEMBERS,
      fetchPolicy: "no-cache",
    });
    return data?.users || [];
  } catch (error) {
    console.error(error);
    enqueueSnackbar(error + "", { variant: "error" });
    return Promise.reject(error);
  }
}

export { fetchUsers, fetchMembers, fetchManagers };
