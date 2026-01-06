import { createSlice } from "@reduxjs/toolkit";
import { authReducer } from "./reducer";
import { initialState } from "./types";

const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: authReducer,
});

export const authActions = authSlice.actions;
export default authSlice.reducer;
