import { createSlice } from "@reduxjs/toolkit";
import { fetchUserReducers, initialUserState } from "./reducer";
import { NAME } from "../keys";

const userSlice = createSlice({
  name: NAME.USER,
  initialState: initialUserState,
  reducers: fetchUserReducers,
});

export const userActions = userSlice.actions;
export default userSlice.reducer;
