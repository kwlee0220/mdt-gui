import { combineReducers } from "@reduxjs/toolkit";

import { dialogSlice } from "./dialog";
import { authSlice } from "./auth";
import { datalistSlice } from "./datalist";
import { commonSlice } from "./common";

export const rootReducer = combineReducers({
  common: commonSlice.reducer,
  auth: authSlice.reducer,
  dialog: dialogSlice.reducer,
  datalist: datalistSlice.reducer,
});
