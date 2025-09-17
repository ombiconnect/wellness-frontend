import { createSlice } from "@reduxjs/toolkit";
import { getAllHabits, upsertHabit } from "../Thunks/Habit";

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
      });
  },
});

export default habitSlice.reducer;
