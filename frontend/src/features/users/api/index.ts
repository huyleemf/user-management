import { apolloClient } from "@/apollo-client";
import { enqueueSnackbar } from "notistack";
import { GET_MANAGERS, GET_MEMBERS, GET_USER_TEAM, GET_USERS } from "./queries";
import type { User, UserTeam } from "./types";

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

async function fetchUserTeam(userId: string): Promise<UserTeam | null> {
  try {
    const { data } = await apolloClient.query<{ teams: UserTeam }>({
      query: GET_USER_TEAM,
      fetchPolicy: "no-cache",
      variables: { userId },
    });
    console.log("cac" + data);
    return data?.teams || null;
  } catch (error) {
    console.error(error);
    enqueueSnackbar(error + "", { variant: "error" });
    return Promise.reject(error);
  }
}

export { fetchManagers, fetchMembers, fetchUsers, fetchUserTeam };
