import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type Employee = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: {
    name: string;
  };
  createdAt: string;
  updatedAt: string;
  permissions: string[];
};

type EmployeeManage = {
  isAdd: boolean;
  isEdit: boolean;
  currentEmployee: Employee | null;
  employees: Employee[]; // Add employees array to the state
};

const initialState: EmployeeManage = {
  isAdd: false,
  isEdit: false,
  currentEmployee: null,
  employees: [], // Initialize employees array
};

const employeeSlice = createSlice({
  name: "employeeSlice",
  initialState,
  reducers: {
    handleAdd: (state, action: PayloadAction<{ isAdd: boolean }>) => {
      state.isAdd = action.payload.isAdd;
    },
    handleEdit: (
      state,
      action: PayloadAction<{ isEdit: boolean; employee: Employee | null }>
    ) => {
      state.isEdit = action.payload.isEdit;
      state.currentEmployee = action.payload.employee;
    },
    clearEdit: (state) => {
      state.isEdit = false;
      state.currentEmployee = null;
    },
    removeEmployee: (state, action: PayloadAction<string>) => {
      state.employees = state.employees.filter(
        (employee) => employee.id !== action.payload
      );
    },
  },
});

export const { handleAdd, handleEdit, clearEdit, removeEmployee } =
  employeeSlice.actions;
export const EmployeeReducer = employeeSlice.reducer;
