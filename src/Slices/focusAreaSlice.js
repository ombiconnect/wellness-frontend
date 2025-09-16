import { createSlice } from "@reduxjs/toolkit";
import { getAllFocusAreas, upsertFocusArea } from "../Thunks/FocusArea";

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
      })

      .addCase(upsertFocusArea.rejected, (state, action) => {
        console.log("upsertFocusArea.rejected", action);

        state.error = {
          alreadyExist: action.payload,
        };
      });
  },
});

export default focusAreaSlice.reducer;
