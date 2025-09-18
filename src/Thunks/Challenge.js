import { createAsyncThunk } from "@reduxjs/toolkit";
import { getAxios } from "../Axios";

// Upsert Challenge
export const upsertChallenge = createAsyncThunk(
  "challenge/upsert",
  async (
    {
      id,
      title,
      subtitle,
      about,
      benefits,
      available,
      averageDuration,
      difficultyLevel,
      xp,
      imageUrl,
      focusAreaId,
      durationDays,
    },
    { rejectWithValue }
  ) => {
    try {
      const payload = {
        title,
        subtitle,
        about,
        benefits,
        available,
        averageDuration,
        difficultyLevel,
        xp,
        imageUrl,
        focusAreaId,
        durationDays,
      };

      let response;
      if (id) {
        response = await getAxios().put(`/challenges/${id}`, payload);
      } else {
        response = await getAxios().post(`/challenges`, payload);
      }
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message ||
          err.message ||
          "Failed to upsert challenge"
      );
    }
  }
);

// Get All Challenges
export const getAllChallenges = createAsyncThunk(
  "challenge/getAll",
  async (focusAreaId, { rejectWithValue }) => {
    try {
      const url = focusAreaId
        ? `/challenges?focusAreaId=${focusAreaId}`
        : `/challenges`;

      const response = await getAxios().get(url);
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message ||
          err.message ||
          "Failed to fetch challenges"
      );
    }
  }
);

// Get Challenge by ID
export const getChallengeById = createAsyncThunk(
  "challenge/getById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await getAxios().get(`/challenges/${id}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message ||
          err.message ||
          "Failed to fetch challenge"
      );
    }
  }
);

// Delete Challenge
export const deleteChallenge = createAsyncThunk(
  "challenge/delete",
  async (id, { rejectWithValue }) => {
    try {
      await getAxios().delete(`/challenges/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message ||
          err.message ||
          "Failed to delete challenge"
      );
    }
  }
);
