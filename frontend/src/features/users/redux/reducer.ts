import type { PayloadAction } from "@reduxjs/toolkit";
import type { User, UserByRole } from "../api/types";
import type { UserState } from "./types";

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
    state.users = action.payload;
    state.lastFetched = Date.now();
  },
  fetchUsersFailed(state: UserState, action: PayloadAction<string>) {
    state.loading = false;
    state.error = action.payload;
    state.lastFetched = Date.now();
  },
};

export const fetchUsersByRoleReducers = {
  fetchManagersRequested(
    state: UserState,
    action: PayloadAction<string | undefined>
  ) {
    state.loading = true;
    state.error = null;
  },
  fetchManagersSucceeded(
    state: UserState,
    action: PayloadAction<UserByRole[]>
  ) {
    state.loading = false;
    state.managers = action.payload;
    state.lastFetched = Date.now();
  },
  fetchManagersFailed(state: UserState, action: PayloadAction<string>) {
    state.loading = false;
    state.error = action.payload;
    state.lastFetched = Date.now();
  },
  fetchMembersRequested(
    state: UserState,
    action: PayloadAction<string | undefined>
  ) {
    state.loading = true;
    state.error = null;
  },
  fetchMembersSucceeded(state: UserState, action: PayloadAction<UserByRole[]>) {
    state.loading = false;
    state.members = action.payload;
    state.lastFetched = Date.now();
  },
  fetchMembersFailed(state: UserState, action: PayloadAction<string>) {
    state.loading = false;
    state.error = action.payload;
    state.lastFetched = Date.now();
  },
};
