import { configureStore } from "@reduxjs/toolkit"
import uiReducer from "../features/UI/uiSlice"

const store = configureStore({
  reducer: {
    ui: uiReducer,
  },
});

export default store;