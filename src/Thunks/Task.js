import { createAsyncThunk } from "@reduxjs/toolkit";
import { getAxios } from "../Axios";
import { ref, uploadBytes } from "firebase/storage";
import { storage } from "../Firebase/Firebase";

// Upsert Task
export const upsertTask = createAsyncThunk(
  "task/upsert",
  async (
    {
      id,
      title,
      description,
      activity,
      keyTakeaways,
      challengeId,
      order,
      xp,
      media,
    },
    { rejectWithValue }
  ) => {
    try {
      const payload = {
        title,
        description,
        activity,
        keyTakeaways,
        challengeId,
        order: order ? parseInt(order) : 0,
        xp: xp ? parseInt(xp) : 0,
        media: {
          title: media?.title || "",
          body: media?.body || "",
          posterUrl: media?.posterUrl || "",
          type: media?.type || undefined,
        },
      };
      // Handle file upload if a file is present
      if (media?.file) {
        const folder = media.file.type.startsWith("video")
          ? "task/video"
          : "task/image";
        const name = `${folder}/${Date.now()}-${media.file.name}`;
        const fileRef = ref(storage, name);

        // Upload the file
        await uploadBytes(fileRef, media.file);

        // Update payload with file URL
        payload.media.posterUrl = name;
        payload.media.type = media.file.type.startsWith("video")
          ? "VIDEO"
          : "AUDIO";
      }

      let response;
      if (id) {
        response = await getAxios().put(`/tasks/${id}`, payload);
      } else {
        response = await getAxios().post(`/tasks`, payload);
      }
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || "Failed to upsert task"
      );
    }
  }
);

// Get All Tasks
export const getAllTasks = createAsyncThunk(
  "task/getAll",
  async (challengeId, { rejectWithValue }) => {
    try {
      const url = challengeId ? `/tasks?challengeId=${challengeId}` : `/tasks`;

      const response = await getAxios().get(url);
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || "Failed to fetch tasks"
      );
    }
  }
);

// Get Task by ID
export const getTaskById = createAsyncThunk(
  "task/getById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await getAxios().get(`/tasks/${id}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || "Failed to fetch task"
      );
    }
  }
);

// Delete Task
export const deleteTask = createAsyncThunk(
  "task/delete",
  async (id, { rejectWithValue }) => {
    try {
      await getAxios().delete(`/tasks/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || "Failed to delete task"
      );
    }
  }
);
