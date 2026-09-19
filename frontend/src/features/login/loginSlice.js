import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoggedIn: false,
  userDetail: {},
  token: null,
  expiresAt: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginUser(state, action) {
      state.isLoggedIn = true;
      state.token = action.payload.token;
      state.expiresAt = action.payload.expiresAt;
    },
    logoutUser(state) {
      state.isLoggedIn = false;
      state.token = null;
      state.expiresAt = null;
      state.userDetail = {};
    },
    setUser(state, action) {
      state.isLoggedIn = true;
      state.userDetail = action.payload;
    },
  },
});
export const { loginUser, logoutUser, setUser } = userSlice.actions;
export default userSlice.reducer;
