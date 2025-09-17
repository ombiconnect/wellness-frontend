import { configureStore } from "@reduxjs/toolkit";
import authSlice from "../Slices/authSlice";
import programSlice from "../Slices/programSlice";
import focusAreaSlice from "../Slices/focusAreaSlice";
import habitSlice from "../Slices/habitSlice";

const Store = configureStore({
  reducer: {
    auth: authSlice,
    program: programSlice,
    focusArea: focusAreaSlice,
    habit: habitSlice,
  },
});
export default Store;
