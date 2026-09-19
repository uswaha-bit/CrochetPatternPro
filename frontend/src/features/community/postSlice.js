import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  title: null,
  description: null,
  files: [],
};

const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    createPost(state, action) {
      state.title = action.payload.title;
      state.description = action.payload.description;
      //   state.files = action.payload.files;
    },
  },
});

export const { createPost } = postSlice.actions;
export default postSlice.reducer;
