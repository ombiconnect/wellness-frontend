import { configureStore } from "@reduxjs/toolkit";
import authSlice from "../Slices/authSlice";
import programSlice from "../Slices/programSlice";

const Store = configureStore({
  reducer: {
    auth: authSlice,
    program: programSlice,
  },
});
export default Store;
