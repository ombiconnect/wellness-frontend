import { createSlice } from "@reduxjs/toolkit";
import { getAllChallenges, upsertChallenge } from "../Thunks/Challenge";

const challengeSlice = createSlice({
  name: "challenge",
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
      .addCase(getAllChallenges.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllChallenges.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload || [];
      })
      .addCase(getAllChallenges.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(upsertChallenge.rejected, (state, action) => {
        state.error = {
          alreadyExist: action.payload,
        };
      });
  },
});

export default challengeSlice.reducer;
