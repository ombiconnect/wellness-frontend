import { createSlice } from "@reduxjs/toolkit";
import { userLogin, userLogout } from "../Thunks/Auth";

const initialState = {
  User: {
    Name: "",
    Email: "",
  },
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    addAuth: (state, action) => {
      state.User = {
        Name: action.payload.Name,
        Email: action.payload.Email,
      };
    },
    removeAuth: (state) => {
      state.User = { Name: "", Email: "" };
    },
    removeError: (state) => {
      state.error = "";
    },
  },
  extraReducers: (builder) => {
    //LOGIN
    builder
      .addCase(userLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(userLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.User = {
          Name: action.payload.name || "",
          Email: action.payload.email || "",
        };
      })
      .addCase(userLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      //LOGOUT
      .addCase(userLogout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(userLogout.fulfilled, (state) => {
        state.loading = false;
        state.User = null;
      })
      .addCase(userLogout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { addAuth, removeAuth, removeError } = authSlice.actions;

export default authSlice.reducer;
