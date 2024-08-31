import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CustomerFormState {
  isOpen: boolean;
}

const initialState: CustomerFormState = {
  isOpen: false,
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
  },
});

export const { openForm, closeForm } = customerFormSlice.actions;
export default customerFormSlice.reducer;
