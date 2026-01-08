import { createSlice } from "@reduxjs/toolkit";
import { authReducer } from "./reducer";
import { initialState } from "./types";
import { NAME } from "../keys";

const authSlice = createSlice({
  name: NAME.AUTH,
  initialState: initialState,
  reducers: authReducer,
});

export const authActions = authSlice.actions;
export default authSlice.reducer;
