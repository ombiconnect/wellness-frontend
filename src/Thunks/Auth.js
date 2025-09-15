import { createAsyncThunk } from "@reduxjs/toolkit";
import { auth } from "../Firebase/Firebase";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";

export const userLogin = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      return {
        name: userCredential.user.displayName,
        email: userCredential.user.email,
      };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const userLogout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      console.log("hi");
      await signOut(auth);
      return true;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);
