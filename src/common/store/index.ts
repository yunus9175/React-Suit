import { configureStore } from "@reduxjs/toolkit" 
import { dogApi } from "../../features/dogs/dog-api-slice"
import counterReducer from "../slice/counterSlice"
import todoReducer from "../slice/todoSlice"
import cartReducer from "../slice/cartSlice"

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    todo: todoReducer,
    cart: cartReducer,
    [dogApi.reducerPath]: dogApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(dogApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch