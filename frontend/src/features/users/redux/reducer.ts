import type { PayloadAction } from "@reduxjs/toolkit";
import type { User } from "../api/types";
import type { UserState } from "./types";

export const initialUserState: UserState = {
  data: [],
  loading: false,
  error: null,
  lastFetched: null,
};

export const fetchUserReducers = {
  fetchUsersRequested(
    state: UserState,
    action: PayloadAction<string | undefined>
  ) {
    state.loading = true;
    state.error = null;
  },
  fetchUsersSucceeded(state: UserState, action: PayloadAction<User[]>) {
    state.loading = false;
    state.data = action.payload;
    state.lastFetched = Date.now();
  },
  fetchUsersFailed(state: UserState, action: PayloadAction<string>) {
    state.loading = false;
    state.error = action.payload;
    state.lastFetched = Date.now();
  },
};
