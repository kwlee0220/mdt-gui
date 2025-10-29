import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  listWidget: [],
  workflow: null,
  pauseInstance: false,
  expandRealTimePanel: true,
};

export const commonSlice = createSlice({
  name: "common",
  initialState: initialState,
  reducers: {
    setListWidget: (state, action) => {
      let list = action.payload;

      if (list) {
        state.listWidget = list;
      } else {
        state.listWidget = [];
      }
    },
    setWorkflow: (state, action) => {
      let workflow = action.payload;

      if (workflow) {
        state.workflow = workflow;
      } else {
        state.workflow = null;
      }
    },
    setInstancePause: (state, action) => {
      const pause = action.payload;

      if (pause) {
        state.pauseInstance = true;
      } else {
        state.pauseInstance = false;
      }
    },
    setExpandRealTimePanel: (state, action) => {
      const expand = action.payload;

      state.expandRealTimePanel = expand;
    },
  },
});

export const {
  setInstancePause,
  setListWidget,
  setWorkflow,
  setExpandRealTimePanel,
} = commonSlice.actions;
