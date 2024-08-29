import { configureStore } from '@reduxjs/toolkit'
import { EmployeeReducer } from './EmployeeSlice'
import { SideBarReducer } from './SidebarSlice'

export const store = configureStore({
    reducer: {
        employee: EmployeeReducer,
        sidebar:SideBarReducer
    },
})



// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch