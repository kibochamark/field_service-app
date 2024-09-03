import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CustomerFormState {
  isOpen: boolean;
  isedit:boolean;
  data:any
}

const initialState: CustomerFormState = {
  isOpen: false,
  isedit: false,
  data: undefined
};

const customerFormSlice = createSlice({
  name: 'customerForm',
  initialState,
  reducers: {
    openForm: (state) => {
      state.isOpen = true;
    },
    closeForm: (state) => {
      state.isOpen = false;
    },
    handleEdit:(state, action)=>{
      state.isedit = action.payload.edit
    
      state.data = action.payload.data
    }
  },
});

export const { openForm, closeForm, handleEdit } = customerFormSlice.actions;
export default customerFormSlice.reducer;
