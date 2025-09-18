import React, { useState } from "react"
import { type Todo as TodoType, deleteTodo, editTodo, completeTodo, incompleteTodo } from "../../../slice/todoSlice"
import { useDispatch } from "react-redux"
const TodoItem: React.FC<{ todo: TodoType }> = ({ todo }) => {
    const dispatch = useDispatch()
    const [isEditing, setIsEditing] = useState(false)
    const [text, setText] = useState(todo.text)
    const [date, setDate] = useState(todo.date)
    const [error, setError] = useState("")

    const handleSave = () => {
        const trimmed = text.trim()
        if (!trimmed) {
            setError("Please enter a todo item")
            return
        }
        if (!date) {
            setError("Please select a date")
            return
        }
        setError("")
        dispatch(editTodo({ id: todo.id, text: trimmed, date, completed: todo.completed }))
        setIsEditing(false)
    }

    const handleCancel = () => {
        setText(todo.text)
        setDate(todo.date)
        setError("")
        setIsEditing(false)
    }

    return (
        <li className={`todo-item ${todo.completed ? "completed" : ""}`}>
            <div className="todo-content">
                {isEditing ? (
                    <>
                        <input
                            placeholder="Edit todo..."
                            type="text"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                        />
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />
                        {error && <span className="error-text">{error}</span>}
                    </>
                ) : (
                    <>
                        <span className="todo-text">{todo.text}</span>
                        <span className="todo-date">{todo.date}</span>
                    </>
                )}
            </div>
            <div className="todo-actions">
                <button onClick={() => dispatch(deleteTodo(todo.id))}>Delete</button>
                {isEditing ? (
                    <>
                        <button onClick={handleSave}>Save</button>
                        <button onClick={handleCancel}>Cancel</button>
                    </>
                ) : (
                    <button onClick={() => setIsEditing(true)}>Edit</button>
                )}
                {todo.completed ? (
                    <button onClick={() => dispatch(incompleteTodo(todo.id))}>Undo</button>
                ) : (
                    <button onClick={() => dispatch(completeTodo(todo.id))}>Complete</button>
                )}
            </div>
        </li>
    )
}

    export default TodoItem