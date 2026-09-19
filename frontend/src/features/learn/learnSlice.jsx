import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  activeTab:"crochet-basics",
  openMenu:true,
};

const learnSlice = createSlice({
  name: "learn",
  initialState,
  reducers: {
    SetActiveTab : (state, action) => {
        if(state.activeTab === action.payload){
            
        }
        else{
            state.activeTab = action.payload
        }
    },
    ToggleMenu : (state) => {
        state.openMenu = !state.openMenu
    }
  },
});
export const {SetActiveTab, ToggleMenu} = learnSlice.actions;
export default learnSlice.reducer;
