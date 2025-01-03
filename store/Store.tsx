import { configureStore } from '@reduxjs/toolkit'
import { EmployeeReducer } from './EmployeeSlice'
import { SideBarReducer } from './SidebarSlice'
import customerFormReducer from './CustomerSlice';
import { ClockReducer } from './ClockSlice';

export const store = configureStore({
  reducer: {
    employee: EmployeeReducer,
    sidebar: SideBarReducer,
    customerForm: customerFormReducer, 
    clock:ClockReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
