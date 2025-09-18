import React from "react"
import TodoItem from "./TodoItem"
import { useSelector } from "react-redux"
import { type RootState } from "../../../../common/store/index"
import { type Todo } from "../../../slice/todoSlice"
const TodoList: React.FC = () => {
    const todos = useSelector((state: RootState) => state.todo.todos)
    return (
        <>
        <ul className="todo-list">
            {todos.map((todo: Todo) => (
                <TodoItem key={todo.id} todo={todo} />
            ))}
            </ul>
           
        </>
    )
}

export default TodoList