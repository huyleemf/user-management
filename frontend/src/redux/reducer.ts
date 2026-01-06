import { combineReducers } from "@reduxjs/toolkit";
import userReducer from "@/redux/users/slice";
import authReducer from "@/redux/auth/slice";

const reducer = combineReducers({
  user: userReducer,
  auth: authReducer,
});

export default reducer;
