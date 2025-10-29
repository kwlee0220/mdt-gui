import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  type: "alert",
  show: false,
  message: "",
  title: "",
  confirmHandler: null,
  denyHandler: null,
};

export const dialogSlice = createSlice({
  name: "dialog",
  initialState: initialState,
  reducers: {
    openDialogCall: (state, action) => {
      const { type, title, message, confirmHandler, denyHandler } =
        action.payload;

      state.show = true;
      state.type = type;
      state.message = message;
      state.title = title;
      state.confirmHandler = confirmHandler;
      state.denyHandler = denyHandler;
    },
    closeDialogCall: (state, action) => {
      Object.assign(state, initialState);
    },
  },
});

export const { openDialogCall, closeDialogCall } = dialogSlice.actions;
