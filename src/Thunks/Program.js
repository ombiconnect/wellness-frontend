import { createAsyncThunk } from "@reduxjs/toolkit";
import { getAxios } from "../Axios";

// Create Program
export const upsertProgram = createAsyncThunk(
  "programs/create",
  async ({ id, name, description, status }, { rejectWithValue }) => {
    try {
      let response;
      if (id) {
        response = await getAxios().put(`/program/${id}`, {
          name,
          description,
          status: status.toUpperCase(),
        });
      } else {
        response = await getAxios().post("/program", {
          name,
          description,
          status: status.toUpperCase(),
        });
      }

      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || "Failed to create program"
      );
    }
  }
);

// Get All Programs
export const getAllPrograms = createAsyncThunk(
  "programs/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAxios().get("/program");
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || "Failed to fetch programs"
      );
    }
  }
);

// Get Program By ID
export const getProgramById = createAsyncThunk(
  "programs/getById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await getAxios().get(`/program/${id}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || "Failed to fetch program"
      );
    }
  }
);

// Update Program
// export const updateProgram = createAsyncThunk(
//   "programs/update",
//   async ({ id, name, description, status }, { rejectWithValue }) => {
//     try {
//       const response = await getAxios().put(`/programs/${id}`, {
//         name,
//         description,
//         status,
//       });
//       return response.data;
//     } catch (err) {
//       return rejectWithValue(
//         err.response?.data?.message || err.message || "Failed to update program"
//       );
//     }
//   }
// );

// Delete Program
export const deleteProgram = createAsyncThunk(
  "programs/delete",
  async (id, { rejectWithValue }) => {
    try {
      await getAxios().delete(`/program/${id}`);
      return id; // return id so we can remove it from Redux state
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || "Failed to delete program"
      );
    }
  }
);
