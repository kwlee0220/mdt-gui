import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { get_instance_all } from "apps/remote/urls";
import isEqual from "lodash.isequal";

const initialState = {
  instanceList: [],
  workflowList: [],
  workflowModelList: [],
  dashboardList: [],
};

export const datalistSlice = createSlice({
  name: "datalist",
  initialState: initialState,
  reducers: {
    setInstanceList: (state, action) => {
      const list = action.payload;

      if (list) {
        state.instanceList = list;
        state.dashboardList = list;
      } else {
        state.instanceList = [];
        state.dashboardList = [];
      }
    },
    updateInstanceList: (state, action) => {
      const newList = action.payload;
      const oldList = state.instanceList;

      if (!isEqual(oldList, newList)) {
        state.instanceList = newList;
      }
    },
    setWorkflowList: (state, action) => {
      const list = action.payload;

      if (list) {
        state.workflowList = list;
      } else {
        state.workflowList = [];
      }
    },
    updateWorkflowList: (state, action) => {
      const newList = action.payload;
      const oldList = state.workflowList;

      if (!isEqual(oldList, newList)) {
        state.workflowList = newList;
      }
    },
    setWorkflowModelList: (state, action) => {
      const list = action.payload;

      if (list) {
        state.workflowModelList = list;
      } else {
        state.workflowModelList = [];
      }
    },
  },
});

export const {
  setInstanceList,
  updateInstanceList,
  setWorkflowList,
  updateWorkflowList,
  setWorkflowModelList,
} = datalistSlice.actions;
