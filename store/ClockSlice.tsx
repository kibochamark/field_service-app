import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ClockState {
  
  data:any
}

const initialState: ClockState = {
  data: undefined
};

const clockSlice = createSlice({
  name: 'clockin',
  initialState,
  reducers: {
    handledata:(state, action)=>{
      state.data = action.payload.data
    }
  },
});

export const { handledata } = clockSlice.actions;
export const ClockReducer= clockSlice.reducer;
