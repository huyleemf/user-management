import { createSlice } from "@reduxjs/toolkit";
import { NAME } from "../keys";
import {
  fetchUserReducers,
  fetchUsersByRoleReducers,
  fetchUserTeamReducers,
} from "./reducer";
import { initialState } from "./types";

const userSlice = createSlice({
  name: NAME.USER,
  initialState: initialState,
  reducers: {
    ...fetchUserReducers,
    ...fetchUsersByRoleReducers,
    ...fetchUserTeamReducers,
  },
});
export const userActions = userSlice.actions;
export default userSlice.reducer;
