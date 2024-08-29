import { createSlice } from "@reduxjs/toolkit"

type EmployeeManage = {
    isAdd: boolean,
    isEdit: boolean,
    currentEmployee: any | null
}

const initialState: EmployeeManage = {
    isAdd: false,
    isEdit: false,
    currentEmployee: null
}

const employeeSlice = createSlice({
    name: "employeeSlice",
    initialState,
    reducers: {
        handleAdd: (state, action) => {
            state.isAdd = action.payload.isAdd;
        },
        handleEdit: (state, action) => {
            state.isEdit = action.payload.isEdit;
            state.currentEmployee = action.payload.employee;
        },
        clearEdit: (state) => {
            state.isEdit = false;
            state.currentEmployee = null;
        }
    }
})

export const { handleAdd, handleEdit, clearEdit } = employeeSlice.actions;
export const EmployeeReducer = employeeSlice.reducer;
