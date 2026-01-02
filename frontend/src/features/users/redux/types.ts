import type { User, UserByRole, UserTeam } from "../api/types";

export interface UserState {
  users: User[];
  managers: UserByRole[];
  members: UserByRole[];
  userTeam: UserTeam | null;
  loading: boolean;
  error: string | null;
  lastFetched: number | null;
}

export const initialState: UserState = {
  users: [],
  managers: [],
  members: [],
  userTeam: null,
  loading: false,
  error: null,
  lastFetched: null,
};
