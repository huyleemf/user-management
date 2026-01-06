import { createSlice } from "@reduxjs/toolkit";
import { NAME } from "../keys";
import { fetchUserReducers, fetchUsersByRoleReducers } from "./reducer";
import { initialState } from "./types";

const userSlice = createSlice({
  name: NAME.USER,
  initialState: initialState,
  reducers: {
    ...fetchUserReducers,
    ...fetchUsersByRoleReducers,
  },
});
export const userActions = userSlice.actions;
export default userSlice.reducer;
