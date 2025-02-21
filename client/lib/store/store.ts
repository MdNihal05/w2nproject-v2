import { configureStore } from "@reduxjs/toolkit"
import authReducer from "./auth-slice"
import billsReducer from "./bills-slice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    bills: billsReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

