import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export interface Product {
  id: string
  title: string
  price: number
  image: string
}

export interface CartItem extends Product {
  quantity: number
}

interface CartState {
  items: CartItem[]
}

const initialState: CartState = {
  items: [],
}

const findIndexById = (items: CartItem[], id: string) => items.findIndex(i => i.id === id)

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Product>) => {
      const idx = findIndexById(state.items, action.payload.id)
      if (idx >= 0) {
        state.items[idx].quantity += 1
      } else {
        state.items.push({ ...action.payload, quantity: 1 })
      }
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(i => i.id !== action.payload)
    },
    incrementQty: (state, action: PayloadAction<string>) => {
      const idx = findIndexById(state.items, action.payload)
      if (idx >= 0) state.items[idx].quantity += 1
    },
    decrementQty: (state, action: PayloadAction<string>) => {
      const idx = findIndexById(state.items, action.payload)
      if (idx >= 0) {
        const next = state.items[idx].quantity - 1
        if (next <= 0) state.items.splice(idx, 1)
        else state.items[idx].quantity = next
      }
    },
    clearCart: (state) => {
      state.items = []
    },
  },
})

export const { addToCart, removeFromCart, incrementQty, decrementQty, clearCart } = cartSlice.actions
export default cartSlice.reducer


