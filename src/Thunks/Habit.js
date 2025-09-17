import { createAsyncThunk } from "@reduxjs/toolkit";
import { getAxios } from "../Axios";

// Upsert Habit
export const upsertHabit = createAsyncThunk(
  "habit/upsert",
  async (
    {
      id,
      title,
      activity,
      tips,
      difficultyLevel,
      activeFrom,
      activeTo,
      focusAreaId,
      recordPoint,
    },
    { rejectWithValue }
  ) => {
    try {
      const payload = {
        title,
        activity,
        tips,
        difficultyLevel,
        activeFrom,
        activeTo,
        focusAreaId,
        recordPoint,
      };

      let response;
      if (id) {
        response = await getAxios().put(`/habits/${id}`, payload);
      } else {
        response = await getAxios().post(`/habits`, payload);
      }
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || "Failed to upsert habit"
      );
    }
  }
);

// Get All Habits
export const getAllHabits = createAsyncThunk(
  "habit/getAll",
  async (focusAreaId, { rejectWithValue }) => {
    try {
      const url = focusAreaId
        ? `/habits?focusAreaId=${focusAreaId}`
        : `/habits`;

      const response = await getAxios().get(url);
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || "Failed to fetch habits"
      );
    }
  }
);

// Get Habit by ID
export const getHabitById = createAsyncThunk(
  "habit/getById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await getAxios().get(`/habits/${id}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || "Failed to fetch habit"
      );
    }
  }
);

// Delete Habit
export const deleteHabit = createAsyncThunk(
  "habit/delete",
  async (id, { rejectWithValue }) => {
    try {
      console.log("Called delete");
      await getAxios().delete(`/habits/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || "Failed to delete habit"
      );
    }
  }
);
