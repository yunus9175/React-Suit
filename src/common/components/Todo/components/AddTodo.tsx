import React, { useState } from "react"
import { useDispatch } from "react-redux"
import { addTodo } from "../../../slice/todoSlice"
const AddTodo: React.FC = () => {
    const dispatch = useDispatch()
    const [todo, setTodo] = useState("")
    const [date, setDate] = useState("")
    const [error, setError] = useState("")
    const handleAddTodo = () => {
        const trimmed = todo.trim()
        if (!trimmed) {
            setError("Please enter a todo item")
            return
        }
        if (!date) {
            setError("Please select a date")
            return
        }
        setError("")
        dispatch(addTodo({ text: trimmed, date }))
        setTodo("")
        setDate("")
    }
    return (
        <div className="flex">
            <input placeholder="Add todo..." type="text" value={todo} onChange={(e) => setTodo(e.target.value)} />
            <input placeholder="Select date..." type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            <button onClick={handleAddTodo}>Add</button>
            {error && <span className="error-text">{error}</span>}
        </div>
    )
}

export default AddTodo