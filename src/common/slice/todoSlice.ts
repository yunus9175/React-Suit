import { createSlice } from "@reduxjs/toolkit"

export interface Todo {
  id: number
  text: string,
  date: string,
  completed: boolean
}

const todoSlice = createSlice({
  name: "todo",
  initialState: {
    todos: [] as Todo[],
  },
  reducers: {
    addTodo: (state, action) => {
      state.todos.push({
        id: state.todos.length + 1,
        text: action.payload.text,
        date: action.payload.date,
        completed: false,
      })
    },
    deleteTodo: (state, action) => {
      state.todos = state.todos.filter((todo) => todo.id !== action.payload)
    },
    editTodo: (state, action) => {
      state.todos = state.todos.map((todo) => todo.id === action.payload.id ? action.payload : todo)
    },
    completeTodo: (state, action) => {
      state.todos = state.todos.map((todo) =>
        todo.id === action.payload ? { ...todo, completed: true } : todo
      )
    },
    incompleteTodo: (state, action) => {
      state.todos = state.todos.map((todo) =>
        todo.id === action.payload ? { ...todo, completed: false } : todo
      )
    },
  },
})

export const { addTodo, deleteTodo, editTodo, completeTodo, incompleteTodo } = todoSlice.actions
export default todoSlice.reducer