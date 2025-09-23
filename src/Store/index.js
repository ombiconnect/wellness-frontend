import { configureStore } from "@reduxjs/toolkit";
import authSlice from "../Slices/authSlice";
import programSlice from "../Slices/programSlice";
import focusAreaSlice from "../Slices/focusAreaSlice";
import habitSlice from "../Slices/habitSlice";
import challengeSlice from "../Slices/challengeSlice";
import taskSlice from "../Slices/taskSlice";

const Store = configureStore({
  reducer: {
    auth: authSlice,
    program: programSlice,
    focusArea: focusAreaSlice,
    habit: habitSlice,
    challenge: challengeSlice,
    task: taskSlice,
  },
});
export default Store;
