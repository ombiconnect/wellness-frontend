import { createAsyncThunk } from "@reduxjs/toolkit";
import { getAxios } from "../Axios";

// Upsert FocusArea (Quadrant)
export const upsertFocusArea = createAsyncThunk(
  "focusArea/upsert",
  async (
    { id, name, label, color, icon, programId },
    { rejectWithValue }
  ) => {
    try {
      const payload = { name, label, color, icon };
      // Optional association if backend supports it
      if (programId) payload.programId = programId;

      let response;
      if (id) {
        response = await getAxios().put(`/program/quadrant/${id}`, payload);
      } else {
        response = await getAxios().post(`/program/quadrant`, payload);
      }
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || "Failed to upsert focus area"
      );
    }
  }
);

// List FocusAreas
export const getAllFocusAreas = createAsyncThunk(
  "focusArea/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAxios().get(`/program/quadrant`);
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || "Failed to fetch focus areas"
      );
    }
  }
);

// Get FocusArea by ID
export const getFocusAreaById = createAsyncThunk(
  "focusArea/getById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await getAxios().get(`/program/quadrant/${id}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || "Failed to fetch focus area"
      );
    }
  }
);

// Delete FocusArea
export const deleteFocusArea = createAsyncThunk(
  "focusArea/delete",
  async (id, { rejectWithValue }) => {
    try {
      await getAxios().delete(`/program/quadrant/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || "Failed to delete focus area"
      );
    }
  }
);


