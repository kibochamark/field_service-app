import { createSlice } from "@reduxjs/toolkit"

type EmployeeManage={
    isadd:boolean
}


const initialState:EmployeeManage={
    isadd: false
}




const employeeSlice= createSlice({
    name:"employeeslice",
    initialState,
    reducers:{
        handleAdd:(state, action)=>{
            state.isadd = action.payload.isadd
        }
    }
})



export const { handleAdd } = employeeSlice.actions

export const EmployeeReducer = employeeSlice.reducer
