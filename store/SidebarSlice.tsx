import { createSlice } from "@reduxjs/toolkit"

type SideBar= {
    isopen:boolean
}

const initialState: SideBar = {
    isopen: false
}

const sidebarSlice = createSlice({
    name: "sideSlice",
    initialState,
    reducers: {
        handleOpen: (state) => {
            state.isopen = !state.isopen
        },
       
    }
})

export const { handleOpen } = sidebarSlice.actions;
export const SideBarReducer = sidebarSlice.reducer;
