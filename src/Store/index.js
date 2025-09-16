import { configureStore } from "@reduxjs/toolkit";
import authSlice from "../Slices/authSlice";
import programSlice from "../Slices/programSlice";
import focusAreaSlice from "../Slices/focusAreaSlice";

const Store = configureStore({
  reducer: {
    auth: authSlice,
    program: programSlice,
    focusArea: focusAreaSlice,
  },
});
export default Store;
