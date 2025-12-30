import { combineReducers } from "@reduxjs/toolkit";
import userReducer from "@/features/users/redux/slice";

const reducer = combineReducers({
  user: userReducer,
});

export default reducer;
