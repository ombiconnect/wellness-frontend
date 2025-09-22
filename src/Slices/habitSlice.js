import { createSlice } from "@reduxjs/toolkit";
import {
  deleteHabit,
  getAllHabits,
  getHabitById,
  upsertHabit,
} from "../Thunks/Habit";

const habitSlice = createSlice({
  name: "habit",
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
      .addCase(getAllHabits.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllHabits.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload || [];
      })
      .addCase(getAllHabits.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //upsert
      .addCase(upsertHabit.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(upsertHabit.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(upsertHabit.rejected, (state, action) => {
        state.loading = false;
        state.error = {
          alreadyExist: action.payload,
        };
      })

      //GetById
      .addCase(getHabitById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getHabitById.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload || [];
      })
      .addCase(getHabitById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //delete
      .addCase(deleteHabit.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteHabit.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(deleteHabit.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default habitSlice.reducer;
