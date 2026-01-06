import { createSlice } from "@reduxjs/toolkit";
import {
  fetchUserReducers,
  fetchUsersByRoleReducers,
  fetchUserTeamReducers,
} from "./reducer";
import { initialState } from "./types";
import { NAME } from "../keys";

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
