import { createSlice } from "@reduxjs/toolkit";
import {
  deleteProgram,
  getAllPrograms,
  getProgramById,
  upsertProgram,
} from "../Thunks/Program";

const programSlice = createSlice({
  name: "programs",
  initialState: {
    items: [],
    current: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Get All
      .addCase(getAllPrograms.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllPrograms.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(getAllPrograms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //upsert
      .addCase(upsertProgram.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(upsertProgram.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(upsertProgram.rejected, (state, action) => {
        state.loading = false;
        state.error = {
          alreadyExist: action.payload,
        };
      })

      //GetById
      .addCase(getProgramById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProgramById.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload || [];
      })
      .addCase(getProgramById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //delete
      .addCase(deleteProgram.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProgram.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(deleteProgram.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default programSlice.reducer;
