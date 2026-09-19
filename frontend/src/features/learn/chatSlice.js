import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  history: [],
  currentQuestion: '',
  isLoading: false,
};

const chatAISlice = createSlice({
  name: 'chatAI',
  initialState,
  reducers: {
    setCurrentQuestion: (state, action) => {
      state.currentQuestion = action.payload;
    },
    addUserMessage: (state, action) => {
      state.history.push({
        role: 'user',
        text: action.payload,
      });
    },
    addAIMessage: (state, action) => {
      state.history.push({
        role: 'model',
        text: action.payload,
      });
    },
    clearCurrentQuestion: (state) => {
      state.currentQuestion = '';
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    clearHistory: (state) => {
      state.history = [];
    },
    // Optional: if you want to set entire history at once
    setHistory: (state, action) => {
      state.history = action.payload;
    },
  },
});

export const {
  setCurrentQuestion,
  addUserMessage,
  addAIMessage,
  clearCurrentQuestion,
  setLoading,
  clearHistory,
  setHistory,
} = chatAISlice.actions;

export default chatAISlice.reducer;

// Selectors
export const selectChatHistory = (state) => state.chatAI.history;
export const selectCurrentQuestion = (state) => state.chatAI.currentQuestion;
export const selectIsLoading = (state) => state.chatAI.isLoading;