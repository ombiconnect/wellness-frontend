import { createSlice } from "@reduxjs/toolkit";
import { getAllFocusAreas } from "../Thunks/FocusArea";

const focusAreaSlice = createSlice({
  name: "focusArea",
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
      .addCase(getAllFocusAreas.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllFocusAreas.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload || [];
      })
      .addCase(getAllFocusAreas.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default focusAreaSlice.reducer;
