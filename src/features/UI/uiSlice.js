import { createSlice } from "@reduxjs/toolkit";

const ui = createSlice({
  name: "ui",
  initialState: {
    isTransitioning: false,
    nextPage: null,
    direction: "forward",
  },
  reducers: {
    startTransition: (state, action) => {
      state.isTransitioning = true;
      state.nextPage = action.payload?.path || null;
      state.direction = action.payload?.direction || "forward";
    },

    endTransition: (state) => {
      state.isTransitioning = false;
      state.nextPage = null;
    },
  },
});

export const { startTransition, endTransition } = ui.actions;
export default ui.reducer;