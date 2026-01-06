import type { User } from "../api/types";

export interface UserState {
  data: User[];
  loading: boolean;
  error: string | null;
  lastFetched: number | null;
}
