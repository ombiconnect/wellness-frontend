import { createSlice } from "@reduxjs/toolkit";
import {
  deleteTask,
  getAllTasks,
  getTaskById,
  upsertTask,
} from "../Thunks/Task";

const taskSlice = createSlice({
  name: "task",
  initialState: {
    items: [],
    current: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // List
      .addCase(getAllTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload || [];
      })
      .addCase(getAllTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //upsert
      .addCase(upsertTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(upsertTask.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(upsertTask.rejected, (state, action) => {
        state.loading = false;
        state.error = {
          alreadyExist: action.payload,
        };
      })

      //GetById
      .addCase(getTaskById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTaskById.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload || [];
      })
      .addCase(getTaskById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //delete
      .addCase(deleteTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default taskSlice.reducer;
