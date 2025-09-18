import React from "react"
import AddTodo from "./components/AddTodo"
import TodoList from "./components/TodoList"
const Todo: React.FC = () => {
    return (
    <>
     <h1 style={{textAlign: "center"}}>Todo App</h1>
     <AddTodo />
     <TodoList />
    </>
    )
}


export default Todo