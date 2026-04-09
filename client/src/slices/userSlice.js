import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  workerDetails: null, // ✅ renamed from policeDetails — matches your roles
  logedAt: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload.user || null;
      state.workerDetails = action.payload.workerDetails || null;
      state.logedAt = Date.now();
    },
    updateUser: (state, action) => {
      state.user = action.payload.user || state.user;
      state.workerDetails = action.payload.workerDetails || state.workerDetails;
      state.logedAt = Date.now();
    },
    resetUser: () => initialState,
  },
});

export const { setUser, updateUser, resetUser } = userSlice.actions;

export default userSlice.reducer;