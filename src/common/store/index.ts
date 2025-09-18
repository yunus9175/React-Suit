import { configureStore } from "@reduxjs/toolkit" 
import counterReducer from "../slice/counterSlice"
import todoReducer from "../slice/todoSlice"
import cartReducer from "../slice/cartSlice"

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    todo: todoReducer,
    cart: cartReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch