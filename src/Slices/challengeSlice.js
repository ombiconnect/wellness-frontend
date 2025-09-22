import { createSlice } from "@reduxjs/toolkit";
import {
  getAllChallenges,
  upsertChallenge,
  deleteChallenge,
  getChallengeById,
} from "../Thunks/Challenge";

const challengeSlice = createSlice({
  name: "challenge",
  initialState: {
    items: [],
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

      //upsert
      .addCase(upsertChallenge.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(upsertChallenge.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(upsertChallenge.rejected, (state, action) => {
        state.loading = false;
        state.error = {
          alreadyExist: action.payload,
        };
      })

      //GetById
      .addCase(getChallengeById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getChallengeById.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload || [];
      })
      .addCase(getChallengeById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //delete
      .addCase(deleteChallenge.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteChallenge.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(deleteChallenge.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default challengeSlice.reducer;
