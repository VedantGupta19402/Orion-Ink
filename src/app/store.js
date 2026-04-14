import { configureStore } from "@reduxjs/toolkit";
import uiReducer from "..src/features/ui/uiSlice";

const store = configureStore({
  reducer: {
    ui: uiReducer,
  },
});

export default store;