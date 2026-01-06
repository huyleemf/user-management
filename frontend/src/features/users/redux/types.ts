import type { User, UserByRole } from "../api/types";

export interface UserState {
  users: User[];
  managers: UserByRole[];
  members: UserByRole[];
  loading: boolean;
  error: string | null;
  lastFetched: number | null;
}
export interface UserByRoleState {
  data: UserByRole[];
  loading: boolean;
  error: string | null;
  lastFetched: number | null;
}

export const initialState: UserState = {
  users: [],
  managers: [],
  members: [],
  loading: false,
  error: null,
  lastFetched: null,
};
