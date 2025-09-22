import { createSlice } from "@reduxjs/toolkit";
import {
  deleteFocusArea,
  getAllFocusAreas,
  getFocusAreaById,
  upsertFocusArea,
} from "../Thunks/FocusArea";

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

      //upsert
      .addCase(upsertFocusArea.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(upsertFocusArea.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(upsertFocusArea.rejected, (state, action) => {
        state.loading = false;
        state.error = {
          alreadyExist: action.payload,
        };
      })

      //GetById
      .addCase(getFocusAreaById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFocusAreaById.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload || [];
      })
      .addCase(getFocusAreaById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //delete
      .addCase(deleteFocusArea.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteFocusArea.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(deleteFocusArea.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default focusAreaSlice.reducer;
