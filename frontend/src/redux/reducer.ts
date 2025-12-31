import { combineReducers } from "@reduxjs/toolkit";
import userReducer from "@/features/users/redux/slice";
import authReducer from "@/features/auth/redux/slice";

const reducer = combineReducers({
  user: userReducer,
  auth: authReducer,
});

export default reducer;
