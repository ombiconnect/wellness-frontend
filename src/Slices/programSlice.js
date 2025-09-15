import { createSlice } from "@reduxjs/toolkit";
import { getAllPrograms } from "../Thunks/Program";

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
      });
  },
});

export default programSlice.reducer;
